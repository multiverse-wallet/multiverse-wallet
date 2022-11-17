import { useWalletAPI } from '@multiverse-wallet/wallet/hooks';
import { Button } from '@multiverse-wallet/shared/components/button';
import { Spinner } from '@multiverse-wallet/shared/components/spinner';
import React, { useState } from 'react';

export function ExportData() {
  const auth = useWalletAPI();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hiddenAnchorElement = document.createElement('a');
  hiddenAnchorElement.style.display = 'none';
  hiddenAnchorElement.setAttribute(
    'download',
    `DA_BROWSER_EXTENSION_ENCRYPTED_DATA_EXPORT_${Date.now()}.txt`
  );

  async function handleExport() {
    setIsSubmitting(true);
    // const encryptedAccountData = await readEncryptedState();

    // hiddenAnchorElement.setAttribute(
    //   'href',
    //   'data:text/plain;charset=utf-8,' +
    //     encodeURIComponent(encryptedAccountData)
    // );

    // Trigger the download by clicking the hidden anchor element
    document.body.appendChild(hiddenAnchorElement);
    hiddenAnchorElement.click();
    document.body.removeChild(hiddenAnchorElement);

    setIsSubmitting(false);
  }

  return (
    <section
      aria-labelledby="export_data_heading"
      className="h-full shadow rounded-md overflow-hidden flex flex-col"
    >
      <div className="bg-white space-y-12 p-8 flex-1">
        <div>
          <h2
            id="export_data_heading"
            className="text-2xl leading-6 font-bold text-gray-900"
          >
            Export Encrypted Data
          </h2>
          <p className="mt-4 text-sm leading-6 text-gray-500">
            If you need to change your computer or browser that this extension
            is running on, you will need a copy of the encrypted data in order
            to transfer it.
          </p>
        </div>
      </div>
      <div className="bg-gray-50 px-8 py-5 sm:flex sm:flex-row-reverse">
        <Button
          variant="dark"
          size="medium"
          isDisabled={isSubmitting}
          onPress={handleExport}
        >
          {isSubmitting ? (
            <div className="flex flex-row">
              <span style={{ marginTop: '2px' }}>
                <Spinner size="small" />
              </span>
              <span className="ml-4">Exporting Data...</span>
            </div>
          ) : (
            <>Export Data</>
          )}
        </Button>
      </div>
    </section>
  );
}
