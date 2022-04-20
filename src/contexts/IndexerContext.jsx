import * as React from "react";
import algosdk from "algosdk";
import { NetworkContext } from "./NetworkContext";

const IndexerContext = React.createContext();

const IndexerContextProvider = ({ children }) => {
  const network = React.useContext(NetworkContext);

  const createClient = () => {
    return new algosdk.Indexer(
      network.value
        ? process.env.REACT_APP_TESTNET_INDEXER_TOKEN
        : process.env.REACT_APP_MAINNET_INDEXER_TOKEN,
      network.value
        ? process.env.REACT_APP_TESTNET_INDEXER_SERVER
        : process.env.REACT_APP_MAINNET_INDEXER_SERVER,
      network.value
        ? process.env.REACT_APP_TESTNET_INDEXER_PORT
        : process.env.REACT_APP_MAINNET_INDEXER_PORT
    );
  };

  const [client, setClient] = React.useState(createClient());
  const [currentNetwork, setCurrentNetwork] = React.useState(network.value);

  React.useEffect(() => {
    setClient(createClient());
  }, [network.value]);

  React.useEffect(() => {
    setCurrentNetwork(network.value);
  }, [client]);

  const context = {
    client,
    currentNetwork
  }

  return (
    <IndexerContext.Provider value={context}>{children}</IndexerContext.Provider>
  );
};

export { IndexerContext, IndexerContextProvider };
