import { useWalletState } from "@multiverse-wallet/wallet/hooks";
import { Button } from "@multiverse-wallet/shared/components/button";
import { ModalDialog } from "@multiverse-wallet/shared/components/modal-dialog";
import { OverlayContainer } from "@react-aria/overlays";
import { useOverlayTriggerState } from "@react-stately/overlays";
import React from "react";
import { CopyValue } from "@multiverse-wallet/shared/components/copy-value";
import { CreateAccountModal } from "./create-account.modal";
import { ImportAccountModal } from "./import-account.modal";
import { RenameAccountModal } from "./rename-account.modal";
import { AccountBalance } from "@xrpl-components/react/components/account-balance";
import {
  CheckIcon,
  ClipboardCopyIcon,
  PencilAltIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { Account } from "@multiverse-wallet/multiverse";

interface AccountTableRowWithModalProps {
  account: Account;
}

function AccountTableRowWithModal({ account }: AccountTableRowWithModalProps) {
  const renameAccountOverlayState = useOverlayTriggerState({});
  const { api } = useWalletState();
  return (
    <tr>
      <td>
        <PencilAltIcon
          onClick={() => renameAccountOverlayState.open()}
          className="mx-5 w-5 h-5 text-teal-600 inline cursor-pointer"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 font-medium text-gray-900 truncate">
        {account.name}
      </td>
      <td className="px-6 py-4 text-sm leading-5 text-gray-500">
        {account.address}
        <CopyValue
          valueToCopy={account.address}
          render={(copyState, onCopyClicked) => {
            if (copyState === "copied") {
              return (
                <div className="float-right inline cursor-pointer ml-2 text-xs text-teal-500">
                  <CheckIcon className="w-5 h-5 inline mr-0.5 -mt-1" />
                  Copied
                </div>
              );
            }
            return (
              <div
                onClick={onCopyClicked}
                className="float-right inline cursor-pointer ml-2 text-xs text-teal-500"
              >
                <ClipboardCopyIcon className="inline w-5 h-5 mr-0.5 -mt-1" />
                Copy to clipboard
              </div>
            );
          }}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 text-gray-500 font-mono truncate">
        <AccountBalance account={account.address}>
          {({ isLoading, value, currency, error }) => {
            if (isLoading) {
              return <>Loading...</>;
            }
            return (
              <>
                <AccountBalance.Value>{value}</AccountBalance.Value>
                <AccountBalance.Currency>{currency}</AccountBalance.Currency>
              </>
            );
          }}
        </AccountBalance>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm leading-5 font-medium">
        <TrashIcon
          onClick={() => api.deleteAccount(account.id)}
          className="mx-5 w-5 h-5 text-teal-600 inline cursor-pointer"
        />
      </td>

      {renameAccountOverlayState.isOpen && (
        <OverlayContainer>
          <ModalDialog
            isOpen
            onClose={renameAccountOverlayState.close}
            isDismissable
            render={(titleProps) => (
              <RenameAccountModal
                account={account}
                titleProps={titleProps}
                closeModal={renameAccountOverlayState.close}
              />
            )}
          />
        </OverlayContainer>
      )}
    </tr>
  );
}

interface ManageAccountsProps {
  accounts: Account[];
}

export function ManageAccounts({ accounts }: ManageAccountsProps) {
  const createAccountOverlayState = useOverlayTriggerState({});
  const importAccountOverlayState = useOverlayTriggerState({});

  return (
    <div >
      <header className="mt-4 mb-12">
        <div className="mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
            Accounts
          </h1>

          <p className="mt-4 mx-auto text-lg leading-6 text-gray-500">
            Manage your accounts on the XRPL.
          </p>
        </div>
      </header>

      <div className="mb-12">
        <div className="flex space-x-3">
          {/*
          Because we use useButton() within our shared Button component, focus management is handled correctly across all
          browsers. Focus is restored to the button once the dialog closes.
        */}
          <Button
            variant="dark"
            size="small"
            onPress={() => createAccountOverlayState.open()}
          >
            <>
              <svg
                className="w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Create Account
            </>
          </Button>

          <Button
            variant="secondary"
            size="small"
            onPress={() => importAccountOverlayState.open()}
          >
            Import Account
          </Button>
        </div>
      </div>

      {createAccountOverlayState.isOpen && (
        <OverlayContainer>
          <ModalDialog
            isOpen
            onClose={createAccountOverlayState.close}
            isDismissable
            render={(titleProps) => (
              <CreateAccountModal
                titleProps={titleProps}
                closeModal={createAccountOverlayState.close}
              />
            )}
          />
        </OverlayContainer>
      )}

      {importAccountOverlayState.isOpen && (
        <OverlayContainer>
          <ModalDialog
            isOpen
            onClose={importAccountOverlayState.close}
            isDismissable
            render={(titleProps) => (
              <ImportAccountModal
                titleProps={titleProps}
                closeModal={importAccountOverlayState.close}
              />
            )}
          />
        </OverlayContainer>
      )}

      <div className="flex flex-col">
        <div>
          <div>
            <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
              {accounts?.length < 1 && (
                <div className="bg-white divide-y divide-gray-200 h-96">
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg
                      className="h-20 w-20 text-gray-200"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>

                    <p className="mt-4 text-gray-300">
                      You don't have any existing Accounts stored.
                    </p>
                  </div>
                </div>
              )}

              {accounts?.length > 0 && (
                <table className="table w-full min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="w-10 px-6 py-3 bg-gray-50" />
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="w-10 px-6 py-3 bg-gray-50" />
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {accounts.map((account, i) => {
                      return (
                        <AccountTableRowWithModal key={i} account={account} />
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
