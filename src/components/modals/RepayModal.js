import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import Web3 from "web3";
import axios from "axios";

function RepayModal(props) {
  const inputRef = useRef(null);
  const { balance: USDCBalance, allowance } = props;
  const [repayAmount, setRepayAmount] = useState(0);
  const [borrowBal, setBorrowBal] = useState(0);

  useEffect(() => {
    const getBorrowableBalance = async () => {
      await window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const from = accounts[0];
      const borrowBalance = await axios.get(
        `http://localhost:8080/getBorrowBalanceOf?account=${from}`
      );
      const BorrowBalance = await borrowBalance.data;
      setBorrowBal(BorrowBalance.balance);
    };
    getBorrowableBalance();
    //     getBorrowableBalance();
    //   const balValue = setInterval(() => {
    //     setAmount()
    //   }, 30000);
    //   // setIntervalID(balValue);
    //   return () => clearInterval(balValue);
  }, []);

  const handleInputChange = (event) => {
    setRepayAmount(event.target.value);
  };

  const handleRepay = () => {
    if (repayAmount <= borrowBal / 1e6 && repayAmount > 0) {
      if (
        allowance >= repayAmount ||
        repayAmount ===
          115792089237316195423570985008687907853269984665640564039457584007913129639935
      ) {
        props.repayTokens(repayAmount);
      } else {
        Swal.fire({
          title: "Allowance Low",
          text: "Your account allowance is not enough to proceed!",
          icon: "warning",
          confirmButtonText: "cancel",
        });
      }
    } else {
      Swal.fire({
        title: "Amount Enter is Excess or Invalid!",
        text: "Please write the correct value to proceed!",
        icon: "warning",
        confirmButtonText: "cancel",
      });
    }
  };

  const handleApprove = () => {
    if (USDCBalance) {
      props.approveTokens(repayAmount);
    } else {
      Swal.fire({
        title: "Balance Low",
        text: "Your account balance is not enough to proceed!",
        icon: "warning",
        confirmButtonText: "cancel",
      });
    }
  };

  const handleMaxValue = () => {
    // inputRef.current.value =
    //   "115792089237316195423570985008687907853269984665640564039457584007913129639935";
    // setRepayAmount(
    //   "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    // );

    if (USDCBalance) {
      props.approveTokens(
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      );
    } else {
      Swal.fire({
        title: "Balance Low",
        text: "Your account balance is not enough to proceed!",
        icon: "warning",
        confirmButtonText: "cancel",
      });
    }
  };

  return (
    <>
      <div className="inset-0 flex items-center justify-center mt-10 z-20">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg p-4">
          <h2 className="font-bold mb-4">Repay USDC Tokens</h2>
          <div className="flex mb-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded  disabled"
              disabled
            >
              {/* User USDC Balance - {balance.toFixed(4)} */}
              User USDC Balance - {USDCBalance}
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded  disabled"
              disabled
            >
              {/* User USDC Balance - {balance.toFixed(4)} */}
              User Borrowed Amount - {borrowBal / 1e6}
            </button>
          </div>
          <label htmlFor="input" className="block font-medium mb-2">
            Enter Amount
          </label>
          <div className="flex ">
            <input
              type="text"
              id="input"
              name="input"
              ref={inputRef}
              // value={modalAmount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mr-1"
            />
            {/* <button
              onClick={handleMaxValue}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-20 rounded"
            >
              Repay Max.
            </button> */}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={props.hideRepayModal}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-20 rounded"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleRepay}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-20 rounded"
            >
              Repay USDC
            </button>

            <button
              type="button"
              onClick={handleApprove}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-20 rounded"
            >
              Approve
            </button>
            {/* {approveButton ? (
              <button
                disabled={true}
                type="button"
                onClick={handleApprove}
                className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-20 rounded ${
                  approveButton ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Approve
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApprove}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-20 rounded"
              >
                Approve
              </button>
            )}
            {supplyButton ? (
              <button
                disabled={true}
                type="button"
                onClick={handleSupply}
                className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded ${
                  supplyButton ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Supply
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSupply}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-8 rounded"
              >
                Supply
              </button>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}

export default RepayModal;
