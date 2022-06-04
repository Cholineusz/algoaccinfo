import * as React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  IconButton,
} from "@mui/material";
import ASAAvatar from "../avatars/ASAAvatar";
import AppAvatar from "../avatars/AppAvatar";

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
        <ListItemAvatar>
          {props.asset && (
            <ASAAvatar
              name={props.primary}
              assetId={props.asset["asset-id"]}
            ></ASAAvatar>
          )}
          {props.app && <AppAvatar owner={props.owner}></AppAvatar>}
        </ListItemAvatar>
        <ListItemText primary={props.primary} secondary={props.secondary} />
      </ListItemButton>
    </ListItem>
  );
}
