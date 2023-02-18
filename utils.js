import {ethers} from "ethers";
import 'dotenv/config';

const getProvider = (mainnet = false) => {
    const providerURL = mainnet ? "http://10.0.0.38:8545" 
    : process.env.INFURA_KEY;

    return new ethers.providers.JsonRpcProvider(providerURL);
}

export {getProvider};