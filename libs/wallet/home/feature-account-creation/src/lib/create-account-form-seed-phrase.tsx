import { joiResolver } from '@hookform/resolvers/joi';
import { generateMnemonic } from '@multiverse-wallet/wallet/utils';
import { Button } from '@multiverse-wallet/shared/components/button';
import Joi from 'joi';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MnemonicViewer } from '@multiverse-wallet/wallet/components';

interface CreateAccountFormSeedPhraseProps {
  onConfirmedBackup: (mnemonic: string) => void;
}

export function CreateAccountFormSeedPhrase(
  props: CreateAccountFormSeedPhraseProps
) {
  const [mnemonic] = useState(generateMnemonic());

  const { handleSubmit, register, watch } = useForm({
    resolver: joiResolver(
      Joi.object({
        confirmBackup: Joi.boolean().required(),
      })
    ),
  });

  const confirmBackup = watch('confirmBackup');

  function onConfirmedBackup() {
    props.onConfirmedBackup(mnemonic);
  }

  return (
    <form onSubmit={handleSubmit(onConfirmedBackup)}>
      <div className="space-y-8 pb-8">
        <div className="px-8 pt-8 pb-2">
          <h2 className="text-3xl font-extrabold leading-tight text-gray-900">
            Secret Recovery Phrase
          </h2>
          <p className="mt-3 text-gray-600 text-sm">
            Your secret recovery phrase makes it easy to backup and restore your
            account.{' '}
            <span className="mt-3 text-gray-600 text-sm font-bold">
              Store your phrase somewhere safe offline.
            </span>
          </p>
        </div>

        <div className="px-8">
          <MnemonicViewer
            decryptedMnemonic={mnemonic}
            showCopyButton={true}
            showPlaceholder={true}
          />
        </div>

        <div className="px-8">
          <div className="flex items-center">
            <input
              type="checkbox"
              defaultValue="false"
              className="focus:ring-blue-200 border-gray-300 rounded h-4 w-4 text-teal-500 transition duration-150 ease-in-out"
              {...register('confirmBackup')}
            />
            <label
              htmlFor="confirmBackup"
              className="ml-2 block text-sm leading-5 text-gray-900"
            >
              I confirm I have securely backed up my seed phrase.
            </label>
          </div>
        </div>

        <div className="px-8 flex justify-end">
          <Button
            isDisabled={!confirmBackup}
            type="submit"
            size="medium"
            variant="primary"
          >
            Next Step
          </Button>
        </div>
      </div>
    </form>
  );
}
