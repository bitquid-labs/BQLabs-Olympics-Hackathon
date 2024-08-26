// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library CoverLib {
    struct CoverInfo {
        CoverType riskType;
        string network;
        uint256 chainId;
    }

    struct SlashingCoverInfo {
        address user;
        string network;
        uint256 chainId;
        string validatorAddress; // The address of the validator the user is staked with
        uint256 coverValue; // This is the value of the cover purchased
        uint256 coverFee; // This is the fee of the cover purchased, it would be dynamic and passed in on the frontend based on the value purchased.
        uint256 coverPeriod; // This is the period the cover is purchased for in days
        uint256 startDay; // When the cover starts
        uint256 endDay; // When the cover expires
        bool isActive;
    }

    struct SmartContractCoverInfo {
        address user;
        string network;
        uint256 chainId;
        uint256 coverValue; // This is the value of the cover purchased
        uint256 coverFee; // This is the fee of the cover purchased, it would be dynamic and passed in on the frontend based on the value purchased.
        uint256 coverPeriod; // This is the period the cover is purchased for in days
        uint256 startDay; // When the cover starts
        uint256 endDay; // When the cover expires
        bool isActive;
    }

    struct StablecoinCoverInfo {
        address user;
        string network;
        uint256 chainId;
        uint256 coverValue; // This is the value of the cover purchased
        uint256 coverFee; // This is the fee of the cover purchased, it would be dynamic and passed in on the frontend based on the value purchased.
        uint256 coverPeriod; // This is the period the cover is purchased for in days
        uint256 startDay; // When the cover starts
        uint256 endDay; // When the cover expires
        bool isActive;
    }

    struct ProtocolCoverInfo {
        address user;
        string network;
        uint256 chainId;
        uint256 coverValue; // This is the value of the cover purchased
        uint256 coverFee; // This is the fee of the cover purchased, it would be dynamic and passed in on the frontend based on the value purchased.
        uint256 coverPeriod; // This is the period the cover is purchased for in days
        uint256 startDay; // When the cover starts
        uint256 endDay; // When the cover expires
        bool isActive;
    }

    struct GenericCover {
        address user;
        string network;
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

    struct GenericCoverInfo {
        CoverType coverType;
        bytes coverData;
    }
}
