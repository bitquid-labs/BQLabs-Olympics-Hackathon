// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CoverLib.sol";

interface ILP {
    struct Deposits {
        address lp;
        uint256 amount;
        uint256 poolId;
        uint256 period;
        uint256 dailyPayout;
        Status status;
        uint256 expiryDate;
    }

    enum Status {
        Active,
        Expired
    }

    function getUserDeposit(
        uint256 _poolId,
        address _user
    ) external view returns (Deposits memory);
}

contract InsuranceCover is ReentrancyGuard, Ownable {
    using CoverLib for *;

    error LpNotActive();
    error InsufficientPoolBalance();
    error NoClaimableReward();
    error CoverAlreadyExists();
    error InvalidCoverDuration();
    error CoverNotAvailable();
    error InvalidAmount();
    error UnsupportedCoverType();

    uint public coverFeeBalance;
    ILP public lpContract;
    uint256[] public chainIds;
    mapping(uint256 => bool) public isChainIdStored;
    mapping(address => uint256) public NextLpClaimTime;

    mapping(address => mapping(uint256 => CoverLib.SlashingCoverInfo))
        public userToSlashingCover;
    mapping(address => mapping(uint256 => CoverLib.GenericCover))
        public userToSmartContractCover;
    mapping(address => mapping(uint256 => CoverLib.GenericCover))
        public userToStablecoinCover;
    mapping(address => mapping(uint256 => CoverLib.GenericCover))
        public userToProtocolCover;

    mapping(uint256 => bool) public availableSlashingCovers;
    mapping(uint256 => bool) public availableSmartContractCovers;
    mapping(uint256 => bool) public availableStablecoinCovers;
    mapping(uint256 => bool) public availableProtocolCovers;

    mapping(address => CoverLib.SlashingCoverInfo[]) public userSlashingCovers;
    mapping(address => CoverLib.GenericCover[]) public userSmartContractCovers;
    mapping(address => CoverLib.GenericCover[]) public userStablecoinCovers;
    mapping(address => CoverLib.GenericCover[]) public userProtocolCovers;

    CoverLib.CoverInfo[] public slashingCovers;
    CoverLib.CoverInfo[] public smartContractCovers;
    CoverLib.CoverInfo[] public stablecoinCovers;
    CoverLib.CoverInfo[] public protocolCovers;
    event CoverPurchased(
        address indexed user,
        uint256 coverValue,
        uint256 coverFee,
        uint256 coverPeriod,
        CoverLib.CoverType coverType
    );
    event PayoutClaimed(
        address indexed user,
        uint256 indexed poolId,
        uint256 amount
    );
    event CoverCreated(
        string network,
        uint256 chainId,
        CoverLib.CoverType coverType
    );

    constructor(
        address _lpContract,
        address _initialOwner
    ) Ownable(_initialOwner) {
        lpContract = ILP(_lpContract);
    }

    function createCover(
        CoverLib.CoverType _riskType,
        string memory _network,
        uint256 _chainId
    ) public onlyOwner {
        CoverLib.CoverInfo memory cover = CoverLib.CoverInfo({
            riskType: _riskType,
            network: _network,
            chainId: _chainId
        });

        if (_riskType == CoverLib.CoverType.Slashing) {
            if (availableSlashingCovers[_chainId]) {
                revert CoverAlreadyExists();
            }
            availableSlashingCovers[_chainId] = true;
            slashingCovers.push(cover);
        } else if (_riskType == CoverLib.CoverType.Stablecoin) {
            if (availableStablecoinCovers[_chainId]) {
                revert CoverAlreadyExists();
            }
            availableStablecoinCovers[_chainId] = true;
            stablecoinCovers.push(cover);
        } else if (_riskType == CoverLib.CoverType.SmartContract) {
            if (availableSmartContractCovers[_chainId]) {
                revert CoverAlreadyExists();
            }
            availableSmartContractCovers[_chainId] = true;
            smartContractCovers.push(cover);
        } else if (_riskType == CoverLib.CoverType.Protocol) {
            if (availableProtocolCovers[_chainId]) {
                revert CoverAlreadyExists();
            }
            availableProtocolCovers[_chainId] = true;
            protocolCovers.push(cover);
        } else {
            revert UnsupportedCoverType();
        }

        if (!isChainIdStored[_chainId]) {
            chainIds.push(_chainId);
            isChainIdStored[_chainId] = true;
        }

        emit CoverCreated(_network, _chainId, _riskType);
    }

    function purchaseSlashingCover(
        string memory _network,
        uint256 _networkChainId,
        uint256 _coverValue,
        uint256 _coverPeriod,
        string memory _validatorAddress
    ) public payable nonReentrant {
        if (!availableSlashingCovers[_networkChainId]) {
            revert CoverNotAvailable();
        }
        if (msg.value <= 0) {
            revert InvalidAmount();
        }
        if (_coverPeriod <= 27 || _coverPeriod >= 366) {
            revert InvalidCoverDuration();
        }

        CoverLib.SlashingCoverInfo memory newCover = CoverLib
            .SlashingCoverInfo({
                user: msg.sender,
                network: _network,
                chainId: _networkChainId,
                validatorAddress: _validatorAddress,
                coverValue: _coverValue,
                coverFee: msg.value,
                coverPeriod: _coverPeriod,
                startDay: block.timestamp,
                endDay: block.timestamp + (_coverPeriod * 1 days),
                isActive: true
            });

        userToSlashingCover[msg.sender][_networkChainId] = newCover;
        userSlashingCovers[msg.sender].push(newCover);
        coverFeeBalance += msg.value;

        emit CoverPurchased(
            msg.sender,
            _coverValue,
            msg.value,
            _coverPeriod,
            CoverLib.CoverType.Slashing
        );
    }

    function purchaseGenericCover(
        CoverLib.CoverType _riskType,
        string memory _network,
        uint256 _chainId,
        uint256 _coverValue,
        uint256 _coverPeriod
    ) public payable nonReentrant {
        if (msg.value <= 0) {
            revert InvalidAmount();
        }
        if (_coverPeriod <= 27 || _coverPeriod >= 366) {
            revert InvalidCoverDuration();
        }

        CoverLib.GenericCover memory newCover = CoverLib.GenericCover({
            user: msg.sender,
            network: _network,
            chainId: _chainId,
            coverValue: _coverValue,
            coverFee: msg.value,
            coverPeriod: _coverPeriod,
            startDay: block.timestamp,
            endDay: block.timestamp + (_coverPeriod * 1 days),
            isActive: true
        });

        if (_riskType == CoverLib.CoverType.Slashing) {
            revert UnsupportedCoverType();
        } else if (_riskType == CoverLib.CoverType.SmartContract) {
            userToSmartContractCover[msg.sender][_chainId] = newCover;
            userSmartContractCovers[msg.sender].push(newCover);
        } else if (_riskType == CoverLib.CoverType.Stablecoin) {
            userToStablecoinCover[msg.sender][_chainId] = newCover;
            userStablecoinCovers[msg.sender].push(newCover);
        } else if (_riskType == CoverLib.CoverType.Protocol) {
            userToProtocolCover[msg.sender][_chainId] = newCover;
            userProtocolCovers[msg.sender].push(newCover);
        } else {
            revert UnsupportedCoverType();
        }

        emit CoverPurchased(
            msg.sender,
            _coverValue,
            msg.value,
            _coverPeriod,
            _riskType
        );
    }

    function getAllUserCovers(
        address user
    )
        external
        view
        returns (
            CoverLib.SlashingCoverInfo[] memory,
            CoverLib.GenericCover[] memory,
            CoverLib.GenericCover[] memory,
            CoverLib.GenericCover[] memory
        )
    {
        return (
            userSlashingCovers[user],
            userSmartContractCovers[user],
            userStablecoinCovers[user],
            userProtocolCovers[user]
        );
    }

    function getAllAvailableCovers()
        external
        view
        returns (
            CoverLib.CoverInfo[] memory,
            CoverLib.CoverInfo[] memory,
            CoverLib.CoverInfo[] memory,
            CoverLib.CoverInfo[] memory
        )
    {
        return (
            slashingCovers,
            smartContractCovers,
            stablecoinCovers,
            protocolCovers
        );
    }

    function getUserGenericCoverInfo(
        address user,
        CoverLib.CoverType coverType,
        uint256 _chainId
    ) external view returns (CoverLib.GenericCoverInfo memory) {
        if (coverType == CoverLib.CoverType.Slashing) {
            return
                CoverLib.GenericCoverInfo({
                    coverType: CoverLib.CoverType.Slashing,
                    coverData: abi.encode(userToSlashingCover[user][_chainId])
                });
        } else if (coverType == CoverLib.CoverType.SmartContract) {
            return
                CoverLib.GenericCoverInfo({
                    coverType: CoverLib.CoverType.SmartContract,
                    coverData: abi.encode(
                        userToSmartContractCover[user][_chainId]
                    )
                });
        } else if (coverType == CoverLib.CoverType.Stablecoin) {
            return
                CoverLib.GenericCoverInfo({
                    coverType: CoverLib.CoverType.Stablecoin,
                    coverData: abi.encode(userToStablecoinCover[user][_chainId])
                });
        } else {
            return
                CoverLib.GenericCoverInfo({
                    coverType: CoverLib.CoverType.Protocol,
                    coverData: abi.encode(userToProtocolCover[user][_chainId])
                });
        }
    }

    function claimPayoutForLP(uint256 _poolId) external nonReentrant {
        ILP.Deposits memory depositInfo = lpContract.getUserDeposit(
            _poolId,
            msg.sender
        );
        if (depositInfo.status != ILP.Status.Active) {
            revert LpNotActive();
        }

        uint256 lastClaimTime = NextLpClaimTime[msg.sender];
        uint256 claimableDays = (block.timestamp - lastClaimTime) / 1 days;

        if (claimableDays <= 0) {
            revert NoClaimableReward();
        }

        uint256 claimableAmount = depositInfo.dailyPayout * claimableDays;

        if (claimableAmount > coverFeeBalance) {
            revert InsufficientPoolBalance();
        }
        NextLpClaimTime[msg.sender] = block.timestamp;

        (bool success, ) = msg.sender.call{value: claimableAmount}("");
        require(success, "Transfer failed");

        coverFeeBalance -= claimableAmount;

        emit PayoutClaimed(msg.sender, _poolId, claimableAmount);
    }
}
