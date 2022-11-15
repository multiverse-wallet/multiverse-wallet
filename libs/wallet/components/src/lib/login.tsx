import { joiResolver } from '@hookform/resolvers/joi';
import { useWalletState } from '@multiverse-wallet/wallet/hooks';
import { TextField } from '@multiverse-wallet/shared/components/text-field';
import Joi from 'joi';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LockOpenIcon } from '@heroicons/react/outline';

interface LoginProps {
  hasPrivateMessageBar: boolean;
}

export function Login({ hasPrivateMessageBar }: LoginProps) {
  const { api } = useWalletState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    setError,
    control,
  } = useForm({
    resolver: joiResolver(
      Joi.object({
        password: Joi.string().required(),
      })
    ),
  });

  const privateMessageBarHeight = '42px';

  async function onPasswordSubmit({ password }: any) {
    setIsSubmitting(true);

    try {
      await api.unlock(password);
      setIsSubmitting(false);
    } catch (e) {
      setIsSubmitting(false);
      setError('password', {
        type: 'incorrectPassword',
      });
    }
  }

  return (
    <div className="login-background h-full w-full">
      <main className="flex flex-col h-full">
        <div className="flex-grow flex items-center justify-center">
          <div>
            <div className="flex justify-center">
              <img src="/assets/logo.svg" width={200} height={200} />
            </div>
            <div className="overflow-hidden max-w-3xl m-auto">
              <form onSubmit={handleSubmit(onPasswordSubmit)}>
                <div className="">
                  <div className="px-8 py-5">
                    <Controller
                      control={control}
                      name="password"
                      defaultValue=""
                      render={({ field }) => {
                        return (
                          <TextField
                            field={field}
                            type="password"
                            placeholder="Enter your password"
                            aria-invalid={errors['password'] ? 'true' : 'false'}
                            aria-describedby="password-error"
                            autoFocus={true}
                            infoText="All of your data is stored locally on your device and your password is never shared with, or stored on our servers."
                            isDisabled={isSubmitting}
                            validationState={
                              errors['password'] ? 'invalid' : undefined
                            }
                            trailingButton={
                              <button
                                type="submit"
                                className="flex h-full items-center justify-center bg-black text-white w-14"
                              >
                                <LockOpenIcon className="w-6 h-6" />
                              </button>
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
                        {(errors['password']['type'] as any) ===
                        'incorrectPassword'
                          ? 'Incorrect password, please make sure Caps Lock is turned off'
                          : 'Your password is required'}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
