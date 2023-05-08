import { joiResolver } from '@hookform/resolvers/joi';
import { useWalletAPI } from '@multiverse-wallet/wallet/hooks';
import { Button } from '@multiverse-wallet/shared/components/button';
import { Spinner } from '@multiverse-wallet/shared/components/spinner';
import { TextField } from '@multiverse-wallet/shared/components/text-field';
import { delay } from '@multiverse-wallet/shared/utils';
import Joi from 'joi';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { validateMnemonic } from 'bip39';

export function ImportAccountForm() {
  const { api } = useWalletAPI();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {
    handleSubmit,
    formState: { errors },
    control,
    setError,
    clearErrors,
  } = useForm({
    resolver: joiResolver(
      Joi.object({
        mnemonic: Joi.string()
          .required()
          .custom((value, helper) => {
            if (validateMnemonic(value)) {
              return value;
            }
            return helper.message({
              custom: 'secret recovery phrase must be a valid bip39 mnemonic',
            });
          }),
        password: Joi.string().min(8).required(),
        confirmPassword: Joi.string().required().valid(Joi.ref('password')),
      })
    ),
  });

  async function onSubmit({ mnemonic, password }: any) {
    try {
      clearErrors();
      setIsSubmitting(true);
      try {
        await api.setupRecoveryPhrase({
          password,
          secretRecoveryPhrase: mnemonic,
        });
        navigate('/');
      } catch (e: unknown) {
        setError('mnemonic', e as Error);
      }
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
                          label="Secret Recovery Phrase (BIP 39 Mnemonic)"
                          type="text"
                          placeholder=""
                          autoComplete="off"
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
                      Secret recovery phrase must be a valid bip39 mnemonic
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
                          autoComplete="off"
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
                      Please provide a valid password of greater than 8
                      characters.
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
                          autoComplete="off"
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
                      {(errors['confirmPassword']['type'] as any) ===
                        'any.required' &&
                        'Please confirm the password in order to encrypt the account'}
                      {(errors['confirmPassword']['type'] as any) ===
                        'any.only' &&
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
