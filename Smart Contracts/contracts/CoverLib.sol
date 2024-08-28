// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library CoverLib {
    struct Cover {
        uint256 id;
        string coverName;
        CoverType riskType;
        string chains;
        uint256 dailyCost;
        uint256 capacity;
        uint256 securityRating;
        string coverWording;
        uint256 maxAmount;
        uint256 currentBalance;
        uint256 poolId;
        string description;
    }

    struct GenericCoverInfo {
        address user;
        uint256 coverId;
        string coverName;
        uint256 chainId;
        uint256 coverValue; // This is the value of the cover purchased
        uint256 coverFee; // This is the fee of the cover purchased, it would be dynamic and passed in on the frontend based on the value purchased.
        uint256 coverPeriod; // This is the period the cover is purchased for in days
        uint256 startDay; // When the cover starts
        uint256 endDay; // When the cover expires
        bool isActive;
    }

    enum CoverType {
        Slashing,
        SmartContract,
        Stablecoin,
        Protocol
    }

    struct GenericCover {
        CoverType coverType;
        bytes coverData;
    }
}
