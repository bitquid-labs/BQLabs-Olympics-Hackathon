
# BQ Labs - Bitcoin Risk Management Layer

## Overview

BQ Labs is pioneering the first Bitcoin Risk Management Layer, aiming to secure the Bitcoin ecosystem through a decentralized insurance infrastructure. The BQ Protocol provides a robust technical, operational, and legal framework that enables members to underwrite and trade risk as a liquid asset, purchase coverage, and efficiently assess claims. This protocol is designed to bring transparency, trust, and efficiency to the Bitcoin financial landscape.

## System Architecture

### Key Actors and Processes

The BQ Protocol is structured around three primary user roles, each interacting with the protocol’s layered architecture to facilitate decentralized risk management:

- **Proposers (Cover Buyers/Clients):**  
   Proposers utilize the platform to secure their Bitcoin-related financial activities, such as staking and smart contracts, by purchasing tailored insurance coverage. After connecting their non-custodial wallet, proposers can select from various coverage options based on their specific risk profiles. The claims process is managed through a decentralized governance model, involving risk assessors, validators, and underwriters, particularly for complex risk scenarios.

- **Stakers (Liquidity Providers):**  
   Stakers provide liquidity to insurance pools, earning returns on their investments. The protocol ensures full transparency of risk and yield details, allowing Stakers to make informed decisions. The capital provided by Stakers is deployed to cover risks during adverse events, ensuring a resilient insurance framework.

- **Governance Participants (BQ Token Holders):**  
   Governance participants hold BQ Tokens, enabling them to vote on proposals and participate in the decision-making process. The protocol incentivizes active participation by rewarding governance activities with BQ Tokens, fostering an engaged and informed community.

### Risk Infrastructure Layer

- **Governance and Pool Infrastructure:**  
   BQ Labs has established a series of credit-rated pools, categorized based on the various risks within the BTCFi space. All claim assessments are executed transparently and on-chain via a governance-based voting mechanism. Only BQ Token holders are authorized to vote on claims, ensuring that decision-making remains decentralized and secure.

## Core Features

1. **Purchase Cover:**  
   Users can browse through a selection of risks, select a coverage tenure and amount, and secure their BTCFi position. This feature is fully integrated with non-custodial wallets, enabling seamless transactions.

2. **Stake:**  
   The staking module allows users to contribute assets to various credit-rated pools. The module provides real-time visibility into pool fund utilization, daily yield claims, and asset withdrawal upon the completion of the staking period.

3. **Claim Module:**  
   In the event of a risk occurrence, cover buyers can initiate a claim process to recover lost assets up to the value of their coverage. The module is designed to operate within the governance framework, ensuring that claims are assessed fairly and efficiently.

4. **Governance:**  
   This module facilitates the decentralized assessment of cover claims. BQ Token holders participate in voting on claims proposals, and those who make sound decisions are rewarded with additional BQ Tokens.

5. **Dynamic Pricing:**  
   The platform employs dynamic pricing algorithms to calculate cover capacity, pool ratios, and claim-based price discovery. This ensures that pricing remains fair and reflective of real-time risk assessments.

## Technical Details

- **Smart Contracts:** Developed using Solidity, with a focus on security, efficiency, and scalability.
- **Frontend:** Built using React.js, providing a responsive and user-friendly interface.
- **Wallet Integration:** Implemented using the Wagmi library, supporting various non-custodial wallets.
- **Blockchain:** The application is powered by the PWR BTC+ chain, ensuring high transaction throughput and minimal latency.
- **Storage:** All logos, images, and related assets are securely stored on IPFS, ensuring decentralized and immutable storage.

## Demo Link - https://youtu.be/O2n-idSakAA

## Deployed Contracts

Below is a list of the smart contracts deployed within the BQ Protocol:

1. **Staking Contract:** 0x89AE684d499bDecC283EDdc1122390C6e2355504
2. **Governance Contract:** 0x532656807B59DB53C940f984076D32fE653Db758
3. **Claim Module Contract:** 0x9689a2EAdF13DE136E7c7AC993Bb4Fc114669160
4. **Insurance Pool Contract:** 0x89AE684d499bDecC283EDdc1122390C6e2355504


## Conclusion

BQ Labs represents a significant advancement in the Bitcoin ecosystem by introducing a decentralized and robust risk management layer. By addressing the gaps in trust, transparency, and on-chain risk management, BQ Labs aims to become the go-to solution for insurance and risk mitigation in the BTCFi space. With its comprehensive technical framework and community-driven governance model, BQ Labs is poised to enhance the security and resilience of Bitcoin financial operations.


