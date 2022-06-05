import * as React from "react";
import { CircularProgress } from "@mui/material";
import ResourceInfoPopup from "./ResourceInfoPopup";
import { AccountContext } from "../../contexts/AccountContext";
import { IndexerContext } from "../../contexts/IndexerContext";
import { WalletContext } from "../../contexts/WalletContext";
import { AlgodContext } from "../../contexts/AlgodContext";

export default function AppInfoPopup(props) {
  const account = React.useContext(AccountContext);
  const indexer = React.useContext(IndexerContext);
  const wallet = React.useContext(WalletContext);
  const algod = React.useContext(AlgodContext);

  const [message, setMessage] = React.useState("");
  const [lastUse, setLastUse] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const showMessage = (text) => {
    clearMessage();
    setMessage(text);
  };

  const clearMessage = () => {
    setMessage("");
  };

  const destroy = async () => {
    setLoading(true);
    const unsignedTxns = await account.destroyApp(props.app.id);

    const signedTxns = await wallet.signTransactions(unsignedTxns);
    if (!signedTxns) {
      setLoading(false);
      showMessage("Transaction rejected, please try again");
      return;
    }

    algod
      .sendTransaction(signedTxns)
      .then(async () => {
        account.fetchAccount().then(() => {
          props.onShowMessage(
            `Destroyed app, +${props.cost} Algos!`,
            "success"
          );
          setLoading(false);
          props.handleClose();
        });
      })
      .catch((error) => {
        console.log("ERROR", error);
        setLoading(false);
        showMessage("Something went wrong, please try again");
      });
  };

  React.useEffect(() => {
    const getLastUse = async () => {
      const txns = await indexer.client
        .searchForTransactions()
        .address(account.address)
        .applicationID(props.app.id)
        .limit(1)
        .do();
      if (txns["transactions"].length > 0) {
        const date = new Date(
          txns["transactions"][0]["round-time"] * 1000
        ).toLocaleString();
        setLastUse(date);
        return;
      }
      setLastUse("Never used");
    };

    getLastUse();
  }, []);

  const content = () => {
    return (
      <div>
        <div>
          <b>id:</b> {props.app.id}
        </div>
        <div>
          <b>reserved:</b> {`${props.cost} Algos`}
        </div>
        <div>
          <b>last use:</b>{" "}
          {lastUse ? (
            lastUse
          ) : (
            <CircularProgress
              size={12}
              sx={{ color: "black" }}
            ></CircularProgress>
          )}
        </div>
      </div>
    );
  };

  return (
    <ResourceInfoPopup
      title="App Info"
      actionLabel="Destroy"
      loading={loading}
      disabled={false}
      content={content()}
      message={message}
      timed={true}
      app={props.app}
      open={props.open}
      onClearMessage={clearMessage}
      handleAction={destroy}
      handleClose={props.handleClose}
    />
  );
}
