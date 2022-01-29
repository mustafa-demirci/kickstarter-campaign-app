//MARK: - REQUIRED MODULES
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

//MARK: - COMPILED CONTRACT OUTPUT
const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

//MARK: - GLOBAL VARIABLES
let MINIMUM_NEEDED_GAS = '2000000';
let accounts;
let factory;
let campaignAddress;
let campaign;
let contractDeployer;
let contributerAccount;
let recipientAccount;

//MARK: - TEST SETUP
beforeEach( async () => {
  accounts = await web3.eth.getAccounts();
  contractDeployer = accounts[0];
  contributerAccount = accounts[5];
  recipientAccount = accounts[4];
  factory = await new web3.eth.Contract(compiledCampaignFactory.abi)
  .deploy({data: compiledCampaignFactory.evm.bytecode.object})
  .send({
    from: contractDeployer,
    gas: MINIMUM_NEEDED_GAS
  });
  await createCampaign('10');

  const deployedCampaigns = await factory.methods.getDeployedCampaigns().call();
  campaignAddress = deployedCampaigns[0];
  // [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  //sugar syntax

  //Creating campaign contract's shadow here.
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress); 
})

 //-------------------------------------------------------
 //MARK: - CAMPAIGN FACTORY CONTRACT TESTS
describe('Campaign Factory Test', () => {
 it('Deploys a factory and a campaign', () => {
   assert.ok(factory.options.address);
   assert.ok(campaign.options.address);
 });

 it('deployed campaign checks',async () => {
   const deployedCampaigns = await factory.methods.getDeployedCampaigns().call();
   assert.equal(deployedCampaigns.length, 1);
 });

 it('campaign manager is the campaign creator', async () => {
   const manager = await campaign.methods.manager().call();
    assert.equal(manager, contractDeployer);
 });

});

 //MARK: - CAMPAIGN CONTRACT TESTS
//-----------------------------------------------------------
describe('Campaign Tests', () => {
  it('contributes to Campaign', async () => {
    await contributeToCampaign('15');
    const isContributer = await campaign.methods.contributers(contributerAccount).call();
    const campaignBalance = await web3.eth.getBalance(campaign.options.address);
    assert(isContributer);
    assert.equal('15', web3.utils.fromWei(campaignBalance, 'ether'));
  });
  it('requires a minimum contribution amount', async () => {
    try {
      await campaign.methods.contribute().send({
        from: contributerAccount,
        value: '7'
      });
      assert(false);
    } catch(error) {
      assert(error);
    }
  });
  it('Campaign owner creates Request', async () => {
    await createRequest();
    const request = await campaign.methods.requests(0).call();
    assert.equal(request.description, 'this is a test request');
    assert.equal(request.recipient, recipientAccount);
  });

  it('Approve Request', async () => {
    // Approve Request 
    await contributeToCampaign('15');
    await createRequest();
    try {
      await approveRequest(0);
      const request = await campaign.methods.requests(0).call();
      
      // Approving Asserts
      assert(request.approvalCount == 1);
      
    }catch(error) {
      assert(false);
    }

    await campaign.methods.finalizeRequest(0).send({
      from: contractDeployer,
      gas: MINIMUM_NEEDED_GAS
    });
    
    //Finalize Asserts
    let recipientAccountBalance = await web3.eth.getBalance(recipientAccount);
    recipientAccountBalance = web3.utils.fromWei(recipientAccountBalance, 'ether');
    recipientAccountBalance = parseFloat(recipientAccountBalance);
    assert(recipientAccountBalance > 104);
  });
});

async function createCampaign(value) {
  await factory.methods.createCampaign(web3.utils.toWei(value,'ether'))
  .send({
    from: contractDeployer,
    gas: MINIMUM_NEEDED_GAS
  });
}

async function contributeToCampaign(value) {
  await campaign.methods.contribute().send({
    from: contributerAccount,
    value: web3.utils.toWei(value,'ether')
  });
}

async function approveRequest(request) {
  await campaign.methods.approveRequest(request).send({
    from: contributerAccount,
    gas: MINIMUM_NEEDED_GAS
  });
}
async function createRequest() {
  await campaign.methods.createRequest(
    'this is a test request',
    web3.utils.toWei('5','ether'), 
    recipientAccount).send({
    from: contractDeployer,
    gas: MINIMUM_NEEDED_GAS
  });
}