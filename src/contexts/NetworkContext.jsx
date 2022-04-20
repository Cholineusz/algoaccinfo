import * as React from "react";

const NETWORK_KEY = "NETWORK";

const NetworkContext = React.createContext();

const NetworkContextProvider = ({ children }) => {
  const [value, setValue] = React.useState(() => {
    const val = window.localStorage.getItem(NETWORK_KEY);
    if (val === null) {
      return 0;
    } else {
      return parseInt(val);
    }
  });

  React.useEffect(() => {
    window.localStorage.setItem(NETWORK_KEY, value);
  }, [value]);

  const context = {
    value,
    setValue,
  };

  return (
    <NetworkContext.Provider value={context}>
      {children}
    </NetworkContext.Provider>
  );
};

export { NetworkContext, NetworkContextProvider };
