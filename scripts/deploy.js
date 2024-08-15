// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const InsurancePool = await hre.ethers.getContractFactory("InsurancePool");

  // Define the initial owner address (example address)
  const initialOwner = "0xB443D0CC017E4398Bc17aA31173621E5EA8D1940";

  // Deploy the contract with the initial owner address
  const insurancePool = await InsurancePool.deploy(initialOwner);

  // Wait for deployment to finish
  await insurancePool.waitForDeployment();

  // Log the address of the deployed contract
  console.log("InsurancePool deployed to:", await insurancePool.getAddress());
}

// Run the main function and handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
