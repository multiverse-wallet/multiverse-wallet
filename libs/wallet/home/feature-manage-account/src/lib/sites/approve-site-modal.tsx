import { useAccounts, useWalletState } from "@multiverse-wallet/wallet/hooks";
import { Button } from "@multiverse-wallet/shared/components/button";
import {
  ModalDialogBody,
  ModalDialogFooter,
  ModalTitleProps,
} from "@multiverse-wallet/shared/components/modal-dialog";
import { Spinner } from "@multiverse-wallet/shared/components/spinner";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { SiteConnectionRequest } from "@multiverse-wallet/multiverse";
import { AccountBalance } from "@multiverse-wallet/wallet/components";

interface ApproveSiteModalProps {
  connectionRequest: SiteConnectionRequest;
  titleProps: ModalTitleProps;
  closeModal: () => void;
}

export function ApproveSiteModal({
  connectionRequest,
  titleProps,
  closeModal,
}: ApproveSiteModalProps) {
  const { api } = useWalletState();
  const accounts = useAccounts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    setError,
    clearErrors,
  } = useForm();

  async function onSubmit({ account }: any) {
    setIsSubmitting(true);
    clearErrors();
    const accounts = Object.keys(account || {}).filter((k) => !!account[k]);
    try {
      await api.approveSite({
        origin: connectionRequest.origin!,
        allowedAccounts: accounts,
      });
      await api.closePopup();
      closeModal();
    } catch (e) {
      console.log(e);
      setError("account", {
        type: "required",
      });
    }
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalDialogBody>
        <div className="flex w-full items-center justify-center my-3">
          <div className="py-2 px-5 text-xs rounded-full border text-white bg-gray-900 font-light">
            {connectionRequest.origin}
          </div>
        </div>
        <div className="flex w-full items-center justify-center">
          <img src="/assets/logo.svg" width={100} />
        </div>
        <div className="flex w-full items-center justify-center mt-1">
          <div className="font-extrabold text-2xl">Connect with Multiverse</div>
        </div>
        <div className="flex w-full items-center justify-center mb-3">
          <div className="text-sm text-gray-800">
            Select the account(s) to use on this site:
          </div>
        </div>
        <div className="border relative rounded-md flex-row divide-y max-h-52 overflow-y-scroll">
          {accounts?.map((account) => (
            <Controller
              key={account.id}
              control={control}
              name={`account.${account.id}`}
              defaultValue={false}
              render={({ field }) => {
                return (
                  <label
                    className="w-full p-3 h-16 flex gap-4"
                    htmlFor={account.id}
                  >
                    <div className="flex items-center">
                      <input id={account.id} type="checkbox" {...field} />
                    </div>
                    <div className="flex-grow flex items-center">
                      <div>
                        <div className="text-sm font-bold text-gray-700">
                          {account.name}
                        </div>
                        <div className="text-xs text-gray-700">
                          <AccountBalance account={account} />
                        </div>
                      </div>
                    </div>
                  </label>
                );
              }}
            />
          ))}
        </div>
        {errors["account"] && (
          <p className="mt-2 text-sm text-red-600" id="account-name-error">
            You must select an account to approve the connection.
          </p>
        )}
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
                <span className="ml-4">Connecting...</span>
              </div>
            ) : (
              <>Approve Connection</>
            )}
          </Button>
        </span>
        <Button
          variant="cancel"
          size="medium"
          onPress={() => {
            api.closePopup();
            closeModal();
          }}
        >
          Cancel
        </Button>
      </ModalDialogFooter>
    </form>
  );
}
