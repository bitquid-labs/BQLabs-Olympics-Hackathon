// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./LP.sol";

contract Governance is ReentrancyGuard, Ownable {
    struct Proposal {
        uint256 id;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 createdAt;
        uint256 deadline;
        bool executed;
        address tokenAddress;
        uint256 claimAmount;
    }

    struct Voter {
        bool voted;
        bool vote; // true for "for", false for "against"
        uint256 weight; // voting weight based on tokens held
    }

    uint256 public proposalCounter;
    uint256 public votingDuration;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => Voter)) public voters;

    event ProposalCreated(uint256 indexed proposalId, address indexed creator, string description, uint256 claimAmount);
    event VoteCast(address indexed voter, uint256 indexed proposalId, bool vote, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId, bool approved);

    IERC20 public governanceToken;

    // Reference to the InsurancePool contract
    InsurancePool public insurancePool;

    constructor(
        address _governanceToken,
        address _insurancePool,
        uint256 _votingDuration,
        address _initialOwner
    ) Ownable(_initialOwner) {
        governanceToken = IERC20(_governanceToken);
        insurancePool = InsurancePool(_insurancePool);
        votingDuration = _votingDuration;
    }

    // Create a new proposal for approving a claim
    function createProposal(string memory _description, address _tokenAddress, uint256 _claimAmount) external {
        require(insurancePool.poolExists(_tokenAddress), "Pool does not exist");
        require(_claimAmount > 0, "Claim amount must be greater than 0");

        proposalCounter++;

        proposals[proposalCounter] = Proposal({
            id: proposalCounter,
            description: _description,
            votesFor: 0,
            votesAgainst: 0,
            createdAt: block.timestamp,
            deadline: block.timestamp + votingDuration,
            executed: false,
            tokenAddress: _tokenAddress,
            claimAmount: _claimAmount
        });

        emit ProposalCreated(proposalCounter, msg.sender, _description, _claimAmount);
    }

    // Vote on a proposal
    function vote(uint256 _proposalId, bool _vote) external {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp <= proposal.deadline, "Voting period has ended");
        require(!voters[_proposalId][msg.sender].voted, "Already voted");

        uint256 voterWeight = governanceToken.balanceOf(msg.sender);
        require(voterWeight > 0, "No voting weight");

        voters[_proposalId][msg.sender] = Voter({
            voted: true,
            vote: _vote,
            weight: voterWeight
        });

        if (_vote) {
            proposal.votesFor += voterWeight;
        } else {
            proposal.votesAgainst += voterWeight;
        }

        emit VoteCast(msg.sender, _proposalId, _vote, voterWeight);
    }

    // Execute a proposal after the voting period ends
    function executeProposal(uint256 _proposalId) external nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.deadline, "Voting period is still active");
        require(!proposal.executed, "Proposal already executed");

        proposal.executed = true;

        if (proposal.votesFor > proposal.votesAgainst) {
            // If the proposal is approved, pay the claim from the respective pool
            insurancePool.payClaim(proposal.tokenAddress, proposal.claimAmount);
            emit ProposalExecuted(_proposalId, true);
        } else {
            emit ProposalExecuted(_proposalId, false);
        }
    }

    // Change the voting duration (only owner can do this)
    function setVotingDuration(uint256 _newDuration) external onlyOwner {
        require(_newDuration > 0, "Voting duration must be greater than 0");
        votingDuration = _newDuration;
    }

    // View proposal details
    function getProposalDetails(uint256 _proposalId) external view returns (
        string memory description,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 createdAt,
        uint256 deadline,
        bool executed,
        address tokenAddress,
        uint256 claimAmount
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.description,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.createdAt,
            proposal.deadline,
            proposal.executed,
            proposal.tokenAddress,
            proposal.claimAmount
        );
    }
}
