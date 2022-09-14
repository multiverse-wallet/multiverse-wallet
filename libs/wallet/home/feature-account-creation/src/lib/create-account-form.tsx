import { joiResolver } from "@hookform/resolvers/joi";
import { Button } from "@multiverse-wallet/shared/components/button";
import { TextField } from "@multiverse-wallet/shared/components/text-field";
import Joi from "joi";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CreateAccountFormConfirm } from "./create-account-form-confirm";
import { CreateAccountFormSeedPhrase } from "./create-account-form-seed-phrase";

type StepState = "upcoming" | "active" | "completed";

interface StepProps {
  stepNumber: string;
  stepName: string;
  state: StepState;
  isFinalStep?: boolean;
  onClick?: () => void;
}

const Step = ({
  stepNumber,
  stepName,
  state,
  isFinalStep,
  onClick,
}: StepProps) => {
  return (
    <li
      className={`relative md:flex-1 md:flex ${
        state === "completed" ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <div
        className={`group flex items-center ${
          state === "completed" ? "w-full" : ""
        }`}
      >
        <div className="px-6 py-4 flex items-center text-sm leading-5 font-medium space-x-4">
          <div
            className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition ease-in-out duration-150 ${
              state === "completed" ? "bg-gradient-to-br from-orange-500 to-purple-500 group-hover:bg-purple-700" : ""
            } ${
              state === "upcoming"
                ? "border-2 border-gray-300 cursor-not-allowed"
                : ""
            } ${state === "active" ? "border-2 border-purple-500" : ""}`}
          >
            {state === "completed" && (
              <svg
                className="w-6 h-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}

            {state === "upcoming" && (
              <span className="text-gray-500 transition ease-in-out duration-150 cursor-not-allowed">
                {stepNumber}
              </span>
            )}

            {state === "active" && (
              <p className="text-purple-500">{stepNumber}</p>
            )}
          </div>
          <p
            className={`text-sm leading-5 font-medium ${
              state === "completed" ? "text-gray-900" : ""
            } ${
              state === "upcoming"
                ? "text-gray-500 cursor-not-allowed transition ease-in-out duration-150"
                : ""
            } ${state === "active" ? "text-purple-500" : ""}`}
          >
            {stepName}
          </p>
        </div>
      </div>
      {!isFinalStep && (
        <div className="hidden md:block absolute top-0 right-0 h-full w-5">
          <svg
            className="h-full w-full text-gray-300"
            viewBox="0 0 22 80"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0 -2L20 40L0 82"
              vectorEffect="non-scaling-stroke"
              stroke="currentcolor"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </li>
  );
};

interface StepConfig {
  name: "Password" | "Secret Recovery Phrase" | "Confirm";
  state: StepState;
}

interface CreateAccountFormProps {
  onNewAccountData: (mnemonic: string, password: string) => void;
}

export function CreateAccountForm({
  onNewAccountData,
}: CreateAccountFormProps) {
  const [password, setPassword] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [steps, setSteps] = useState<StepConfig[]>([
    {
      name: "Password",
      state: "active",
    },
    {
      name: "Secret Recovery Phrase",
      state: "upcoming",
    },
    {
      name: "Confirm",
      state: "upcoming",
    },
  ]);

  const { handleSubmit, formState: { errors }, control } = useForm({
    resolver: joiResolver(
      Joi.object({
        password: Joi.string().required(),
        confirmPassword: Joi.string().required().valid(Joi.ref("password")),
      })
    ),
  });

  function onPasswordFormSubmit({ password }: any) {
    setPassword(password);
    const newSteps = [...steps];
    newSteps.find((s) => s.name === "Password")!.state = "completed";
    newSteps.find((s) => s.name === "Secret Recovery Phrase")!.state = "active";
    setSteps(newSteps);
  }

  function onConfirmedMnemonicBackup(newMnemonic: string) {
    setMnemonic(newMnemonic);
    const newSteps = [...steps];
    newSteps.find((s) => s.name === "Secret Recovery Phrase")!.state = "completed";
    newSteps.find((s) => s.name === "Confirm")!.state = "active";
    setSteps(newSteps);
  }

  function onStepClicked(i: number) {
    const newSteps = [...steps];
    const step = newSteps[i];
    step.state = "active";
    for (let j = i + 1; j < newSteps.length; j++) {
      newSteps[j].state = "upcoming";
    }
    setSteps(newSteps);
  }

  function onSaveStart() {
    const newSteps = [...steps];
    newSteps.find((s) => s.name === "Confirm")!.state = "completed";
    setSteps(newSteps);
  }

  function onSaveEnd() {
    onNewAccountData(mnemonic, password);
  }

  return (
    <div className="max-w-5xl m-auto">
      <div className="relative max-w-2xl m-auto">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <nav>
            <ul className="border border-r-0 border-l-0 border-t-0 border-gray-200 divide-y divide-gray-200 md:flex md:divide-y-0">
              {steps.map((step, i) => {
                return (
                  <Step
                    key={i}
                    stepNumber={`0${i + 1}`}
                    stepName={step.name}
                    state={step.state}
                    isFinalStep={i === steps.length - 1}
                    onClick={() => {
                      // Only allow going "backwards" to already completed states
                      if (step.state !== "completed") {
                        return;
                      }
                      onStepClicked(i);
                    }}
                  />
                );
              })}
            </ul>
          </nav>

          {steps.find((s) => s.name === "Password")!.state === "active" && (
            <form onSubmit={handleSubmit(onPasswordFormSubmit)}>
              <div className="space-y-8 pb-8">
                <div className="px-8 pt-8 pb-2">
                  <h2 className="text-3xl font-extrabold leading-tight text-gray-900">
                    Set Password
                  </h2>
                  <p className="mt-3 text-gray-600 text-sm">
                    In order to create an account on this device you need to set
                    a password which will be used to encrypt your unique seed
                    phrase as part of the next step.
                  </p>
                </div>

                <div className="px-8">
                  <Controller
                    control={control}
                    name="password"
                    defaultValue={password}
                    render={({ field }) => {
                      return (
                        <TextField
                          field={field}
                          label="New Password"
                          type="password"
                          placeholder=""
                          autoFocus={true}
                          aria-invalid={errors["password"] ? "true" : "false"}
                          aria-describedby="password-error"
                          validationState={
                            errors["password"] ? "invalid" : undefined
                          }
                        />
                      );
                    }}
                  />
                  {errors["password"] && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="password-error"
                    >
                      You must create a password in order to encrypt the
                      account.
                    </p>
                  )}
                </div>

                <div className="px-8">
                  <Controller
                    control={control}
                    name="confirmPassword"
                    defaultValue={password}
                    render={({ field }) => {
                      return (
                        <TextField
                          field={field}
                          label="Confirm Password"
                          type="password"
                          placeholder=""
                          aria-invalid={
                            errors["confirmPassword"] ? "true" : "false"
                          }
                          aria-describedby="confirm-password-error"
                          validationState={
                            errors["confirmPassword"] ? "invalid" : undefined
                          }
                        />
                      );
                    }}
                  />
                  {errors["confirmPassword"] && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="confirm-password-error"
                    >
                      {errors["confirmPassword"]["type"] as any === "any.required" &&
                        "Please confirm the password in order to encrypt the account."}
                      {errors["confirmPassword"]["type"] as any === "any.only" &&
                        "This does not currently match your given password."}
                    </p>
                  )}
                </div>

                <div className="px-8 flex justify-end">
                  <Button type="submit" size="medium" variant="primary">
                    Next Step
                  </Button>
                </div>
              </div>
            </form>
          )}

          {steps.find((s) => s.name === "Secret Recovery Phrase")!.state === "active" && (
            <CreateAccountFormSeedPhrase
              onConfirmedBackup={onConfirmedMnemonicBackup}
            />
          )}

          {(steps.find((s) => s.name === "Confirm")!.state === "active" ||
            steps.find((s) => s.name === "Confirm")!.state === "completed") && (
            <CreateAccountFormConfirm
              mnemonic={mnemonic}
              onSaveStart={onSaveStart}
              onSaveEnd={onSaveEnd}
            />
          )}
        </div>
      </div>
    </div>
  );
}
