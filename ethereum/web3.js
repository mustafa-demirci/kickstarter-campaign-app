import Web3 from "web3";

let web3Instance;

// typeof window : checks to see if we are in the server or browser
// checks if metamask is running : typeof window.ethereum !== "undefined"
if(typeof window !== 'undefined' && typeof window.ethereum !== "undefined") {
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3Instance = new Web3(window.ethereum);
} else {
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/4f21a3627a514ca880d56820dee91d22'
    );
    web3Instance = new Web3(provider);
}
  
export default web3Instance;