const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const campaignFactoryCompiled = require('../ethereum/build/CampaignFactory.json');

provider = new HDWalletProvider(
  'phone secret develop globe dinosaur easy run pizza blind frog artist raise',
  'https://rinkeby.infura.io/v3/0adb34250f1a455d885258e4368a4da4'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(campaignFactoryCompiled.abi)
    .deploy({ data: campaignFactoryCompiled.evm.bytecode.object })
    .send({ gas: '2000000', from: accounts[0] });

  console.log(JSON.stringify(campaignFactoryCompiled.abi));
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
