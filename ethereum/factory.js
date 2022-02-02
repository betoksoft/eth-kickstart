import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';


const factory = new web3.eth.Contract(
    CampaignFactory.abi,
    '0xa88BBbBE2332997030a51cFD51E1e28EB879Eaa4'
);

export default factory;
