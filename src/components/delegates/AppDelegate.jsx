import * as React from "react";
import axios from "axios";
import Delegate from "./Delegate";

export default function AppDelegate(props) {
  const [name, setName] = React.useState(props.primary);

  React.useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_ALGO_RES_INFO_HOST}/applications/?id=${props.app.id}`
      )
      .then((appInfo) => {
        if (appInfo.data && appInfo.data.length > 0) {
          setName(`${appInfo.data[0].name} - ${appInfo.data[0].description}`);
        }
      });
  }, []);
  return <Delegate {...props} primary={name} />;
}
