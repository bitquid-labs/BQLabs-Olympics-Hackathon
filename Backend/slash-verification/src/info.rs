use crate::types::{GenericCoverInfo, SlashingCoverInfo};

use eyre::Ok;
use serde_json::Value;
use alloy::{ contract::{ContractInstance, Interface},
    primitives::{Address, U256}, providers::ProviderBuilder,
};
use std::str::FromStr;

pub async fn get_slashing_cover_info(address: &str) -> Result<SlashingCoverInfo, eyre::Report> {
    let provider = ProviderBuilder::new()
            .with_chain_id(21000001)
            .on_http("https://bitcoinplus.pwrlabs.io/".parse()?);

    let cover_contract_address = Address::from_str("0x68543e919B6cd5D884E22Ed85f912daE5De2371b")?;
    
    let path = std::env::current_dir()?.join("src/contract/artifacts/InsuranceCover.json");
    
    let artifacts = std::fs::read(path).expect("Failed to read artifact");
    let json: Value = serde_json::from_slice(&artifacts)?;

    let abi_value = json.get("abi").expect("Failed to get ABI from artifact");
    let abi = serde_json::from_str(&abi_value.to_string())?;
    
    let cover_contract = ContractInstance::new(cover_contract_address, provider, Interface::new(abi));
    let user_address = Address::from_str(address)?;
    let result = cover_contract.function("getSlashingCoverInfo", &[user_address.into()])?
        .call().await?;
    println!("Cover info: {:?}", result);

    let cover_info = result[0].as_tuple().unwrap();
    println!("Tuple length: {}", cover_info.len());

    let user = cover_info[0].as_address().unwrap();
    let validator_address = cover_info[1].as_str().unwrap().to_string();
    let cover_value: U256 = cover_info[2].as_uint().unwrap().0;
    let cover_fee: U256 = cover_info[3].as_uint().unwrap().0;
    let cover_period: U256 = cover_info[4].as_uint().unwrap().0;
    let start_day: U256 = cover_info[5].as_uint().unwrap().0;
    let end_day: U256 = cover_info[6].as_uint().unwrap().0;        
    let is_active = cover_info[7].as_bool().unwrap();

    let slashing_cover_info = SlashingCoverInfo {
        user: user,
        validator_address: validator_address,
        cover_value: cover_value,
        cover_fee: cover_fee,
        cover_period: cover_period,
        start_day: start_day,
        end_day: end_day,
        is_active: is_active
    };


    Ok(slashing_cover_info)
}

pub async fn get_smart_contract_slashing_cover_info(address: &str) -> Result<GenericCoverInfo, eyre::Report> {
    let provider = ProviderBuilder::new()
            .with_chain_id(21000001)
            .on_http("https://bitcoinplus.pwrlabs.io/".parse()?);

    let cover_contract_address = Address::from_str("0x68543e919B6cd5D884E22Ed85f912daE5De2371b")?;
    
    let path = std::env::current_dir()?.join("src/contract/artifacts/InsuranceCover.json");
    
    let artifacts = std::fs::read(path).expect("Failed to read artifact");
    let json: Value = serde_json::from_slice(&artifacts)?;

    let abi_value = json.get("abi").expect("Failed to get ABI from artifact");
    let abi = serde_json::from_str(&abi_value.to_string())?;
    
    let cover_contract = ContractInstance::new(cover_contract_address, provider, Interface::new(abi));
    let user_address = Address::from_str(address)?;
    let result = cover_contract.function("getSmartContractCoverInfo", &[user_address.into()])?
        .call().await?;
    println!("Cover info: {:?}", result);

    let cover_info = result[0].as_tuple().unwrap();

    let user = cover_info[0].as_address().unwrap();
    let cover_value : U256 = cover_info[1].as_uint().unwrap().0;
    let cover_fee : U256 = cover_info[2].as_uint().unwrap().0;
    let cover_period : U256 = cover_info[3].as_uint().unwrap().0;
    let start_day : U256 = cover_info[4].as_uint().unwrap().0;
    let end_day : U256 = cover_info[5].as_uint().unwrap().0;
    let is_active  = cover_info[6].as_bool().unwrap();

println!("User: {}", user);
println!("Value: {}", cover_value);

    let smartcontract_cover_info = GenericCoverInfo {
        user: user,
        risk_type: String::from("Smart Contract"),
        cover_value: cover_value,
        cover_fee: cover_fee,
        cover_period: cover_period,
        start_day: start_day,
        end_day: end_day,
        is_active: is_active
    };

    println!("Smart Contract cover Info {:?}", smartcontract_cover_info);

    Ok(smartcontract_cover_info)
}

