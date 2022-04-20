import * as React from "react";
import { List, Stack } from "@mui/material";

export default function ResourceList(props) {
  const [open, setOpen] = React.useState(false);
  const [resource, setResource] = React.useState(null);

  const openDialog = (resource) => {
    setResource(resource);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    if (!open && resource) {
      setResource(null);
    }
  }, [open]);

  const popup = () => {
    let Popup = props.popup;
    return (
      resource && (
        <Popup
          {...resource}
          open={open}
          handleClose={closeDialog}
          onShowMessage={props.onShowMessage}
        />
      )
    );
  };

  return (
    <>
      <Stack sx={{ alignItems: "center" }}>
        <h4>{props.title}</h4>
        <List dense>{props.populate(openDialog)}</List>
      </Stack>
      {popup()}
    </>
  );
}
