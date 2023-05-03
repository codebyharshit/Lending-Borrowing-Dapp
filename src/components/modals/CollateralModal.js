import React from "react";
import classes from "./LendingModal.module.css";
import Button from "../button/Button";
import Card from "../Card";

const CollateralModal = (props) => {

    const useColleteral =() => {
        return (
            alert("Enabled")
        );
    };

  return (
    <div>
      <div className={classes.backdrop} pnClick={props.onConfirm}>
        <Card>
          <header className={classes.header}>
            <h2>{props.TokenName}</h2>
          </header>
          <div className={classes.content}>
            <p>
              {` To Supply or Repay ${props.TokenName} to the Compound Protocol you need to enable it first.`}
            </p>
          </div>
          <footer className={classes.actions}>
            <Button onClick={props.onConfirm}>Cancel</Button>
            <Button onClick={useColleteral}>{`Use ${props.TokenName} as Collateral`}</Button>
          </footer>
        </Card>
      </div>
    </div>
  );
};

export default CollateralModal;
