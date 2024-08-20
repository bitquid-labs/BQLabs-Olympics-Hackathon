// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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
    struct SlashingCoverInfo {
        address user;
        string validatorPubkey; // The public key of the validator the user is staked with
        uint256 validatorIndex; // The index of the validator the user is staked with
        uint256 coverValue; // This is the value of the cover purchased
        uint256 coverFee; // This is the fee of the cover purchased, it would be dynamic and passed in on the frontend based on the value purchased.
        uint256 coverPeriod; // This is the period the cover is purchased for in days
        uint256 startDay; // When the cover starts
        uint256 endDay; // When the cover expires
        bool isActive;
    }

    struct SmartContractCoverInfo {
        address user;
        uint256 coverValue; // This is the value of the cover purchased
        uint256 coverFee; // This is the fee of the cover purchased, it would be dynamic and passed in on the frontend based on the value purchased.
        uint256 coverPeriod; // This is the period the cover is purchased for in days
        uint256 startDay; // When the cover starts
        uint256 endDay; // When the cover expires
        bool isActive;
    }

    struct StablecoinCoverInfo {
        address user;
        uint256 coverValue; // This is the value of the cover purchased
        uint256 coverFee; // This is the fee of the cover purchased, it would be dynamic and passed in on the frontend based on the value purchased.
        uint256 coverPeriod; // This is the period the cover is purchased for in days
        uint256 startDay; // When the cover starts
        uint256 endDay; // When the cover expires
        bool isActive;
    }

    struct ProtocolCoverInfo {
        address user;
        uint256 coverValue; // This is the value of the cover purchased
        uint256 coverFee; // This is the fee of the cover purchased, it would be dynamic and passed in on the frontend based on the value purchased.
        uint256 coverPeriod; // This is the period the cover is purchased for in days
        uint256 startDay; // When the cover starts
        uint256 endDay; // When the cover expires
        bool isActive;
    }

    IERC20 public coverToken;
    uint public coverFeeBalance;
    ILP public lpContract;

    mapping(address => SlashingCoverInfo) public userToSlashingCover;
    mapping(address => SmartContractCoverInfo) public userToSmartContractCover;
    mapping(address => StablecoinCoverInfo) public userToStablecoinCover;
    mapping(address => ProtocolCoverInfo) public userToProtocolCover;
    mapping(address => uint256) public NextLpClaimTime;

    address[] public slashCoveredAddresses;
    address[] public smartContractCoveredAddresses;
    address[] public stablecoinCoveredAddresses;
    address[] public protocolCoveredAddresses;

    event SlashingCoverPurchased(
        address indexed user,
        uint256 coverValue,
        uint256 coverFee,
        uint256 coverPeriod
    );
    event SmartContractCoverPurchased(
        address indexed user,
        uint256 coverValue,
        uint256 coverFee,
        uint256 coverPeriod
    );
    event StablecoinCoverPurchased(
        address indexed user,
        uint256 coverValue,
        uint256 coverFee,
        uint256 coverPeriod
    );
    event ProtocolCoverPurchased(
        address indexed user,
        uint256 coverValue,
        uint256 coverFee,
        uint256 coverPeriod
    );
    event CoverExpired(address indexed user, string coverType);
    event PayoutClaimed(
        address indexed user,
        uint256 indexed poolId,
        uint256 amount
    );

    constructor(
        address _lpContract,
        address _coverToken,
        address _initialOwner
    ) Ownable(_initialOwner) {
        lpContract = ILP(_lpContract);
        coverToken = IERC20(_coverToken);
    }

    // coverPeriod is the number of days the user is paying for
    function purchaseSlashingCover(
        uint256 _coverValue,
        uint256 _coverPeriod,
        string memory _validatorPubKey,
        uint256 _validatorIndex,
        uint256 _coverFee
    ) public payable nonReentrant {
        require(_coverFee > 0, "Amount must be greater than 0");
        require(
            _coverPeriod > 27 && _coverPeriod < 366,
            "Duration must be between 28 and 365 days"
        );

        require(
            coverToken.transferFrom(msg.sender, address(this), _coverFee),
            "Transfer failed"
        );

        SlashingCoverInfo memory newCover = SlashingCoverInfo({
            user: msg.sender,
            validatorPubkey: _validatorPubKey,
            validatorIndex: _validatorIndex,
            coverValue: _coverValue,
            coverFee: _coverFee,
            coverPeriod: _coverPeriod,
            startDay: block.timestamp,
            endDay: block.timestamp + (_coverPeriod * 1 days),
            isActive: true
        });

        userToSlashingCover[msg.sender] = newCover;
        slashCoveredAddresses.push(msg.sender);
        coverFeeBalance += _coverFee;

        emit SlashingCoverPurchased(
            msg.sender,
            _coverValue,
            _coverFee,
            _coverPeriod
        );
    }

    function purchaseSmartContractCover(
        uint256 _coverValue,
        uint256 _coverPeriod,
        uint256 _coverFee
    ) public payable nonReentrant {
        require(_coverFee > 0, "Amount must be greater than 0");
        require(
            _coverPeriod > 27 && _coverPeriod < 366,
            "Duration must be between 28 and 365 days"
        );
        require(
            coverToken.transferFrom(msg.sender, address(this), _coverFee),
            "Transfer failed"
        );

        SmartContractCoverInfo memory newCover = SmartContractCoverInfo({
            user: msg.sender,
            coverValue: _coverValue,
            coverFee: _coverFee,
            coverPeriod: _coverPeriod,
            startDay: block.timestamp,
            endDay: block.timestamp + (_coverPeriod * 1 days),
            isActive: true
        });

        userToSmartContractCover[msg.sender] = newCover;
        smartContractCoveredAddresses.push(msg.sender);
        coverFeeBalance += _coverFee;

        emit SmartContractCoverPurchased(
            msg.sender,
            _coverValue,
            _coverFee,
            _coverPeriod
        );
    }

    function purchaseStablecoinCover(
        uint256 _coverValue,
        uint256 _coverPeriod,
        uint256 _coverFee
    ) public payable nonReentrant {
        require(_coverFee > 0, "Amount must be greater than 0");
        require(
            _coverPeriod > 27 && _coverPeriod < 366,
            "Duration must be between 28 and 365 days"
        );
        require(
            coverToken.transferFrom(msg.sender, address(this), _coverFee),
            "Transfer failed"
        );

        StablecoinCoverInfo memory newCover = StablecoinCoverInfo({
            user: msg.sender,
            coverValue: _coverValue,
            coverFee: _coverFee,
            coverPeriod: _coverPeriod,
            startDay: block.timestamp,
            endDay: block.timestamp + (_coverPeriod * 1 days),
            isActive: true
        });

        userToStablecoinCover[msg.sender] = newCover;
        stablecoinCoveredAddresses.push(msg.sender);
        coverFeeBalance += _coverFee;

        emit StablecoinCoverPurchased(
            msg.sender,
            _coverValue,
            _coverFee,
            _coverPeriod
        );
    }

    function purchaseProtocolCover(
        uint256 _coverValue,
        uint256 _coverPeriod,
        uint256 _coverFee
    ) public payable nonReentrant {
        require(_coverFee > 0, "Amount must be greater than 0");
        require(
            _coverPeriod > 27 && _coverPeriod < 366,
            "Duration must be greater than between 28 and 365"
        );
        require(
            coverToken.transferFrom(msg.sender, address(this), _coverFee),
            "Transfer failed"
        );

        ProtocolCoverInfo memory newCover = ProtocolCoverInfo({
            user: msg.sender,
            coverValue: _coverValue,
            coverFee: _coverFee,
            coverPeriod: _coverPeriod,
            startDay: block.timestamp,
            endDay: block.timestamp + (_coverPeriod * 1 days),
            isActive: true
        });

        userToProtocolCover[msg.sender] = newCover;
        protocolCoveredAddresses.push(msg.sender);
        coverFeeBalance += _coverFee;

        emit ProtocolCoverPurchased(
            msg.sender,
            _coverValue,
            _coverFee,
            _coverPeriod
        );
    }

    function getSlashingCoverInfo(
        address user
    ) external view returns (SlashingCoverInfo memory) {
        return userToSlashingCover[user];
    }

    function getSmartContractCoverInfo(
        address user
    ) external view returns (SmartContractCoverInfo memory) {
        return userToSmartContractCover[user];
    }

    function getStablecoinCoverInfo(
        address user
    ) external view returns (StablecoinCoverInfo memory) {
        return userToStablecoinCover[user];
    }

    function getProtocolCoverInfo(
        address user
    ) external view returns (ProtocolCoverInfo memory) {
        return userToProtocolCover[user];
    }

    function deleteExpiredCovers(address user) external onlyOwner {
        if (block.timestamp > userToSlashingCover[user].endDay) {
            delete userToSlashingCover[user];
        }
        if (block.timestamp > userToSmartContractCover[user].endDay) {
            delete userToSmartContractCover[user];
        }
        if (block.timestamp > userToStablecoinCover[user].endDay) {
            delete userToStablecoinCover[user];
        }
        if (block.timestamp > userToProtocolCover[user].endDay) {
            delete userToProtocolCover[user];
        }
    }

    function claimPayoutForLP(uint256 _poolId) external nonReentrant {
        ILP.Deposits memory depositInfo = lpContract.getUserDeposit(
            _poolId,
            msg.sender
        );
        require(depositInfo.status == ILP.Status.Active, "LP not active");

        uint256 lastClaimTime = NextLpClaimTime[msg.sender];
        uint256 claimableDays = (block.timestamp - lastClaimTime) / 1 days;
        require(claimableDays > 0, "No claimable rewards yet");

        uint256 claimableAmount = depositInfo.dailyPayout * claimableDays;
        require(
            claimableAmount <= coverFeeBalance,
            "Insufficient balance in pool"
        );

        NextLpClaimTime[msg.sender] = block.timestamp;

        require(
            coverToken.transfer(msg.sender, claimableAmount),
            "Transfer failed"
        );
        coverFeeBalance -= claimableAmount;

        emit PayoutClaimed(msg.sender, _poolId, claimableAmount);
    }
}
