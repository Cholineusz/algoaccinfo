import * as React from "react";
import { CircularProgress } from "@mui/material";
import ResourceInfoPopup from "./ResourceInfoPopup";
import { AccountContext } from "../../contexts/AccountContext";
import { IndexerContext } from "../../contexts/IndexerContext";
import { WalletContext } from "../../contexts/WalletContext";
import { AlgodContext } from "../../contexts/AlgodContext";

export default function AssetInfoPopup(props) {
  const account = React.useContext(AccountContext);
  const indexer = React.useContext(IndexerContext);
  const wallet = React.useContext(WalletContext);
  const algod = React.useContext(AlgodContext);

  const [message, setMessage] = React.useState("");
  const [timed, setTimed] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [details, setDetails] = React.useState({
    total: -1,
    amount: -1,
    name: "",
    lastUse: null,
  });

  const showMessage = (text, timed = true) => {
    clearMessage();
    setMessage(text);
    setTimed(timed);
  };

  const clearMessage = () => {
    setMessage("");
  };

  const destroy = async () => {
    setLoading(true);

    const unsignedTxn = await account.destroyAsset(props.asset["asset-id"]);

    const signedTxn = await wallet.signTransaction(unsignedTxn);

    algod
      .sendTransaction(signedTxn)
      .then(() => {
        account.fetchAccount().then(() => {
          props.onShowMessage(
            `Destroyed ${details.name}, +${props.cost * 2} Algos!`,
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
        .assetID(props.asset["asset-id"])
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
      const decimals = props.created.params.decimals;
      const total = parseFloat(
        (props.created.params.total / 10 ** decimals).toFixed(decimals)
      );
      const amount = parseFloat(
        (props.asset.amount / 10 ** decimals).toFixed(decimals)
      );
      return { total, amount, name: props.created.params.name };
    };

    const fetchData = async () => {
      const lastUse = await getLastUse();
      const { total, amount, name } = await getDetails();

      setDetails({ total, amount, name, lastUse });
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    if (props.created.params.manager !== account.address) {
      showMessage(
        `Assets can be destroyed only by the asset manager account (${props.created.params.manager}).`,
        false
      );
    } else if (details.total > 0 && details.total !== details.amount) {
      showMessage(
        "All of the assets must be owned by the creator of the asset before the asset can be deleted.",
        false
      );
    }
  }, [details.total, details.amount]);

  const content = () => {
    return (
      <div>
        <div>
          <b>id:</b> {props.asset["asset-id"]}
        </div>
        <div>
          <b>reserved:</b> {`${props.cost} Algos`}
        </div>
        <div>
          <b>name:</b>{" "}
          {details.name ? (
            details.name
          ) : (
            <CircularProgress size={12} sx={{ color: "black" }} />
          )}
        </div>
        <div>
          <b>total:</b>{" "}
          {details.total >= 0 ? (
            details.total
          ) : (
            <CircularProgress size={12} sx={{ color: "black" }} />
          )}
        </div>
        <div>
          <b>amount:</b>{" "}
          {details.amount >= 0 ? (
            details.amount
          ) : (
            <CircularProgress size={12} sx={{ color: "black" }} />
          )}
        </div>
        <div>
          <b>last use:</b>{" "}
          {details.lastUse ? (
            details.lastUse
          ) : (
            <CircularProgress size={12} sx={{ color: "black" }} />
          )}
        </div>
      </div>
    );
  };

  return (
    <ResourceInfoPopup
      title="Asset Info"
      actionLabel="Destroy"
      loading={loading}
      disabled={!timed}
      content={content()}
      message={message}
      timed={timed}
      open={props.open}
      onClearMessage={clearMessage}
      handleAction={destroy}
      handleClose={props.handleClose}
    />
  );
}
