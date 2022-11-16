import React, { useEffect, useState } from 'react';
import { SelectAsset } from './select-asset';

export interface AmountInputProps {
  onChange?: (v: {
    value?: string;
    currency?: string;
    issuer?: string | undefined;
  }) => void;
}

export function AmountInput({ onChange }: AmountInputProps) {
  const [asset, setAsset] = useState<{
    value: string;
    currency: string;
    issuer?: string | undefined;
  }>();
  const [amount, setAmount] = useState<string>();
  useEffect(() => {
    onChange &&
      onChange({
        value: amount,
        currency: asset?.currency,
        issuer: asset?.issuer,
      });
  }, [amount, asset, onChange]);
  return (
    <div>
      <div className="my-3 flex flex-col gap-4">
        <div className="grid grid-cols-3">
          <div className="flex items-center text-md">Asset:</div>
          <div className="col-span-2">
            <SelectAsset onChange={(asset) => setAsset(asset)} />
          </div>
        </div>
        <div className="grid grid-cols-3">
          <div className="flex items-center text-md">
            <div>
              <div>Amount:</div>
              <div
                onClick={() => setAmount(asset?.value)}
                className="text-xs underline text-blue-400 font-bold"
              >
                Set to Max
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <Input
              currency={asset?.currency}
              amount={amount}
              onChange={setAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface InputProps {
  amount?: string;
  currency?: string;
  onChange: (value: string) => void;
}

function Input({ currency, amount, onChange }: InputProps) {
  return (
    <div>
      <input
        className="border shadow-sm text-xl text-right rounded-md p-2 w-full"
        type="number"
        value={amount}
        defaultValue={'0.00'}
        onChange={(t) => onChange(t.target.value)}
      />
    </div>
  );
}
