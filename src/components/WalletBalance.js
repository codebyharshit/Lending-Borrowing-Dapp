import React from "react";
import "./WalletBalance.css";
import { Grid } from "@mui/material";

const WalletBalance = () => {
  return (
    <div>
      <Grid item xs={12} md={6}>
        <div className="balance">
          <div className="label">USDC Wallet Balance</div>
          {/* <div className="value">${supplyBalance.toFixed(2)}</div> */}
          <div className="value">0.000</div>
        </div>
        <div className="balance">
          <div className="label">Supply APR</div>
          <div className="value">0.000</div>
        </div>
        <div className="balance">
          <div className="label">Borrow APR</div>
          <div className="value">0.000</div>
        </div>
      </Grid>
    </div>
  );
};

export default WalletBalance;
