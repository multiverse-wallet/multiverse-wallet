import { PencilAltIcon, PlusIcon, TrashIcon } from '@heroicons/react/outline';
import { LinkIcon } from '@heroicons/react/solid';
import { Site, SiteConnectionRequest } from '@multiverse-wallet/multiverse';
import { Button } from '@multiverse-wallet/shared/components/button';
import { ModalDialog } from '@multiverse-wallet/shared/components/modal-dialog';
import { useAccounts, useWalletState } from '@multiverse-wallet/wallet/hooks';
import { OverlayContainer } from '@react-aria/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';
import React, { useEffect, useMemo, useState } from 'react';
import { ApproveSiteModal } from './approve-site-modal';

export interface SitesProps {
  sites: Site[];
  connectionRequests: SiteConnectionRequest[];
}

interface SiteTableRowWithModalProps {
  site: Site;
}

function SiteTableRowWithModal({ site }: SiteTableRowWithModalProps) {
  const { api } = useWalletState();
  const accounts = useAccounts();
  const allowedAccounts = useMemo(() => {
    if (!site.allowedAccounts) {
      return <>-</>;
    }
    return site.allowedAccounts
      .map((accId) => {
        return accounts?.find((a) => a.id === accId);
      })
      .filter(Boolean)
      .map((acc) => acc?.name)
      .join(', ');
  }, [site, accounts]);
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 font-medium text-gray-900 truncate">
        {site.origin}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 font-medium text-gray-900 truncate">
        {allowedAccounts}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm leading-5 font-medium">
        <TrashIcon
          onClick={() => api.deleteSite({ origin: site.origin })}
          className="mx-5 w-5 h-5 text-teal-600 inline cursor-pointer"
        />
      </td>
    </tr>
  );
}

export function SiteConnectionRequestWithModal({ request }: any) {
  const { api } = useWalletState();
  const siteConnectionOverlayState = useOverlayTriggerState({});
  return (
    <div className="flex gap-2 text-sm bg-purple-500 text-white rounded-md shadow items-center mb-1 p-3">
      <div className="flex-grow">{request.origin}</div>
      <div className="">
        <Button
          size="small"
          variant="light"
          onPress={() => siteConnectionOverlayState.open()}
        >
          Approve
        </Button>
      </div>
      <div className="">
        <Button
          size="small"
          variant="dark"
          onPress={() => api.denySite({ origin: request.origin })}
        >
          Deny
        </Button>
      </div>
      {siteConnectionOverlayState.isOpen && (
        <OverlayContainer>
          <ModalDialog
            isOpen
            onClose={siteConnectionOverlayState.close}
            isDismissable
            render={(titleProps) => (
              <ApproveSiteModal
                closeModal={siteConnectionOverlayState.close}
                titleProps={titleProps}
                connectionRequest={request}
              />
            )}
          />
        </OverlayContainer>
      )}
    </div>
  );
}

export function Sites({ sites, connectionRequests }: SitesProps) {
  return (
    <div>
      <header className="mt-4 mb-12">
        <div className="mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
            Connected Sites
          </h1>

          <p className="mt-4 mx-auto text-lg leading-6 text-gray-500">
            Manage your connected sites.
          </p>
        </div>
      </header>

      {!!connectionRequests?.length && (
        <div className="mb-5">
          <div className="mb-2 text-xs my-1 font-bold">
            Pending Connection Requests
          </div>
          {connectionRequests.map((request) => {
            return (
              <SiteConnectionRequestWithModal
                key={request.origin}
                request={request}
              />
            );
          })}
        </div>
      )}

      <div className="flex flex-col">
        <div>
          <div>
            <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
              {sites?.length < 1 && (
                <div className="bg-white divide-y divide-gray-200 h-96">
                  <div className="flex flex-col items-center justify-center h-full">
                    <LinkIcon className="w-20 h-20 text-gray-200" />

                    <p className="mt-4 text-gray-300">
                      You don't have any connected sites.
                    </p>
                  </div>
                </div>
              )}

              {sites?.length > 0 && (
                <table className="table w-full min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Site Origin
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Allowed Accounts
                      </th>
                      <th className="w-10 px-6 py-3 bg-gray-50" />
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sites.map((site, i) => {
                      return <SiteTableRowWithModal site={site} />;
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
