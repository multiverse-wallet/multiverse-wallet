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
import { PlusIcon, SaveIcon } from "@heroicons/react/solid";
import { Checkbox } from "@multiverse-wallet/shared/components/checkbox";
import { INetwork } from "@xrpl-components/react/hooks/xrpl";
import { CreateNetworkRequest, Network } from "@multiverse-wallet/multiverse";

interface EditNetworkModalProps {
  network: Network;
  titleProps: ModalTitleProps;
  closeModal: () => void;
}

export function EditNetworkModal({
  network,
  titleProps,
  closeModal,
}: EditNetworkModalProps) {
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
        name: Joi.string().required(),
        server: Joi.string().required(),
        options: Joi.object().optional(),
      })
    ),
  });

  async function onSubmit(updatedNetwork: any) {
    setIsSubmitting(true);
    try {
      await api.updateNetwork(network.id, updatedNetwork);
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
        title="Update Network"
        subtitle="Update the details of an existing network."
      />

      <ModalDialogBody>
        <div className="">
          <Controller
            control={control}
            name="name"
            defaultValue={network.name}
            render={({ field }) => {
              return (
                <TextField
                  className="mb-2"
                  field={field}
                  type="text"
                  label="Name"
                  placeholder="My Awesome Network"
                  aria-invalid={errors["name"] ? "true" : "false"}
                  aria-describedby="network-name-error"
                  autoFocus={true}
                  isDisabled={isSubmitting}
                  validationState={errors["name"] ? "invalid" : undefined}
                />
              );
            }}
          />
          {errors["name"] && (
            <p className="mt-2 text-sm text-red-600" id="network-name-error">
              You must provide a name for the Network
            </p>
          )}
          <Controller
            control={control}
            name="server"
            defaultValue={network.server}
            render={({ field }) => {
              return (
                <TextField
                  className="my-2"
                  field={field}
                  type="text"
                  label="Server"
                  placeholder="e.g. wss://s1.ripple.com"
                  aria-invalid={errors["server"] ? "true" : "false"}
                  aria-describedby="server-error"
                  autoFocus={true}
                  isDisabled={isSubmitting}
                  validationState={errors["server"] ? "invalid" : undefined}
                />
              );
            }}
          />
          {errors["server"] && (
            <p className="mt-2 text-sm text-red-600" id="server-error">
              You must provide a server for the Network
            </p>
          )}
          <div className="text-sm font-medium leading-5 text-gray-500 mt-5 mb-4">
            Additional Options
          </div>
          <Controller
            control={control}
            name="options.supportsNFTokenMethods"
            defaultValue={network.options?.supportsNFTokenMethods || false}
            render={({ field }) => {
              return (
                <Checkbox
                  field={field}
                  className="my-2"
                  label="Supports NFToken Methods"
                  isDisabled={isSubmitting}
                />
              );
            }}
          />
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
              </div>
            ) : (
              <>Update Network</>
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
