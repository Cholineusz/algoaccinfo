import Avatar from "./Avatar";

export default function ASAAvatar(props) {
  return (
    <Avatar
      sx={props.sx}
      name={props.name}
      avatar={`${process.env.REACT_APP_ASA_ICONS_HOST}/${props.assetId}/icon.png`}
    ></Avatar>
  );
}
