import {
  Login,
  ContextProvider,
  TopBar,
  SelectedAccount,
} from "@multiverse-wallet/wallet/components";
import { AccountCreation } from "@multiverse-wallet/wallet/home/feature-account-creation";
import { ManageAccount } from "@multiverse-wallet/wallet/home/feature-manage-account";
import {
  useHasCompletedSetup,
  useIsInitialized,
  useIsLocked,
  useWalletState,
} from "@multiverse-wallet/wallet/hooks";
import { Spinner } from "@multiverse-wallet/shared/components/spinner";
import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Button } from "@multiverse-wallet/shared/components/button";
import { navigateExtension } from "@multiverse-wallet/wallet/utils";
import { SelectAction } from "libs/wallet/popup/feature-select-action/src";
import { Connect } from "libs/wallet/popup/feature-connect/src";
import { SendPayment } from "@multiverse-wallet/wallet/popup/feature-send-payment";

function LockExtension() {
  const { api } = useWalletState();
  const navigate = useNavigate();
  useEffect(() => {
    api.lock();
    navigate("/");
  }, []);
  return null;
}

const PrivateMessageBar = () => (
  <div className="relative bg-gradient-to-r from-orange-400 to-purple-500">
    <div className="max-w-screen-xl mx-auto py-3 px-8">
      <div className="text-center px-16">
        <p className="font-medium text-white text-xs flex flex-row items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            style={{ paddingBottom: "1px" }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="inline ml-3">
            Everything below is running privately within your browser, no data
            is fetched from or stored on remote servers.
          </span>
        </p>
      </div>
    </div>
  </div>
);

export default function App() {
  const isLocked = useIsLocked();
  const isInitialized = useIsInitialized();
  const hasCompletedSetup = useHasCompletedSetup();
  if (!isInitialized) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Spinner size="large" variant="dark" />
      </div>
    );
  }
  return (
    <ContextProvider>
      <Routes>
        <Route path="/lock" element={<LockExtension />} />
        <Route path="/create/*" element={<AccountCreation />} />
        <Route
          path="/popup/*"
          element={
            <div className="flex justify-center" style={{ height: "600px" }}>
              <div
                style={{ width: "400px" }}
                className="shadow flex flex-col overflow-y-scroll"
              >
                <Popup />
              </div>
            </div>
          }
        />
        <Route
          path="/*"
          element={
            <>
              {!hasCompletedSetup && (
                <>
                  <PrivateMessageBar />
                  <AccountCreation />
                </>
              )}
              {hasCompletedSetup && isLocked && (
                <>
                  <PrivateMessageBar />
                  <div className="fixed top-0 h-screen w-screen">
                    <Login hasPrivateMessageBar={true} />
                  </div>
                </>
              )}
              {!isLocked && hasCompletedSetup && (
                <>
                  <PrivateMessageBar />
                  <ManageAccount />
                </>
              )}
            </>
          }
        />
      </Routes>
    </ContextProvider>
  );
}

function Popup() {
  const isLocked = useIsLocked();
  const isInitialized = useIsInitialized();
  const hasCompletedSetup = useHasCompletedSetup();
  if (!isInitialized) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Spinner size="large" variant="dark" />
      </div>
    );
  }
  if (hasCompletedSetup && isLocked) {
    return (
      <>
        <Login hasPrivateMessageBar={false} />
      </>
    );
  }
  return (
    <Routes>
      <Route path="/connect" element={<Connect />} />
      <Route path="/send-payment" element={<SendPayment />} />
      <Route path="/exchange" element={<>Exchange!</>} />
      <Route
        path="/*"
        element={
          <>
            {!hasCompletedSetup && (
              <div>
                <header className="pt-16 flex justify-center items-center">
                  {/* DA Logo SVG */}
                  <svg
                    className="h-10 w-auto fill-current text-gray-800"
                    viewBox="0 0 169.33 107.16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g strokeWidth=".265">
                      <path
                        d="M97.209 16.798L106.36.968l60.935 105.542-83.113-.158s42.093-35.357 13.025-89.557zM.858.943v105.414l35.973-.052s51.153-.44 51.153-52.437C87.984.404 34.424.81 34.424.81z"
                        strokeWidth=".1897082"
                      />
                    </g>
                  </svg>
                </header>
                <div className="px-8 pt-16 text-center pb-8 mt-6">
                  <div className="flex flex-col items-center justify-center h-32">
                    <h1
                      className="text-3xl font-extrabold"
                      data-cy="welcome-title"
                    >
                      Welcome to the DA Browser Extension
                    </h1>
                    <p className="mt-6 text-gray-600 text-base mb-12">
                      Everything you do here is running privately on your
                      computer, nothing is ever sent to our servers.
                    </p>

                    <Button
                      type="button"
                      size="medium"
                      variant="primary"
                      onPress={() => {
                        navigateExtension("/create");
                      }}
                    >
                      Create or Import Account
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {hasCompletedSetup && isLocked && (
              <>
                <Login hasPrivateMessageBar={false} />
              </>
            )}
            {!isLocked && (
              <>
                <TopBar />
                <SelectedAccount />
                <SelectAction />
              </>
            )}
          </>
        }
      />
    </Routes>
  );
}
