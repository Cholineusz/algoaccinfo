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
    setLoading(true);

    const unsignedTxn = await account.optOutAsset(props.asset["asset-id"]);

    const signedTxn = await wallet.signTransaction(unsignedTxn);

    algod
      .sendTransaction(signedTxn)
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
        return { amount: calculated, name: assetInfo.asset.params.name };
      }
      return { amount: -1, name: "" };
    };

    const fetchData = async () => {
      const lastUse = await getLastUse();
      const { amount, name } = await getDetails();

      setDetails({ amount, name, lastUse });
    };

    fetchData();

    if (props.asset.amount > 0) {
      showMessage(
        "You can't opt out of the asset if you have non-zero amount",
        false
      );
    }
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
      open={props.open}
      onClearMessage={clearMessage}
      handleAction={optOut}
      handleClose={props.handleClose}
    />
  );
}
