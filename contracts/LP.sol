// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InsurancePool is ReentrancyGuard, Ownable {
    struct Pool {
        IERC20 token;
        uint256 totalDeposits;
        uint256 totalPremiums;
        uint256 totalClaimsPaid;
    }

    // Pool data mapping (for multiple pools)
    mapping(address => Pool) public pools;
    mapping(address => mapping(address => uint256)) public userDeposits;

    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdraw(address indexed user, address indexed token, uint256 amount);
    event PremiumCollected(address indexed token, uint256 amount);
    event ClaimPaid(address indexed token, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {
        // The Ownable constructor is called with the initialOwner address
    }

    // Create a new pool for a token
    function createPool(address tokenAddress) external onlyOwner {
        require(pools[tokenAddress].token == IERC20(address(0)), "Pool already exists");
        pools[tokenAddress] = Pool({
            token: IERC20(tokenAddress),
            totalDeposits: 0,
            totalPremiums: 0,
            totalClaimsPaid: 0
        });
    }
    function poolExists(address tokenAddress) external view returns (bool) {
    return pools[tokenAddress].token != IERC20(address(0));
}

    // Deposit tokens into the pool
    function deposit(address tokenAddress, uint256 amount) external nonReentrant {
        Pool storage pool = pools[tokenAddress];
        require(pool.token != IERC20(address(0)), "Pool does not exist");
        require(amount > 0, "Deposit amount must be greater than 0");

        pool.token.transferFrom(msg.sender, address(this), amount);
        pool.totalDeposits += amount;
        userDeposits[msg.sender][tokenAddress] += amount;

        emit Deposit(msg.sender, tokenAddress, amount);
    }

    // Withdraw tokens from the pool
    function withdraw(address tokenAddress, uint256 amount) external nonReentrant {
        Pool storage pool = pools[tokenAddress];
        require(pool.token != IERC20(address(0)), "Pool does not exist");
        require(amount > 0, "Withdraw amount must be greater than 0");
        require(userDeposits[msg.sender][tokenAddress] >= amount, "Insufficient balance");

        pool.totalDeposits -= amount;
        userDeposits[msg.sender][tokenAddress] -= amount;
        pool.token.transfer(msg.sender, amount);

        emit Withdraw(msg.sender, tokenAddress, amount);
    }

    // Collect premiums
    function collectPremium(address tokenAddress, uint256 amount) external onlyOwner {
        Pool storage pool = pools[tokenAddress];
        require(pool.token != IERC20(address(0)), "Pool does not exist");
        require(amount > 0, "Amount must be greater than 0");

        pool.totalPremiums += amount;
        pool.token.transferFrom(msg.sender, address(this), amount);

        emit PremiumCollected(tokenAddress, amount);
    }

    // Pay insurance claims
    function payClaim(address tokenAddress, uint256 amount) external onlyOwner nonReentrant {
        Pool storage pool = pools[tokenAddress];
        require(pool.token != IERC20(address(0)), "Pool does not exist");
        require(amount > 0, "Amount must be greater than 0");
        require(pool.totalDeposits >= amount, "Insufficient pool balance");

        pool.totalClaimsPaid += amount;
        pool.totalDeposits -= amount;
        pool.token.transfer(msg.sender, amount);

        emit ClaimPaid(tokenAddress, amount);
    }

    // View total deposits for a user
    function getUserDeposits(address user, address tokenAddress) external view returns (uint256) {
        return userDeposits[user][tokenAddress];
    }

    // View pool details
    function getPoolDetails(address tokenAddress) external view returns (uint256, uint256, uint256) {
        Pool storage pool = pools[tokenAddress];
        return (pool.totalDeposits, pool.totalPremiums, pool.totalClaimsPaid);
    }
}
