import * as React from "react";
import AssetDelegate from "../delegates/AssetDelegate";
import COSTS from "../../utils/costs";
import algosdk from "algosdk";
import ResourceList from "./ResourceList";
import OptedInAssetInfoPopup from "../popups/OptedInAssetInfoPopup";
import { AccountContext } from "../../contexts/AccountContext";

export default function AssetList(props) {
  const account = React.useContext(AccountContext);

  const populateAssetList = (openDialogHandler) => {
    let assets = [];
    if (account.details["assets"]) {
      for (
        let index = 0;
        index < account.details["assets"].length;
        index++
      ) {
        const asset = account.details["assets"][index];
        const cost = algosdk.microalgosToAlgos(COSTS.OPT_IN);
        const resource = { asset, cost };
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
      popup={OptedInAssetInfoPopup}
    />
  );
}
