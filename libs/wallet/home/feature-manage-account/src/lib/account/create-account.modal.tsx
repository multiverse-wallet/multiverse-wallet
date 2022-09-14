import { joiResolver } from "@hookform/resolvers/joi";
import { useWalletState } from "@multiverse-wallet/wallet/hooks";
import { Button } from "@multiverse-wallet/shared/components/button";
import {
  ModalDialogBody,
  ModalDialogFooter,
  ModalDialogHeader,
  ModalTitleProps,
} from "@multiverse-wallet/shared/components/modal-dialog";
import { Spinner } from "@multiverse-wallet/shared/components/spinner";
import { TextField } from "@multiverse-wallet/shared/components/text-field";
import Joi from "joi";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { PlusIcon } from "@heroicons/react/solid";

interface CreateAccountModalProps {
  titleProps: ModalTitleProps;
  closeModal: () => void;
}

export function CreateAccountModal({
  titleProps,
  closeModal,
}: CreateAccountModalProps) {
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
        accountName: Joi.string().required(),
      })
    ),
  });

  async function onSubmit({ accountName }: any) {
    setIsSubmitting(true);
    try {
      await api.createAccount({ name: accountName });
      setIsSubmitting(false);
      closeModal();
    } catch (e: any) {
      setError("account", {
        type: "validate",
        message: e.message,
      });
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalDialogHeader
        titleProps={titleProps}
        title="Create Account"
        subtitle="A new wallet will be generated in your browser and stored locally using the name you specify."
      />

      <ModalDialogBody>
        <div className="">
          <Controller
            control={control}
            name="accountName"
            defaultValue=""
            render={({ field }) => {
              return (
                <TextField
                  field={field}
                  type="text"
                  label="Account Name"
                  placeholder="My Awesome Account"
                  aria-invalid={errors["accountName"] ? "true" : "false"}
                  aria-describedby="account-name-error"
                  autoFocus={true}
                  isDisabled={isSubmitting}
                  validationState={
                    errors["accountName"] ? "invalid" : undefined
                  }
                />
              );
            }}
          />
          {errors["accountName"] && (
            <p className="mt-2 text-sm text-red-600" id="account-name-error">
              You must provide a name for the Account
            </p>
          )}
          {errors["account"] && (
            <p className="mt-2 text-sm text-red-600" id="account-name-error">
              {(errors["account"] as any).message}
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
                <span style={{ marginTop: "2px" }}>
                  <Spinner size="small" />
                </span>
                <span className="ml-4">Generating Keys...</span>
              </div>
            ) : (
              <>
                <PlusIcon className="inline w-5 h-5 mr-2" />
                Create Account
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
