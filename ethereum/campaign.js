import web3 from './web3';
import Campaign from './build/Campaign.json';


const campaign = (campaignAddress) => {
    return new web3.eth.Contract(
        Campaign.abi,
        campaignAddress
    );
}

export default campaign;
