import * as React from "react";
import algosdk from "algosdk";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import { AccountContext } from "./AccountContext";
import usePrevious from "../utils/utils";

const WalletContext = React.createContext();

const WalletContextProvider = ({ children }) => {
  const account = React.useContext(AccountContext);

  const [connected, setConnected] = React.useState(false);
  const [connector, setConnector] = React.useState(null);

  const prevAddress = usePrevious(account.address);

  const connect = async (usePrevSession = false) => {
    const connection = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal,
    });
    
    if (!connection.connected && !usePrevSession) {
      connection.createSession();
    } else if (connection.connected && usePrevSession) {
      account.setAddress(connection.accounts[0]);
      setConnected(true);
    } else if (!usePrevSession) {
      await connection.killSession();
      connection.createSession();
    }

    connection.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }

      // Get provided accounts
      const { accounts } = payload.params[0];
      console.log("connect accounts", accounts);
      validate(accounts);
    });

    connection.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }

      // Get updated accounts
      const { accounts } = payload.params[0];
      console.log("connect session", accounts);
      validate(accounts);
    });

    connection.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }
      setConnected(false);
    });

    setConnector(connection);
  };

  const disconnect = () => {
    if (connector && connector.connected) {
      connector.killSession();
    }
  };

  const validate = (accs) => {
    if (accs.length == 0 || (account.address && accs[0] != account.address)) {
      setConnected(false);
      disconnect();
    } else {
      setConnected(true);
    }
  };

  const signTransaction = async (transaction, message = "") => {
    const enc = algosdk.encodeUnsignedTransaction(transaction);
    const encodedTransaction = Buffer.from(enc).toString("base64");

    const transactionToSign = {
      txn: encodedTransaction,
      message: message,
    };

    const request = formatJsonRpcRequest("algo_signTxn", [[transactionToSign]]);
    const result = await connector.sendCustomRequest(request);
    const decodedResult = result.map((element) => {
      return element ? new Uint8Array(Buffer.from(element, "base64")) : null;
    });
    return decodedResult;
  };

  const context = {
    connector,
    connected,
    connect,
    disconnect,
    signTransaction,
  };

  React.useEffect(() => {
    connect(true);
  }, []);

  React.useEffect(() => {
    if (!account || (prevAddress && prevAddress != account.address)) {
      disconnect();
    }
  }, [account.address]);

  return (
    <WalletContext.Provider value={context}>{children}</WalletContext.Provider>
  );
};

export { WalletContext, WalletContextProvider };
