import { joiResolver } from "@hookform/resolvers/joi";
import { useWalletState } from '@multiverse-wallet/wallet/hooks';
import { Button } from '@multiverse-wallet/shared/components/button';
import { Spinner } from '@multiverse-wallet/shared/components/spinner';
import { TextField } from '@multiverse-wallet/shared/components/text-field';
import { delay } from '@multiverse-wallet/shared/utils';
import Joi from 'joi';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export function ImportAccountForm() {
  const api = useWalletState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit, formState: { errors }, control, setError } = useForm({
    resolver: joiResolver(
      Joi.object({
        mnemonic: Joi.string().required(),
        existingEncryptedData: Joi.string().optional(), // user may or may not have existing encrypted data
        password: Joi.string().required(),
        confirmPassword: Joi.string().required().valid(Joi.ref('password')),
      })
    ),
  });

  async function onSubmit({
    existingEncryptedData,
    mnemonic,
    password,
  }: any) {
    try {
      setIsSubmitting(true);

      /**
       * User has provided an encrypted mnemonic, but the data
       * cannot be decrypted
       */
      // if (
      //   existingEncryptedData &&
      //   !api.isValid(
      //     existingEncryptedData,
      //     mnemonic
      //   )
      // ) {
      //   setIsSubmitting(false);
      //   setError('existingEncryptedData', {
      //     type: 'failedDecryption',
      //   });
      //   return;
      // }

      // await importExistingEncryptedState(
      //   mnemonic,
      //   password,
      //   existingEncryptedData
      // );

      await delay(1000);

      setIsSubmitting(false);
    } catch {
      setIsSubmitting(false);
      setError('existingEncryptedData', {
        type: 'failedParsing',
      });
    }
  }

  return (
    <div className="max-w-5xl m-auto">
      <h1 className="text-5xl font-extrabold leading-tight text-gray-900 text-center">
        Import Existing Account
      </h1>
      <p className="mt-4 text-gray-600 text-lg text-center">
        If you are migrating existing encrypted data, you can provide it now, or
        any time later within the Settings section.
      </p>
      <div className="mt-8 sm:mt-12 lg:mt-16">
        <div className="relative max-w-2xl m-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="bg-white p-8 space-y-8">
                <div>
                  <Controller
                    control={control}
                    name="mnemonic"
                    defaultValue=""
                    render={({ field }) => {
                      return (
                        <TextField
                          field={field}
                          label="Mnemonic Seed Phrase"
                          type="text"
                          placeholder=""
                          autoFocus={true}
                          aria-invalid={errors['mnemonic'] ? 'true' : 'false'}
                          aria-describedby="mnemonic-error"
                          validationState={
                            errors['mnemonic'] ? 'invalid' : undefined
                          }
                        />
                      );
                    }}
                  />
                  {errors['mnemonic'] && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="mnemonic-error"
                    >
                      You must create a password in order to encrypt the
                      account.
                    </p>
                  )}
                </div>

                <div>
                  <Controller
                    control={control}
                    name="existingEncryptedData"
                    render={({ field }) => {
                      return (
                        <TextField
                          field={field}
                          label="(Optional) Existing Encrypted Data"
                          type="text"
                          placeholder=""
                          autoFocus={false}
                          aria-invalid={
                            errors['existingEncryptedData'] ? 'true' : 'false'
                          }
                          aria-describedby="existing-encrypted-data-error"
                          validationState={
                            errors['existingEncryptedData'] ? 'invalid' : undefined
                          }
                          infoText="If you are migrating existing encrypted data, you can provide it now, or any time later within the Settings section of your account."
                        />
                      );
                    }}
                  />
                  {errors['existingEncryptedData'] && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="existing-encrypted-data-error"
                    >
                      {JSON.stringify(errors['existingEncryptedData'])}
                    </p>
                  )}
                </div>

                <div>
                  <Controller
                    control={control}
                    name="password"
                    defaultValue=""
                    render={({ field }) => {
                      return (
                        <TextField
                          field={field}
                          label="New Password"
                          type="password"
                          placeholder=""
                          autoFocus={false}
                          aria-invalid={errors['password'] ? 'true' : 'false'}
                          aria-describedby="password-error"
                          validationState={
                            errors['password'] ? 'invalid' : undefined
                          }
                        />
                      );
                    }}
                  />
                  {errors['password'] && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="password-error"
                    >
                      You must create a password in order to encrypt the
                      account.
                    </p>
                  )}
                </div>

                <div>
                  <Controller
                    control={control}
                    name="confirmPassword"
                    defaultValue=""
                    render={({ field }) => {
                      return (
                        <TextField
                          field={field}
                          label="Confirm Password"
                          type="password"
                          placeholder=""
                          aria-invalid={
                            errors['confirmPassword'] ? 'true' : 'false'
                          }
                          aria-describedby="confirm-password-error"
                          validationState={
                            errors['confirmPassword'] ? 'invalid' : undefined
                          }
                        />
                      );
                    }}
                  />
                  {errors['confirmPassword'] && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="confirm-password-error"
                    >
                      {errors['confirmPassword']['type'] as any === 'any.required' &&
                        'Please confirm the password in order to encrypt the account'}
                      {errors['confirmPassword']['type'] as any === 'any.only' &&
                        'This does not currently match your given password'}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-8 py-5 sm:flex sm:flex-row-reverse">
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
                      <span className="ml-4">Validating Data...</span>
                    </div>
                  ) : (
                    <>Import Data</>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
