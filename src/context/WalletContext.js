import { createContext, useState } from 'react';
import Web3 from 'web3';

export const NavbarContext = createContext();

export function NavbarProvider({ children }) {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  async function connectToMetamask() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setWeb3(web3);
        setAccount(accounts[0]);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Metamask not installed');
    }
  }

  const contextValue = {
    web3,
    account,
    connectToMetamask,
  };

  return (
    <NavbarContext.Provider value={contextValue}>
      {children}
    </NavbarContext.Provider>
  );
}