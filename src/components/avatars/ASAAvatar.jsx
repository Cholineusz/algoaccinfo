import Avatar from "./Avatar";
import asa from "../../default-asa.png";

export default function ASAAvatar(props) {
  return (
    <Avatar
      sx={props.sx}
      name={props.name}
      avatar={`${process.env.REACT_APP_ASA_ICONS_HOST}/${props.assetId}/icon.png`}
      default={asa}
    ></Avatar>
  );
}
