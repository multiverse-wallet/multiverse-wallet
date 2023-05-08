import React, { useEffect, useMemo, useState } from 'react';
import {
  useSelectedAccount,
  useSelectedAccountNFTs,
  useWalletAPI,
} from '@multiverse-wallet/wallet/hooks';
import { useXRPLContext } from '@xrpl-components/react/hooks/xrpl';
import { AccountBalance } from '@xrpl-components/react/components/account-balance';
import { ChevronRightIcon } from '@heroicons/react/outline';
import { Spinner } from '@multiverse-wallet/shared/components/spinner';
import { AccountNFTsResponse } from 'xrpl';
import { Button } from '@multiverse-wallet/shared/components/button';
import { convertHexToString } from 'xrpl';

interface AccountNFToken {
  Flags: number;
  Issuer: string;
  NFTokenID: string;
  NFTokenTaxon: number;
  URI?: string;
  nft_serial: number;
}

export function SelectedAccountNFTs() {
  const nfts = useSelectedAccountNFTs();
  return (
    <div className="flex flex-col bg-white divide-y">
      {nfts?.map(({ NFTokenID, Issuer, URI }) => (
        <div key={NFTokenID} className="p-3 flex font-mono items-center h-16">
          <div className="text-xs flex-grow">
            <div className="capitalize">{NFTokenID}</div>
            <div className="text-xs text-slate-400">{Issuer}</div>
          </div>
          <div>
            <PreviewNFTokenURI uri={URI} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PreviewNFTokenURI({ uri }: any) {
  const metadataUri = useMemo(() => convertHexToString(uri), [uri]);
  const [metadata, setMetadata] = useState();
  useEffect(() => {
    fetch(metadataUri.replace('ipfs://', 'https://ipfs.io/ipfs/'))
      .then((r) => r.json())
      .then((metadata) => setMetadata(metadata))
      .catch((e) => console.log);
  }, [metadataUri]);
  console.log(metadata);
  return <></>;
}
