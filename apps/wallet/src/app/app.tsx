import { Button } from '@multiverse-wallet/shared/components/button';
import { Spinner } from '@multiverse-wallet/shared/components/spinner';
import {
  ContextProvider,
  Login,
  SelectedAccount,
  TopBar,
} from '@multiverse-wallet/wallet/components';
import { AccountCreation } from '@multiverse-wallet/wallet/home/feature-account-creation';
import { ManageAccount } from '@multiverse-wallet/wallet/home/feature-manage-account';
import {
  useHasCompletedSetup,
  useIsInitialized,
  useIsLocked,
  useWalletState,
} from '@multiverse-wallet/wallet/hooks';
import { navigateExtension } from '@multiverse-wallet/wallet/utils';
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { Connect } from '@multiverse-wallet/wallet/popup/feature-connect';
import { SelectAction } from '@multiverse-wallet/wallet/popup/feature-select-action';
import { SendPayment } from '@multiverse-wallet/wallet/popup/feature-send-payment';
import { Transaction } from '@multiverse-wallet/wallet/popup/feature-transaction';

function LockExtension() {
  const { api } = useWalletState();
  const navigate = useNavigate();
  useEffect(() => {
    api.lock();
    navigate('/');
  }, []);
  return null;
}

const PrivateMessageBar = () => (
  <div className="relative bg-gradient-to-r from-gray-600 to-gray-700">
    <div className="max-w-screen-xl mx-auto py-3 px-8">
      <div className="text-center px-16">
        <p className="font-medium text-white text-xs flex flex-row items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            style={{ paddingBottom: '1px' }}
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
  const { hasCompletedSetup, isLoading } = useHasCompletedSetup();
  if (!isInitialized || isLoading) {
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
            <div
              className="flex justify-center text-sm"
              style={{ height: '600px' }}
            >
              <div style={{ width: '400px' }} className="flex flex-col">
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
  const { hasCompletedSetup, isLoading } = useHasCompletedSetup();
  if (!isInitialized || isLoading) {
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
      <Route path="/transaction/:transactionId" element={<Transaction />} />
      <Route path="/exchange" element={<>Exchange!</>} />
      <Route
        path="/*"
        element={
          <>
            {!hasCompletedSetup && (
              <div>
                <header className="pt-16 flex justify-center items-center">
                  <img src="/assets/logo.svg" width={200} height={200} />
                </header>
                <div className="px-8 pt-16 text-center pb-8 mt-6">
                  <div className="flex flex-col items-center justify-center h-32">
                    <h1
                      className="text-3xl font-extrabold"
                      data-cy="welcome-title"
                    >
                      Welcome to Multiverse
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
                        navigateExtension('/create');
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
