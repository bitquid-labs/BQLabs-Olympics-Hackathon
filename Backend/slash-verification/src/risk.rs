use pwr_rs::{ rpc::RPC, validator::Validator};
use std::result::Result::Ok;

use eyre::Result;
use crate::utils::PWR_BITCOIN_PLUS;

pub async fn get_validator(address: &str) -> Result<Validator, eyre::Report> {
    let rpc = RPC::new(PWR_BITCOIN_PLUS).await.map_err(|e| eyre::eyre!("Failed to create RPC connection: {:?}", e))?;
    let all_validators = rpc.all_validators().await.map_err(|e| eyre::eyre!("Error fetching validators: {:?}", e))?;
    let validator = all_validators.into_iter().find(|validator| validator.address == address).expect("Failed to fetch validator");

    Ok(validator)
}

pub async fn verify_delegator(user_address: &str, validator_address: &str) -> Result<bool, eyre::Report> {
    let rpc = RPC::new(PWR_BITCOIN_PLUS).await.map_err(|e| eyre::eyre!("Failed to create RPC connection: {:?}", e))?;
    println!("Validator address: {:?}", validator_address);
    
    let delegators_result = rpc.delegators_of_validator(validator_address).await;

    match delegators_result {
        Ok(delegators) => {
            println!("Delegators: {:?}", delegators);
            let exists = delegators.iter().any(|delegator| delegator.address == user_address);
            Ok(exists)
        },
        Err(e) => {
            println!("Error fetching delegators: {:?}", e);
            Err(eyre::eyre!("Failed to fetch delegators: {:?}", e))
        }
    }
}


pub async fn get_all_validators() -> Result<Vec<Validator>, eyre::Report> {
    let rpc = RPC::new(PWR_BITCOIN_PLUS).await.map_err(|e| eyre::eyre!("Error from RPC Connection: {:?}", e))?;
    let all_validators = rpc.all_validators().await.expect("Error getting validators");
    Ok(all_validators)
}

pub async fn validator_score(validator_address: &str) -> Result<u64, eyre::Report> {
    let validator = get_validator(validator_address).await?;
    let total_network_voting_power = get_total_network_voting_power().await as f64;
    let total_delegators = get_total_delegators().await? as f64;
    let total_shares = get_total_network_share().await as f64;

    let is_active_score: f64 = if validator.is_active { 100.0 } else { 0.0 };

    let actor_score: f64 = if validator.bad_actor { 0.0 } else { 100.0 };

    let normalized_voting_power_score = ((validator.voting_power as f64 / total_network_voting_power) * 100.0).min(100.0);
    let normalized_delegators_count_score = ((validator.delegators_count as f64 / total_delegators) * 100.0).min(100.0);
    let normalized_total_shares_score = ((validator.total_shares as f64 / total_shares) * 100.0).min(100.0);

    let final_score = (is_active_score * 0.20) +
                      (actor_score * 0.20) +
                      (normalized_voting_power_score * 0.30) +
                      (normalized_delegators_count_score * 0.15) +
                      (normalized_total_shares_score * 0.15);

    let score = final_score.round() as u64;

    Ok(score)
}

pub async fn get_total_network_voting_power() -> u64 {
    let rpc = RPC::new(PWR_BITCOIN_PLUS).await.expect("Failed to initialize RPC");
    let power = rpc.active_voting_power().await.expect("Failed to get total voting power");

    power
}

pub async fn get_total_delegators() -> Result<u32, eyre::Report> {
    let rpc = RPC::new(PWR_BITCOIN_PLUS).await.expect("Failed to initialize RPC");
    let all_validators = rpc.all_validators().await.expect("Failed to fetch validators");

    let validators = all_validators.iter().map(|validator| validator.delegators_count).sum();
    Ok(validators)
}

pub async fn get_total_network_share() -> u64 {
    let rpc = RPC::new(PWR_BITCOIN_PLUS).await.expect("Failed to initialize RPC");
    let all_validators = rpc.all_validators().await.expect("Failed to fetch validators");

    all_validators.iter().map(|validator| validator.total_shares).sum()
}
