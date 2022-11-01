import React from "react";
import { PencilAltIcon, PlusIcon, TrashIcon } from "@heroicons/react/outline";
import { Network } from "@multiverse-wallet/multiverse";
import { Button } from "@multiverse-wallet/shared/components/button";
import { ModalDialog } from "@multiverse-wallet/shared/components/modal-dialog";
import { useWalletState } from "@multiverse-wallet/wallet/hooks";
import { OverlayContainer } from "@react-aria/overlays";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { AddNetworkModal } from "./add-network.modal";
import { EditNetworkModal } from "./edit-network.modal";

export interface NetworksProps {
  networks: Network[];
}

interface NetworkTableRowWithModalProps {
  network: Network;
}

function NetworkTableRowWithModal({ network }: NetworkTableRowWithModalProps) {
  const editNetworkOverlayState = useOverlayTriggerState({});
  const { api } = useWalletState();
  return (
    <tr>
      <td>
        <PencilAltIcon
          onClick={() => editNetworkOverlayState.open()}
          className="mx-5 w-5 h-5 text-teal-600 inline cursor-pointer"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 font-medium text-gray-900 truncate">
        {network.name}
      </td>
      <td className="px-6 py-4 text-sm leading-5 text-gray-500">
        {network.server}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm leading-5 font-medium">
        <TrashIcon
          onClick={() => api.deleteNetwork(network.id)}
          className="mx-5 w-5 h-5 text-teal-600 inline cursor-pointer"
        />
      </td>
      {editNetworkOverlayState.isOpen && (
        <OverlayContainer>
          <ModalDialog
            isOpen
            onClose={editNetworkOverlayState.close}
            isDismissable
            render={(titleProps) => (
              <EditNetworkModal
                network={network}
                titleProps={titleProps}
                closeModal={editNetworkOverlayState.close}
              />
            )}
          />
        </OverlayContainer>
      )}
    </tr>
  );
}

export function Networks({ networks }: NetworksProps) {
  const addNetworkOverlayState = useOverlayTriggerState({});

  return (
    <div >
      <header className="mt-4 mb-12">
        <div className="mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
            Networks
          </h1>

          <p className="mt-4 mx-auto text-lg leading-6 text-gray-500">
            Manage your networks.
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
            onPress={() => addNetworkOverlayState.open()}
          >
            <>
              <PlusIcon className="w-5 h-5 mr-1" />
              Add Network
            </>
          </Button>
        </div>
      </div>

      {addNetworkOverlayState.isOpen && (
        <OverlayContainer>
          <ModalDialog
            isOpen
            onClose={addNetworkOverlayState.close}
            isDismissable
            render={(titleProps) => (
              <AddNetworkModal
                titleProps={titleProps}
                closeModal={addNetworkOverlayState.close}
              />
            )}
          />
        </OverlayContainer>
      )}

      <div className="flex flex-col">
        <div>
          <div>
            <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
              {networks?.length < 1 && (
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

              {networks?.length > 0 && (
                <table className="table w-full min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="w-10 px-6 py-3 bg-gray-50" />
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Server
                      </th>
                      <th className="w-10 px-6 py-3 bg-gray-50" />
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {networks.map((network, i) => {
                      return <NetworkTableRowWithModal network={network} />
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
