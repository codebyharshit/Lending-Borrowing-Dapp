import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar.js";
import HomeLayout from "../components/HomeLayout";
import SupplyAndBorrow from "../components/SupplyandBorrow.js";
// import WalletBalance from "../components/WalletBalance.js";
// import SupplyTable from "../components/SupplyTable.js";
// import Sidebar from "../components/Sidebar.js";
// import PositionSummary from "../components/PositionSummary.js";
// import LendingModal from "../components/LendingModal.js";
// import AmountProvider from "../context/AmountProvider.js";
import UserAddressContext from "../context/UserAddressContext.js";
import AppContext from "../context/AppContext.js";

const Home = () => {
  // const [userAccount, setUserAccount] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [childComponentState, setChildComponentState] = useState(null);
  const handleClick = (userAddress) => {
    setUserAddress(userAddress);
  };


  useEffect(() => {
    sessionStorage.getItem("account") !== null
      ? setUserAddress(sessionStorage.getItem("account"))
      : setUserAddress("");
  }, []);

  return (
    <UserAddressContext.Provider value={userAddress}>
      <div>
        <AppContext.Provider value={{ childComponentState, setChildComponentState }}>
          <Navbar onclickHandler={handleClick} />
          <SupplyAndBorrow />
          <HomeLayout />
          {/* <div className="flex">
          <div className="flex items-center p-6 max-w-xs mx-10 bg-white rounded-xl shadow-lg space-x-4 mt-10 ml-48">
            <WalletBalance />
          </div>
          <div className="flex items-center p-6 max-w-xs bg-white rounded-xl shadow-lg space-x-4 mt-10">
            <PositionSummary />
          </div>
        </div> */}
        </AppContext.Provider>
      </div>
    </UserAddressContext.Provider>
  );
};

export default Home;
