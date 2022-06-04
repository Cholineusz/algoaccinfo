import { Avatar } from "@mui/material";
import asa from "../default-asa.png";

export default function ASAAvatar(props) {
  return (
    <Avatar
      sx={props.sx}
      alt={props.name}
      src={`${process.env.REACT_APP_ASA_ICONS_HOST}/${props.assetId}/icon.png`}
    >
      <img src={asa} alt="default-asa"></img>
    </Avatar>
  );
}
