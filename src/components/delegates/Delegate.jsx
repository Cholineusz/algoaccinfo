import * as React from "react";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";

export default function Delegate(props) {
  return (
    <ListItem>
      <ListItemButton
        sx={{
          backgroundColor: "black",
          color: "white",
          borderRadius: 1,
          cursor: props.interactive ? "pointer" : "not-allowed",
          "& p": { color: "white" },
          "&:hover": { backgroundColor: "gray" },
        }}
        onClick={props.handleClick}
      >
        <ListItemText
          primary={`id: ${props.primary}`}
          secondary={`reserved: ${props.secondary} Algos`}
        />
      </ListItemButton>
    </ListItem>
  );
}
