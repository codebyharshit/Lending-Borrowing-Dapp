import React, { useEffect, useState } from "react";
import "./SupplyandBorrow.css";
import axios from "axios";

const SupplyAndBorrow = () => {
  const [supplyRate, setSupplyRate] = useState(0);
  const [borrowRate, setBorrowRate] = useState(0);

  useEffect(() => {
    const ratesDetails = async () => {
      const response = await axios.get(
        "https://lending-and-borrowing-dapp-backend.onrender.com/supply&BorrowAPR"
      );
      setSupplyRate(response.data.SupplyAPR);
      setBorrowRate(response.data.BorrowAPR);
    };
    ratesDetails();
  }, []);

  return (
    <div className="flex items-center p-1 max-w-lg mx-auto bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg space-x-4 mt-12">
      <div className="balance ml-4">
        <div className="value">
          Supply APR Rate {(supplyRate/1e18).toFixed(2)}%
        </div>
      </div>
      <div className="balance">
        <div className="value">
          Borrow APR Rate {(borrowRate/1e18).toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

export default SupplyAndBorrow;
