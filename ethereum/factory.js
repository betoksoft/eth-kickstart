import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';


const factory = new web3.eth.Contract(
    CampaignFactory.abi,
    '0xddA3E8a604578EdeD8D852515857F8de687917D9'
);

export default factory;
