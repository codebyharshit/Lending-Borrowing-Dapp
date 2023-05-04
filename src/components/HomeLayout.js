import { Outlet, Link } from "react-router-dom";
import Button from "./button/Button";
import SupplyTable from "./table/SupplyTable";
import SupplyModal from "./modals/SupplyModal";
import BorrowTable from "./table/BorrowTable";
import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import CircularIndeterminate from "./Loader";
import Web3 from "web3";
import axios from "axios";
import ApproveModal from "./modals/appproveSupplyModal";
import AmountContext from "../context/amount-context";
import WithdrawModal from "./modals/WithdrawModal";
import WithdrawContext from "../context/withdraw-amt";
import Swal from "sweetalert2";
import UserAddressContext from "../context/UserAddressContext";
import BorrowModal from "./modals/BorrowModal";
import RepayModal from "./modals/RepayModal";
import { UpdateSharp } from "@mui/icons-material";
import { utils } from "ethers";
import WithdrawCheckModal from "./modals/withdrawCheckModal";

const web3 = new Web3(window.ethereum);
const { ethereum } = window;

export default function HomeLayout() {
  const [assetsInfo, setAssetsInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoader, setIsLoader] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [supplyButtonDisable, setSupplyButtonDisable] = useState(true);
  const [isAddress, setIsAddress] = useState(null);
  const [tokenAddressWithdraw, setTokenAddressWithdraw] = useState(null);
  const [withdrawModal, setWithdrawModal] = useState(null);
  const [isWithdrawDisabled, setIsWithdrawDisabled] = useState(true);
  const [allowance, setAllowance] = useState(0);
  const [isBalance, setIsBalance] = useState(0);
  const [supplyState, setSupplyState] = useState(0);
  const [borrowModal, setBorrowModal] = useState(false);
  const [isBorrowDisabled, setIsBorrowDisabled] = useState(false);
  const [allowModalState, setAllowModalState] = useState(false);
  const [borrowableAmt, setBorrowableAmt] = useState(0);
  const [repayModal, setRepayModal] = useState(false);
  const [Prices, setPrices] = useState([]);
  const [borrowBal, setBorrowBal] = useState(0);
  const [suppliedAmt, setSuppliedAmt] = useState(0);
  // const [userAddress, setUserAddress] = useState(null);

  const connectedUser = useContext(UserAddressContext);
  console.log("connectedUser", connectedUser);

  useEffect(() => {
    const assetInfo = async () => {
      const response = await axios.get("https://lending-and-borrowing-dapp-backend.onrender.com/allAssetsInfo");
      setAssetsInfo(response.data);
      const priceFeed = await axios.get("https://lending-and-borrowing-dapp-backend.onrender.com/priceFeed");
      const Price = await priceFeed.data;
      setPrices(Price);
      setIsLoading(false);
    };
    assetInfo();

    getBorrowableBalance();
  }, []);

  const repayTokens = async (tokenAmount) => {
    try {
      setIsLoader(true);
      // setIsLoader(false);
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      // "0xDB3cB4f2688daAB3BFf59C24cC42D4B6285828e9"
      const balance = await userBalance(
        "0x07865c6E87B9F70255377e024ace6630C1Eaa37F"
      );
      const allowance = await allowanceTokens();
      if (
        tokenAmount <= allowance ||
        tokenAmount ===
          "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      ) {
        if (
          tokenAmount <= balance ||
          tokenAmount ===
            "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        ) {
          const data = {
            asset: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
            amount: tokenAmount,
          };
          const response = await axios.post(
            "https://lending-and-borrowing-dapp-backend.onrender.com/supplyAsset",
            data
          );
          const repayAmt = response.data;
          console.log("response", response.data);

          const result = await ethereum.request({
            method: "eth_sendTransaction",
            params: [
              {
                from,
                to: response.data.to,
                data: response.data.data,
              },
            ],
          });
          setIsLoader(false);

          const checkTransactionStatus = async (result) => {
            try {
              let receipt = null;

              while (!receipt) {
                receipt = await ethereum.request({
                  method: "eth_getTransactionReceipt",
                  params: [result],
                });

                if (!receipt) {
                  await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 1 second before checking again
                }
              }

              if (receipt && receipt.status === "0x1") {
                // Transaction successful
                console.log("Transaction successful");

                if (result) {
                  setRepayModal(false);
                  setIsLoader(false);
                  let txHash = result;
                  Swal.fire({
                    title: "Transaction confirmed!",
                    text: "Your transaction has been confirmed on the Ethereum network.",
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "View on Ethereum",
                    cancelButtonText: "Close",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      const polyscanUrl = `https://goerli.etherscan.io/tx/${txHash}`;
                      window.open(polyscanUrl, "_blank");
                    }
                  });
                }
                // Your code flow after the transaction is successful goes here
              } else if (receipt && receipt.status === "0x0") {
                // Transaction failed
                console.log("Transaction failed");
              }
            } catch (error) {
              console.error(error);
            }
          };
          await checkTransactionStatus(result);
          setIsLoader(false);
        } else {
          setIsLoader(false);
          Swal.fire({
            title: "Account Spend Limit Exceed",
            text: "Your Account Balance is Lower than Amount you wan to repay!",
            icon: "warning",
            confirmButtonText: "cancel",
          });
        }
      } else {
        Swal.fire({
          title: "Not Enough Allowance Found!",
          text: "Your Account Balance is Lower than Amount you wan to repay!",
          icon: "warning",
          confirmButtonText: "cancel",
        });
      }
    } catch (error) {
      setIsLoader(false);
      setApproveModal(false);
      Swal.fire({
        title: "Metamask Denied!",
        text: `${error.message}`,
        icon: "error",
        confirmButtonText: "cancel",
      });
    }
  };

  const allowanceTokens = async (tokenAddress) => {
    try {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      const assetAddress = tokenAddress
        ? tokenAddress
        : "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
      // : "0xDB3cB4f2688daAB3BFf59C24cC42D4B6285828e9";

      const response = await axios.get(
        `https://lending-and-borrowing-dapp-backend.onrender.com/allowance?owner=${from}&asset=${assetAddress}`
      );
      const allowance = await response.data;
      setAllowance(allowance.allowance);
      return allowance;
    } catch (error) {
      console.log(error);
    }
  };

  // const getDecimal = async (assetAddress) => {
  //   const decimal = await axios.get(
  //     `https://lending-and-borrowing-dapp-backend.onrender.com/decimals?asset=${assetAddress}`
  //   );
  //   const decimals = await decimal.data;
  //   const tokenDecimal = await decimals.decimals;
  //   console.log("decimal", tokenDecimal);
  //   return tokenDecimal;
  // };

  const approveTokens = async (tokenAmount, tokenAddress) => {
    try {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      const assetAddress = tokenAddress
        ? tokenAddress
        : "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
      // : "0xDB3cB4f2688daAB3BFf59C24cC42D4B6285828e9";

      const data = {
        asset: assetAddress,
        value: tokenAmount,
      };
      console.log("data", data);

      setIsLoader(true);
      const response = await axios.post("https://lending-and-borrowing-dapp-backend.onrender.com/approve", data);
      console.log("response.data", response.data);
      const result = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from,
            to: response.data.to,
            data: response.data.data,
          },
        ],
      });

      // setIsLoader(false);
      setAllowModalState(true);

      const checkTransactionStatus = async (result) => {
        try {
          let receipt = null;

          while (!receipt) {
            receipt = await ethereum.request({
              method: "eth_getTransactionReceipt",
              params: [result],
            });

            if (!receipt) {
              await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 1 second before checking again
            }
          }

          if (receipt && receipt.status === "0x1") {
            // Transaction successful
            console.log("Transaction successful");

            if (result) {
              setIsLoader(false);
              let txHash = result;
              Swal.fire({
                title: "Transaction confirmed!",
                text: "Your transaction has been confirmed on the Ethereum network.",
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "View on Ethereum",
                cancelButtonText: "Close",
              }).then((result) => {
                if (result.isConfirmed) {
                  const polyscanUrl = `https://goerli.etherscan.io/tx/${txHash}`;
                  window.open(polyscanUrl, "_blank");
                }
              });
              // setSupplyState("1");
            }

            const updatedAllowance = await allowanceTokens(assetAddress);
            const userUpdatedAllowance = await updatedAllowance.data;
            // const tokenDecimal = await getDecimal(assetAddress);
            setAllowance(userUpdatedAllowance.allowance);

            // Your code flow after the transaction is successful goes here
          } else if (receipt && receipt.status === "0x0") {
            // Transaction failed
            console.log("Transaction failed");
          }
        } catch (error) {
          console.error(error);
        }
      };
      await checkTransactionStatus(result);
    } catch (error) {
      setIsLoader(false);
      setApproveModal(false);
      Swal.fire({
        title: "Metamask Denied!",
        text: `${error.message}`,
        icon: "error",
        confirmButtonText: "cancel",
      });
    }
  };

  const supplyTokens = async (tokenAmount, tokenAddress) => {
    try {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      const assetAddress = tokenAddress
        ? tokenAddress
        : // : "0xDB3cB4f2688daAB3BFf59C24cC42D4B6285828e9";
          "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
      const data = {
        asset: assetAddress,
        amount: tokenAmount,
      };
      console.log("data", data);

      const response = await axios.post(
        "https://lending-and-borrowing-dapp-backend.onrender.com/supplyAsset",
        data
      );
      console.log("response", response);
      setIsLoader(true);
      const result = await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from,
            to: response.data.to,
            data: response.data.data,
          },
        ],
      });
      setIsLoader(false);
      setApproveModal(false);

      const checkTransactionStatus = async (result) => {
        try {
          let receipt = null;

          while (!receipt) {
            receipt = await ethereum.request({
              method: "eth_getTransactionReceipt",
              params: [result],
            });

            if (!receipt) {
              await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 1 second before checking again
            }
          }

          if (receipt && receipt.status === "0x1") {
            // Transaction successful
            console.log("Transaction successful");

            if (result) {
              setApproveModal(false);
              let txHash = result;
              Swal.fire({
                title: "Transaction confirmed!",
                text: "Your transaction has been confirmed on the Ethereum network.",
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "View on Ethereum",
                cancelButtonText: "Close",
              }).then((result) => {
                if (result.isConfirmed) {
                  const polyscanUrl = `https://goerli.etherscan.io/tx/${txHash}`;
                  window.open(polyscanUrl, "_blank");
                }
              });
              setSupplyState(1);
            }
            const updatedAllowance = await allowanceTokens(assetAddress);
            const userUpdatedAllowance = await updatedAllowance.data;
            // const tokenDecimal = await getDecimal(assetAddress);
            setAllowance(userUpdatedAllowance.allowance);

            // Your code flow after the transaction is successful goes here
          } else if (receipt && receipt.status === "0x0") {
            // Transaction failed
            console.log("Transaction failed");
          }
        } catch (error) {
          console.error(error);
        }
      };
      await checkTransactionStatus(result);
    } catch (error) {
      setIsLoader(false);
      setApproveModal(false);
      Swal.fire({
        title: "Metamask Denied!",
        text: `${error.message}`,
        icon: "error",
        confirmButtonText: "cancel",
      });
    }
  };

  const borrowTokens = async (tokenAmount) => {
    try {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];

      // const borrowableAmount = await axios.get(
      //   `https://lending-and-borrowing-dapp-backend.onrender.com/borrowableAmount?account=${from}`
      // );
      // const amount = borrowableAmount.data;

      if (tokenAmount <= borrowableAmt && tokenAmount !== null) {
        const assetAddress = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
        // const assetAddress = "0xDB3cB4f2688daAB3BFf59C24cC42D4B6285828e9";
        const borrowData = {
          asset: assetAddress,
          amount: tokenAmount,
        };

        const response = await axios.post(
          "https://lending-and-borrowing-dapp-backend.onrender.com/withdrawAsset",
          borrowData
        );

        const result = await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from,
              to: response.data.to,
              data: response.data.data,
            },
          ],
        });

        console.log("result", result);
        setIsLoader(false);
        setBorrowModal(false);

        const checkTransactionStatus = async (result) => {
          try {
            let receipt = null;

            while (!receipt) {
              receipt = await ethereum.request({
                method: "eth_getTransactionReceipt",
                params: [result],
              });

              if (!receipt) {
                await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 second before checking again
              }
            }

            if (receipt && receipt.status === "0x1") {
              // Transaction successful
              console.log("Transaction successful");

              if (result) {
                let txHash = result;
                Swal.fire({
                  title: "Transaction confirmed!",
                  text: "Your transaction has been confirmed on the Ethereum network.",
                  icon: "success",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "View on Ethereum",
                  cancelButtonText: "Close",
                }).then((result) => {
                  if (result.isConfirmed) {
                    const polyscanUrl = `https://goerli.etherscan.io/tx/${txHash}`;
                    window.open(polyscanUrl, "_blank");
                  }
                });
              }
              // Your code flow after the transaction is successful goes here
            } else if (receipt && receipt.status === "0x0") {
              // Transaction failed
              console.log("Transaction failed");
            }
          } catch (error) {
            console.error(error);
          }
        };
        await checkTransactionStatus(result);
      } else {
        Swal.fire({
          title: "Insufficient Borrow Limit!",
          text: `User don't have enough supplied funds to borrow USDC!`,
          icon: "error",
          confirmButtonText: "cancel",
        });
      }
    } catch (error) {
      setIsLoader(false);
      setBorrowModal(false);

      Swal.fire({
        title: "Metamask Denied!",
        text: `${error.message}`,
        icon: "error",
        confirmButtonText: "cancel",
      });
    }
  };

  const userBalance = async (tokenAddress) => {
    try {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      const assetAddress = tokenAddress
        ? tokenAddress
        : // : "0xDB3cB4f2688daAB3BFf59C24cC42D4B6285828e9";
          "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
      console.log("assetAddress", assetAddress);
      const response = await axios.get(
        `https://lending-and-borrowing-dapp-backend.onrender.com/userBalance?address=${from}`
      );
      const bal = await response.data;
      console.log("bal", bal);
      const userBal = await bal["userBalance"][assetAddress];
      console.log("userBal", userBal);
      return userBal;
    } catch (err) {
      console.log(err);
    }
  };

  const withdrawTokens = async (tokenAmount) => {
    try {
      setIsLoader(true);
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      const assetAddress = tokenAddressWithdraw;

      const borrowAssetInfo = await axios.get(
        `https://lending-and-borrowing-dapp-backend.onrender.com/getBorrowBalanceOf?account=${from}`
      );

      const Token = assetAddress.toLowerCase();
      // const result = await borrowAssetInfo.data.result;
      // const borrowedAmount = await result[Token];

      const BorrowBalance = await borrowAssetInfo.data;
      const borrowedAmount = await BorrowBalance.balance;
      console.log("borrowedAmount", borrowedAmount);
      setBorrowBal(borrowedAmount);

      // const borrowedAmount = borrowAssetInfo.data.result.borrowAmount;

      const suppliedAssetInfo = await axios.get(
        `https://lending-and-borrowing-dapp-backend.onrender.com/userSupplyInfo?account=${from}`
      );

      const decimal = await axios.get(
        `https://lending-and-borrowing-dapp-backend.onrender.com/decimals?asset=${tokenAddressWithdraw}`
      );
      const decimals = await decimal.data;
      const tokenDecimal = await decimals.decimals;

      // const Token = tokenAddress.toLowerCase();
      const supplyAmount = await suppliedAssetInfo.data.result;
      const suppliedAmount = await supplyAmount[Token];

      // const suppliedAmount = await suppliedAssetInfo.data.result.tokenAddress;

      if (borrowedAmount === 0 && tokenAmount <= suppliedAmount) {
        const data = {
          asset: assetAddress,
          amount: tokenAmount,
        };
        console.log("data", data);

        const response = await axios.post(
          "https://lending-and-borrowing-dapp-backend.onrender.com/withdrawAsset",
          data
        );
        console.log("response", response);
        setIsLoader(true);
        const result = await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from,
              to: response.data.to,
              data: response.data.data,
            },
          ],
        });
        setIsLoader(false);
        setWithdrawModal(false);
        // if (result) {
        //   setApproveModal(false);
        //   setSupplyState(true);
        //   let txHash = result;
        //   Swal.fire({
        //     title: "Transaction confirmed!",
        //     text: "Your transaction has been confirmed on the Ethereum network.",
        //     icon: "success",
        //     showCancelButton: true,
        //     confirmButtonColor: "#3085d6",
        //     cancelButtonColor: "#d33",
        //     confirmButtonText: "View on Polygon",
        //     cancelButtonText: "Close",
        //   }).then((result) => {
        //     if (result.isConfirmed) {
        //       const polyscanUrl = `https://mumbai.polygonscan.com/tx/${txHash}`;
        //       window.open(polyscanUrl, "_blank");
        //     }
        //   });
        // }

        const checkTransactionStatus = async (result) => {
          try {
            let receipt = null;

            while (!receipt) {
              receipt = await ethereum.request({
                method: "eth_getTransactionReceipt",
                params: [result],
              });

              if (!receipt) {
                await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 second before checking again
              }
            }

            if (receipt && receipt.status === "0x1") {
              // Transaction successful
              console.log("Transaction successful");

              if (result) {
                setApproveModal(false);
                let txHash = result;
                Swal.fire({
                  title: "Transaction confirmed!",
                  text: "Your transaction has been confirmed on the Ethereum network.",
                  icon: "success",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "View on Ethereum",
                  cancelButtonText: "Close",
                }).then((result) => {
                  if (result.isConfirmed) {
                    const polyscanUrl = `https://goerli.etherscan.io/tx/${txHash}`;
                    window.open(polyscanUrl, "_blank");
                  }
                });
                setSupplyState(2);
              }
              // Your code flow after the transaction is successful goes here
            } else if (receipt && receipt.status === "0x0") {
              // Transaction failed
              console.log("Transaction failed");
            }
          } catch (error) {
            console.error(error);
          }
        };
        await checkTransactionStatus(result);
      } else if (borrowedAmount > 0) {
        // } else if (borrowedAmount === 0 && tokenAmount > suppliedAmount) {
        // console.log(
        //   "User is Borrowed some USDC funds from contract or the amount specified is greater than the user supplied assets"
        // );
        setIsLoader(true);
        const withdrawableAmount = await axios.get(
          `https://lending-and-borrowing-dapp-backend.onrender.com/withdrawableAmount?account=${from}&asset=${assetAddress}&amount=${tokenAmount}`
        );
        const withdrawApproval = withdrawableAmount.data;

        if (withdrawApproval === true) {
          const data = {
            asset: assetAddress,
            amount: tokenAmount,
          };
          console.log("data", data);

          const response = await axios.post(
            "https://lending-and-borrowing-dapp-backend.onrender.com/withdrawAsset",
            data
          );
          console.log("response", response);
          setIsLoader(true);
          const result = await ethereum.request({
            method: "eth_sendTransaction",
            params: [
              {
                from,
                to: response.data.to,
                data: response.data.data,
              },
            ],
          });
          setIsLoader(false);

          const checkTransactionStatus = async (txHash) => {
            try {
              let receipt = null;

              while (!receipt) {
                receipt = await ethereum.request({
                  method: "eth_getTransactionReceipt",
                  params: [txHash],
                });

                if (!receipt) {
                  await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 1 second before checking again
                }
              }

              if (receipt && receipt.status === "0x1") {
                // Transaction successful
                console.log("Transaction successful");

                if (result) {
                  setApproveModal(false);
                  let txHash = result;
                  Swal.fire({
                    title: "Transaction confirmed!",
                    text: "Your transaction has been confirmed on the Ethereum network.",
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "View on Ethereum",
                    cancelButtonText: "Close",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      const polyscanUrl = `https://goerli.etherscan.io/tx/${txHash}`;
                      window.open(polyscanUrl, "_blank");
                    }
                  });
                  setSupplyState(3);
                }
                // Your code flow after the transaction is successful goes here
              } else if (receipt && receipt.status === "0x0") {
                // Transaction failed
                console.log("Transaction failed");
              }
            } catch (error) {
              console.error(error);
            }
          };
          await checkTransactionStatus(result);
        } else {
          setIsLoader(false);
          Swal.fire({
            title: "Wrong Amount Entered",
            text: `Please Try again!`,
            icon: "error",
            confirmButtonText: "cancel",
          });
        }
      } else {
        setIsLoader(false);
        Swal.fire({
          title: "Wrong Amount Entered",
          text: `Please Try again!`,
          icon: "error",
          confirmButtonText: "cancel",
        });
      }
    } catch (error) {
      setIsLoader(false);
      setWithdrawModal(false);
      Swal.fire({
        title: "Metamask Denied!",
        text: `${error.message}`,
        icon: "error",
        confirmButtonText: "cancel",
      });
    }
  };

  const handleApproveModal = () => {
    setApproveModal(true);
  };

  const handleWithdrawModal = () => {
    setWithdrawModal(true);
  };

  const handleRepayUSDC = () => {
    setRepayModal(true);
    setIsLoader(false);
  };

  const getBorrowableBalance = async () => {
    await window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const from = accounts[0];
    const borrowBalance = await axios.get(
      `https://lending-and-borrowing-dapp-backend.onrender.com/getBorrowBalanceOf?account=${from}`
    );
    const BorrowBalance = await borrowBalance.data;
    const BorrowBalanceOf = await BorrowBalance.balance;
    setBorrowBal(BorrowBalanceOf);
    return BorrowBalanceOf;
  };

  const handleSupplyUSDC = async () => {
    if (connectedUser) {
      setIsAddress(null);
      setIsLoader(true);
      const balance = await userBalance();
      setIsBalance(balance);

      // await window.ethereum.enable();
      // const web3 = new Web3(window.ethereum);
      // const accounts = await web3.eth.getAccounts();
      // const from = accounts[0];
      const amount = await getBorrowableBalance();

      // if (balance <= 0) {
      if (amount > 0 && balance > 0) {
        handleRepayUSDC();
      } else if (balance > 0) {
        setIsLoader(false);
        handleApproveModal();
        const allowance = await allowanceTokens();
        if (allowance.allowance < balance) {
          setSupplyButtonDisable(false);
          setIsButtonDisabled(false);
        } else if (allowance.allowance >= balance) {
          setIsButtonDisabled(true);
          setSupplyButtonDisable(false);
        }
      } else {
        // setIsButtonDisabled(true);
        setIsLoader(false);
        Swal.fire({
          title: "Balance Low",
          text: "Your Account Balance is very Low!",
          icon: "warning",
          confirmButtonText: "cancel",
        });
      }
    } else {
      Swal.fire({
        title: "Metamask Not Connected",
        text: "User has not connected to Metamask yet!",
        icon: "warning",
        confirmButtonText: "cancel",
      });
    }
  };

  const handleSupplyCollateral = async (tokenAddress) => {
    if (connectedUser) {
      setIsAddress(tokenAddress);
      setIsLoader(true);
      const balance = await userBalance(tokenAddress);
      setIsBalance(balance);
      // const tokenDecimal = await getDecimal(tokenAddress);

      if (balance > 0) {
        handleApproveModal();
        const allowance = await allowanceTokens(tokenAddress);

        if (allowance.allowance < balance) {
          //changes needed here
          setIsButtonDisabled(false);
          setSupplyButtonDisable(false);
        } else if (allowance.allowance >= balance) {
          setIsButtonDisabled(true);
          setSupplyButtonDisable(false);
        }
      } else {
        setIsButtonDisabled(true);
        Swal.fire({
          title: "Balance Low",
          text: "Your Account Balance is very Low!",
          icon: "warning",
          confirmButtonText: "cancel",
        });
      }
      setIsLoader(false);
    } else {
      Swal.fire({
        title: "Metamask Not Connected",
        text: "User has not connected to Metamask yet!",
        icon: "warning",
        confirmButtonText: "cancel",
      });
    }
  };

  const handleWithdrawCollateral = async (tokenAddress) => {
    if (connectedUser) {
      try {
        setTokenAddressWithdraw(tokenAddress);
        setIsLoader(true);
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        const from = accounts[0];
        const response = await axios.get(
          `https://lending-and-borrowing-dapp-backend.onrender.com/userSupplyInfo?account=${from}`
        );
        const Token = tokenAddress.toLowerCase();
        const supplyAmount = await response.data.result;
        const assetAmount = await supplyAmount[Token];
        // setSuppliedAmount(supplyAmount);

        if (assetAmount > 0) {
          handleWithdrawModal();
        } else {
          Swal.fire({
            title: "Balance Low",
            text: "User wallet has run out of balance!",
            icon: "warning",
            confirmButtonText: "cancel",
          });
        }
        setIsLoader(false);
      } catch (error) {
        setIsLoader(false);
        Swal.fire({
          title: "Error",
          text: `${error.message}`,
          icon: "error",
          confirmButtonText: "cancel",
        });
      }
    } else {
      Swal.fire({
        title: "Metamask Not Connected",
        text: "User has not connected to Metamask yet!",
        icon: "warning",
        confirmButtonText: "cancel",
      });
    }
  };

  const hideApproveModal = () => {
    setIsLoader(false);
    setApproveModal(false);
  };

  const hideWithdrawModal = () => {
    setIsLoader(false);
    setWithdrawModal(false);
  };

  const handleBorrowUSDC = async () => {
    if (connectedUser) {
      setIsLoader(false);
      // handleBorrowModal();
      // const balance = await userBalance();
      // setIsBalance(balance);

      const tokenAddress = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      const suppliedAmt = await axios.get(
        `https://lending-and-borrowing-dapp-backend.onrender.com/balanceOf?account=${from}`
      );

      console.log("suppliedAmt", suppliedAmt);
      // const Token = tokenAddress.toLowerCase();
      const supplyAmount = await suppliedAmt.data;
      const supplyAmtUSDC = await supplyAmount.usdcSuppliedBalance;
      // const assetAmount = await supplyAmount[tokenAddress];
      console.log("supplyAmount", supplyAmount.usdcSuppliedBalance);

      const borrowAssetInfo = await axios.get(
        `https://lending-and-borrowing-dapp-backend.onrender.com/getBorrowBalanceOf?account=${from}`
      );

      const BorrowBalance = await borrowAssetInfo.data;
      const borrowedAmount = await BorrowBalance.balance;
      console.log("borrowedAmount", borrowedAmount);

      if (supplyAmtUSDC > 0 && borrowedAmount <= 0) {
        console.log("if entered");
        handleWithdrawModal();
      } else {
        console.log("else entered");
        handleBorrowModal();
      }

      // const amount = await getBorrowableBalance();

      // if (balance <= 0) {
      //   if (amount > 0 && balance > 0) {
      //     handleRepayUSDC();
      //   } else if (balance > 0) {
      //     setIsLoader(false);
      //     handleApproveModal();
      //     const allowance = await allowanceTokens();
      //     if (allowance.allowance < balance) {
      //       setSupplyButtonDisable(false);
      //       setIsButtonDisabled(false);
      //     } else if (allowance.allowance >= balance) {
      //       setIsButtonDisabled(true);
      //       setSupplyButtonDisable(false);
      //     }
      //   } else {
      //     // setIsButtonDisabled(true);
      //     setIsLoader(false);
      //     Swal.fire({
      //       title: "Balance Low",
      //       text: "Your Account Balance is very Low!",
      //       icon: "warning",
      //       confirmButtonText: "cancel",
      //     });
      //   }
    } else {
      Swal.fire({
        title: "Metamask Not Connected",
        text: "User has not connected to Metamask yet!",
        icon: "warning",
        confirmButtonText: "cancel",
      });
    }
  };

  const handleBorrowModal = async () => {
    setIsLoader(true);
    await window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const from = accounts[0];
    const response = await axios.get(
      `https://lending-and-borrowing-dapp-backend.onrender.com/borrowableAmount?account=${from}`
    );
    const amount = response.data;
    setBorrowableAmt(amount.borrowableAmount);
    if (amount.borrowableAmount > 0) {
      setBorrowModal(true);
      setIsLoader(false);
    } else {
      setIsLoader(false);
      Swal.fire({
        title: "Insufficient Borrow Limit!",
        text: `User don't have enough supplied funds to borrow USDC!`,
        icon: "error",
        confirmButtonText: "cancel",
      });
    }
  };

  const hideBorrowModal = () => {
    setIsLoader(false);
    setBorrowModal(false);
  };

  const hideRepayModal = () => {
    setRepayModal(false);
    setIsLoader(false);
  };

  const getBorrowableAmt = async () => {
    await window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const from = accounts[0];

    const response = await axios.get(
      `https://lending-and-borrowing-dapp-backend.onrender.com/borrowableAmount?account=${from}`
    );
    const borrowAmt = response.data;
    setBorrowableAmt(borrowAmt.borrowableAmount);
  };

  getBorrowableAmt();

  return (
    <React.Fragment>
      <div className="relative z-10">
        {/* <div className="flex items-center p-1 max-w-lg mx-auto rounded-xl shadow-lg space-x-4 mt-12"> */}
        {isLoader ? <CircularIndeterminate /> : ""}
        <div className="flex items-center p-1 max-w-lg mx-auto rounded-xl shadow-lg mt-12">
          <div>
            <div className=" p-2 m-2 bg-cyan-500 rounded-md">
              <div className="mb-4 ml-4">
                User Borrowable Amount - {borrowableAmt / 1e6} USDC
              </div>
              {/* </div>
            <div className="shadow-lg p-2 m-2 bg-cyan-500 hover:bg-orange-500 hover:text-white rounded-md"> */}
              <div className="ml-4">
                User Borrowed Amount - {(borrowBal / 1e6).toFixed(0)} USDC
              </div>
            </div>
          </div>

          <button
            className="shadow-lg max-w-m p-2 m-2 ml-16 bg-cyan-500 hover:bg-orange-500 hover:text-white rounded-md"
            onClick={handleSupplyUSDC}
          >
            Supply USDC / Repay
          </button>
          <button
            className="shadow-lg max-w-m p-2 m-2 bg-cyan-500 hover:bg-orange-500 hover:text-white rounded-md"
            onClick={handleBorrowUSDC}
          >
            Borrow USDC / Withdraw
          </button>
        </div>

        <div>{`\n`}</div>

        {repayModal ? (
          <RepayModal
            repayTokens={repayTokens}
            hideRepayModal={hideRepayModal}
            balance={isBalance}
            allowance={allowance}
            approveTokens={approveTokens}
          />
        ) : (
          ""
        )}

        {approveModal && !isLoader && isBalance > 0 ? (
          <ApproveModal
            hideModal={hideApproveModal}
            approveTokens={approveTokens}
            supplyTokens={supplyTokens}
            approveButton={isButtonDisabled}
            supplyButton={supplyButtonDisable}
            address={isAddress}
            allowance={allowance}
            isBalance={isBalance}
            allowModalState={allowModalState}
          />
        ) : (
          ""
        )}
        {withdrawModal ? (
          !borrowBal > 0 ? (
            <WithdrawModal
              hideModal={hideWithdrawModal}
              withdrawButton={isWithdrawDisabled}
              withdrawTokens={withdrawTokens}
              tokenAddressWithdraw={tokenAddressWithdraw}
              setWithdrawButton={setIsWithdrawDisabled}
            />
          ) : (
            <WithdrawCheckModal
              hideModal={hideWithdrawModal}
              withdrawButton={isWithdrawDisabled}
              setWithdrawButton={setIsWithdrawDisabled}
              withdrawTokens={withdrawTokens}
              tokenAddressWithdraw={tokenAddressWithdraw}
              suppliedAmt={suppliedAmt}
            />
          )
        ) : (
          ""
        )}
        {borrowModal ? (
          <BorrowModal
            hideModal={hideBorrowModal}
            borrowButton={isBorrowDisabled}
            borrowTokens={borrowTokens}
          />
        ) : (
          ""
        )}
        {!isLoading ? (
          <div>
            <SupplyTable
              allAssetInfo={assetsInfo}
              handleSupplyToken={handleSupplyCollateral}
              handleWithdrawToken={handleWithdrawCollateral}
              supplyState={supplyState}
              isLoader={isLoader}
              Prices={Prices}
            />
          </div>
        ) : (
          <CircularIndeterminate />
        )}
      </div>
    </React.Fragment>
  );
}
