import { joiResolver } from '@hookform/resolvers/joi';
import { useSettings, useWalletAPI } from '@multiverse-wallet/wallet/hooks';
import { Button } from '@multiverse-wallet/shared/components/button';
import {
  ModalDialogBody,
  ModalDialogFooter,
  ModalDialogHeader,
  ModalTitleProps,
} from '@multiverse-wallet/shared/components/modal-dialog';
import { Spinner } from '@multiverse-wallet/shared/components/spinner';
import { TextField } from '@multiverse-wallet/shared/components/text-field';
import Joi from 'joi';
import React, { useState } from 'react';
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { PlusIcon } from '@heroicons/react/solid';
import { DragDropFile, ImageFile } from '@multiverse-wallet/wallet/components';
import { CID, create } from 'ipfs-http-client';

interface CreateNFTModalProps {
  titleProps: ModalTitleProps;
  closeModal: () => void;
}

export function CreateNFTModal({
  titleProps,
  closeModal,
}: CreateNFTModalProps) {
  const { api } = useWalletAPI();
  const settings = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    control,
  } = useForm({
    resolver: joiResolver(
      Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.custom((value, helper) => {
          if (value instanceof File && value?.type.startsWith('image/')) {
            return value;
          }
          return helper.message({
            custom: 'You must provide an image file.',
          });
        }).required(),
      })
    ),
  });

  const onSubmit: SubmitHandler<FieldValues> = async (fields) => {
    setIsSubmitting(true);
    const image: File = fields['image'];
    const name = fields['name'];
    const description = fields['description'];
    try {
      const ipfs = create({ url: settings?.ipfsGateway });
      const ipfsPath = '/nft/' + image.name;
      const { cid: assetCid } = await ipfs.add(
        {
          path: ipfsPath,
          content: image,
        },
        {
          pin: true,
        }
      );
      const assetURI = ensureIpfsUriPrefix(assetCid) + '/' + image.name;
      const metadata = {
        name,
        description,
        image: assetURI,
      };
      // add the metadata to IPFS
      const { cid: metadataCid } = await ipfs.add(
        {
          path: '/nft/metadata.json',
          content: JSON.stringify(metadata),
        },
        {
          pin: true,
        }
      );
      const metadataURI = ensureIpfsUriPrefix(metadataCid) + '/metadata.json';
      await api.createNFToken({
        name,
        description,
        nfTokenTaxon: 0,
        uri: metadataURI,
      });
      setIsSubmitting(false);
      closeModal();
    } catch (e: any) {
      setError('collection', {
        type: 'validate',
        message: e.message,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalDialogHeader
        titleProps={titleProps}
        title="Create NFT"
        subtitle="Create a new NFT to be minted on the XRPL."
      />

      <ModalDialogBody>
        <div className="mb-2">
          <Controller
            control={control}
            name="name"
            defaultValue=""
            render={({ field }) => {
              return (
                <TextField
                  field={field}
                  type="text"
                  label="Name"
                  placeholder="My Awesome NFT"
                  aria-invalid={errors['name'] ? 'true' : 'false'}
                  aria-describedby="collection-name-error"
                  autoFocus={true}
                  isDisabled={isSubmitting}
                  validationState={errors['name'] ? 'invalid' : undefined}
                />
              );
            }}
          />
          {errors['name'] && (
            <p className="mt-2 text-sm text-red-600" id="collection-name-error">
              You must provide a name for the NFT
            </p>
          )}
          {errors['collection'] && (
            <p className="mt-2 text-sm text-red-600" id="collection-name-error">
              {(errors['collection'] as any).message}
            </p>
          )}
        </div>
        <div className="mb-2">
          <Controller
            control={control}
            name="description"
            defaultValue=""
            render={({ field }) => {
              return (
                <TextField
                  field={field}
                  type="text"
                  label="Description"
                  placeholder="A description of my awesome NFT"
                  aria-invalid={errors['description'] ? 'true' : 'false'}
                  aria-describedby="collection-description-error"
                  autoFocus={true}
                  isDisabled={isSubmitting}
                  validationState={
                    errors['description'] ? 'invalid' : undefined
                  }
                />
              );
            }}
          />
          {errors['description'] && (
            <p
              className="mt-2 text-sm text-red-600"
              id="collection-description-error"
            >
              You must provide a description for the NFT
            </p>
          )}
        </div>
        <div className="mb-2">
          <Controller
            control={control}
            name="image"
            defaultValue=""
            render={({ field }) => {
              return (
                <DragDropFile
                  setError={(e) => {
                    e ? setError('image', e) : clearErrors('image');
                  }}
                  contentType="image"
                  label="Image"
                  field={field}
                >
                  {({ file }) => {
                    return (
                      <div className="relative w-full">
                        <ImageFile
                          file={file}
                          className="w-full rounded shadow"
                        />
                      </div>
                    );
                  }}
                </DragDropFile>
              );
            }}
          />
          {errors['image'] && (
            <p
              className="mt-2 text-sm text-red-600"
              id="collection-image-error"
            >
              You must provide an image file.
            </p>
          )}
        </div>
      </ModalDialogBody>

      <ModalDialogFooter>
        <span className="ml-2">
          <Button
            type="submit"
            variant="primary"
            size="medium"
            isDisabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex flex-row">
                <span style={{ marginTop: '2px' }}>
                  <Spinner size="small" />
                </span>
                <span className="ml-4">Creating NFT...</span>
              </div>
            ) : (
              <>
                <PlusIcon className="inline w-5 h-5 mr-2" />
                Create NFT
              </>
            )}
          </Button>
        </span>
        <Button variant="cancel" size="medium" onPress={closeModal}>
          Cancel
        </Button>
      </ModalDialogFooter>
    </form>
  );
}

function ensureIpfsUriPrefix(cid: CID<any, any, any, any>): string {
  return `ipfs://${cid.toString()}`;
}
