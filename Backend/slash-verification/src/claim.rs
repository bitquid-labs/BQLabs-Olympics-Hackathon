use std::str::FromStr;
use alloy::{ primitives::{FixedBytes, U256}, providers::{Provider, ProviderBuilder,}};
use crate::{risk::{validator_score, verify_delegator}, types::{ProposalData, RiskTypes, UserGenericParam, UserSlashingParam}, utils::{send_generic_proposal_data, send_slashing_proposal_data}};
use eyre::{Ok, Result};
use crate::info::{get_slashing_cover_info, get_smart_contract_slashing_cover_info, get_stablecoin_slashing_cover_info, get_protocol_slashing_cover_info};
  
pub async fn claim_slashing_cover(user_param: UserSlashingParam) -> Result<ProposalData, eyre::Report> {
    let provider = ProviderBuilder::new()
            .with_chain_id(21000001)
            .on_http("https://bitcoinplus.pwrlabs.io/".parse()?);
            
    let user_slashing_cover_info = get_slashing_cover_info(user_param.user.as_str()).await?;
    // let exists = verify_delegator(&user_param.user, &user_param.validator_address).await?;
    let exists = true;
    if !exists {
        eyre::bail!("Delegator verification failed.");
    }

    let tx_hash_str = user_param.tx_hash.trim_start_matches("0x");
    let tx_hash = FixedBytes::<32>::from_str(tx_hash_str).map_err(|e| {
        eyre::eyre!("Failed to parse transaction hash: {:?}", e)
    })?;

    let tx = provider.get_transaction_by_hash(tx_hash).await?.ok_or_else(|| {
        eyre::eyre!("Transaction not found.")
    })?;

    if user_param.claim_value > tx.value {
        eyre::bail!("Claim value is more than value slashed!");
    }
    if user_param.claim_value > user_slashing_cover_info.cover_value {
        eyre::bail!("Cover value is less than the claim value requested!");
    }

    let risk_type = String::from("Slashing");
    let validator_score = validator_score(&user_param.validator_address).await?;

    let claim = send_slashing_proposal_data(
            user_param.pool_id,
            user_param.user.as_str(),
            &user_param.validator_address,
            validator_score,
            risk_type,
            user_param.claim_value,
            user_slashing_cover_info.cover_value,
            user_slashing_cover_info.end_day,
            user_param.tx_hash,
            user_param.description
    )
    .await;
    println!("Claim result: {:?}", claim);

    Ok(claim)
}

pub async fn claim_generic_cover(user_param: UserGenericParam) -> Result<ProposalData, eyre::Report> {

    let risk: String = match user_param.risk_type {
        RiskTypes::SmartContract => String::from("Smart Contract"),
        RiskTypes::Stablecoin => String::from("Stablecoin"),
        RiskTypes::Protocol => String::from("Protocol"),
    };
    let cover_value: U256;
    let cover_end_day: U256;
    if risk == String::from("Smart Contract") {
        let user_smart_contract_cover_info = get_smart_contract_slashing_cover_info(user_param.user.as_str()).await?;
        cover_value = user_smart_contract_cover_info.cover_value;
        cover_end_day = user_smart_contract_cover_info.end_day;
    } else if risk == String::from("Stablecoin") {
        let user_stablecoin_cover_info = get_stablecoin_slashing_cover_info(user_param.user.as_str()).await?;
        cover_value = user_stablecoin_cover_info.cover_value;
        cover_end_day = user_stablecoin_cover_info.end_day;
    } else if risk == String::from("Protocol") {
        let user_protocol_cover_info = get_protocol_slashing_cover_info(user_param.user.as_str()).await?;
        cover_value = user_protocol_cover_info.cover_value;
        cover_end_day = user_protocol_cover_info.end_day;
    } else {
        cover_value = U256::from(0);
        cover_end_day = U256::from(0);
    }

    let claim = send_generic_proposal_data(
                user_param.pool_id,
                user_param.user.as_str(),
                risk,
                user_param.claim_value,
                cover_value,
                cover_end_day,
                user_param.tx_hash,
                user_param.description
        )
        .await;

    println!("Claim result: {:?}", claim);

    Ok(claim)
}