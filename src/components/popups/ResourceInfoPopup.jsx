import * as React from "react";
import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { WalletContext } from "../../contexts/WalletContext";
import Message from "../alerts/Message";
import ASAAvatar from "../avatars/ASAAvatar";
import AppAvatar from "../avatars/AppAvatar";

export default function ResourceInfoPopup(props) {
  const wallet = React.useContext(WalletContext);

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        scroll="body"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            {props.asset && (
              <ASAAvatar
                sx={{ alignSelf: "center" }}
                name={props.primary}
                assetId={props.asset["asset-id"]}
              ></ASAAvatar>
            )}
            {props.app && (
              <AppAvatar
                sx={{ alignSelf: "center" }}
                owner={props.app.name.toLowerCase()}
              ></AppAvatar>
            )}
            {props.content}
            {props.message && (
              <Message
                message={props.message}
                timed={props.timed}
                variant="error"
                onClearMessage={props.onClearMessage}
              ></Message>
            )}
            {wallet.connected && (
              <LoadingButton
                onClick={props.handleAction}
                loading={props.loading}
                disabled={props.disabled}
                autoFocus
                variant="contained"
                color="success"
              >
                {props.actionLabel}
              </LoadingButton>
            )}
            {!wallet.connected && (
              <Button
                onClick={() => wallet.connect(false)}
                autoFocus
                variant="contained"
                color="success"
              >
                {`Connect to ${props.actionLabel}`}
              </Button>
            )}
            {wallet.connected && (
              <Button
                onClick={wallet.disconnect}
                autoFocus
                variant="contained"
                color="error"
              >
                Disconnect
              </Button>
            )}
            <Button variant="contained" onClick={props.handleClose}>
              Close
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
}
