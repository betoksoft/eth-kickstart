const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const campaignCompiled = require('../ethereum/build/Campaign.json');
const campaignFactoryCompiled = require('../ethereum/build/CampaignFactory.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(campaignFactoryCompiled.abi)
    .deploy({
      data: campaignFactoryCompiled.evm.bytecode.object
    })
    .send({ from: accounts[0], gas: '4000000' });

    await factory.methods.createCampaign('100').send({ from: accounts[0], gas: '1000000' });

    const campaignAddresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = campaignAddresses[0];

    campaign = await new web3.eth.Contract(campaignCompiled.abi, campaignAddress);

});

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const managerInCampaign = await campaign.methods.manager().call();
    assert.equal(accounts[0], managerInCampaign);
  });

  it('allows people to contribute money and marks them as approvers', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1]
    });
    const isAccount1Approver = await campaign.methods.approvers(accounts[1]).call();
    assert(isAccount1Approver);
  });

  it('requires a minimum contribution', async() => {
    try {
      await campaign.methods.contribute().send({
        value: '0',
        from: accounts[1]
      });
    } catch(err) {
      assert(true);
      return;
    }

    assert(false);

  });

  it('allows a manager to make a payment request', async() => {
    await campaign.methods.createRequest('Buy something', '100', accounts[2]).send({
      from: accounts[0],
      gas: '1000000'
    });

    const request = await campaign.methods.requests(0).call();

    assert(request.description, 'Buy something');
  });

  it('process requests', async() => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });

    await campaign.methods.createRequest('Buy something', web3.utils.toWei('5', 'ether'), accounts[2]).send({
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });


    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    let accounts2Balance = await web3.eth.getBalance(accounts[2]);
    accounts2Balance = web3.utils.fromWei(accounts2Balance, 'ether');
    accounts2Balance = Number(accounts2Balance);

    assert(accounts2Balance > 104);
  });


});

