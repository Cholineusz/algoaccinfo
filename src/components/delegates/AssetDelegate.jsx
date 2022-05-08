import * as React from "react";
import Delegate from "./Delegate";
import { IndexerContext } from "../../contexts/IndexerContext";

export default function AssetDelegate(props) {
  const indexer = React.useContext(IndexerContext);

  const [name, setName] = React.useState(props.primary);

  React.useEffect(() => {
    indexer.client
      .lookupAssetByID(props.asset["asset-id"])
      .do()
      .then((assetInfo) => setName(assetInfo.asset.params.name));
  }, []);
  return <Delegate {...props} primary={name} />;
}
