const { expect } = require("chai");
const hre = require("hardhat");

describe("InsurancePool", function () {
  let InsurancePool, insurancePool;
  let MockERC20, token;
  let owner, user;
  before(async function () {
    [owner, user] = await hre.ethers.getSigners();

    MockERC20 = await hre.ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy(
      "MockToken",
      "MTK",
      18,
      hre.ethers.parseEther("1000000")
    );
    await token.waitForDeployment();
    console.log("MockERC20 deployed to:", await token.getAddress());

    // Deploy insurance pool contract
    InsurancePool = await hre.ethers.getContractFactory("InsurancePool");
    insurancePool = await InsurancePool.deploy(owner.address); // Provide the initialOwner argument
    await insurancePool.waitForDeployment();
    console.log("InsurancePool deployed to:", await insurancePool.getAddress());
    await insurancePool.createPool(await token.getAddress());
    console.log("Pool created at", await token.getAddress());
    const mintAmount = hre.ethers.parseEther("100"); // Amount to mint
    await token.connect(owner).mint(user.address, mintAmount);
    console.log(
      "Minted",
      mintAmount.toString(),
      "tokens to user:",
      user.address
    );
  });
  it("should deploy the contracts correctly", async function () {
    expect(await token.name()).to.equal("MockToken");
    expect(await token.symbol()).to.equal("MTK");
    expect(await insurancePool.owner()).to.equal(owner.address);
  });
  it("should create a new pool", async function () {
    const poolExists = await insurancePool.poolExists(await token.getAddress());
    if (!poolExists) {
      await insurancePool.createPool(await token.getAddress());
    }

    const poolDetails = await insurancePool.getPoolDetails(
      await token.getAddress()
    );

    expect(poolDetails[0]).to.equal(0); // totalDeposits
    expect(poolDetails[1]).to.equal(0); // totalPremiums
    expect(poolDetails[2]).to.equal(0); // totalClaimsPaid
  });

  it("should allow users to deposit tokens", async function () {
    const depositAmount = hre.ethers.parseEther("10");
    await token
      .connect(user)
      .approve(await insurancePool.getAddress(), depositAmount);
    await insurancePool
      .connect(user)
      .deposit(await token.getAddress(), depositAmount);

    const userDeposit = await insurancePool.getUserDeposits(
      await user.getAddress(),
      await token.getAddress()
    );
    expect(userDeposit).to.equal(depositAmount);
  });
  it("should allow users to withdraw tokens", async function () {
    const withdrawAmount = hre.ethers.parseEther("5");

    // Withdraw
    await insurancePool
      .connect(user)
      .withdraw(await token.getAddress(), withdrawAmount);

    const userDeposit = await insurancePool.getUserDeposits(
      await user.getAddress(),
      await token.getAddress()
    );
    expect(userDeposit).to.equal(hre.ethers.parseEther("5")); // 10 - 5 = 5
  });
  it("should collect premiums", async function () {
    const premiumAmount = hre.ethers.parseEther("2");

    await token
      .connect(owner)
      .approve(await insurancePool.getAddress(), premiumAmount);
    await insurancePool.collectPremium(await token.getAddress(), premiumAmount);

    const poolDetails = await insurancePool.getPoolDetails(
      await token.getAddress()
    );
    expect(poolDetails[1]).to.equal(premiumAmount);
  });
  it("should pay claims", async function () {
    const claimAmount = hre.ethers.parseEther("3");

    // Ensure the insurance pool contract is allowed to spend the owner's tokens
    await token
      .connect(owner)
      .approve(await insurancePool.getAddress(), hre.ethers.parseEther("10"));

    // Collect a premium to ensure there is a sufficient balance for claims
    await insurancePool.collectPremium(
      await token.getAddress(),
      hre.ethers.parseEther("10")
    );

    // Pay claim
    await insurancePool.payClaim(await token.getAddress(), claimAmount);

    const poolDetails = await insurancePool.getPoolDetails(
      await token.getAddress()
    );
    expect(poolDetails[2]).to.equal(claimAmount);
  });
});
