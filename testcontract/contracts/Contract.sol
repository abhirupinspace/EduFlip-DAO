// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BasicDAO {
    struct Proposal {
        string description;
        uint256 voteCount;
        bool exists;
    }

    mapping(string => Proposal) public proposals;
    string[] public proposalList;
    mapping(address => bool) public hasVoted;

    address public owner;

    event ProposalCreated(string description);
    event Voted(address voter, string proposal);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute this");
        _;
    }

    modifier hasNotVoted() {
        require(!hasVoted[msg.sender], "You have already voted");
        _;
    }

    function createProposal(string memory _description) public onlyOwner {
        require(!proposals[_description].exists, "Proposal already exists");
        Proposal memory newProposal = Proposal({
            description: _description,
            voteCount: 0,
            exists: true
        });
        proposals[_description] = newProposal;
        proposalList.push(_description);

        emit ProposalCreated(_description);
    }

    function vote(string memory _proposal) public hasNotVoted {
        require(proposals[_proposal].exists, "Proposal does not exist");
        proposals[_proposal].voteCount += 1;
        hasVoted[msg.sender] = true;

        emit Voted(msg.sender, _proposal);
    }

    function getVoteCount(string memory _proposal) public view returns (uint256) {
        require(proposals[_proposal].exists, "Proposal does not exist");
        return proposals[_proposal].voteCount;
    }

    function getProposals() public view returns (string[] memory) {
        return proposalList;
    }
}
