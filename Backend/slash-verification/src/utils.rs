use std::u64;
use alloy::primitives:: {Uint, U256};
use std::str::FromStr;

use crate::types::ProposalData;

pub const PWR_BITCOIN_PLUS: &str = "https://pwrrpc.pwrlabs.io/"; // Not specific to the bitcoin+ chain though

pub async fn send_generic_proposal_data(pool_id: u64, user_address: &str, risk_type: String, claim_value: U256, user_cover_value: U256, cover_end_day: U256, tx_hash: String, description: String) -> ProposalData {
    let claim_value_u64 = u256_to_u64(claim_value);
    let cover_end_day_u64 = u256_to_u64(cover_end_day);
    let cover_value_u64 = u256_to_u64(user_cover_value);
    ProposalData {
        user: user_address.to_string(),
        validator: "".to_string(),
        validator_score: 0,
        risk_type,
        cover_end_day: cover_end_day_u64,
        cover_value: cover_value_u64,
        description,
        tx_hash,
        pool_id,
        claim_amount: claim_value_u64,
    }
}

pub async fn send_slashing_proposal_data(pool_id: u64, user_address: &str, validator: &str, validator_score: u64, risk_type: String, claim_value: U256, user_cover_value: U256, cover_end_day: U256, tx_hash: String, description: String) -> ProposalData {
    let claim_value_u64 = u256_to_u64(claim_value);
    let cover_end_day_u64 = u256_to_u64(cover_end_day);
    let cover_value_u64 = u256_to_u64(user_cover_value);
    ProposalData {
        user: user_address.to_string(),
        validator: validator.to_string(),
        validator_score: validator_score,
        risk_type,
        cover_end_day: cover_end_day_u64,
        cover_value: cover_value_u64,
        description,
        tx_hash,
        pool_id,
        claim_amount: claim_value_u64,
    }
}

fn u256_to_u64(value: Uint<256, 4>) -> u64 {
    let value_str = value.to_string();
    
    let value = u64::from_str(&value_str).unwrap_or(0);

    value
}