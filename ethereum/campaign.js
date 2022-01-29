import web3Instance from "./web3";
import Campaign from './build/Campaign.json';

export default (address) => {
    return new web3Instance.eth.Contract(
        Campaign.abi,
        address
    );
};