const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Governance Contract", function () {
    let Governance, governance, InsurancePool, insurancePool, Token, token;
    let owner, addr1, addr2;
    let votingDuration = 3 * 24 * 60 * 60; // 3 days

    beforeEach(async function () {
        // Deploy the GovernanceToken (ERC20 token)
        Token = await ethers.getContractFactory("ERC20Mock");
        token = await Token.deploy("GovernanceToken", "GOV", ethers.utils.parseEther("10000"));
        await token.deployed();

        // Deploy the InsurancePool contract
        InsurancePool = await ethers.getContractFactory("InsurancePoolMock");
        insurancePool = await InsurancePool.deploy();
        await insurancePool.deployed();

        // Deploy the Governance contract
        Governance = await ethers.getContractFactory("Governance");
        [owner, addr1, addr2] = await ethers.getSigners();
        governance = await Governance.deploy(token.address, insurancePool.address, votingDuration, owner.address);
        await governance.deployed();

        // Initialize the Insurance Pool with some token
        await insurancePool.createPool(token.address);
    });

    it("should create a proposal", async function () {
        const description = "Proposal 1";
        const claimAmount = ethers.utils.parseEther("100");

        await expect(governance.createProposal(description, token.address, claimAmount))
            .to.emit(governance, "ProposalCreated")
            .withArgs(1, owner.address, description, claimAmount);

        const proposal = await governance.getProposalDetails(1);
        expect(proposal.description).to.equal(description);
        expect(proposal.votesFor).to.equal(0);
        expect(proposal.votesAgainst).to.equal(0);
        expect(proposal.executed).to.equal(false);
        expect(proposal.claimAmount).to.equal(claimAmount);
    });

    it("should allow voting on a proposal", async function () {
        const description = "Proposal 1";
        const claimAmount = ethers.utils.parseEther("100");

        await governance.createProposal(description, token.address, claimAmount);

        // Transfer tokens to addr1 and addr2 for voting
        await token.transfer(addr1.address, ethers.utils.parseEther("1000"));
        await token.transfer(addr2.address, ethers.utils.parseEther("500"));

        // addr1 votes "for" the proposal
        await expect(governance.connect(addr1).vote(1, true))
            .to.emit(governance, "VoteCast")
            .withArgs(addr1.address, 1, true, ethers.utils.parseEther("1000"));

        // addr2 votes "against" the proposal
        await expect(governance.connect(addr2).vote(1, false))
            .to.emit(governance, "VoteCast")
            .withArgs(addr2.address, 1, false, ethers.utils.parseEther("500"));

        const proposal = await governance.getProposalDetails(1);
        expect(proposal.votesFor).to.equal(ethers.utils.parseEther("1000"));
        expect(proposal.votesAgainst).to.equal(ethers.utils.parseEther("500"));
    });

    it("should execute a proposal and pay the claim if approved", async function () {
        const description = "Proposal 1";
        const claimAmount = ethers.utils.parseEther("100");

        await governance.createProposal(description, token.address, claimAmount);

        // Transfer tokens to addr1 and addr2 for voting
        await token.transfer(addr1.address, ethers.utils.parseEther("1000"));
        await token.transfer(addr2.address, ethers.utils.parseEther("500"));

        // addr1 votes "for" the proposal
        await governance.connect(addr1).vote(1, true);

        // Increase time to after voting period
        await ethers.provider.send("evm_increaseTime", [votingDuration + 1]);
        await ethers.provider.send("evm_mine", []);

        // Execute the proposal
        await expect(governance.executeProposal(1))
            .to.emit(governance, "ProposalExecuted")
            .withArgs(1, true);

        // Verify that the claim was paid
        expect(await insurancePool.isClaimPaid(token.address)).to.equal(true);
    });

    it("should fail to execute a proposal if not approved", async function () {
        const description = "Proposal 1";
        const claimAmount = ethers.utils.parseEther("100");

        await governance.createProposal(description, token.address, claimAmount);

        // Transfer tokens to addr1 and addr2 for voting
        await token.transfer(addr1.address, ethers.utils.parseEther("1000"));
        await token.transfer(addr2.address, ethers.utils.parseEther("500"));

        // addr1 votes "against" the proposal
        await governance.connect(addr1).vote(1, false);

        // Increase time to after voting period
        await ethers.provider.send("evm_increaseTime", [votingDuration + 1]);
        await ethers.provider.send("evm_mine", []);

        // Execute the proposal
        await expect(governance.executeProposal(1))
            .to.emit(governance, "ProposalExecuted")
            .withArgs(1, false);

        // Verify that the claim was not paid
        expect(await insurancePool.isClaimPaid(token.address)).to.equal(false);
    });

    it("should allow owner to change voting duration", async function () {
        const newDuration = 2 * 24 * 60 * 60; // 2 days
        await governance.setVotingDuration(newDuration);
        expect(await governance.votingDuration()).to.equal(newDuration);
    });

    it("should revert if non-owner tries to change voting duration", async function () {
        const newDuration = 2 * 24 * 60 * 60; // 2 days
        await expect(governance.connect(addr1).setVotingDuration(newDuration)).to.be.revertedWith("Ownable: caller is not the owner");
    });
});
