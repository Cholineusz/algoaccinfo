import * as React from "react";
import AppDelegate from "../delegates/AppDelegate";
import ResourceList from "./ResourceList";
import algosdk from "algosdk";
import COSTS from "../../utils/costs";
import CreatedAppInfoPopup from "../popups/CreatedAppInfoPopup";
import { AccountContext } from "../../contexts/AccountContext";

export default function CreatedAppList(props) {
  const account = React.useContext(AccountContext);

  const populateAppList = (openDialogHandler) => {
    let apps = [];
    if (account.details["created-apps"]) {
      for (
        let index = 0;
        index < account.details["created-apps"].length;
        index++
      ) {
        const app = account.details["created-apps"][index];
        const extraProgramPages = app.params["extra-program-pages"];
        const globalStateSchema = app.params["global-state-schema"];
        let uints = 0;
        let byteSlices = 0;
        if (globalStateSchema) {
          uints = globalStateSchema["num-uint"];
          byteSlices = globalStateSchema["num-byte-slice"];
        }
        const cost = algosdk.microalgosToAlgos(
          COSTS.estimateCreatedAppCost(
            extraProgramPages ? extraProgramPages : 0,
            uints,
            byteSlices
          )
        );
        const resource = {app, cost}
        apps.push(
          <AppDelegate
            key={app.id}
            primary={`id: ${app.id}`}
            secondary={`reserved: ${cost} Algos`}
            app={app}
            interactive={props.interactive}
            handleClick={() => openDialogHandler(resource)}
          />
        );
      }
      return apps;
    }
  };
  return (
    <ResourceList
      {...props}
      populate={populateAppList}
      popup={CreatedAppInfoPopup}
    ></ResourceList>
  );
}
