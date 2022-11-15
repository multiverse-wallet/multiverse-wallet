import { joiResolver } from '@hookform/resolvers/joi';
import { useWalletState } from '@multiverse-wallet/wallet/hooks';
import { Button } from '@multiverse-wallet/shared/components/button';
import { TextField } from '@multiverse-wallet/shared/components/text-field';
import Joi from 'joi';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MnemonicViewer } from '@multiverse-wallet/wallet/components';

export function RevealMnemonic() {
  const { api } = useWalletState();
  const [decryptedMnemonic, setDecryptedMnemonic] = useState('');
  const [progressUntilRehiddenState, setProgressUntilRehiddenState] = useState({
    elapsedSeconds: 0,
    progressPercentage: 0,
  });
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    setError,
  } = useForm({
    resolver: joiResolver(
      Joi.object({
        password: Joi.string().allow(''), // allow empty string so that the form can be submitted in the "hide case"
      })
    ),
  });

  useEffect(() => {
    if (!decryptedMnemonic) {
      return;
    }

    // Auto-hide the mnemonic again, whenever it is revealed
    const hideAfterSeconds = 5;
    const chunkSize = 100 / hideAfterSeconds;

    const intervalId = setInterval(() => {
      setProgressUntilRehiddenState((state) => {
        if (state.elapsedSeconds >= hideAfterSeconds) {
          setDecryptedMnemonic('');
          clearInterval(intervalId);
          return {
            elapsedSeconds: 0,
            progressPercentage: 0,
          };
        }
        return {
          elapsedSeconds: state.elapsedSeconds + 1,
          progressPercentage: (state.elapsedSeconds + 1) * chunkSize,
        };
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
      setProgressUntilRehiddenState(() => {
        return {
          elapsedSeconds: 0,
          progressPercentage: 0,
        };
      });
    };
  }, [decryptedMnemonic]);

  async function onSubmit() {
    // Already showing the mnemonic, hide it again
    if (decryptedMnemonic) {
      setDecryptedMnemonic('');
      return;
    }

    try {
      const password = getValues('password');
      if (!password) {
        setError('password', {
          type: 'required',
        });
        return;
      }
      const decryptedMnemonic = await api.revealRecoveryPhrase(password);
      setDecryptedMnemonic(decryptedMnemonic);
      // Clear the password input, they used the password successfully already
      setValue('password', '');
    } catch {
      setDecryptedMnemonic('');
      setError('password', {
        type: 'incorrectPassword',
      });
    }
  }

  return (
    <section
      aria-labelledby="import_data_heading"
      className="h-full shadow rounded-md overflow-hidden flex flex-col"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 bg-white">
          <div>
            <div className="space-y-6 p-8 flex-1">
              <div>
                <h2
                  id="import_data_heading"
                  className="text-2xl leading-6 font-bold text-gray-900"
                >
                  Reveal Secret Recovery Phrase
                </h2>
                <p className="mt-4 text-sm leading-6 text-gray-500">
                  Confirm your password in order to reveal your secret recovery
                  phrase.{' '}
                  <span className="font-bold">
                    Never share your secret recovery phrase with anyone, it is
                    all that is needed to regenerate your accounts and wallets.
                  </span>
                  <div className="font-bold text-xs text-orange-700 p-3 bg-orange-100 rounded-lg my-2">
                    Note: If you have imported an account using an existing
                    secret, this cannot be regenerated using your secret
                    recovery phrase.
                  </div>
                </p>
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
                        label="Confirm Password"
                        type="password"
                        placeholder="***********"
                        isDisabled={!!decryptedMnemonic}
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
                  <p className="mt-2 text-sm text-red-600" id="password-error">
                    {(errors['password']['type'] as any) === 'incorrectPassword'
                      ? 'Incorrect password, please make sure Caps Lock is turned off'
                      : 'Your password is required'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="px-8 flex align-center h-auto mt-20 mb-8">
            <MnemonicViewer
              decryptedMnemonic={decryptedMnemonic}
              showCopyButton={true}
              showPlaceholder={true}
              progressPercentage={progressUntilRehiddenState.progressPercentage}
            />
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-5 sm:flex sm:flex-row-reverse">
          <Button type="submit" variant="dark" size="medium">
            {decryptedMnemonic ? 'Hide Mnemonic' : 'Reveal Mnemonic'}
          </Button>
          {decryptedMnemonic && (
            <div className="text-teal-500 flex justify-center items-center mr-6">
              {5 - progressUntilRehiddenState.elapsedSeconds > 0
                ? `Auto-hiding in ${
                    5 - progressUntilRehiddenState.elapsedSeconds
                  }s...`
                : 'Auto-hiding...'}
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
