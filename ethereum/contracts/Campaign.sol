pragma solidity ^0.8.9;

contract CampaignFactory {
    address [] deployedCampaigns;

    function createCampaign(uint minimumContribution) public {
        address newCampaign = address(new Campaign(minimumContribution, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    address public manager;
    uint public minimumContribution;
    uint approversCount;
    mapping(address => bool) public approvers;
    uint numRequests;
    mapping (uint => Request) public requests;
    
    constructor(uint minimumContribution, address creator) public {
        manager = creator;
        minimumContribution = minimumContribution;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function createRequest(string calldata description, uint value, address recipient) public restricted {
        Request storage r = requests[numRequests++];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
    }

    function approveRequest(uint requestIndex) public {
        Request storage request = requests[requestIndex];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint requestIndex) public restricted {
        Request storage request = requests[requestIndex];
        require(!request.complete);
        require(request.approvalCount > (approversCount / 2)); // At least half approvers

        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }
}
