import * as React from "react";
import AssetDelegate from "../delegates/AssetDelegate";
import COSTS from "../../utils/costs";
import algosdk from "algosdk";
import ResourceList from "./ResourceList";
import CreatedAssetInfoPopup from "../popups/CreatedAssetInfoPopup";
import { AccountContext } from "../../contexts/AccountContext";

export default function AssetList(props) {
  const account = React.useContext(AccountContext);

  const populateAssetList = (openDialogHandler) => {
    let assets = [];
    if (account.details["created-assets"]) {
      for (
        let index = 0;
        index < account.details["created-assets"].length;
        index++
      ) {
        const created = account.details["created-assets"][index];
        let asset = null;
        if (account.details["assets"]) {
          for (
            let assetIndex = 0;
            assetIndex < account.details["assets"].length;
            assetIndex++
          ) {
            const ownedAsset = account.details["assets"][index];
            if (ownedAsset["asset-id"] === created["index"]) {
              asset = ownedAsset;
              break;
            }
          }
        }
        const cost = algosdk.microalgosToAlgos(COSTS.OPT_IN);
        const resource = { asset, cost, created };
        assets.push(
          <AssetDelegate
            key={asset["asset-id"]}
            primary={`id: ${asset["asset-id"]}`}
            secondary={`reserved: ${cost} Algos`}
            asset={asset}
            interactive={props.interactive}
            handleClick={() => openDialogHandler(resource)}
          />
        );
      }
    }
    return assets;
  };

  return (
    <ResourceList
      {...props}
      populate={populateAssetList}
      popup={CreatedAssetInfoPopup}
    />
  );
}
