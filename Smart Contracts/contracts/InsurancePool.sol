// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InsurancePool is ReentrancyGuard, Ownable {
    error LpNotActive();

    struct Pool {
        string poolName;
        uint256 apy;
        uint256 minPeriod;
        uint256 tvl;
        uint256 tcp; // Total claim paid to users
        bool isActive; // Pool status to handle soft deletion
        mapping(address => Deposits) deposits; // Mapping of user address to their deposit
    }

    struct Deposits {
        address lp;
        uint256 amount;
        uint256 poolId;
        uint256 period;
        uint256 dailyPayout;
        Status status;
        uint256 expiryDate;
    }

    // Define PoolInfo struct
    struct PoolInfo {
        string poolName;
        uint256 apy;
        uint256 minPeriod;
        uint256 tvl;
        uint256 tcp; // Total claim paid to users
        bool isActive; // Pool status to handle soft deletion
    }

    enum Status {
        Active,
        Withdrawn
    }

    mapping(uint256 => Pool) public pools;
    uint256 public poolCount;
    address public governance;
    address public initialOwner;

    event Deposited(address indexed user, uint256 amount, string pool);
    event Withdraw(address indexed user, uint256 amount, string pool);
    event ClaimPaid(address indexed recipient, string pool, uint256 amount);
    event PoolCreated(uint256 indexed id, string poolName);
    event PoolUpdated(uint256 indexed poolId, uint256 apy, uint256 _minPeriod);
    event ClaimAttempt(uint256, uint256, address);

    constructor(address _initialOwner) Ownable(_initialOwner) {
        initialOwner = _initialOwner;
    }

    function createPool(
        string memory _poolName,
        uint256 _apy,
        uint256 _minPeriod
    ) public onlyOwner {
        poolCount += 1;
        Pool storage newPool = pools[poolCount];
        newPool.poolName = _poolName;
        newPool.apy = _apy;
        newPool.minPeriod = _minPeriod;
        newPool.tvl = 0;
        newPool.isActive = true;

        emit PoolCreated(poolCount, _poolName);
    }

    function updatePool(
        uint256 _poolId,
        uint256 _apy,
        uint256 _minPeriod
    ) public onlyOwner {
        require(pools[_poolId].isActive, "Pool does not exist or is inactive");
        require(_apy > 0, "Invalid APY");
        require(_minPeriod > 0, "Invalid minimum period");

        pools[_poolId].apy = _apy;
        pools[_poolId].minPeriod = _minPeriod;

        emit PoolUpdated(_poolId, _apy, _minPeriod);
    }

    function deactivatePool(uint256 _poolId) public onlyOwner {
        if (!pools[_poolId].isActive) {
            revert LpNotActive();
        }
        pools[_poolId].isActive = false;
    }

    function getPool(
        uint256 _poolId
    )
        public
        view
        returns (
            string memory name,
            uint256 apy,
            uint256 minPeriod,
            uint256 tvl,
            bool isActive
        )
    {
        Pool storage pool = pools[_poolId];
        return (
            pool.poolName,
            pool.apy,
            pool.minPeriod,
            pool.tvl,
            pool.isActive
        );
    }

    // Function to get all pools
    function getAllPools() public view returns (PoolInfo[] memory) {
        PoolInfo[] memory result = new PoolInfo[](poolCount);

        for (uint256 i = 1; i <= poolCount; i++) {
            Pool storage pool = pools[i];
            result[i - 1] = PoolInfo({
                poolName: pool.poolName,
                apy: pool.apy,
                minPeriod: pool.minPeriod,
                tvl: pool.tvl,
                tcp: pool.tcp,
                isActive: pool.isActive
            });
        }
        return result;
    }

    function getPoolsByAddress(
        address _userAddress
    ) public view returns (PoolInfo[] memory) {
        PoolInfo[] memory result = new PoolInfo[](poolCount);
        for (uint256 i = 1; i <= poolCount; i++) {
            Pool storage pool = pools[i];
            if (pool.deposits[_userAddress].amount > 0) {
                result[i - 1] = PoolInfo({
                    poolName: pool.poolName,
                    apy: pool.apy,
                    minPeriod: pool.minPeriod,
                    tvl: pool.tvl,
                    tcp: pool.tcp,
                    isActive: pool.isActive
                });
            }
        }
        return result;
    }

    function withdraw(uint256 _poolId) public nonReentrant {
        Pool storage selectedPool = pools[_poolId];
        Deposits storage userDeposit = selectedPool.deposits[msg.sender];

        require(userDeposit.amount > 0, "No deposit found for this address");
        require(userDeposit.status == Status.Active, "Deposit is not active");
        require(
            block.timestamp >= userDeposit.expiryDate,
            "Deposit period has not ended"
        );

        userDeposit.status = Status.Withdrawn;
        selectedPool.tvl -= userDeposit.amount;

        (bool success, ) = msg.sender.call{value: userDeposit.amount}("");
        require(success, "Withdrawal failed");

        emit Withdraw(msg.sender, userDeposit.amount, selectedPool.poolName);
    }

    function deposit(
        uint256 _poolId,
        uint256 _period
    ) public payable nonReentrant {
        Pool storage selectedPool = pools[_poolId];

        require(msg.value > 0, "Amount must be greater than 0");
        require(selectedPool.isActive, "Pool is inactive or does not exist");
        require(
            _period >= selectedPool.minPeriod,
            "Deposit period is less than the minimum required"
        );

        uint256 dailyPayout = (msg.value * selectedPool.apy) / 100 / 365;

        require(
            selectedPool.deposits[msg.sender].amount == 0,
            "Existing deposit found for this address"
        );

        selectedPool.deposits[msg.sender] = Deposits({
            lp: msg.sender,
            amount: msg.value,
            poolId: _poolId,
            period: _period,
            dailyPayout: dailyPayout,
            status: Status.Active,
            expiryDate: block.timestamp + (_period * 1 days)
        });

        selectedPool.tvl += msg.value;

        emit Deposited(msg.sender, msg.value, selectedPool.poolName);
    }

    function payClaim(
        uint256 poolId,
        uint256 claimAmount,
        address payable recipient
    ) public onlyGovernance nonReentrant {
        Pool storage pool = pools[poolId];
        require(pool.isActive, "Pool is not active");
        require(pool.tvl >= claimAmount, "Not enough funds in the pool");

        emit ClaimAttempt(poolId, claimAmount, recipient); // Add this line to debug

        recipient.transfer(claimAmount);

        pool.tcp += claimAmount;
        pool.tvl -= claimAmount;

        emit ClaimPaid(msg.sender, pool.poolName, claimAmount);
    }

    function getUserDeposit(
        uint256 _poolId,
        address _user
    ) public view returns (Deposits memory) {
        return pools[_poolId].deposits[_user];
    }

    function getPoolTVL(uint256 _poolId) public view returns (uint256) {
        return pools[_poolId].tvl;
    }

    function poolActive(uint256 poolId) public view returns (bool) {
        Pool storage pool = pools[poolId];
        return pool.isActive;
    }

    function setGovernance(address _governance) external onlyOwner {
        require(governance == address(0), "Governance already set");
        require(_governance != address(0), "Governance address cannot be zero");
        governance = _governance;
    }

    modifier onlyGovernance() {
        require(
            msg.sender == governance || msg.sender == initialOwner,
            "Caller is not the governance contract"
        );
        _;
    }
}
