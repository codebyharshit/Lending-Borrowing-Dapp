import React, { useState } from "react";
import Swal from "sweetalert2";
import Web3 from "web3";
import axios from "axios";

function WithdrawCheckModal(props) {
  const { withdrawButton, tokenAddressWithdraw, setWithdrawButton } = props;
  const [withdrawAmount, setWithdrawAmount] = useState(null);
  const [canExtraWithdraw, setCanExtraWithdraw] = useState(false);

  const handleInputChange = (event) => {
    setWithdrawAmount(event.target.value);
  };

  const handleCheckCollateral = async () => {
    await window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const from = accounts[0];
    const isCollateral = await axios.get(
      `https://lending-and-borrowing-dapp-backend.onrender.com/withdrawableAmount?account=${from}&asset=${tokenAddressWithdraw}&amount=${withdrawAmount}`
    );
    const userWithdraw = await isCollateral.data;
    if (userWithdraw) {
      const canUserWithdraw = await userWithdraw;
      setCanExtraWithdraw(canUserWithdraw);
      canUserWithdraw ? setWithdrawButton(false) : setWithdrawButton(true);
    } else {
      setCanExtraWithdraw(false);
      setWithdrawButton(true);
    }
  };

  const handleWithdraw = () => {
    props.withdrawTokens(withdrawAmount);
  };

  return (
    <>
      <div className="inset-0 flex items-center justify-center mt-10 z-20">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg p-4">
          <h2 className="font-bold mb-4">Withdraw Tokens</h2>

          <div className="flex mb-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded  disabled"
              disabled
            >
              {/* User USDC Balance - {balance.toFixed(4)} */}
              Withdraw Asset - {tokenAddressWithdraw}
            </button>
            {/* <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded  disabled"
              disabled
            >
              Withdrawable Amount - {}
            </button> */}
          </div>

          {/* <div className="flex mb-2">
            {withdrawableAmount ? 
              (<button
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded  disabled"
                disabled
              >
                Withdrawable Amount - {withdrawableAmount}
              </button>) : ("")
            } 
            <button
              className="ml-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded disabled"
              disabled
            >
            </button>
          </div> */}

          <label htmlFor="input" className="block font-medium mb-2">
            Enter Amount
          </label>
          <div className="flex ">
            <input
              type="text"
              id="input"
              name="input"
              value={withdrawAmount}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mr-1"
            />
            <button
              onClick={handleCheckCollateral}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-20 rounded"
            >
              Check
            </button>
          </div>

          <div className="mt-4 flex justify-end mr-28">
            <button
              type="button"
              onClick={props.hideModal}
              className="mr-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 mr-10  rounded"
            >
              Cancel
            </button>

            {!canExtraWithdraw && withdrawButton ? (
              <button
                disabled={true}
                type="button"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-24 rounded"
              >
                Withdraw Token
              </button>
            ) : (
              <button
                type="button"
                onClick={handleWithdraw}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-24 rounded"
              >
                Withdraw Token
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default WithdrawCheckModal;
