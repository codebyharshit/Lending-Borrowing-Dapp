// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import React from "react";
// import { NavLink } from "react-router-dom";
// import "./Navbar.css";
// export const Navbar = () => {
//   return (
//     <div>
//       <nav>
//         <div>
//           <div>
//             <ConnectButton />
//           </div>
//           {/* <NavLink to="/"> Home
//           </NavLink> */}
//         </div>
//       </nav>
//     </div>
//   );
// };

import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import Swal from "sweetalert2";
import { ethers } from "ethers";
import AppContext from "../context/AppContext";


// const ACTIVE_NETWORK = 80001;
let ACTIVE_NETWORK = 5;

export const Navbar = (props) => {
  const [account, setAccount] = useState(null);
  const [result, setResult] = useState("");
  const [activeNetwork, setActiveNetwork] = useState("");

  const { setChildComponentState } = useContext(AppContext);

  useEffect(() => {
    sessionStorage.getItem("account") !== null
      ? setAccount(sessionStorage.getItem("account"))
      : setAccount("");
  }, []);

  const userAddressHandler = async (account) => {
    await props.onclickHandler(account);
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      const result = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (result) {
        await swichNetworkHandler();
        setAccount(result[0]);
        sessionStorage.setItem("account", result[0]);
        console.log("address", result[0]);
        await userAddressHandler(result[0]);
        let currentChain = await window.ethereum.request({
          method: "eth_chainId",
        });
        console.log(currentChain + " <- currentChain");
        setActiveNetwork(currentChain);
        setChildComponentState(result[0]);
      } else {
        Swal.fire({
          title: "No Accounts",
          text: "No Accounts Found!",
          icon: "warning",
          confirmButtonText: "cancel",
        });
      }
    } else {
      Swal.fire({
        title: "Please Install Metamask wallet!",
        text: "Metamask Not Installed!",
        icon: "warning",
        confirmButtonText: "cancel",
      });
    }
  };

  const swichNetworkHandler = async () => {
    try {
      // let currentChain = await window.ethereum.request({
      //   method: "eth_chainId",
      // });
      // console.log(currentChain + " <- currentChain");
      // if (currentChain === "0x5") {
      //   console.log("if", currentChain);
      //   setActiveNetwork("0x13881");
      // } else if (currentChain === "0x13881") {
      //   console.log("else", currentChain);
      //   setActiveNetwork("0x5");
      // }
      // await window.ethereum.request({
      //   method: "wallet_switchEthereumChain",
      //   params: [{ chainId: activeNetwork }],
      //   // params: [activeNetwork],
      // });

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x" + ACTIVE_NETWORK.toString(16) }],
      });

    } catch (error) {
      console.log("ERROR", error);
      if (error.code === 4902) {
        Swal.fire({
          title: "Network Not Added",
          text: "Please add the polygon network in your metamask wallet",
          icon: "warning",
          confirmButtonText: "cancel",
        });
        // setAccount("");
      }
    }
  };

  const disconnectWallet = () => {
    sessionStorage.removeItem("account", result[0]);
    setAccount("");
    userAddressHandler(null);
  };

  return (
    <div>
      <nav>
        <div>
          <NavLink to="/">
            <div className="image-container">
              <img
                src="https://media.licdn.com/dms/image/C510BAQGbJciAIl3Mhg/company-logo_200_200/0/1525862345784?e=2147483647&v=beta&t=VGPJhJ__Di_sqqgohcUgSATNweOg0eLTIrQoBtUyyxc"
                alt="SoluLab Logo"
              />
            </div>
          </NavLink>
          <span>Lending and Borrowing dApp</span>
          <div>
            <button className="shadow-lg p-2 m-2 bg-cyan-500 hover:bg-orange-500 hover:text-white rounded-md">
              <NavLink to="/">Home</NavLink>
            </button>
            <button className="shadow-lg p-2 m-2 bg-cyan-500 hover:bg-orange-500 hover:text-white rounded-md">
              <NavLink to="/About">Invest</NavLink>
            </button>
            <button className="shadow-lg p-2 m-2 bg-cyan-500 hover:bg-orange-500 hover:text-white rounded-md">
              <div onClick={swichNetworkHandler}>Switch Network</div>
            </button>
          </div>
          <div>
            {/* <ConnectButton /> */}
            <button className="shadow-lg p-2 m-2 bg-cyan-500 hover:bg-orange-500 hover:text-white rounded-md ">
              {account !== "" && account !== undefined && account !== null ? (
                <NavLink
                  className="btn btn_primary m-1"
                  id="disconnectbtn"
                  onClick={disconnectWallet}
                >
                  {`${account.substring(0, 6)}....${account.substring(
                    account.length - 4,
                    account.length
                  )}`}
                </NavLink>
              ) : (
                <NavLink
                  className="btn btn_primary m-1"
                  id="connectbtn"
                  onClick={connectWallet}
                >
                  Connect wallet
                </NavLink>
              )}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};
