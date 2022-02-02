import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';


const factory = new web3.eth.Contract(
    CampaignFactory.abi,
    '0xE6A5a3210fC73e0ff4Acc6Fe4151c07666b3a821'
);

export default factory;
