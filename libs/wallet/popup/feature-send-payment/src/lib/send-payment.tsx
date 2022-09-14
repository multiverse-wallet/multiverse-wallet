import { ChevronLeftIcon } from "@heroicons/react/outline";
import { Button } from "@multiverse-wallet/shared/components/button";
import { AddressInput, TopBar } from "@multiverse-wallet/wallet/components";
import { useState } from "react";
import { Link } from "react-router-dom";
import TransferAccount from "./transfer-account";

/* eslint-disable-next-line */
export interface SendPaymentProps {}

export function SendPayment(props: SendPaymentProps) {
  const [isTransfer, setIsTransfer] = useState(false);
  const [address, setAddress] = useState<string>();
  return (
    <>
      <TopBar />
      <div className="border-t border-b border-gray-50">
        <Link to="/popup">
          <a className="p-2 text-xs text-blue-400 underline flex items-center">
            <ChevronLeftIcon className="w-5 h-5 text-black inline" />
            Back
          </a>
        </Link>
      </div>
      <div className="text-center text-lg py-3">Send Payment to</div>
      {!isTransfer && (
        <div className="px-3 pb-3 relative">
          <AddressInput defaultValue={address} onChange={(address) => setAddress(address)} />
          {!address && (
            <div className="mt-3">
              <Button
                onPress={() => setIsTransfer(true)}
                className="w-full"
                variant="primary"
                size="medium"
              >
                Transfer between my accounts
              </Button>
            </div>
          )}
        </div>
      )}
      {isTransfer && <TransferAccount back={() => setIsTransfer(false)} onSelect={(account) => setAddress(account.address)} />}
    </>
  );
}

export default SendPayment;
