import { useWalletState } from "@multiverse-wallet/wallet/hooks";
import { Button } from "@multiverse-wallet/shared/components/button";
import React from "react";
import { SelectNetwork } from "./select-network";
import { SelectAccount } from "./select-account";
import { LockClosedIcon } from "@heroicons/react/solid";
import { useXRPLContext } from "@xrpl-components/react/hooks/xrpl";

export function TopBar() {
  const { api } = useWalletState();
  const { error, reconnect } = useXRPLContext();
  return (
    <div>
      {error && (
        <div className="w-full p-3 bg-gradient-to-br from-red-500 to-orange-400 text-white to text-xs">
          XRPL Client Error: {error.message}
          <button
            onClick={() => reconnect()}
            className="font-bold float-right text-white underline"
          >
            Reconnect
          </button>
        </div>
      )}
      <div className="p-4 w-full z-10">
        <div className="grid grid-cols-3 items-center space-x-2">
          <div>
            <SelectNetwork align="left" />
          </div>
          <div className="flex justify-center">
            <img
              className="mx-auto"
              src="/assets/logo.png"
              width="70"
              alt="Multiverse Wallet"
            />
          </div>
          <div className="">
            <div className="float-right">
              <SelectAccount showIcon={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
