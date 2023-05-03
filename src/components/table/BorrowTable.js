import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import BorrowModal from "./BorrowModal";

function createData(Assets, APY, Wallet, Collateral) {
  return { Assets, APY, Wallet, Collateral };
}

const rows = [
  createData("Dai(0x4DAFE12E1293D889221B1980672FE260Ac9dDd28)", 159, 6.0),
  createData("USDC(0xDB3cB4f2688daAB3BFf59C24cC42D4B6285828e9)", 237, 9.0),
  createData("WETH(0xE1e67212B1A4BF629Bdf828e08A3745307537ccE)", 262, 16.0),
  createData("WBTC(0x4B5A0F4E00bC0d6F16A593Cae27338972614E713)", 305, 3.7),
  createData("WMATIC(0xfec23a9E1DBA805ADCF55E0338Bf5E03488FC7Fb)", 356, 16.0),
];

const BorrowTable = () => {
  const [borrow, setBorrow] = useState();

  const hideBorrowHandler = () => {
    setBorrow(null);
  };

  const showBorrowHandler = (tokenName) => {
    setBorrow(tokenName);
  };

  return (
    <div>
      {/* {borrow && (
        <BorrowModal TokenName={borrow} onConfirm={hideBorrowHandler} />
      )} */}
      <div className="flex mx-auto ml-48 mt-10 mr-64">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Assets</TableCell>
                <TableCell>APY</TableCell>
                <TableCell>Wallet</TableCell>
                <TableCell>% Of Limit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    align="left"
                    onClick={() => showBorrowHandler(row.Assets)}
                  >
                    {row.Assets}
                  </TableCell>
                  <TableCell
                    align="left"
                    onClick={() => showBorrowHandler(row.Assets)}
                  >
                    {row.APY}
                  </TableCell>
                  <TableCell
                    align="left"
                    onClick={() => showBorrowHandler(row.Assets)}
                  >
                    {row.Wallet}
                  </TableCell>
                  <TableCell
                    align="left"
                    onClick={() => showBorrowHandler(row.Assets)}
                  >
                    {borrow}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default BorrowTable;
