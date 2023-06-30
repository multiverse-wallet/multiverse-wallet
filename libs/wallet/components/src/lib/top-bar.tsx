import React from 'react';
import { SelectNetwork } from './select-network';
import { SelectAccount } from './select-account';
import { useXRPLContext } from '@xrpl-components/react/hooks/xrpl';

export function TopBar() {
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
      <div className="w-full z-10">
        <div className="flex items-center space-x-2 h-16 px-2">
          <div className="flex">
            <SelectNetwork />
          </div>
          <div className="flex-grow"></div>
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
