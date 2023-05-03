import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

function ApproveModal(props) {
  const {
    approveButton,
    supplyButton,
    address,
    allowance,
    isBalance: balance,
  } = props;
  const [modalAmount, setModalAmount] = useState(null);
  const [modalAllowance, setModalAllowance] = useState(0);
  // const [functionRun, checkFunctionRun] = useState(false);

  useEffect(() => {
    setModalAllowance(allowance);
  }, [modalAmount, allowance]);

  const handleInputChange = (event) => {
    setModalAmount(event.target.value);
  };

  const handleApprove = () => {
    if (modalAmount < balance - allowance) {
      props.approveTokens(modalAmount, address);
    } else {
      Swal.fire({
        title: "Balance Low",
        text: "Your account balance is not enough to proceed!",
        icon: "warning",
        confirmButtonText: "cancel",
      });
    }
  };

  const handleSupply = () => {
    if (modalAmount <= allowance) {
      if (modalAmount <= balance) {
        props.supplyTokens(modalAmount, address);
      } else {
        Swal.fire({
          title: "User Balance Low",
          text: "User Need to buy more assets to supply in the compound!",
          icon: "error",
          confirmButtonText: "cancel",
        });
      }
    } else {
      Swal.fire({
        title: "Allowance Low",
        text: "First user need to Approve and then they can Supply Assets!",
        icon: "warning",
        confirmButtonText: "cancel",
      });
    }
  };

  return (
    <>
      <div className="inset-0 flex items-center justify-center mt-10 z-20">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg p-4">
          <h2 className="font-bold mb-4">Approve and Supply Tokens</h2>
          <div className="flex mb-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded  disabled"
              disabled
            >
              User Balance - {balance.toFixed(4)}
            </button>
            <button
              className="ml-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded disabled"
              disabled
            >
              User Allowance - {modalAllowance.toFixed(4)}
            </button>
          </div>

          <label htmlFor="input" className="block font-medium mb-2">
            Enter Amount
          </label>
          <input
            type="text"
            id="input"
            name="input"
            value={modalAmount}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={props.hideModal}
              className="mr-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 mr-24  rounded"
            >
              Cancel
            </button>
            {approveButton ? (
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ApproveModal;
