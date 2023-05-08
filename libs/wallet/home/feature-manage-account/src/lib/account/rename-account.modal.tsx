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
import { delay } from '@multiverse-wallet/shared/utils';
import Joi from 'joi';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Account } from '@multiverse-wallet/multiverse';

interface RenameAccountModalProps {
  account: Account;
  titleProps: ModalTitleProps;
  closeModal: () => void;
}

export function RenameAccountModal({
  account,
  titleProps,
  closeModal,
}: RenameAccountModalProps) {
  const { api } = useWalletAPI();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: joiResolver(
      Joi.object({
        accountName: Joi.string().required(),
      })
    ),
  });

  async function onSubmit({ accountName }: any) {
    setIsSubmitting(true);
    await api.updateAccount(account.id, { name: accountName });
    setIsSubmitting(false);
    closeModal();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalDialogHeader
        titleProps={titleProps}
        title="Rename Account"
        subtitle="You can update the name used to identify the selected account. The wallet details will remain unchanged."
      />

      <ModalDialogBody>
        <div className="">
          <Controller
            control={control}
            name="accountName"
            defaultValue={account.name}
            render={({ field }) => {
              return (
                <TextField
                  field={field}
                  type="text"
                  label="Account Name"
                  placeholder="My Awesome account"
                  aria-invalid={errors['accountName'] ? 'true' : 'false'}
                  aria-describedby="account-name-error"
                  autoFocus={true}
                  isDisabled={isSubmitting}
                  validationState={
                    errors['accountName'] ? 'invalid' : undefined
                  }
                />
              );
            }}
          />
          {errors['accountName'] && (
            <p className="mt-2 text-sm text-red-600" id="account-name-error">
              You must provide a name for the account
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
                <span className="ml-4">Updating...</span>
              </div>
            ) : (
              <>Update account</>
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
