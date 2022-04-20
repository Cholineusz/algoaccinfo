import * as React from "react";
import algosdk from "algosdk";
import { Box, Grid } from "@mui/material";
import OptedInAppList from "./lists/OptedInAppList";
import AssetList from "./lists/AssetList";
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
              <CreatedAppList />
            </Grid>
            <Grid item xs={5} md={3}>
              <OptedInAppList
                interactive={true}
                onShowMessage={props.onShowMessage}
              />
            </Grid>
            <Grid item xs={5} md={3}>
              <AssetList assetKey="created-assets" title="Created assets" />
            </Grid>
            <Grid item xs={5} md={3}>
              <AssetList
                assetKey="assets"
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
