import Avatar from "./Avatar";

export default function AppAvatar(props) {
  return (
    <Avatar
      sx={props.sx}
      name={props.owner}
      avatar={`${process.env.REACT_APP_APP_ICONS_HOST}/images/${props.owner}.png`}
    ></Avatar>
  );
}
