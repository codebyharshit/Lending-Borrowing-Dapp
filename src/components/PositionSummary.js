import React from "react";
import "./PositionSummary.css";
import { Grid } from "@mui/material";

const PositionSummary = () => {
  return (
    <div>
      <Grid item xs={12} md={6}>
        <div className="balance">
          <div className="label">Collateral Value</div>
          {/* <div className="value">${supplyBalance.toFixed(2)}</div> */}
          <div className="value">0.0000 USDC</div>
        </div>
        <div className="balance">
          <div className="label">Liquidation Point</div>
          <div className="value">0.0000 USDC</div>
        </div>
        <div className="balance">
          <div className="label">Borrow Capacity</div>
          <div className="value">0.0000 USDC</div>
        </div>
        <div className="balance">
          <div className="label">Available to Borrow</div>
          <div className="value">0.0000 USDC</div>
        </div>
      </Grid>
    </div>
  );
};

export default PositionSummary;
