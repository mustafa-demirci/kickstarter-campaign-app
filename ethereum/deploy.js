// create a wallet.js file and initialize and HDWalletProvider
//with your deploying account and export it.
import provider from './wallet';
const Web3 = require('web3');
const compiledCampaignFactory = require('./build/CampaignFactory.json');

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);

    const contract = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({data: compiledCampaignFactory.evm.bytecode.object})
    .send({gas: '2000000', from: accounts[0]});
    console.log('Contract deployed to', contract.options.address);
    provider.engine.stop();
};
deploy(); 
