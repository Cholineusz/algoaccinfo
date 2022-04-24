import * as React from "react";
import algosdk from "algosdk";
import { Box, Grid } from "@mui/material";
import OptedInAppList from "./lists/OptedInAppList";
import OptedInAssetList from "./lists/OptedInAssetList";
import CreatedAssetList from "./lists/CreatedAssetList";
import CreatedAppList from "./lists/CreatedAppList";
import { AccountContext } from "../contexts/AccountContext";
import Typography from "@mui/material/Typography";

export default function Details(props) {
  const account = React.useContext(AccountContext);

  return (
    <>
      {account.details && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="balance" sx={{ marginTop: 3 }}>
            Balance:{" "}
            {`${algosdk.microalgosToAlgos(account.details.amount)} Algos`}
          </Typography>
          <Typography variant="available" sx={{ marginTop: 3 }}>
            Available:{" "}
            {`${
              account.details.amount > account.reservedAlgos > 0 &&
              algosdk.microalgosToAlgos(
                account.details.amount - account.reservedAlgos
              )
            } Algos`}
          </Typography>
          <Typography variant="reserved" sx={{ marginTop: 3 }}>
            Reserved:{" "}
            {`${algosdk.microalgosToAlgos(account.reservedAlgos)} Algos`}
          </Typography>
          <Grid container spacing={1} sx={{ justifyContent: "center" }}>
            <Grid item xs={5} md={3}>
              <CreatedAppList
                title="Created apps"
                interactive={true}
                onShowMessage={props.onShowMessage}
              />
            </Grid>
            <Grid item xs={5} md={3}>
              <OptedInAppList
                title="Opted-in apps"
                interactive={true}
                onShowMessage={props.onShowMessage}
              />
            </Grid>
            <Grid item xs={5} md={3}>
              <CreatedAssetList
                title="Created assets"
                interactive={true}
                onShowMessage={props.onShowMessage}
              />
            </Grid>
            <Grid item xs={5} md={3}>
              <OptedInAssetList
                title="Opted-in assets"
                interactive={true}
                onShowMessage={props.onShowMessage}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}
