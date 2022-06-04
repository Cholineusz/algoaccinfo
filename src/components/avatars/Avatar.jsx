import { Avatar as Avt } from "@mui/material";

export default function Avatar(props) {
  return (
    <Avt sx={props.sx} alt={props.name} src={props.avatar}>
      <img src={props.default} alt="default"></img>
    </Avt>
  );
}
