import React, { useState, useContext, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import LendingModal from "../modals/SupplyModal";
import CollateralModal from "../modals/CollateralModal";
import TokenDetails from "./TokenDetails";
import DAI from "../assets/DAI.png";
import WETH from "../assets/WETH.png";
import WBTC from "../assets/WBTC.png";
import WMATIC from "../assets/WMATIC.png";
import LINK from "../assets/LINK.png";
import COMP from "../assets/COMP.png";
import { ethers } from "ethers";
import CircularIndeterminate from "../Loader";
import Web3 from "web3";
import axios from "axios";
import AddressContext from "../../context/address-context";
import UserAddressContext from "../../context/UserAddressContext";
import AppContext from "../../context/AppContext";

const web3 = new Web3(window.ethereum);
const { ethereum } = window;

const SupplyTable = (props) => {
  const [lend, setLend] = useState(null);
  const [collateral, setCollateral] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverValue, setHoverValue] = useState(null);
  // const [isLoader, setIsLoader] = useState(false);
  // const [selectedToken, setSelectedToken] = useState(null);
  const [modalAddress, setModalAddress] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [userAssetBalance, setUserAssetBalance] = useState([]);
  // const [Prices, setPrices] = useState([]);
  const [activeNetwork, setActiveNetwork] = useState();

  const connectedUser = useContext(UserAddressContext);

  const { childComponentState } = useContext(AppContext);

  useEffect(() => {
    userBalanceAssets();
  }, [props.supplyState, childComponentState]);

  const array = Object.values(props);
  const arrayData = array[0];

  function createData(
    Assets,
    Scale,
    BorrowCollateralFactor,
    Images,
    PriceFeed,
    LiquidationFactor,
    LiquidateCollateralFactor
  ) {
    return {
      Assets,
      Scale,
      BorrowCollateralFactor,
      Images,
      PriceFeed,
      LiquidationFactor,
      LiquidateCollateralFactor,
    };
  }

  const chainId = async () => {
    let currentChain = await window.ethereum.request({
      method: "eth_chainId",
    });
    setActiveNetwork(currentChain);
    // return currenctChain;
  };

  chainId();

  const imagesETH = [COMP, WBTC, WETH, LINK];
  const imagesPOLYGON = [DAI, WETH, WBTC, WMATIC];
  const tokenNamesETH = [
    "COMP Token",
    "WBTC Token",
    "WETH Token",
    "LINK Token",
  ];
  const tokenNamesPOLYGON = [
    "DAI Token",
    "WETH Token",
    "WBTC Token",
    "WMATIC Token",
  ];
  // const Prices = [];

  // const OraclePrice = async () => {
  //   const response = await axios.get("http://localhost:8080/priceFeed");
  //   const Price = await response.data;
  //   setPrices(Price);
  // };

  // OraclePrice();

  const rows = [];

  if (activeNetwork === "0x5") {
    for (let i = 0; i < arrayData.length; i++) {
      const data = arrayData[i];
      const image = imagesETH[i];
      const price = props.Prices[i];

      rows.push(
        createData(
          data.asset,
          data.scale,
          data.borrowCollateralFactor,
          image,
          price,
          data.liquidationFactor,
          data.liquidateCollateralFactor
        )
      );
    }
    
  } else {
    for (let i = 0; i < arrayData.length; i++) {
      const data = arrayData[i];
      const image = imagesPOLYGON[i];
      const price = props.Prices[i];

      rows.push(
        createData(
          data.asset,
          data.scale,
          data.borrowCollateralFactor,
          image,
          price,
          data.liquidationFactor,
          data.liquidateCollateralFactor
        )
      );
    }
  }

  const userBalanceAssets = async () => {
    // props.isLoader(true);
    await window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const from = accounts[0];
    let userAssetBalances = [];
    const suppliedAssetInfo = await axios.get(
      `http://localhost:8080/userSupplyInfo?account=${from}`
    );
    const suppliedAmount = await suppliedAssetInfo.data.result;
    await userAssetBalances.push(suppliedAmount);
    setUserAssetBalance(Object.values(suppliedAmount));
    return userAssetBalances;
  };

  const hideLendHandler = () => {
    setLend(null);
  };

  const hideCollateralHandler = () => {
    setCollateral(null);
  };

  // const showLendHandler = (tokenName) => {
  //   setLend(tokenName);
  // };

  // const showCollateralHandler = (tokenName) => {
  //   setCollateral(tokenName);
  // };

  const showHoverHandler = (tokenDetails) => {
    setHoverValue(tokenDetails);
    setIsHovering(true);
  };

  const handleSupplyToken = async (e) => {
    const token = rows[e.target.value];
    // setIsLoader(true);
    // const allowanceCheck = await allowance(token.Assets);
    // setIsLoader(false);
    setModalAddress(token.Assets);
    await handleSupplyCollateral(token.Assets);

    // await userBalanceAssets();
  };

  const handleWithdrawTokens = async (e) => {
    const token = rows[e.target.value];
    // setModalAddress(token.Assets);
    await handleWithdrawCollateral(token.Assets);
  };

  const handleWithdrawCollateral = async (tokenAddress) => {
    props.handleWithdrawToken(tokenAddress);
  };

  const handleSupplyCollateral = async (tokenAddress) => {
    props.handleSupplyToken(tokenAddress);
  };

  return (
    <div className="relative">
      {isHovering && <TokenDetails TokenDetails={hoverValue} />}
      {lend && <LendingModal TokenName={lend} onConfirm={hideLendHandler} />}
      {collateral && (
        <CollateralModal
          TokenName={collateral}
          onConfirm={hideCollateralHandler}
        />
      )}
      <div className="flex mx-auto ml-48 mt-10 mr-64 ">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              {/* <TableRow className="items-center">Supply Assets</TableRow> */}
              <TableRow>
                <TableCell>Assets</TableCell>
                <TableCell>User Supplied Assets</TableCell>
                <TableCell>Add</TableCell>
                <TableCell>Less</TableCell>
                {/* <TableCell>APY</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody className="bg-slate-500 ">
              {rows.map((row, idx) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    align="left"
                    onMouseEnter={() => showHoverHandler(row)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <div className="flex">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={row.Images}
                        />
                      </div>{" "}
                      <div className="ml-4 mt-2"> {row.Assets}</div>
                    </div>
                  </TableCell>
                  <TableCell
                    align="left"
                    onMouseEnter={() => showHoverHandler(row)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    {idx === 1
                      ? `${(userAssetBalance[idx] / 10 ** 8).toFixed(2)}`
                      : `${(userAssetBalance[idx] / 10 ** 18).toFixed(2)}`}

                    {/* {`${(userAssetBalance[idx])}`} */}
                  </TableCell>
                  <TableCell
                    align="left"
                    onMouseEnter={() => showHoverHandler(row)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    {/* <button className="shadow-lg p-2 m-2 bg-cyan-500 hover:bg-orange-500 hover:text-white rounded-3xl"> */}
                    <button
                      className="shadow-lg p-2 m-2 bg-cyan-500 hover:bg-orange-500 hover:text-white rounded-3xl"
                      value={idx}
                      onClick={handleSupplyToken}
                    >
                      Add
                    </button>
                  </TableCell>
                  <TableCell
                    align="left"
                    onMouseEnter={() => showHoverHandler(row)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    {/* <button className="shadow-lg p-2 m-2 bg-cyan-500 hover:bg-orange-500 hover:text-white rounded-3xl" onClick={props.withdrawUSDC}> */}
                    <button
                      className="shadow-lg p-2 m-2 bg-cyan-500 hover:bg-orange-500 hover:text-white rounded-3xl"
                      value={idx}
                      onClick={handleWithdrawTokens}
                    >
                      Less
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default SupplyTable;
