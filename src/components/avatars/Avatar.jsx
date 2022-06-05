import { Avatar as Avt } from "@mui/material";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

export default function Avatar(props) {
  return (
    <Avt sx={props.sx} alt={props.name} src={props.avatar}>
      <QuestionMarkIcon color="primary" />
    </Avt>
  );
}
