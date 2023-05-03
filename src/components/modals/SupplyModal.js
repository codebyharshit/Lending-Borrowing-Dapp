// import React, { useState } from "react";
// import classes from "./LendingModal.module.css";
// import Button from "./Button";
// import Card from "./Card";

// const LendingModal = (props) => {
//   const [supplyModal, setSupplyModal] = useState(null);
//   const [withdrawModal, setWithdrawModal] = useState(null);

//   const lendEnable = () => {
//     return alert("Enabled");
//   };

//   const supplyModalHandler = () => {
//     setSupplyModal(true);
//     setWithdrawModal(false);
//   };

//   const withdrawModalHandler = () => {
//     setWithdrawModal(true);
//     setSupplyModal(false);
//   };

//   return (
//     <div>
//       <div className={classes.backdrop} pnClick={props.onConfirm}>
//         {/* {supplyModal && ( */}
//           <Card>
//             <header className={classes.header}>
//               <h2>{props.TokenName}</h2>
//             </header>
//             <div>
//               {/* <p>
//                 {` To Supply or Repay ${props.TokenName} to the Compound Protocol you need to enable it first.`}
//               </p> */}
//               <label htmlFor="input" className="font-medium mb-2">Type the Amount of USDC tokens you want to supply</label>
//               <input className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"></input>
//             </div>
//             <footer className={classes.actions}>
//               <Button onClick={props.onConfirm}>Cancel</Button>
//               <Button onClick={lendEnable}>Enable</Button>
//             </footer>
//           </Card>
//         {/* )} */}

//         {/* { withdrawModal && <Card>
//           <header className={classes.header}>
//             <h2>{props.TokenName}</h2>
//           </header>
//           <div className={classes.content}>
//             <p>
//               {` Withdraw Modal`}
//             </p>
//           </div>
//           <footer className={classes.actions}>
//             <Button onClick={props.onConfirm}>Cancel</Button>
//             <Button onClick={lendEnable}>Withdraw</Button>
//           </footer>
//         </Card>} */}
// {/*
//         <Button onClick={supplyModalHandler}>Supply</Button>
//         <Button onClick={withdrawModalHandler}>Withdraw</Button> */}
//       </div>
//     </div>
//   );
// };

// export default LendingModal;

import React, { useState } from "react";

function SupplyModal(props) {
  // const [isOpen, setIsOpen] = useState(true);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // const handleModalOpen = () => {
  //   setIsOpen(true);
  // };

  // const handleModalClose = () => {
  //   setIsOpen(false);
  //   setInputValue("");
  // };

  const handleSupply = () => {
    props.supplyTokens(inputValue);
  };

  return (
    <>
      {/* Button to open modal */}
      {/* Modal */}
      <div className="inset-0 flex items-center justify-center mt-10 z-20">
        {/* <div
            className="absolute inset-0 bg-gray-900 opacity-50"
            onClick={props.hideModal}
          ></div> */}
        <div className="bg-white rounded-lg overflow-hidden shadow-lg p-4">
          <h2 className="font-bold mb-4">Supply USDC</h2>
          <label htmlFor="input" className="block font-medium mb-2">
            Supply Token Amount
          </label>
          <input
            type="text"
            id="input"
            name="input"
            value={inputValue}
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
            <button
              type="button"
              onClick={handleSupply}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded"
            >
              Supply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SupplyModal;
