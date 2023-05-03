// // import React from "react";
// // import classes from "./LendingModal.module.css";
// // import Button from "./Button";
// // import Card from "./Card";

// // const ApproveModal = (props) => {

// //     const borrowEnable =() => {
// //         return (
// //             alert("Enabled")
// //         );
// //     };

// //   return (
// //     <div>
// //       <div className={classes.backdrop} pnClick={props.onConfirm}>
// //         <Card>
// //           <header className={classes.header}>
// //             <h2>{props.TokenName}</h2>
// //           </header>
// //           <div className={classes.content}>
// //             <input></input>
// //             <p>
// //               {` To Supply or Repay ${props.TokenName} to the Compound Protocol you need to enable it first.`}
// //             </p>
// //           </div>
// //           <footer className={classes.actions}>
// //             <Button onClick={props.onConfirm}>Cancel</Button>
// //             <Button onClick={borrowEnable}>Enable</Button>
// //           </footer>
// //         </Card>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ApproveModal;

// import React, { useState } from "react";

// function ApproveModal(props) {
//   // const [isOpen, setIsOpen] = useState(true);
//   const [inputValue, setInputValue] = useState("");

//   const handleInputChange = (event) => {
//     setInputValue(event.target.value);
//   };

//   // const handleModalOpen = () => {
//   //   setIsOpen(true);
//   // };

//   // const handleModalClose = () => {
//   //   setIsOpen(false);
//   //   setInputValue("");
//   // };

//   const handleApprove = () => {
//     console.log("handle Approve");
//     props.approveTokens(inputValue);
//   };

//   return (
//     <>
//       {/* Button to open modal */}
//       {/* Modal */}

//       <div className="inset-0 flex items-center justify-center mt-10 z-20">
//         {/* <div
//             className="absolute inset-0 bg-gray-900 opacity-50"
//             onClick={props.hideModal}
//           ></div> */}
//         <div className="bg-white rounded-lg overflow-hidden shadow-lg p-4">
//           <h2 className="font-bold mb-4">Approve USDC</h2>
//           <label htmlFor="input" className="block font-medium mb-2">
//             Approve Token Amount
//           </label>
//           <input
//             type="text"
//             id="input"
//             name="input"
//             value={inputValue}
//             onChange={handleInputChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//           <div className="mt-4 flex justify-end">
//             <button
//               type="button"
//               onClick={props.hideModal}
//               className="mr-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 mr-10  rounded"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleApprove}
//               className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mr-2 rounded"
//             >
//               Approve
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ApproveModal;
