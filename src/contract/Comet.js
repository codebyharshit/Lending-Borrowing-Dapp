import { COMET_CONTRACT_ADDRESS, COMET_ABI } from "./constants";
import { ethers } from 'ethers';

let cometAddress;

const Comet = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    cometAddress = new ethers.Contract(COMET_CONTRACT_ADDRESS, COMET_ABI, signer);
    return cometAddress;
}

export default Comet; 
export { cometAddress };