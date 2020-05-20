// web3 library to intract ethereum with jaavscript code
import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // Now We are using the browser alse metamask is working.
  web3 = new Web3(window.web3.currentProvider);
} else {
  // the server is using *OR* the user is not using metamask
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/2764f21457d84be884bf7c9d0a7104f9'
  );
  web3 = new Web3(provider);
}

export default web3;
