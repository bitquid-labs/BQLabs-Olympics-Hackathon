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

    struct Pool {
        string poolName;
        CoverLib.RiskType riskType;
        uint256 apy;
        uint256 minPeriod;
        uint256 tvl;
        uint256 tcp; // Total claim paid to users
        bool isActive; // Pool status to handle soft deletion
        uint256 percentageSplitBalance;
        mapping(address => Deposits) deposits; // Mapping of user address to their deposit
    }

    enum Status {
        Active,
        Expired
    }

    function getUserDeposit(
        uint256 _poolId,
        address _user
    ) external view returns (Deposits memory);

    function getPool(
        uint256 _poolId
    )
        external
        view
        returns (
            string memory name,
            CoverLib.RiskType riskType,
            uint256 apy,
            uint256 minPeriod,
            uint256 tvl,
            bool isActive,
            uint256 percentageSplitBalance
        );

        function updatePercentageSplit(uint256 _poolId,uint256 __poolPercentageSplit) external ;
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
    error WrongPool();

    uint public coverFeeBalance;
    ILP public lpContract;
    address public governance;
    address public initialOwner;

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
    CoverLib.Cover[] public allCovers;

    mapping(uint256 => CoverLib.Cover) public slashingCovers;
    mapping(uint256 => CoverLib.Cover) public smartContractCovers;
    mapping(uint256 => CoverLib.Cover) public stablecoinCovers;
    mapping(uint256 => CoverLib.Cover) public protocolCovers;

    uint256 slashingCoverCount;
    uint256 smartContractCoverCount;
    uint256 stablecoinCoverCount;
    uint256 protocolCoverCount;

    event CoverCreated(
        string name,
        CoverLib.RiskType riskType
    );
    event CoverPurchased(
        address indexed user,
        uint256 coverValue,
        uint256 coverFee,
        CoverLib.RiskType riskType
    );
    event PayoutClaimed(
        address indexed user,
        uint256 indexed poolId,
        uint256 amount
    );

    constructor(
        address _lpContract,
        address _initialOwner,
        address _governace
    ) Ownable(_initialOwner) {
        lpContract = ILP(_lpContract);
        governance = _governace;
        initialOwner = _initialOwner;
    }

    function createCover(
        CoverLib.RiskType _riskType,
        string memory _coverName,
        string memory _chains,
        uint256 _capacity,
        uint256 _poolId
    ) public onlyOwner {
        (, CoverLib.RiskType risk, , , uint256 tvl, , uint256 _percentageSplitBalance) = lpContract.getPool(_poolId);

        if (risk != _riskType || _capacity > _percentageSplitBalance) {
            revert WrongPool();
        }

        uint256 _maxAmount = tvl * (_capacity * 1e18 / 100) / 1e18;

        lpContract.updatePercentageSplit(_poolId, _capacity);
        CoverLib.Cover memory cover = CoverLib.Cover({
            id: 0,
            coverName: _coverName,
            riskType: _riskType,
            chains: _chains,
            capacity: _capacity,
            maxAmount: _maxAmount,
            poolId: _poolId
        });

        if (_riskType == CoverLib.RiskType.Slashing) {
            cover.id = ++slashingCoverCount;
            slashingCovers[cover.id] = cover;
            slashingCoverExist[cover.id] = true;
        } else if (_riskType == CoverLib.RiskType.Stablecoin) {
            cover.id = ++stablecoinCoverCount;
            stablecoinCovers[cover.id] = cover;
            stablecoinCoverExist[cover.id] = true;
        } else if (_riskType == CoverLib.RiskType.SmartContract) {
            cover.id = ++smartContractCoverCount;
            smartContractCovers[cover.id] = cover;
            smartContractCoverExist[cover.id] = true;
        } else if (_riskType == CoverLib.RiskType.Protocol) {
            cover.id = ++protocolCoverCount;
            protocolCovers[cover.id] = cover;
            protocolCoverExist[cover.id] = true;
        } else {
            revert UnsupportedCoverType();
        }
        allCovers.push(cover);

        emit CoverCreated(_coverName, _riskType);
    }

    function purchaseCover(
        CoverLib.RiskType _riskType,
        uint256 _coverId,
        string memory _coverName,
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
            riskType: _riskType,
            coverName: _coverName,
            coverValue: _coverValue,
            claimPaid: 0,
            coverPeriod: _coverPeriod,
            endDay: block.timestamp + (_coverPeriod * 1 days),
            isActive: true
        });

        if (_riskType == CoverLib.RiskType.Slashing) {
            if (!slashingCoverExist[_coverId]) {
                revert CoverNotAvailable();
            }
            uint256 coverBalance = slashingCovers[_coverId].maxAmount;
            if (_coverValue > coverBalance) {
                revert InsufficientPoolBalance();
            }
            slashingCovers[_coverId].maxAmount -= _coverValue;
            if (userToSlashingCover[msg.sender][_coverId].coverValue == 0) {
                userToSlashingCover[msg.sender][_coverId] = newCover;
                userCovers[msg.sender].push(newCover);
            } else {
                userToSlashingCover[msg.sender][_coverId].coverValue += _coverValue;
                userToSlashingCover[msg.sender][_coverId].coverPeriod += _coverPeriod;
                userToSlashingCover[msg.sender][_coverId].endDay += (_coverPeriod * 1 days);
            }
        } else if (_riskType == CoverLib.RiskType.SmartContract) {
            if (!smartContractCoverExist[_coverId]) {
                revert CoverNotAvailable();
            }
            uint256 coverBalance = smartContractCovers[_coverId].maxAmount;
            if (_coverValue > coverBalance) {
                revert InsufficientPoolBalance();
            }
            smartContractCovers[_coverId].maxAmount -= _coverValue;
            if (userToSmartContractCover[msg.sender][_coverId].coverValue == 0) {
                userToSmartContractCover[msg.sender][_coverId] = newCover;
                userCovers[msg.sender].push(newCover);
            } else  {
                userToSmartContractCover[msg.sender][_coverId].coverValue += _coverValue;
                userToSmartContractCover[msg.sender][_coverId].coverPeriod += _coverPeriod;
                userToSmartContractCover[msg.sender][_coverId].endDay += (_coverPeriod * 1 days);
            }
        } else if (_riskType == CoverLib.RiskType.Stablecoin) {
            if (!stablecoinCoverExist[_coverId]) {
                revert CoverNotAvailable();
            }
            uint256 coverBalance = stablecoinCovers[_coverId].maxAmount;
            if (_coverValue > coverBalance) {
                revert InsufficientPoolBalance();
            }
            stablecoinCovers[_coverId].maxAmount -= _coverValue;
            if (userToStablecoinCover[msg.sender][_coverId].coverValue == 0) {
                userToStablecoinCover[msg.sender][_coverId] = newCover;
                userCovers[msg.sender].push(newCover);
            } else  {
                userToStablecoinCover[msg.sender][_coverId].coverValue += _coverValue;
                userToStablecoinCover[msg.sender][_coverId].coverPeriod += _coverPeriod;
                userToStablecoinCover[msg.sender][_coverId].endDay += (_coverPeriod * 1 days);
            }
        } else if (_riskType == CoverLib.RiskType.Protocol) {
            if (!protocolCoverExist[_coverId]) {
                revert CoverNotAvailable();
            }
            uint256 coverBalance = protocolCovers[_coverId].maxAmount;
            if (_coverValue > coverBalance) {
                revert InsufficientPoolBalance();
            }
            protocolCovers[_coverId].maxAmount -= _coverValue;
            if (userToProtocolCover[msg.sender][_coverId].coverValue == 0) {
                userToProtocolCover[msg.sender][_coverId] = newCover;
                userCovers[msg.sender].push(newCover);
            } else  {
                userToProtocolCover[msg.sender][_coverId].coverValue += _coverValue;
                userToProtocolCover[msg.sender][_coverId].coverPeriod += _coverPeriod;
                userToProtocolCover[msg.sender][_coverId].endDay += (_coverPeriod * 1 days);
            }
        } else {
            revert UnsupportedCoverType();
        }

        emit CoverPurchased(
            msg.sender,
            _coverValue,
            msg.value,
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
        returns (CoverLib.Cover[] memory)
    {
        return (allCovers);
    }

    function getUserCoverInfo(
        address user,
        CoverLib.RiskType riskType,
        uint256 _coverId
    ) external view returns (CoverLib.GenericCover memory) {
        if (riskType == CoverLib.RiskType.Slashing) {
            return
                CoverLib.GenericCover({
                    riskType: CoverLib.RiskType.Slashing,
                    coverData: abi.encode(userToSlashingCover[user][_coverId])
                });
        } else if (riskType == CoverLib.RiskType.SmartContract) {
            return
                CoverLib.GenericCover({
                    riskType: CoverLib.RiskType.SmartContract,
                    coverData: abi.encode(
                        userToSmartContractCover[user][_coverId]
                    )
                });
        } else if (riskType == CoverLib.RiskType.Stablecoin) {
            return
                CoverLib.GenericCover({
                    riskType: CoverLib.RiskType.Stablecoin,
                    coverData: abi.encode(userToStablecoinCover[user][_coverId])
                });
        } else {
            return
                CoverLib.GenericCover({
                    riskType: CoverLib.RiskType.Protocol,
                    coverData: abi.encode(userToProtocolCover[user][_coverId])
                });
        }
    }

    function updateUserCoverValue(
        address user,
        uint256 _coverId,
        CoverLib.RiskType riskType,
        uint256 _claimPaid
    ) public onlyGovernance nonReentrant {
        if (riskType == CoverLib.RiskType.Slashing) {
            userToSlashingCover[user][_coverId].coverValue -= _claimPaid;
            userToSlashingCover[user][_coverId].claimPaid += _claimPaid;
        } else if (riskType == CoverLib.RiskType.SmartContract) {
            userToSmartContractCover[user][_coverId].coverValue -= _claimPaid;
            userToSmartContractCover[user][_coverId].claimPaid += _claimPaid;
        } else if (riskType == CoverLib.RiskType.Stablecoin) {
            userToStablecoinCover[user][_coverId].coverValue -= _claimPaid;
            userToStablecoinCover[user][_coverId].claimPaid += _claimPaid;
        } else if (riskType == CoverLib.RiskType.Protocol) {
            userToProtocolCover[user][_coverId].coverValue -= _claimPaid;
            userToProtocolCover[user][_coverId].claimPaid += _claimPaid;
        } else {
            revert CoverNotAvailable();
        }
    }

    // function deleteExpiredCovers(
    //     address user,
    //     uint256 _coverId
    // ) external onlyOwner {
    //     if (block.timestamp > userToSlashingCover[user][_coverId].endDay) {
    //         delete userToSlashingCover[user][_coverId];
    //     }
    //     if (block.timestamp > userToSmartContractCover[user][_coverId].endDay) {
    //         delete userToSmartContractCover[user][_coverId];
    //     }
    //     if (block.timestamp > userToStablecoinCover[user][_coverId].endDay) {
    //         delete userToStablecoinCover[user][_coverId];
    //     }
    //     if (block.timestamp > userToProtocolCover[user][_coverId].endDay) {
    //         delete userToProtocolCover[user][_coverId];
    //     }
    // }

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

    modifier onlyGovernance() {
        require(
            msg.sender == governance,
            "Caller is not the governance contract"
        );
        _;
    }

    modifier onlyContractOwner() {
        require( msg.sender == owner() || msg.sender == initialOwner || msg.sender == address(this),
            "Caller is not the governance contract"
        );
        _;
    }
}
