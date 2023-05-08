import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DotsVerticalIcon,
  PencilAltIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/outline';
import api, { Network, NFT } from '@multiverse-wallet/multiverse';
import { Button } from '@multiverse-wallet/shared/components/button';
import { ModalDialog } from '@multiverse-wallet/shared/components/modal-dialog';
import {
  NFToken,
  useNFTs,
  useSelectedAccountBalances,
  useSelectedNetwork,
  useSettings,
  useWalletAPI,
} from '@multiverse-wallet/wallet/hooks';
import { OverlayContainer } from '@react-aria/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { CreateNFTModal } from './create-nft.modal';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  FolderOpenIcon,
  XCircleIcon,
} from '@heroicons/react/solid';
import { useAccount, useTransaction } from '@multiverse-wallet/react';
import {
  useXRPLContext,
  useXRPLGlobal,
} from '@xrpl-components/react/hooks/xrpl';
import { convertStringToHex } from 'xrpl';
import {
  Link,
  Route,
  Router,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { create } from 'ipfs-http-client';
import all from 'it-all';
import { concat as uint8ArrayConcat } from 'uint8arrays/concat';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
import { lookup } from 'mime-types';

interface NFTItemProps {
  nft: NFT;
}

interface IMetadata {
  name?: string;
  description?: string;
  image?: string;
  isLoading?: boolean;
  error?: Error;
  imageDataUrl?: string;
}

function useTokenMetadata(uri: any): IMetadata {
  const [metadata, setMetadata] = useState<IMetadata>();
  const [imageDataUrl, setImageDataUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const settings = useSettings();
  const loadNFT = useCallback(async () => {
    if (!settings?.ipfsGateway) return;
    setIsLoading(true);
    setError(undefined);
    try {
      const ipfs = create({ url: settings?.ipfsGateway });
      const metadataRaw = uint8ArrayConcat(
        await all(ipfs.cat(uri.replace('ipfs://', '')))
      );
      const metadata = JSON.parse(uint8ArrayToString(metadataRaw));
      setMetadata({
        ...metadata,
      });
      const imageDataRaw = uint8ArrayConcat(
        await all(ipfs.cat(metadata.image.replace('ipfs://', '')))
      );
      const imageDataUrl = await arrayBufferToBase64(
        imageDataRaw,
        lookup(metadata.image) as string
      );
      setImageDataUrl(imageDataUrl);
    } catch (e) {
      setError(e as Error);
    }
    setIsLoading(false);
  }, [setIsLoading, uri, settings]);
  useEffect(() => {
    loadNFT();
  }, [loadNFT]);
  return { ...metadata, isLoading, error, imageDataUrl };
}

function NFTItem({ nft }: NFTItemProps) {
  const { api } = useWalletAPI();
  const { account } = useAccount();
  const navigate = useNavigate();
  const { isLoading, imageDataUrl } = useTokenMetadata(nft.uri);
  const isMinted = false;
  return (
    <div className="h-64 group cursor-pointer border-2 border-transparent hover:border-blue-400 shadow rounded-md overflow-hidden relative">
      <div
        style={{
          backgroundImage: `url(${imageDataUrl})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          zIndex: -1,
        }}
        className="absolute text-xs flex items-center justify-center top-0 right-0 bottom-0 left-0 group-hover:scale-110 transition-all duration-500"
      >
        {isLoading && <>Loading...</>}
      </div>
      <div className="h-full flex flex-col bg-gradient-to-b from-transparent to-slate-800 text-white w-full p-3">
        <div className="flex-grow"></div>
        <div>
          <div className="font-bold">{nft.name}</div>
          <div className="text-xs truncate">{nft.description}</div>
          <div className="flex mt-1">
            <div className="flex-grow">
              {isMinted ? (
                <div className="text-xs text-green-200 bold flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-1 inline" />
                  Minted
                </div>
              ) : (
                <div className="text-xs text-slate-400 bold flex items-center">
                  <ExclamationCircleIcon className="w-4 h-4 mr-1 inline" />
                  Not Yet Minted
                </div>
              )}
            </div>
            <div>
              <DotsVerticalIcon className="-m-1 w-7 h-7 p-1 hover:bg-black rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NFTListView() {
  const createNFTOverlayState = useOverlayTriggerState({});
  const allNfts = useNFTs();
  const [searchTerm, setSearchTerm] = useState<string>();
  const nfts = useMemo(() => {
    if (!searchTerm) {
      return allNfts;
    }
    const re = new RegExp(searchTerm, 'i');
    return allNfts?.filter((n) => JSON.stringify(n).match(re));
  }, [allNfts, searchTerm]);
  return (
    <div>
      <header className="mt-4 mb-12">
        <div className="mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
            NFTs
          </h1>

          <p className="mt-4 mx-auto text-lg leading-6 text-gray-500">
            Create NFTs and manage your NFT collection.
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
            onPress={() => createNFTOverlayState.open()}
          >
            <>
              <PlusIcon className="w-5 h-5 mr-1" />
              Create NFT
            </>
          </Button>
          <input
            className="rounded-full p-5 py-2.5 bg-slate-50 shadow"
            type="text"
            placeholder="Search NFTs..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {createNFTOverlayState.isOpen && (
        <OverlayContainer>
          <ModalDialog
            isOpen
            onClose={createNFTOverlayState.close}
            isDismissable
            render={(titleProps) => (
              <CreateNFTModal
                titleProps={titleProps}
                closeModal={createNFTOverlayState.close}
              />
            )}
          />
        </OverlayContainer>
      )}

      <div className="flex flex-col">
        <div>
          <div>
            {!nfts?.length && (
              <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
                <div className="bg-white divide-y divide-gray-200 h-96">
                  <div className="flex flex-col items-center justify-center h-full">
                    <FolderOpenIcon className="h-20 w-20 text-gray-200" />

                    <p className="mt-4 text-gray-300">
                      You don't have any existing NFTs.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!!nfts?.length && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {nfts.map((nft, i) => {
                  return (
                    <Link to={`./${nft.id}`}>
                      <NFTItem key={nft.id} nft={nft} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NFTSingleView() {
  const { api } = useWalletAPI();
  const { nftId } = useParams();
  const { selectedNetwork } = useSelectedNetwork();
  const nfts = useNFTs();
  const nft = useMemo(() => {
    return nfts?.find((n) => n.id === nftId);
  }, [nftId, nfts]);
  const { imageDataUrl, isLoading } = useTokenMetadata(nft?.uri);
  return (
    <div>
      <header className="mt-4 mb-12">
        <div className="mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
            {nft?.name}
          </h1>
          {/* <p className="mt-4 mx-auto text-lg leading-6 text-gray-500">
            {nft?.description}
          </p> */}
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="max-h-screen rounded-md overflow-hidden shadow-md p-1 flex items-center justify-center">
          <img
            className="rounded-md border border-slate-100"
            src={imageDataUrl}
            alt=""
          />
        </div>
        <div>
          <div className="p-4 rounded-lg bg-slate-50 flex flex-col text-lg font-light items-center justify-center">
            <div className="flex items-center mb-1">
              <ExclamationCircleIcon className="w-5 h-5 inline mr-1" />
              Not Yet Minted
            </div>
            <div className="text-xs mb-3">
              This NFT has not yet been minted on the connected network (
              {selectedNetwork?.name}). Minting requires you to sign and submit
              an NFTokenMint transaction. Click the below button to begin this
              process.
            </div>
            <Button
              variant="dark"
              size="medium"
              className="w-full rounded-md text-lg font-light capitalize"
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onPress={() => {}}
            >
              Mint on {selectedNetwork?.name}
            </Button>
          </div>
          <div className="p-4">
            <div>
              <div className="font-extrabold mb-1 border-b py-2 text-lg">
                Name
              </div>
              <div className="mb-2 py-2 text-slate-500">{nft?.name}</div>
            </div>
            <div>
              <div className="font-extrabold mb-1 border-b py-2 text-lg">
                Description
              </div>
              <div className="mb-2 py-2 text-slate-500">{nft?.description}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NFTs() {
  return (
    <Routes>
      <Route path="/:nftId" element={<NFTSingleView />} />
      <Route path="/" element={<NFTListView />} />
    </Routes>
  );
}

async function arrayBufferToBase64(
  buffer: ArrayBuffer,
  contentType?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([buffer], { type: 'application/octet-binary' });
    const reader = new FileReader();
    reader.onload = function (evt: ProgressEvent<FileReader>) {
      const dataurl = evt?.target?.result as string;
      resolve(
        `data:${contentType};base64,${dataurl?.substr(
          dataurl.indexOf(',') + 1
        )}`
      );
    };
    reader.readAsDataURL(blob);
  });
}