pub async fn get_stablecoin_slashing_cover_info(address: &str) -> Result<GenericCoverInfo, eyre::Report> {
    let provider = ProviderBuilder::new()
            .with_chain_id(21000001)
            .on_http("https://bitcoinplus.pwrlabs.io/".parse()?);

    let cover_contract_address = Address::from_str("0x68543e919B6cd5D884E22Ed85f912daE5De2371b")?;
    
    let path = std::env::current_dir()?.join("src/contract/artifacts/InsuranceCover.json");
    
    let artifacts = std::fs::read(path).expect("Failed to read artifact");
    let json: Value = serde_json::from_slice(&artifacts)?;

    let abi_value = json.get("abi").expect("Failed to get ABI from artifact");
    let abi = serde_json::from_str(&abi_value.to_string())?;
    
    let cover_contract = ContractInstance::new(cover_contract_address, provider, Interface::new(abi));
    println!("Contract Instance gotten {:?}", cover_contract.address());
    let user_address = Address::from_str(address)?;
    let result = cover_contract.function("getStablecoinCoverInfo", &[user_address.into()])?
        .call().await?;
    println!("Cover info: {:?}", result);

    let cover_info = result[0].as_tuple().unwrap();

    let user = cover_info[0].as_address().unwrap();
    let cover_value : U256 = cover_info[1].as_uint().unwrap().0;
    let cover_fee : U256 = cover_info[2].as_uint().unwrap().0;
    let cover_period : U256 = cover_info[3].as_uint().unwrap().0;
    let start_day : U256 = cover_info[4].as_uint().unwrap().0;
    let end_day : U256 = cover_info[5].as_uint().unwrap().0;
    let is_active  = cover_info[6].as_bool().unwrap();

println!("User: {}", user);
println!("Value: {}", cover_value);

    let stablecoin_cover_info = GenericCoverInfo {
        user: user,
        risk_type: String::from("Stablecoin"),
        cover_value: cover_value,
        cover_fee: cover_fee,
        cover_period: cover_period,
        start_day: start_day,
        end_day: end_day,
        is_active: is_active
    };

    println!("Stablecoin cover Info: {:?}", stablecoin_cover_info);

    Ok(stablecoin_cover_info)
}

pub async fn get_protocol_slashing_cover_info(address: &str) -> Result<GenericCoverInfo, eyre::Report> {
    let provider = ProviderBuilder::new()
            .with_chain_id(21000001)
            .on_http("https://bitcoinplus.pwrlabs.io/".parse()?);

    let cover_contract_address = Address::from_str("0x68543e919B6cd5D884E22Ed85f912daE5De2371b")?;
    
    let path = std::env::current_dir()?.join("src/contract/artifacts/InsuranceCover.json");
    
    let artifacts = std::fs::read(path).expect("Failed to read artifact");
    let json: Value = serde_json::from_slice(&artifacts)?;

    let abi_value = json.get("abi").expect("Failed to get ABI from artifact");
    let abi = serde_json::from_str(&abi_value.to_string())?;
    
    let cover_contract = ContractInstance::new(cover_contract_address, provider, Interface::new(abi));
    println!("Contract Instance gotten {:?}", cover_contract.address());
    
    let user_address = Address::from_str(address)?;
    let result = cover_contract.function("getProtocolCoverInfo", &[user_address.into()])?
        .call().await?;
    println!("Cover info: {:?}", result);
    let cover_info = result[0].as_tuple().unwrap();

    let user = cover_info[0].as_address().unwrap();
    let cover_value : U256 = cover_info[1].as_uint().unwrap().0;
    let cover_fee : U256 = cover_info[2].as_uint().unwrap().0;
    let cover_period : U256 = cover_info[3].as_uint().unwrap().0;
    let start_day : U256 = cover_info[4].as_uint().unwrap().0;
    let end_day : U256 = cover_info[5].as_uint().unwrap().0;
    let is_active  = cover_info[6].as_bool().unwrap();

println!("User: {}", user);
println!("Value: {}", cover_value);

    let protocol_cover_info = GenericCoverInfo {
        user: user,
        risk_type: String::from("Protocol"),
        cover_value: cover_value,
        cover_fee: cover_fee,
        cover_period: cover_period,
        start_day: start_day,
        end_day: end_day,
        is_active: is_active
    };

    println!("Protocol Cover Info: {:?}", protocol_cover_info);

    Ok(protocol_cover_info)
}