// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
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
    error InvalidCoverDuration();
    error CoverNotAvailable();
    error InvalidAmount();
    error UnsupportedCoverType();

    uint public coverFeeBalance;
    ILP public lpContract;

    mapping(uint256 => bool) public isChainIdStored;
    mapping(uint256 => bool) public slashingCoverExist;
    mapping(uint256 => bool) public smartContractCoverExist;
    mapping(uint256 => bool) public stablecoinCoverExist;
    mapping(uint256 => bool) public protocolCoverExist;

    mapping(address => uint256) public NextLpClaimTime;

    mapping(address => mapping(uint256 => CoverLib.GenericCoverInfo))
        public userToSlashingCover;
    mapping(address => mapping(uint256 => CoverLib.GenericCoverInfo))
        public userToSmartContractCover;
    mapping(address => mapping(uint256 => CoverLib.GenericCoverInfo))
        public userToStablecoinCover;
    mapping(address => mapping(uint256 => CoverLib.GenericCoverInfo))
        public userToProtocolCover;

    mapping(address => CoverLib.GenericCoverInfo[]) public userCovers;

    CoverLib.Cover[] public slashingCovers;
    CoverLib.Cover[] public smartContractCovers;
    CoverLib.Cover[] public stablecoinCovers;
    CoverLib.Cover[] public protocolCovers;

    uint256 slashingCoverCount;
    uint256 smartContractCoverCount;
    uint256 stablecoinCoverCount;
    uint256 protocolCoverCount;

    event CoverCreated(
        string name,
        string network,
        uint256 chainId,
        CoverLib.CoverType coverType
    );
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

    constructor(
        address _lpContract,
        address _initialOwner
    ) Ownable(_initialOwner) {
        lpContract = ILP(_lpContract);
    }

    function createCover(
        CoverLib.CoverType _riskType,
        string memory _coverName,
        string memory _network,
        uint256 _chainId,
        string memory _description
    ) public onlyOwner {
        CoverLib.Cover memory cover = CoverLib.Cover({
            id: 0,
            coverName: _coverName,
            riskType: _riskType,
            network: _network,
            chainId: _chainId,
            description: _description
        });

        if (_riskType == CoverLib.CoverType.Slashing) {
            cover.id = ++slashingCoverCount;
            slashingCovers.push(cover);
            slashingCoverExist[cover.id] = true;
        } else if (_riskType == CoverLib.CoverType.Stablecoin) {
            cover.id = ++stablecoinCoverCount;
            stablecoinCovers.push(cover);
            stablecoinCoverExist[cover.id] = true;
        } else if (_riskType == CoverLib.CoverType.SmartContract) {
            cover.id = ++smartContractCoverCount;
            smartContractCovers.push(cover);
            smartContractCoverExist[cover.id] = true;
        } else if (_riskType == CoverLib.CoverType.Protocol) {
            cover.id = ++protocolCoverCount;
            protocolCovers.push(cover);
            protocolCoverExist[cover.id] = true;
        } else {
            revert UnsupportedCoverType();
        }

        if (!isChainIdStored[_chainId]) {
            isChainIdStored[_chainId] = true;
        }

        emit CoverCreated(_coverName, _network, _chainId, _riskType);
    }

    function purchaseCover(
        CoverLib.CoverType _riskType,
        uint256 _coverId,
        string memory _coverName,
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

        CoverLib.GenericCoverInfo memory newCover = CoverLib.GenericCoverInfo({
            user: msg.sender,
            coverId: _coverId,
            coverName: _coverName,
            chainId: _chainId,
            coverValue: _coverValue,
            coverFee: msg.value,
            coverPeriod: _coverPeriod,
            startDay: block.timestamp,
            endDay: block.timestamp + (_coverPeriod * 1 days),
            isActive: true
        });

        if (_riskType == CoverLib.CoverType.Slashing) {
            if (!slashingCoverExist[_coverId]) {
                revert CoverNotAvailable();
            }
            userToSlashingCover[msg.sender][_coverId] = newCover;
            userCovers[msg.sender].push(newCover);
        } else if (_riskType == CoverLib.CoverType.SmartContract) {
            if (!smartContractCoverExist[_coverId]) {
                revert CoverNotAvailable();
            }
            userToSmartContractCover[msg.sender][_coverId] = newCover;
            userCovers[msg.sender].push(newCover);
        } else if (_riskType == CoverLib.CoverType.Stablecoin) {
            if (!stablecoinCoverExist[_coverId]) {
                revert CoverNotAvailable();
            }
            userToStablecoinCover[msg.sender][_coverId] = newCover;
            userCovers[msg.sender].push(newCover);
        } else if (_riskType == CoverLib.CoverType.Protocol) {
            if (!protocolCoverExist[_coverId]) {
                revert CoverNotAvailable();
            }
            userToProtocolCover[msg.sender][_coverId] = newCover;
            userCovers[msg.sender].push(newCover);
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
    ) external view returns (CoverLib.GenericCoverInfo[] memory) {
        return (userCovers[user]);
    }

    function getAllAvailableCovers()
        external
        view
        returns (
            CoverLib.Cover[] memory,
            CoverLib.Cover[] memory,
            CoverLib.Cover[] memory,
            CoverLib.Cover[] memory
        )
    {
        return (
            slashingCovers,
            smartContractCovers,
            stablecoinCovers,
            protocolCovers
        );
    }

    function getUserCoverInfo(
        address user,
        CoverLib.CoverType coverType,
        uint256 _coverId
    ) external view returns (CoverLib.GenericCover memory) {
        if (coverType == CoverLib.CoverType.Slashing) {
            return
                CoverLib.GenericCover({
                    coverType: CoverLib.CoverType.Slashing,
                    coverData: abi.encode(userToSlashingCover[user][_coverId])
                });
        } else if (coverType == CoverLib.CoverType.SmartContract) {
            return
                CoverLib.GenericCover({
                    coverType: CoverLib.CoverType.SmartContract,
                    coverData: abi.encode(
                        userToSmartContractCover[user][_coverId]
                    )
                });
        } else if (coverType == CoverLib.CoverType.Stablecoin) {
            return
                CoverLib.GenericCover({
                    coverType: CoverLib.CoverType.Stablecoin,
                    coverData: abi.encode(userToStablecoinCover[user][_coverId])
                });
        } else {
            return
                CoverLib.GenericCover({
                    coverType: CoverLib.CoverType.Protocol,
                    coverData: abi.encode(userToProtocolCover[user][_coverId])
                });
        }
    }

    function deleteExpiredCovers(
        address user,
        uint256 _coverId
    ) external onlyOwner {
        if (block.timestamp > userToSlashingCover[user][_coverId].endDay) {
            delete userToSlashingCover[user][_coverId];
        }
        if (block.timestamp > userToSmartContractCover[user][_coverId].endDay) {
            delete userToSmartContractCover[user][_coverId];
        }
        if (block.timestamp > userToStablecoinCover[user][_coverId].endDay) {
            delete userToStablecoinCover[user][_coverId];
        }
        if (block.timestamp > userToProtocolCover[user][_coverId].endDay) {
            delete userToProtocolCover[user][_coverId];
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

    function updateLPContract(address _newLpContract) external onlyOwner {
        lpContract = ILP(_newLpContract);
    }
}
