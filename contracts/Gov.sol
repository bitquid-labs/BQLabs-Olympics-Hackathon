// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ILP {
    struct Deposits {
        address lp;
        uint256 amount; // User Input
        string category; // User Input
        uint256 apy; // Annual Percentage Yield. Calculated from the frontend
        string pool; // FTF
        uint256 period; // User Input in days
        uint dailyPayout; // FTF. This would be the amount the depositor would receive daily. Calculated from its deposit amount and apy
        Status status;
        uint256 expiryDate;
    }

    enum Status {
        Active,
        Expired
    }

    function getDeposit(address lp) external view returns (Deposits memory);
    function poolActive(uint256 poolId) external view returns (bool);
    function payClaim(
        uint256 poolId,
        uint256 amount,
        address recipient
    ) external view returns (bool);
}

contract Governance is ReentrancyGuard, Ownable {
    struct Proposal {
        uint256 id;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 createdAt;
        uint256 deadline;
        bool executed;
        ProposalParams proposalParam;
    }

    struct Voter {
        bool voted;
        bool vote; // true for "for", false for "against"
        uint256 weight; // voting weight based on tokens held
    }

    struct ProposalParams {
        address user;
        string riskType;
        uint256 coverEndDay;
        uint256 coverValue;
        string description;
        string txHash;
        uint256 poolId;
        uint256 claimAmount;
    }

    uint256 public proposalCounter;
    uint256 public votingDuration;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => Voter)) public voters;

    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed creator,
        string description,
        uint256 claimAmount
    );
    event VoteCast(
        address indexed voter,
        uint256 indexed proposalId,
        bool vote,
        uint256 weight
    );
    event ProposalExecuted(uint256 indexed proposalId, bool approved);

    IERC20 public governanceToken;

    // Reference to the InsurancePool contract
    ILP public lpContract;

    constructor(
        address _governanceToken,
        address _insurancePool,
        uint256 _votingDuration,
        address _initialOwner
    ) Ownable(_initialOwner) {
        governanceToken = IERC20(_governanceToken);
        lpContract = ILP(_insurancePool);
        votingDuration = _votingDuration;
    }

    // Create a new proposal for approving a claim
    function createProposal(ProposalParams memory params) external {
        require(lpContract.poolActive(params.poolId), "Pool does not exist");
        require(params.claimAmount > 0, "Claim amount must be greater than 0");

        proposalCounter++;

        proposals[proposalCounter] = Proposal({
            id: proposalCounter,
            votesFor: 0,
            votesAgainst: 0,
            createdAt: block.timestamp,
            deadline: block.timestamp + votingDuration,
            executed: false,
            proposalParam: params
        });

        emit ProposalCreated(
            proposalCounter,
            params.user,
            params.description,
            params.claimAmount
        );
    }

    // Vote on a proposal
    function vote(uint256 _proposalId, bool _vote) external {
        Proposal storage proposal = proposals[_proposalId];
        require(
            block.timestamp <= proposal.deadline,
            "Voting period has ended"
        );
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

    function executeProposal(uint256 _proposalId) external nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        require(
            block.timestamp > proposal.deadline,
            "Voting period is still active"
        );
        require(!proposal.executed, "Proposal already executed");

        proposal.executed = true;

        if (proposal.votesFor > proposal.votesAgainst) {
            require(
                lpContract.payClaim(
                    proposal.proposalParam.poolId,
                    proposal.proposalParam.claimAmount,
                    proposal.proposalParam.user
                ),
                "Error Claiming pay"
            );
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
    function getProposalDetails(
        uint256 _proposalId
    ) external view returns (Proposal memory) {
        return proposals[_proposalId];
    }
}
