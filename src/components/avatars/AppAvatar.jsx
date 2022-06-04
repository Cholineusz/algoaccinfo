import Avatar from "./Avatar";
import asa from "../../default-asa.png";

export default function AppAvatar(props) {
  return (
    <Avatar
      sx={props.sx}
      name={props.owner}
      avatar={`${process.env.REACT_APP_APP_ICONS_HOST}/images/${props.owner}.png`}
      default={asa}
    ></Avatar>
  );
}
