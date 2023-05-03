import { TOKEN_CONTRACT_ADDRESS, TOKEN_ABI } from "./constants";
import { ethers } from 'ethers';

let tokenAddress;

const Comet = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    tokenAddress = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, TOKEN_ABI, signer);
    return tokenAddress;
}

export default Comet; 
export { tokenAddress };