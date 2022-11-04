import { AriaTextFieldProps } from "@react-aria/textfield";
import { AccountBalance } from "@xrpl-components/react/components/account-balance";
import {
  isValidXAddress,
  xAddressToClassicAddress,
  isValidClassicAddress,
} from "xrpl";
import React, { useEffect, useMemo, useState } from "react";

export interface AddressInputProps
  extends Omit<AriaTextFieldProps, "onChange"> {
  className?: string;
  errorClassName?: string;
  onChange: (value: {
    address: string | undefined;
    tag: number | undefined;
  }) => void;
}

const defaultClassNames =
  "p-2 rounded border shadow-sm dark:text-gray-100 dark:bg-gray-700 dark:border-gray-500 dark:focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:ring-opacity-50 dark:placeholder-gray-500 rounded-md focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 placeholder-gray-400 py-3 px-4 block w-full transition ease-in-out duration-150 w-full";

const defaultErrorClassNames = "m-1 text-red-600 text-sm";

export function AddressInput(props: AddressInputProps) {
  const [error, setError] = useState<string>();
  const [value, setValue] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [tag, setTag] = useState<number | undefined>();
  const [showTagInput, setShowTagInput] = useState<boolean>(false);
  const showTagField = useMemo(() => {
    return !!tag || showTagInput;
  }, [tag, showTagInput]);
  useEffect(() => {
    if (!value) {
      setError(undefined);
      setValue(undefined);
      setTag(undefined);
      return;
    }
    if (isValidXAddress(value)) {
      const { classicAddress, tag } = xAddressToClassicAddress(value);
      setAddress(classicAddress);
      setTag(tag ? tag : undefined);
      setError(undefined);
      return;
    }
    if (isValidClassicAddress(value)) {
      setAddress(value);
      setTag(undefined);
      setError(undefined);
      return;
    }
    setError("Invalid address, must be either a classic address or X-Address");
    setAddress(undefined);
    setTag(undefined);
  }, [error, value]);
  useEffect(() => {
    props.onChange({ address, tag });
  }, [address, tag]);
  return (
    <>
      <input
        className={props.className || defaultClassNames}
        autoComplete="off"
        placeholder="Enter a classic address or X-Address"
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex my-1">
        <div className="flex-grow"></div>
        <div
          onClick={() => setShowTagInput(!showTagInput)}
          className="text-xs text-underline text-blue-400 underline font-bold cursor-pointer"
        >
          Set Tag
        </div>
      </div>
      {showTagField && (
        <div className="flex items-center grid grid-cols-3">
          <div>Tag:</div>
          <div className="col-span-2">
            <input
              type="number"
              className={props.className || defaultClassNames}
              autoComplete="off"
              placeholder="Enter a tag"
              onChange={(e) => setTag(+e.target.value)}
            />
          </div>
        </div>
      )}
      <div className={props.errorClassName || defaultErrorClassNames}>
        {error}
      </div>
    </>
  );
}
