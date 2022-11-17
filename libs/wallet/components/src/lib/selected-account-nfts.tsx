import React, { useEffect, useState } from 'react';
import {
  useSelectedAccount,
  useWalletAPI,
} from '@multiverse-wallet/wallet/hooks';
import { useXRPLContext } from '@xrpl-components/react/hooks/xrpl';
import { AccountBalance } from '@xrpl-components/react/components/account-balance';
import { ChevronRightIcon } from '@heroicons/react/outline';
import { Spinner } from '@multiverse-wallet/shared/components/spinner';
import { AccountNFTsResponse } from 'xrpl';
import { Button } from '@multiverse-wallet/shared/components/button';

interface AccountNFToken {
  Flags: number;
  Issuer: string;
  NFTokenID: string;
  NFTokenTaxon: number;
  URI?: string;
  nft_serial: number;
}

export function SelectedAccountNFTs() {
  const { selectedAccount } = useSelectedAccount();
  const { client, connectionState } = useXRPLContext();
  const [nfts, setNFTs] = useState<AccountNFToken[] | null>(null);
  useEffect(() => {
    selectedAccount &&
      connectionState === 'connected' &&
      client
        ?.request({
          command: 'account_nfts',
          account: selectedAccount.address,
          ledger_index: 'validated',
        })
        .then((res) =>
          setNFTs((res as AccountNFTsResponse).result?.account_nfts)
        )
        .catch((e) => {
          setNFTs(null);
        });
  }, [selectedAccount, client, connectionState]);
  if (connectionState === 'connecting') {
    return (
      <div className="flex-grow bg-white">
        <div className="h-full flex items-center justify-center">
          <Spinner variant="dark" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col bg-white divide-y">
      {nfts?.map(({ NFTokenID, Issuer, URI }) => (
        <div key={NFTokenID} className="p-3 flex font-mono items-center h-16">
          <div className="text-xs flex-grow">
            <div className="capitalize">{NFTokenID}</div>
            <div className="text-xs text-slate-400">{Issuer}</div>
          </div>
          <div>{URI}</div>
        </div>
      ))}
    </div>
  );
}
