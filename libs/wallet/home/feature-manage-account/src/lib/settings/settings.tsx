import { joiResolver } from "@hookform/resolvers/joi";
import { Button } from "@multiverse-wallet/shared/components/button";
import { Checkbox } from "@multiverse-wallet/shared/components/checkbox";
import { Spinner } from "@multiverse-wallet/shared/components/spinner";
import { TextField } from "@multiverse-wallet/shared/components/text-field";
import { useSettings, useWalletState } from "@multiverse-wallet/wallet/hooks";
import Joi from "joi";
import React, { Fragment, useState } from "react";
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  useForm,
} from "react-hook-form";
import { Menu, Transition } from "@headlessui/react";
import * as currencyCodes from "currency-codes";
import { ArrowDownIcon, ChevronDownIcon } from "@heroicons/react/solid";

export function Settings() {
  const { api } = useWalletState();
  const settings = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: joiResolver(
      Joi.object({
        emailAddress: Joi.string()
          .email({ tlds: { allow: false } })
          .optional(),
        feedbackOptIn: Joi.boolean().default(false).required(),
        exchangeRateCurrency: Joi.string().required(),
      })
    ),
  });
  async function onSubmit(settings: any) {
    setIsSubmitting(true);
    await api.updateSettings(settings);
    setIsSubmitting(false);
  }
  if (!settings) {
    return null;
  }
  return (
    <div>
      <header className="mt-4 mb-12">
        <div className="mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
            Settings
          </h1>
          <p className="mt-4 mx-auto text-lg leading-6 text-gray-500">
            Manage your settings.
          </p>
        </div>
      </header>
      <div className="mb-12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Controller
              control={control}
              name="emailAddress"
              defaultValue={settings?.emailAddress}
              render={({ field }) => {
                return (
                  <TextField
                    className="mb-2"
                    field={field}
                    type="text"
                    label="Email Address"
                    placeholder="Enter email address"
                    aria-invalid={errors["emailAddress"] ? "true" : "false"}
                    aria-describedby="email-address-error"
                    autoFocus={true}
                    isDisabled={isSubmitting}
                    validationState={
                      errors["emailAddress"] ? "invalid" : undefined
                    }
                  />
                );
              }}
            />
            {errors["emailAddress"] && (
              <p className="mt-2 text-sm text-red-600" id="email-address-error">
                Invalid email address
              </p>
            )}
          </div>
          <div className="mt-4">
            <Controller
              control={control}
              name="feedbackOptIn"
              defaultValue={settings?.feedbackOptIn}
              render={({ field }) => {
                return (
                  <Checkbox
                    field={field}
                    label="Opt-in to providing feedback*"
                    isDisabled={isSubmitting}
                  />
                );
              }}
            />
            <p className="text-xs text-gray-400">
              * If you opt-in to providing feedback we may contact you via email
              from time-to-time to help us improve the product. We will never
              sell your data to third parties.
            </p>
          </div>
          <div className="mt-4">
            <Controller
              control={control}
              name="exchangeRateCurrency"
              defaultValue={settings?.exchangeRateCurrency || "USD"}
              render={({ field }) => {
                return (
                  <label className="flex-col block text-sm font-medium leading-5 text-gray-500 flex gap-2">
                    Exchange Rate Currency
                    <SelectExchangeRateCurrency field={field} />
                  </label>
                );
              }}
            />
          </div>
          <div className="mt-8">
            <div>
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
                    <span className="ml-4">Updating...</span>
                  </div>
                ) : (
                  <>Update settings</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export interface SelectExchangeRateCurrencyProps {
  field: ControllerRenderProps<FieldValues, "exchangeRateCurrency">;
}

export function SelectExchangeRateCurrency({
  field,
}: SelectExchangeRateCurrencyProps) {
  const supportedCurrencies = ["USD", "EUR", "GBP"];
  return (
    <div className="w-56">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="shadow inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white text-black focus-visible:ring-opacity-75">
            {currencyCodes.code(field.value)?.currency}
            <ChevronDownIcon
              className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div>
              {supportedCurrencies.map((currency) => (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => field.onChange(currency)}
                      className={`${
                        active ? "bg-slate-50" : ""
                      } group flex w-full items-center px-4 py-3 text-sm`}
                    >
                      {currencyCodes.code(currency)?.currency}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
