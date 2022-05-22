import * as React from "react";
import { Alert, Box } from "@mui/material";

export default function ErrorAlert(props) {
  React.useEffect(() => {
    if (props.timed) {
      setTimeout(() => {
        props.onClearMessage();
      }, 5000);
    }
  }, [props.message]);

  return (
    <Box sx={{ justifyContent: "center", display: "flex", marginTop: 2 }}>
      <Alert severity={props.variant || "error"}>{props.message}</Alert>
    </Box>
  );
}
