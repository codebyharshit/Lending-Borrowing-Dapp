import React from "react";

const TokenDetails = (props) => {
  return (
    <div>
      <div className="absolute top-24 left-64 z-10 mx-auto bg-black text-white rounded-xl p-4 border-2 border-white ">
        <p>Token Selected {props.TokenDetails.Assets}</p>
        {/* <p>Scale - {props.TokenDetails.Scale}</p> */}
        {/* <p>PriceFeed - {props.TokenDetails.PriceFeed} </p> */}
        <p>Oracle Price - {props.TokenDetails.PriceFeed} USDC </p>
        <p>
          Liquidation Factor -{" "}
          {(props.TokenDetails.LiquidationFactor / 1e18) * 100}%
        </p>
        <div>
          <p>
            Liquidation Collateral Factor -{" "}
            {(props.TokenDetails.LiquidateCollateralFactor / 1e18) * 100}%
          </p>
          <p>
            Borrow Collateral Factor -{" "}
            {(props.TokenDetails.BorrowCollateralFactor / 1e18) * 100}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenDetails;
