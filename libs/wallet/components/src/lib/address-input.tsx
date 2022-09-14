import {
  CheckCircleIcon,
  CheckIcon,
  ExclamationCircleIcon,
  LinkIcon,
  QrcodeIcon,
  XIcon,
} from "@heroicons/react/solid";
import {
  IWellKnownAccount,
  useWellKnownName,
} from "@multiverse-wallet/wallet/hooks";
import { useTextField, AriaTextFieldProps } from "@react-aria/textfield";
import { FocusableElement } from "@react-types/shared";
import { AccountBalance } from "@xrpl-components/react/components/account-balance";
import { useXRPLContext, XRPLContext } from "@xrpl-components/react/hooks/xrpl";
import React, { useEffect, useRef, useState } from "react";
import {
  xAddressToClassicAddress,
  isValidXAddress,
  isValidClassicAddress,
} from "xrpl";
import QrScanner from "qr-scanner";

export interface AddressInputProps extends AriaTextFieldProps {
  children?: (props: AddressInputChildProps) => JSX.Element;
  defaultValue?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

export interface AddressInputChildProps extends AriaTextFieldProps {
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  labelProps: React.DOMAttributes<FocusableElement>;
  descriptionProps: React.DOMAttributes<FocusableElement>;
  errorMessageProps: React.DOMAttributes<FocusableElement>;
  ref: React.MutableRefObject<HTMLInputElement | undefined>;
  isLoading: boolean;
  wellKnownName?: IWellKnownAccount;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  error: Error;
  classicAddress?: string;
  tag?: number;
  addressInput?: string;
  setAddressInput: (value: string) => void;
}

export function AddressInput(props: AddressInputProps) {
  let {
    defaultValue,
    children,
    className,
    inputClassName,
    labelClassName,
    onChange: originalOriginChange,
  } = props;
  const { client } = useXRPLContext();
  const [addressInput, setAddressInput] = useState(defaultValue);
  const [classicAddress, setClassicAddress] = useState<string>();
  const [tag, setTag] = useState<number>();
  const [addressError, setAddressError] = useState<Error>();
  const wellKnownName = useWellKnownName(addressInput);
  const ref = useRef<HTMLInputElement>();
  let onChange = (value: string) => {
    setAddressInput(value);
  };
  useEffect(() => {
    if (!addressInput) {
      setClassicAddress(undefined);
      setTag(undefined);
      setAddressError(undefined);
      return;
    }
    if (isValidClassicAddress(addressInput!)) {
      setClassicAddress(addressInput);
      setTag(undefined);
      setAddressError(undefined);
      return;
    }
    if (isValidXAddress(addressInput!)) {
      const { classicAddress, tag } = xAddressToClassicAddress(addressInput!);
      setClassicAddress(classicAddress);
      if (tag) {
        setTag(tag);
      } else {
        setTag(undefined);
      }
      setAddressError(undefined);
      return;
    }
    setAddressError(new Error("Invalid Address"));
  }, [addressInput]);
  useEffect(() => {
    originalOriginChange && originalOriginChange(classicAddress!);
  }, [classicAddress]);
  const { inputProps, labelProps, descriptionProps, errorMessageProps } =
    useTextField(
      {
        ...props,
        onChange,
        inputElementType: "input",
      },
      ref as any
    );
  if (!children) {
    children = AddressInputChildStyled;
  }
  return (
    <AccountBalance account={classicAddress || ""}>
      {(accountBalanceProps) => {
        return children!({
          ...props,
          ...accountBalanceProps,
          error: addressInput
            ? addressError || accountBalanceProps.error
            : undefined,
          wellKnownName,
          inputProps,
          labelProps,
          descriptionProps,
          errorMessageProps,
          className,
          inputClassName,
          labelClassName,
          ref,
          classicAddress,
          tag,
          addressInput,
          setAddressInput,
        });
      }}
    </AccountBalance>
  );
}

function AddressInputChildStyled({
  labelProps,
  inputProps,
  ref,
  label,
  description,
  error,
  descriptionProps,
  errorMessageProps,
  className,
  inputClassName,
  labelClassName,
  classicAddress,
  tag,
  wellKnownName,
  addressInput,
  setAddressInput,
}: AddressInputChildProps) {
  const { qrCodeValue, scan, isScanning, cancel: cancelQrScan } = useQRCodeScanner();
  const accountNotFound = error?.message == "Account not found.";
  useEffect(() => {
    qrCodeValue && setAddressInput(qrCodeValue);
  }, [qrCodeValue]);
  return (
    <div className={className}>
      {label && (
        <label className={labelClassName} {...labelProps}>
          {label}
        </label>
      )}
      {isScanning && (
        <div className="flex flex-col border p-3 my-2 rounded-md items-center justify-center">
          <div className="text-sm">Place QR Code in view of camera</div>
          <QrcodeIcon className="text-gray-300 w-20 h-20" />
          <a className="text-xs text-blue-400 underline cursor-pointer" onClick={() => cancelQrScan()}>Cancel</a>
        </div>
      )}
      <div
        className={classNames(
          className,
          "p-2 border w-full rounded-md flex items-center gap-2"
        )}
      >
        <QrcodeIcon
          onClick={() => scan()}
          className="w-6 h-6 inline text-gray-300"
        />
        <input
          className={classNames(
            inputClassName,
            "flex-grow text-sm focus:outline-none"
          )}
          {...inputProps}
          placeholder="Enter address here..."
          value={addressInput}
          ref={ref as any}
        />
        {addressInput && (
          <XIcon
            className="w-6 h-6 inline text-gray-300"
            onClick={() => setAddressInput("")}
          />
        )}
      </div>
      {description && <div {...descriptionProps}>{description}</div>}
      {!accountNotFound && error && (
        <div
          className="text-xs p-2 text-red-400 flex items-center"
          {...errorMessageProps}
        >
          <ExclamationCircleIcon className="-mt-0.5 mr-1 w-4 h-4 inline" />
          {error?.message}
        </div>
      )}
      {accountNotFound && (
        <div
          className="text-xs p-2 text-orange-400 flex items-center"
          {...errorMessageProps}
        >
          <ExclamationCircleIcon className="-mt-0.5 mr-1 w-4 h-4 inline" />
          Account not found, may not yet be initialized
        </div>
      )}
      {!!wellKnownName && (
        <>
          <div className="flex text-xs p-2">
            {wellKnownName?.domain ? (
              <div className="flex-grow flex items-center">
                <a href={`//` + wellKnownName?.domain} target="_blank">
                  <LinkIcon className="-mt-0.5 mr-1 w-4 h-4 inline" />
                  {wellKnownName?.name}
                </a>
              </div>
            ) : (
              <div className="flex-grow flex items-center">
                {wellKnownName?.name}
              </div>
            )}
            {wellKnownName?.verified && (
              <div className="text-blue-400 flex items-center">
                <CheckCircleIcon className="mr-1 w-5 h-5 inline" />
                Verified Account
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function useQRCodeScanner() {
  const [qrCodeValue, setQrCodeValue] = useState<string>();
  const [qrScanner, setQRScanner] = useState<QrScanner>();
  const [isScanning, setIsScanning] = useState(false);
  const scan = () => {
    const video = document.createElement("video");
    const qrScanner = new QrScanner(
      video,
      (result) => {
        setQrCodeValue(result);
        setQRScanner(undefined);
        setIsScanning(false);
      },
      (err) => {}
    );
    setQRScanner(qrScanner);
    setIsScanning(true);
    qrScanner.start();
    return () => cancel();
  };
  const cancel = () => {
    qrScanner?.stop();
    qrScanner?.$video.pause();
    qrScanner?.destroy();
    setQRScanner(undefined);
    setIsScanning(false);
  };
  return { qrCodeValue, isScanning, scan, cancel };
}

export async function setupCamera(
  video: HTMLVideoElement
): Promise<{ video: HTMLVideoElement; stream: MediaStream }> {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
    },
  });
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      resolve({ video, stream });
    };
  });
}
