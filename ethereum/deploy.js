// import libraries
const factoryCompiled = require('./build/FactoryRent.json');
const HDWalletProvider = require('truffle-hdwallet-provider');
// get web3 instance with metamask
const Web3 = require('web3');

const web3provider = new HDWalletProvider(
  '#Enter your Etheruem account mnemonic',
  'https://rinkeby.infura.io/v3/2764f21457d84be884bf7c9d0a7104f9'
);

const instanceOfWeb3 = new Web3(web3provider);

const deploy = async () => {
  const listOfAccounts = await instanceOfWeb3.eth.getAccounts();

  console.log('Trying to deploy from this account address', listOfAccounts[0]);

  const deployed = await new instanceOfWeb3.eth.Contract(
    JSON.parse(factoryCompiled.interface)
  )
    .deploy({ data: '0x'+factoryCompiled.bytecode })
    .send({ from: listOfAccounts[0] , gas: '2000000', });

  console.log('Factory Contract is deployed at address', deployed.options.address);
};
deploy();
