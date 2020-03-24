
import web3 from './web3';
import RentFactory from './build/FactoryRent.json';

const instance = new web3.eth.Contract(
  JSON.parse(RentFactory.interface),
  '0xC37fd56d23a9cdf2b10C8136e8662bf5229F828D'
);

export default instance;
