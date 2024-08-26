use alloy::primitives::{Address, U256};
use serde::{Deserialize, Serialize};
use pwr_rs::validator::Validator;
#[derive(Clone, Deserialize, Serialize)]
pub struct SlashingCoverInfo {
    pub user: Address,
    pub validator_address: String,
    pub cover_value: U256,
    pub cover_fee: U256,
    pub cover_period: U256,
    pub start_day: U256,
    pub end_day: U256,
    pub is_active: bool,
}
#[derive(Debug, Deserialize, Serialize)]
pub struct GenericCoverInfo {
    pub user: Address,
    pub risk_type: String,
    pub cover_value: U256,
    pub cover_fee: U256,
    pub cover_period: U256,
    pub start_day: U256,
    pub end_day: U256,
    pub is_active: bool,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ProposalData {
    pub user: String,
    pub validator: String,
    pub validator_score: u64,
    pub risk_type: String,
    pub cover_end_day: u64,
    pub cover_value: u64,
    pub description: String,
    pub tx_hash: String,
    pub pool_id: u64,
    pub claim_amount: u64
}
#[derive(Debug, Deserialize, Serialize)]
pub struct SlashingProposalData {
    pub user: String,
    pub validator_address: String,
    pub validator_score: u64,
    pub risk_type: String,
    pub cover_end_day: u64,
    pub cover_value: u64,
    pub description: String,
    pub tx_hash: String,
    pub pool_id: u64,
    pub claim_amount: u64
}

#[derive(Clone, Deserialize, Serialize)]
pub struct UserSlashingParam {
    pub user: String,
    pub validator_address: String,
    pub date: String,
    pub claim_value: U256,
    pub tx_hash: String,
    pub pool_id: u64, // Pool Id should be gotten from the frontend when the user selects the pool with its associated risk type.
    pub description: String
}
#[derive(Debug, Deserialize, Serialize)]
pub struct UserGenericParam{
    pub user: String,
    pub risk_type: RiskTypes,
    pub date: String,
    pub claim_value: U256,
    pub tx_hash: String,
    pub pool_id: u64, // Pool Id should be gotten from the frontend when the user selects the pool with its associated risk type.
    pub description: String
}

#[derive(Debug, Deserialize, Serialize)]
pub enum RiskTypes {
    SmartContract,
    Stablecoin,
    Protocol
}

#[derive(Serialize)]
pub struct SerializableValidator {
    address: String,
    ip: String,
    bad_actor: bool,
    voting_power: u64,
    total_shares: u64,
    delegators_count: u32,
    is_active: bool,
}

impl From<Validator> for SerializableValidator {
    fn from(validator: Validator) -> Self {
        SerializableValidator {
            address: validator.address,
            ip: validator.ip.to_string(),
            bad_actor: validator.bad_actor,
            voting_power: validator.voting_power,
            total_shares: validator.total_shares,
            delegators_count: validator.delegators_count,
            is_active: validator.is_active,
        }
    }
}