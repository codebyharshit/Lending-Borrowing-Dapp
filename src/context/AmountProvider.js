import AmountContext from "./amount-context";

const AmountProvider = (props) => {
  return <AmountContext.Provider>
    {props.children}
  </AmountContext.Provider>;
};

export default AmountProvider;