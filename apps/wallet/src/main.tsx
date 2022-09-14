import { WalletStateProvider } from "@multiverse-wallet/wallet/hooks";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./app/app";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StrictMode>
    <HashRouter>
        <WalletStateProvider>
          <App />
        </WalletStateProvider>
    </HashRouter>
  </StrictMode>
);
