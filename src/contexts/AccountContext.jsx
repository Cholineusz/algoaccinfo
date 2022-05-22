import * as React from "react";
import algosdk from "algosdk";
import axios from "axios";
import COSTS from "../utils/costs.js";
import { IndexerContext } from "./IndexerContext";
import { AlgodContext } from "./AlgodContext.jsx";

const ADDRESS_KEY = "ADDRESS";

const AccountContext = React.createContext();

const AccountContextProvider = ({ children }) => {
  const [address, setAddress] = React.useState(() => {
    const val = window.localStorage.getItem(ADDRESS_KEY);
    if (val === null) {
      return "";
    } else {
      return val;
    }
  });
  const [details, setDetails] = React.useState(null);
  const [reservedAlgos, setReservedAlgos] = React.useState(0);

  const indexer = React.useContext(IndexerContext);
  const algod = React.useContext(AlgodContext);

  const fetchAccount = async () => {
    setDetails(null);
    return new Promise(async (resolve, reject) => {
      const account = await indexer.client
        .lookupAccountByID(address)
        .do()
        .then((reply) => {
          if (reply) {
            return reply.account;
          } else {
            return null;
          }
        })
        .catch(() => null);

      if (!account) {
        setDetails(null);
        reject(null);
        return;
      }

      //Bypass https://governance.algorand.foundation wrongly configured CORS:
      const governanceURL = `${process.env.REACT_APP_GOVERNANCE_API}/api/governors/${address}/status/`;
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const governance = await fetch(governanceURL, {
        method: "GET",
        mode: "no-cors",
        headers: headers,
      })
        .then(
          async () =>
            await fetch(governanceURL, {
              method: "GET",
              headers: headers,
            })
              .then(async (reply) => await reply.json().catch(() => null))
              .catch(() => null)
        )
        .catch(() => null);

      if (governance) {
        account.governance_ = governance;
      }
      setDetails(account);
      resolve(account);
    });
  };

  const destroyApp = async (appId) => {
    const suggestedParams = await algod.client.getTransactionParams().do();
    const unsignedTxn = algosdk.makeApplicationDeleteTxnFromObject({
      appIndex: appId,
      from: address,
      suggestedParams: suggestedParams,
    });
    return [unsignedTxn];
  };

  const destroyAsset = async (assetId) => {
    const suggestedParams = await algod.client.getTransactionParams().do();
    const unsignedTxn =
      algosdk.makeAssetDestroyTxnWithSuggestedParamsFromObject({
        assetIndex: assetId,
        from: address,
        suggestedParams: suggestedParams,
      });
    return [unsignedTxn];
  };

  const optOutAsset = async (assetId, creatorAddress = "", amount = 0) => {
    const suggestedParams = await algod.client.getTransactionParams().do();

    let transactions = [];
    //Send remaining amount to creator address:
    if (amount > 0 && creatorAddress) {
      transactions.push(
        algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          assetIndex: assetId,
          from: address,
          to: creatorAddress,
          amount: amount,
          suggestedParams: suggestedParams,
        })
      );
    }
    //Opt-out:
    transactions.push(
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        assetIndex: assetId,
        from: address,
        to: address,
        amount: 0,
        suggestedParams: suggestedParams,
        closeRemainderTo: address,
      })
    );
    //Atomic transfer:
    if (transactions.length > 1) {
      transactions = algosdk.assignGroupID(transactions);
    }
    return transactions;
  };

  const optOutApp = async (appId) => {
    const suggestedParams = await algod.client.getTransactionParams().do();
    const unsignedTxn = algosdk.makeApplicationClearStateTxnFromObject({
      appIndex: appId,
      from: address,
      suggestedParams: suggestedParams,
    });
    return [unsignedTxn];
  };

  React.useEffect(() => {
    const calculateReserved = () => {
      if (details) {
        let optedInAppsCost = 0;
        if (details["total-apps-opted-in"]) {
          optedInAppsCost = details["total-apps-opted-in"] * COSTS.OPT_IN;
        }

        let optedInAssetsCost = 0;
        if (details["total-assets-opted-in"]) {
          optedInAssetsCost = details["total-assets-opted-in"] * COSTS.OPT_IN;
        }

        let appsCreatedCost = 0;
        if (details["total-created-apps"]) {
          appsCreatedCost = details["total-created-apps"] * COSTS.OPT_IN;
        }

        let assetsCreatedCost = 0;
        if (details["total-created-assets"]) {
          assetsCreatedCost = details["total-created-assets"] * COSTS.OPT_IN;
        }

        let appsUintCost = 0;
        let appsByteSliceCost = 0;
        if (
          details["apps-total-schema"] &&
          (optedInAppsCost > 0 || appsCreatedCost > 0)
        ) {
          appsUintCost = details["apps-total-schema"]["num-uint"] * COSTS.UINT;
          appsByteSliceCost =
            details["apps-total-schema"]["num-byte-slice"] * COSTS.BYTE_SLICE;
        }

        let appsExtraPagesCost = 0;
        if (details["apps-total-extra-pages"]) {
          appsExtraPagesCost = details["apps-total-extra-pages"] * COSTS.OPT_IN;
        }

        setReservedAlgos(
          optedInAppsCost +
            optedInAssetsCost +
            appsCreatedCost +
            assetsCreatedCost +
            appsUintCost +
            appsByteSliceCost +
            appsExtraPagesCost
        );
      } else {
        setReservedAlgos(0);
      }
    };
    calculateReserved();
  }, [details]);

  React.useEffect(() => {
    window.localStorage.setItem(ADDRESS_KEY, address);
  }, [address]);

  const context = {
    details,
    address,
    reservedAlgos,
    setAddress,
    fetchAccount,
    optOutAsset,
    optOutApp,
    destroyAsset,
    destroyApp,
  };

  return (
    <AccountContext.Provider value={context}>
      {children}
    </AccountContext.Provider>
  );
};

export { AccountContext, AccountContextProvider };
