import * as React from "react";
import { Box, Grid, Stack, Divider } from "@mui/material";
import OptedInAppList from "./lists/OptedInAppList";
import OptedInAssetList from "./lists/OptedInAssetList";
import CreatedAssetList from "./lists/CreatedAssetList";
import CreatedAppList from "./lists/CreatedAppList";
import { AccountContext } from "../contexts/AccountContext";
import BalanceForm from "./forms/BalanceForm";

export default function Details(props) {
  const account = React.useContext(AccountContext);

  const balanceForm = () => {
    let available = 0;
    if (account.details.amount > account.reservedAlgos > 0) {
      available = account.details.amount - account.reservedAlgos;
    }
    return <BalanceForm
      title={ account.details.governance_ ? "(without governance)" : "" }
      balanceTitle="Balance"
      balance={account.details.amount}
      available={available}
      reserved={account.reservedAlgos}
    />
  }

  const governanceForm = () => {
    const govCommitment = account.details.governance_.committed_algo_amount;
    let available = 0;
    if (account.details.amount > account.reservedAlgos > 0) {
      available = account.details.amount - account.reservedAlgos - govCommitment;
    }
    return <BalanceForm
      title={ account.details.governance_ ? "(with governance)" : "" }
      balanceTitle={account.details.governance_.period.title}
      balance={govCommitment}
      available={available}
      reserved={account.reservedAlgos + govCommitment}
    />
  }

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
          <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
            { balanceForm() }
            { account.details.governance_ && governanceForm() }
          </Stack>
          <Divider sx={{marginBottom: 0}} flexItem></Divider>
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
