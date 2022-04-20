import * as React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PowerOutlinedIcon from "@mui/icons-material/PowerOutlined";
import PowerOffOutlinedIcon from "@mui/icons-material/PowerOffOutlined";
import {
  CircularProgress,
  Stack,
  IconButton,
  TextField,
  Tooltip,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from "@mui/material";
import "./AccountForm.css";
import algosdk from "algosdk";
import { AccountContext } from "../contexts/AccountContext";
import { WalletContext } from "../contexts/WalletContext";
import { NetworkContext } from "../contexts/NetworkContext";
import { IndexerContext } from "../contexts/IndexerContext";
import usePrevious from "../utils/utils";

export default function Form(props) {
  const indexer = React.useContext(IndexerContext);
  const network = React.useContext(NetworkContext);
  const account = React.useContext(AccountContext);
  const wallet = React.useContext(WalletContext);

  const [loading, setLoading] = React.useState(false);
  const [addressValid, setAddressValid] = React.useState(false);

  const prevIndexerNetwork = usePrevious(indexer.currentNetwork);

  let input = React.useRef();

  const showMessage = (text, variant = "error") => {
    props.onShowMessage(text, variant);
  };

  const checkAddress = (address) => {
    const isValidAddress = algosdk.isValidAddress(address);
    setAddressValid(isValidAddress);
    return isValidAddress;
  };

  const handleAddressChange = (event) => {
    const text = event.target.value;
    const isValidAddress = checkAddress(text);

    if (isValidAddress) {
      account.setAddress(text);
    } else {
      account.setAddress("");
    }
  };

  const fetchAccount = () => {
    setLoading(true);
    props.onClearMessage();
    account
      .fetchAccount()
      .then(() => {
        setLoading(false);
        setAddressValid(true);
      })
      .catch((error) => {
        console.log("ERROR", error);
        setLoading(false);
        showMessage("Something went wrong, please try again");
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchAccount();
  };

  const handleClick = async () => {
    if (wallet.connected) {
      wallet.disconnect();
    } else {
      wallet.connect();
    }
  };

  const handleNetworkChange = (event) => {
    network.setValue(event.target.value);
  };

  React.useEffect(() => {
    if (
      wallet.connected &&
      !account.address &&
      wallet.connector.accounts.length
    ) {
      handleAddressChange({ target: { value: wallet.connector.accounts[0] } });
    }
  }, [wallet.connected]);

  React.useEffect(() => {
    if (!input.value && account.address) {
      input.value = account.address;
      setAddressValid(true);
    }
  }, [account.address]);

  React.useEffect(() => {
    if (
      prevIndexerNetwork !== undefined &&
      prevIndexerNetwork != indexer.currentNetwork &&
      input.value &&
      account.address
    ) {
      fetchAccount();
    }
  }, [indexer.currentNetwork]);

  return (
    <form onSubmit={handleSubmit}>
      <Stack sx={{ justifyContent: "center" }} direction="row" spacing={1}>
        <Tooltip
          title={wallet.connected ? "Click to disconnect" : "Click to connect"}
        >
          <IconButton
            size="large"
            className="icon-button"
            onClick={handleClick}
          >
            {!wallet.connected && <PowerOutlinedIcon className="icon" />}
            {wallet.connected && <PowerOffOutlinedIcon className="icon" />}
          </IconButton>
        </Tooltip>
        <FormControl sx={{ minWidth: 100 }}>
          <InputLabel id="network-label">Network</InputLabel>
          <Select
            labelId="network-label"
            label="Network"
            value={network.value}
            onChange={handleNetworkChange}
          >
            <MenuItem value={0}>MainNet</MenuItem>
            <MenuItem value={1}>TestNet</MenuItem>
          </Select>
        </FormControl>
        <TextField
          InputLabelProps={{ shrink: true }}
          inputRef={(ref) => (input = ref)}
          label="Address"
          variant="outlined"
          className="address-input"
          onChange={handleAddressChange}
        />
        <Tooltip title="Click to search">
          <span>
            <IconButton
              type="submit"
              size="large"
              disabled={!addressValid}
              className="icon-button"
            >
              {!loading && <SearchOutlinedIcon className="icon" />}
              {loading && (
                <CircularProgress size={30} sx={{ color: "white" }} />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </form>
  );
}
