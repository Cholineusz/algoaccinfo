import * as React from "react";
import algosdk from "algosdk";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function BalanceForm(props) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        marginBottom: 2,
      }}
    >
      <Typography variant="balance" sx={{ marginTop: 3 }}>
        {`${props.balanceTitle}: ${algosdk.microalgosToAlgos(
          props.balance
        )} Algos`}
      </Typography>
      {props.title && (
        <Typography variant="warning" sx={{ marginTop: 3 }}>
          {props.title}
        </Typography>
      )}
      <Typography variant="available" sx={{ marginTop: 3 }}>
        {`Available: ${algosdk.microalgosToAlgos(props.available)} Algos`}
      </Typography>
      <Typography variant="reserved" sx={{ marginTop: 3 }}>
        {`Reserved: ${algosdk.microalgosToAlgos(props.reserved)} Algos`}
      </Typography>
    </Box>
  );
}
