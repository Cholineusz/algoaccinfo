import * as React from "react";
import axios from "axios";
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
  const [loading, setLoading] = React.useState(false);
  const [details, setDetails] = React.useState({
    name: "",
    description: "",
    lastUse: null,
  });

  const showMessage = (text) => {
    clearMessage();
    setMessage(text);
  };

  const clearMessage = () => {
    setMessage("");
  };

  const optOut = async () => {
    if (
      !window.confirm(
        "This option will delete all your data related to the selected smart contract.\
         \n\nYou may lose your funds related to it. It is not possible to undo this action.\
         \n\nDo you understand and confirm?"
      )
    ) {
      return;
    }

    setLoading(true);
    const unsignedTxns = await account.optOutApp(props.app.id);

    const signedTxns = await wallet.signTransactions(unsignedTxns);

    algod
      .sendTransaction(signedTxns)
      .then(async () => {
        account.fetchAccount().then(() => {
          props.onShowMessage(
            `Opted out of app, +${props.cost} Algos!`,
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
        return date;
      }
      return "Never used";
    };

    const getDetails = async () => {
      const appInfo = await axios.get(
        `${process.env.REACT_APP_ALGO_RES_INFO_HOST}/applications/?id=${props.app.id}`
      );

      if (appInfo.data && appInfo.data.length > 0) {
        const data = appInfo.data[0];
        return { name: data.name, description: data.description };
      }
      return { name: "", description: "" };
    };

    const fetchData = async () => {
      const lastUse = await getLastUse();
      const { name, description } = await getDetails();

      setDetails({ name, description, lastUse });
    };

    fetchData();
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
          <b>owner:</b>{" "}
          {details.name ? (
            details.name
          ) : details.lastUse ? (
            "Not found"
          ) : (
            <CircularProgress size={12} sx={{ color: "black" }} />
          )}
        </div>
        <div>
          <b>name:</b>{" "}
          {details.description ? (
            details.description
          ) : details.lastUse ? (
            "Not found"
          ) : (
            <CircularProgress size={12} sx={{ color: "black" }} />
          )}
        </div>
        <div>
          <b>last use:</b>{" "}
          {details.lastUse ? (
            details.lastUse
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
      actionLabel="Opt-out"
      loading={loading}
      disabled={false}
      content={content()}
      message={message}
      timed={true}
      open={props.open}
      onClearMessage={clearMessage}
      handleAction={optOut}
      handleClose={props.handleClose}
    />
  );
}
