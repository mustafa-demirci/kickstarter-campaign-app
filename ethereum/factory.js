import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json';
const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    // Campaign Factory deployed address change this address with your deployed contract address:
    '0x01220bC3A8A4BFc9E8a8714bbE00dbb61dD8f3A3'
);

export default instance;