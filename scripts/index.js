const hre = require("hardhat");
const deployLP = require('./deployPool')

async function main() {
    const governanceTokenAddress = "0x4200000000000000000000000000000000000006"; // This is the WBTC for B2 network 
    const coverTokenAddress = "0x4200000000000000000000000000000000000006"; // This is the WBTC for B2 network 
    const votingDuration = 3600; // We will reset this
    const initialOwner = "0xB443D0CC017E4398Bc17aA31173621E5EA8D1940"; // Example address
    const poolAddress = await deployLP()

    // Deploy Governance
    const Governance = await hre.ethers.getContractFactory("Governance");
    const governance = await Governance.deploy(
        governanceTokenAddress,
        poolAddress,
        votingDuration,
        initialOwner
    );
    await governance.waitForDeployment();    
    governanceContract = governance.getAddress()
    console.log("Governance deployed to:", governanceContract);

    // Deploy Cover
    const Cover = await hre.ethers.getContractFactory("InsuranceCover");
    const cover = await Cover.deploy(
        coverTokenAddress,
        poolAddress,
        initialOwner
    );
    await cover.waitForDeployment();
    console.log("Governance deployed to:", cover.getAddress());


    // Set Governance
    const LPool = await hre.ethers.getContractAt("InsurancePool", poolAddress);
    const tx = await LPool.setGovernance(governanceAddress);
    await tx.wait();
    console.log("Governance address set in Pool contract")

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
