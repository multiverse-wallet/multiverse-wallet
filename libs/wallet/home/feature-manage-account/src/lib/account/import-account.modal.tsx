import { joiResolver } from '@hookform/resolvers/joi';
import { useWalletAPI } from '@multiverse-wallet/wallet/hooks';
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
import { Controller, useForm } from 'react-hook-form';

interface ImportAccountModalProps {
  titleProps: ModalTitleProps;
  closeModal: () => void;
}

export function ImportAccountModal({
  titleProps,
  closeModal,
}: ImportAccountModalProps) {
  const { api } = useWalletAPI();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    control,
    setError,
  } = useForm({
    resolver: joiResolver(
      Joi.object({
        name: Joi.string().required(),
        secret: Joi.string().required(),
      })
    ),
  });

  async function onSubmit({ name, secret }: any) {
    setIsSubmitting(true);
    try {
      await api.createAccount({ name, secret });
      setIsSubmitting(false);
      closeModal();
    } catch {
      setIsSubmitting(false);
      setError('secret', {
        type: 'invalidSecret',
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalDialogHeader
        titleProps={titleProps}
        title="Import Account"
        subtitle="If you have an existing secret, it can be used to import an account."
      />

      <ModalDialogBody>
        <div className="pb-4 space-y-8">
          <div className="">
            <Controller
              control={control}
              name="name"
              defaultValue=""
              render={({ field }) => {
                return (
                  <TextField
                    field={field}
                    type="text"
                    label="Account Name"
                    placeholder="My Awesome Account"
                    aria-invalid={errors['name'] ? 'true' : 'false'}
                    aria-describedby="account-name-error"
                    autoFocus={true}
                    isDisabled={isSubmitting}
                    validationState={errors['name'] ? 'invalid' : undefined}
                  />
                );
              }}
            />
            {errors['name'] && (
              <p className="mt-2 text-sm text-red-600" id="name-error">
                You must provide a name for the account.
              </p>
            )}
          </div>

          <div className="">
            <Controller
              control={control}
              name="secret"
              defaultValue=""
              render={({ field }) => {
                return (
                  <TextField
                    field={field}
                    type="password"
                    label="Secret"
                    placeholder="**********"
                    aria-invalid={errors['secret'] ? 'true' : 'false'}
                    aria-describedby="private-key-error"
                    autoFocus={false}
                    isDisabled={isSubmitting}
                    validationState={errors['secret'] ? 'invalid' : undefined}
                  />
                );
              }}
            />
            {errors['secret'] && (
              <p className="mt-2 text-sm text-red-600" id="private-key-error">
                {(errors['secret']['type'] as any) === 'invalidSecret'
                  ? 'Please ensure that this is a valid secret'
                  : 'A secret value is required'}
              </p>
            )}
          </div>
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
                <span className="ml-4">Importing Account...</span>
              </div>
            ) : (
              <>
                <svg
                  className="-ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                Import Account
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
