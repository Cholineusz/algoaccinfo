import * as React from "react";
import logo from "./algorand_logo.svg";
import "./App.css";
import AccountForm from "./components/AccountForm";
import AccountDetails from "./components/AccountDetails";
import { Container, Box, Typography } from "@mui/material";
import { WalletContextProvider } from "./contexts/WalletContext";
import { IndexerContextProvider } from "./contexts/IndexerContext";
import { AccountContextProvider } from "./contexts/AccountContext";
import { AlgodContextProvider } from "./contexts/AlgodContext";
import { NetworkContextProvider } from "./contexts/NetworkContext";
import Theme from "./theme/theme";
import Message from "./components/alerts/Message";

function App() {
  const [message, setMessage] = React.useState("");
  const [variant, setVariant] = React.useState("error");

  const showMessage = (text, variant = "error") => {
    clearMessage();

    setVariant(variant);
    setMessage(text);
  };

  const clearMessage = () => {
    setMessage("");
  };

  return (
    <NetworkContextProvider>
      <AlgodContextProvider>
        <IndexerContextProvider>
          <AccountContextProvider>
            <WalletContextProvider>
              <Theme>
                <Container className="App">
                  <Box className="box-container">
                    <img src={logo} className="logo" alt="logo"></img>
                    <AccountForm
                      onShowMessage={showMessage}
                      onClearMessage={clearMessage}
                    ></AccountForm>
                    {message && (
                      <Message
                        message={message}
                        variant={variant}
                        timed={true}
                        onClearMessage={clearMessage}
                      ></Message>
                    )}
                    <AccountDetails
                      onShowMessage={showMessage}
                    ></AccountDetails>
                  </Box>
                  <Box className="box-version">
                    <Typography variant="version">{`v${process.env.REACT_APP_VERSION}`}</Typography>
                  </Box>
                </Container>
              </Theme>
            </WalletContextProvider>
          </AccountContextProvider>
        </IndexerContextProvider>
      </AlgodContextProvider>
    </NetworkContextProvider>
  );
}

export default App;
