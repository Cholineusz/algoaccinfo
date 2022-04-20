import * as React from "react";
import Delegate from "../delegates/Delegate";
import ResourceList from "./ResourceList";
import COSTS from "../../utils/costs";
import algosdk from "algosdk";
import AppInfoPopup from "../popups/AppInfoPopup";
import { AccountContext } from "../../contexts/AccountContext";

export default function OptedInAppList(props) {
  const account = React.useContext(AccountContext);

  const populateAppList = (openDialogHandler) => {
    let apps = [];
    if (account.details["apps-local-state"]) {
      for (
        let index = 0;
        index < account.details["apps-local-state"].length;
        index++
      ) {
        const app = account.details["apps-local-state"][index];
        const cost = algosdk.microalgosToAlgos(
          COSTS.estimateOptInAppCost(
            app.schema["num-uint"],
            app.schema["num-byte-slice"]
          )
        );
        const resource = { app, cost };
        apps.push(
          <Delegate
            key={app.id}
            primary={app.id}
            secondary={cost}
            interactive={props.interactive}
            handleClick={() => openDialogHandler(resource)}
          />
        );
      }
    }
    return apps;
  };
  return (
    <ResourceList
      {...props}
      title="Opted-in apps"
      populate={populateAppList}
      popup={AppInfoPopup}
    />
  );
}
