//SPDX-License-Identifier: UNLICENCED
pragma solidity ^0.8.11;


contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(address(newCampaign));
    }

    function getDeployedCampaigns() public view returns(address[] memory) {
         return deployedCampaigns;
    }

}
contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    event CreatedRequest(address owner, uint256 index);
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public contributers;
    mapping(uint => Request) public requests;
    uint public contributersCount;
    uint private requestCount;
    uint private requestIndex = 0;
    Request private newRequest; 

    modifier onlyContractOwner() {
        require(msg.sender == manager);
        _;
    }
    
    modifier onlyContributers() {
        require(contributers[msg.sender]);
        _;
    }

    constructor (uint minimum, address campaignCreator) {        
        manager = campaignCreator;
        minimumContribution = minimum;
    } 

    function contribute() public payable {
        require(msg.value > minimumContribution);
        contributers[msg.sender] = true;
        contributersCount++;
    }

    function createRequest(string memory description, uint value, address payable recipient) public onlyContractOwner {
        Request storage request = requests[requestIndex++];
        request.description = description;
        request.value = value;
        request.recipient = recipient;
        request.complete = false;
        request.approvalCount = 0;
        requestCount++;
        emit CreatedRequest(msg.sender, requestIndex);
    }
    
    function approveRequest(uint index) public onlyContributers {
        Request storage request = requests[index];
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public onlyContractOwner {
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount > contributersCount / 2);
        request.recipient.transfer(request.value);
        request.complete = true;
    }
    function isApproved(uint i, address approver) public view returns(bool) {
        Request storage request = requests[i];
        return request.approvals[approver];
    }

    function getSummary() public view returns (uint, uint,uint,uint,address) {
        return (
            minimumContribution,
            address(this).balance,
            requestCount,
            contributersCount,
            manager
        );
    }

    function getRequestCount() public view returns(uint) {
        return requestCount;
    }
}