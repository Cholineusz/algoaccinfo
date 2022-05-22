import * as React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";

export default function Delegate(props) {
  return (
    <ListItem
      sx={{
        backgroundColor: "black",
        color: "white",
        borderRadius: 1,
        cursor: props.interactive ? "pointer" : "not-allowed",
        margin: 1,
        padding: 0,
      }}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          color="error"
          onClick={props.handleClick}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemButton
        sx={{
          "& p": { color: "white" },
          "&:hover": { backgroundColor: "gray" },
        }}
        onClick={props.handleClick}
      >
        <ListItemText primary={props.primary} secondary={props.secondary} />
      </ListItemButton>
    </ListItem>
  );
}
