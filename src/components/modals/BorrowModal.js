import React, { useState } from "react";
import Swal from "sweetalert2";

function BorrowModal(props) {
  const { borrowButton } = props;
  const [borrowAmount, setBorrowAmount] = useState(null);

  const handleInputChange = (event) => {
    setBorrowAmount(event.target.value);
  };

  const handleBorrow = () => {
    if (borrowAmount !== null && borrowAmount > 1000) {
      props.borrowTokens(borrowAmount);
    } else {
      Swal.fire({
        title: "User Must Enter a Valid Value Before Proceeding!",
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
          <h2 className="font-bold mb-4">Borrow USDC</h2>
          <div className="flex mb-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded  disabled"
              disabled
            >
              {/* User USDC Balance - {balance.toFixed(4)} */}
              Minimum Borrow Amount- 1000 USDC
            </button>
          </div>
          <label htmlFor="input" className="block font-medium mb-2">
            Enter Amount
          </label>
          <input
            type="text"
            id="input"
            name="input"
            value={borrowAmount}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={props.hideModal}
              className="mr-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 mr-10  rounded"
            >
              Cancel
            </button>
            {borrowButton ? (
              <button
                disabled={true}
                type="button"
                className={
                  "bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded"
                }
              >
                Borrow USDC
              </button>
            ) : (
              <button
                type="button"
                onClick={handleBorrow}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded"
              >
                Borrow USDC
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BorrowModal;
