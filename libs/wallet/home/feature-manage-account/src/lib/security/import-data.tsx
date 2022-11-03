import { useWalletState } from '@multiverse-wallet/wallet/hooks';
import { Button } from '@multiverse-wallet/shared/components/button';
import { Spinner } from '@multiverse-wallet/shared/components/spinner';
import { delay } from '@multiverse-wallet/shared/utils';
import React, { useState } from 'react';

export function ImportData() {
  const auth = useWalletState();
  const [encryptedAccountData, setEncryptedAccountData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleImport() {
    try {
      setIsSubmitting(true);

      // await auth.importEncryptedAccountData(encryptedAccountData);

      await delay(1000);

      setIsSubmitting(false);
      setEncryptedAccountData('');

      await delay(500);

      alert('Successfully imported account data!');
    } catch {
      setIsSubmitting(false);
      alert(
        'Error: Could not add the given encrypted data. Be sure to only import data that was encrypted using your mnemonic seed phrase.'
      );
    }
  }

  return (
    <section
      aria-labelledby="import_data_heading"
      className="h-full shadow rounded-md overflow-hidden flex flex-col"
    >
      <div className="bg-white space-y-12 p-8 flex-1">
        <div>
          <h2
            id="import_data_heading"
            className="text-2xl leading-6 font-bold text-gray-900"
          >
            Import Encrypted Data
          </h2>
          <p className="mt-4 text-sm leading-6 text-gray-500">
            If you have existing encrypted data, that was encrypted using the
            same mnemonic seed phrase as you are currently using, you can
            securely add it to your local account.{' '}
            <span className="font-bold">
              It will be merged with any existing data you have in this account.
            </span>
          </p>
        </div>
        <div className="space-y-1">
          <label
            htmlFor="description"
            className="block text-sm font-medium leading-5 text-gray-700"
          >
            Encrypted Data
          </label>
          <div className="rounded-md shadow-sm">
            <textarea
              id="description"
              rows={3}
              className="border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 placeholder-gray-400 rounded-md block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              value={encryptedAccountData}
              onChange={(event) => setEncryptedAccountData(event.target.value)}
            ></textarea>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-8 py-5 sm:flex sm:flex-row-reverse">
        <Button
          variant="dark"
          size="medium"
          isDisabled={isSubmitting}
          onPress={handleImport}
        >
          {isSubmitting ? (
            <div className="flex flex-row">
              <span style={{ marginTop: '2px' }}>
                <Spinner size="small" />
              </span>
              <span className="ml-4">Validating Data...</span>
            </div>
          ) : (
            <>Import Data</>
          )}
        </Button>
      </div>
    </section>
  );
}
