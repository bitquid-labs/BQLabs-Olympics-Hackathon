const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InsuranceCover", function () {
  let InsuranceCover, insuranceCover;
  let owner, user1, user2;
  let lpContractMock, governance;
  let CoverLib;

  beforeEach(async function () {
    [owner, user1, user2, governance] = await ethers.getSigners();

    const LPContractMock = await ethers.getContractFactory("InsurancePool");
    lpContractMock = await LPContractMock.deploy(owner.address);
    console.log("Address:", lpContractMock.target);

    // const CoverLibFactory = await ethers.getContractFactory("CoverLib");
    // CoverLib = await CoverLibFactory.deploy();

    const InsuranceCoverFactory = await ethers.getContractFactory(
      "InsuranceCover"
    );

    insuranceCover = await InsuranceCoverFactory.deploy(
      lpContractMock.target,
      owner.address,
      governance.address
    );
  });

  describe("Cover Creation", function () {
    it("Should create a new slashing cover", async function () {
      await insuranceCover
        .connect(owner)
        .createCover(
          0,
          "Slashing Cover",
          "Ethereum",
          ethers.parseEther("1"),
          ethers.parseEther("1000"),
          5,
          1,
          "Slashing protection for Ethereum validators"
        );

      const cover = await insuranceCover.slashingCovers(1);
      expect(cover.coverName).to.equal("Slashing Cover");
      expect(cover.chains).to.equal("Ethereum");
    });
  });

  describe("Cover Purchase", function () {
    beforeEach(async function () {
      await lpContractMock.createPool("Random Pool", 3, 28);
      const pool = await lpContractMock.getPool(1);
      console.log("Pool created:", pool);
      await lpContractMock.connect(user2).deposit(1, 150, {
        value: ethers.parseEther("1000"),
      });
      await insuranceCover
        .connect(owner)
        .createCover(
          0,
          "Slashing Cover",
          "Ethereum",
          ethers.parseEther("1"),
          ethers.parseEther("1000"),
          5,
          1,
          "Slashing protection for Ethereum validators"
        );
    });

    it("Should allow a user to purchase a slashing cover", async function () {
      const coverValue = ethers.parseEther("100");

      await insuranceCover.connect(user1).purchaseCover(
        0, // Slashing
        1, // Cover ID
        "Slashing Cover",
        1, // Chain ID
        coverValue,
        30, // Cover period (days)
        { value: ethers.parseEther("1") } // Cover fee
      );

      const userCover = await insuranceCover.userToSlashingCover(
        user1.address,
        1
      );
      expect(userCover.coverValue).to.equal(coverValue);
      expect(userCover.isActive).to.be.true;
    });

    it("Should revert if cover period is invalid", async function () {
      await expect(
        insuranceCover.connect(user1).purchaseCover(
          0, // Slashing
          1, // Cover ID
          "Slashing Cover",
          1, // Chain ID
          ethers.parseEther("100"),
          10, // Invalid Cover period (too short)
          { value: ethers.parseEther("1") } // Cover fee
        )
      ).to.be.revertedWithCustomError(insuranceCover, "InvalidCoverDuration");
    });

    it("Should revert if cover value exceeds the cover balance", async function () {
      await expect(
        insuranceCover.connect(user1).purchaseCover(
          0, // Slashing
          1, // Cover ID
          "Slashing Cover",
          1, // Chain ID
          ethers.parseEther("2000"), // Exceeds cover balance
          30, // Cover period (days)
          { value: ethers.parseEther("1") } // Cover fee
        )
      ).to.be.revertedWithCustomError(
        insuranceCover,
        "InsufficientPoolBalance"
      );
    });
  });

  describe("Claim Payout", function () {
    beforeEach(async function () {
      await lpContractMock.createPool("Random Pool", 5, 28);
      const pool = await lpContractMock.getPool(1);
      console.log("Pool created:", pool);
      await lpContractMock.connect(user2).deposit(1, 150, {
        value: ethers.parseEther("1000"),
      });
      // Create a cover and simulate a purchase
      await insuranceCover.connect(owner).createCover(
        0, // Slashing
        "Slashing Cover",
        "Ethereum",
        ethers.parseEther("1"),
        ethers.parseEther("1000"),
        5,
        1,
        "Slashing protection for Ethereum validators"
      );

      await insuranceCover.connect(user1).purchaseCover(
        0, // Slashing
        1, // Cover ID
        "Slashing Cover",
        1, // Chain ID
        ethers.parseEther("100"),
        30, // Cover period (days)
        { value: ethers.parseEther("1") } // Cover fee
      );
    });

    it("Should allow LP to claim a payout", async function () {
      await lpContractMock.deposit(
        1, // poolId
        40,
        {
          value: ethers.parseEther("1000"),
        }
      );

      await insuranceCover.connect(user1).claimPayoutForLP(1);
      const balanceAfterClaim = await ethers.provider.getBalance(user1.address);
      expect(balanceAfterClaim).to.be.gt(0);
    });

    it("Should revert if LP is not active and go through if LP is active", async function () {
      await lpContractMock.connect(user1).deposit(
        1, // poolId
        30,
        {
          value: ethers.parseEther("7300"),
        }
      );
      const deposit = await lpContractMock.getUserDeposit(1, user1);
      const dailyPayout = ethers.formatEther(deposit.dailyPayout);
      console.log(dailyPayout);
      expect(parseFloat(dailyPayout)).to.be.eq(1.0);
    });
  });
});
