import * as React from "react";
import algosdk from "algosdk";
import { NetworkContext } from "./NetworkContext";

const AlgodContext = React.createContext();

const AlgodContextProvider = ({ children }) => {
  const network = React.useContext(NetworkContext);

  const createClient = () => {
    return new algosdk.Algodv2(
      network.value
        ? process.env.REACT_APP_TESTNET_ALGOD_TOKEN
        : process.env.REACT_APP_MAINNET_ALGOD_TOKEN,
      network.value
        ? process.env.REACT_APP_TESTNET_ALGOD_SERVER
        : process.env.REACT_APP_MAINNET_ALGOD_SERVER,
      network.value
        ? process.env.REACT_APP_TESTNET_ALGOD_PORT
        : process.env.REACT_APP_MAINNET_ALGOD_PORT
    );
  };

  const [client, setClient] = React.useState(createClient());

  const sendTransaction = async (transaction) => {
    const { txId } = await client.sendRawTransaction(transaction).do();
    return algosdk.waitForConfirmation(client, txId, 10);
  };

  const context = {
    client,
    sendTransaction,
  };

  React.useEffect(() => {
    setClient(createClient());
  }, [network.value]);

  return (
    <AlgodContext.Provider value={context}>{children}</AlgodContext.Provider>
  );
};

export { AlgodContext, AlgodContextProvider };
