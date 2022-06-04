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
    amount: -1,
    name: "",
    lastUse: null,
    creator: ""
  });

  const showMessage = (text, timed = true) => {
    clearMessage();
    setMessage(text);
    setTimed(timed);
  };

  const clearMessage = () => {
    setMessage("");
  };

  const optOut = async () => {
    if (props.asset.amount > 0 && !window.confirm(
      `You still have ${details.amount} ${details.name}.\
      \n\nThe remaining amount will be sent to ${details.name} creator address.\
      \n\nDo you agree?`)
    ) {
      return;
    }

    setLoading(true);

    const unsignedTxns = await account.optOutAsset(
      props.asset["asset-id"], 
      details.creator,
      props.asset.amount
    );

    const signedTxns = await wallet.signTransactions(unsignedTxns);
    if (!signedTxns) {
      setLoading(false);
      showMessage("Transaction rejected, please try again");
      return;
    }

    algod
      .sendTransaction(signedTxns)
      .then(() => {
        account.fetchAccount().then(() => {
          props.onShowMessage(
            `Opted out of ${details.name}, +${props.cost} Algos!`,
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
      const assetInfo = await indexer.client
        .lookupAssetByID(props.asset["asset-id"])
        .do();
      if (assetInfo.asset) {
        const decimals = assetInfo.asset.params.decimals;
        const calculated = parseFloat(
          (props.asset.amount / 10 ** decimals).toFixed(decimals)
        );
        return { 
          amount: calculated, 
          name: assetInfo.asset.params.name,
          creator: assetInfo.asset.params.creator,
        };
      }
      return { amount: -1, name: "", creator: "" };
    };

    const fetchData = async () => {
      const lastUse = await getLastUse();
      const { amount, name, creator } = await getDetails();

      setDetails({ amount, name, lastUse, creator });
    };

    fetchData();
  }, []);

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
      actionLabel="Opt-out"
      loading={loading}
      disabled={!timed}
      content={content()}
      message={message}
      timed={timed}
      asset={props.asset}
      open={props.open}
      onClearMessage={clearMessage}
      handleAction={optOut}
      handleClose={props.handleClose}
    />
  );
}
