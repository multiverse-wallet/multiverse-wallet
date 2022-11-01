import React, { useCallback, useMemo } from "react";
import { Transaction } from "@multiverse-wallet/multiverse";
import { AccountName } from "./account-name";
import { XRPLAmount } from "./xrpl-amount";
import { AccountBalance } from "./account-balance";
import ReactTimeago from "react-timeago";
import { Tabs } from "./tabs";

export interface TransactionSummaryProps {
  transaction: Partial<Transaction>;
}

export function TransactionSummary({ transaction }: TransactionSummaryProps) {
  const tabs = useMemo(() => {
    const tabs = [
      {
        name: "Raw JSON",
        component: (
          <div className="m-3">
            <pre className="p-3 bg-slate-50 rounded text-xs overflow-x-scroll">
              {!!transaction && JSON.stringify(transaction.txJson, null, 2)}
            </pre>
          </div>
        ),
      },
    ];
    switch (transaction?.txJson?.TransactionType?.toLowerCase()) {
      case "payment":
        return [
          {
            name: "Send Payment",
            component: <PaymentTransactionSummary transaction={transaction} />,
          },
          ...tabs,
        ];
    }
    return tabs
  }, [transaction]);
  return (
    <div className="-mt-5">
      <Tabs tabs={tabs} />
    </div>
  );
}

export function PaymentTransactionSummary({
  transaction,
}: TransactionSummaryProps) {
  const { txJson } = transaction;
  if (!txJson) {
    return <>No transaction JSON</>;
  }
  const { Account, Destination, DestinationTag, Amount } = txJson;
  return (
    <div className="px-5 py-3">
      <div className="p-4 bg-gray-50 rounded-md">
        <div className="mb-2 text-xs text-gray-600">Amount</div>
        <XRPLAmount amount={Amount}>
          {({ value, currency }) => {
            return (
              <>
                <XRPLAmount.Value>{value}</XRPLAmount.Value>
                <XRPLAmount.Currency>{currency}</XRPLAmount.Currency>
              </>
            );
          }}
        </XRPLAmount>
      </div>
      <div className="mt-3 p-3 bg-gray-50 rounded-md">
        <div className="mb-1 -mt-1 text-xs text-gray-600">From</div>
        <div className="text-sm font-semibold">
          <AccountName address={Account} />
          <div className="text-gray-500 font-medium text-md">
            Current Balance: <AccountBalance address={Account} />
          </div>
        </div>
      </div>
      <div className="mt-3 p-3 bg-gray-50 rounded-md">
        <div className="mb-1 -mt-1 text-xs text-gray-600">Destination</div>
        <div className="text-sm font-semibold">{Destination}</div>
      </div>
      {DestinationTag && (
        <div className="mt-3 p-3 bg-gray-50 rounded-md">
          <div className="mb-1 -mt-1 text-xs text-gray-600">
            Destination Tag
          </div>
          <div className="text-sm font-semibold">{DestinationTag}</div>
        </div>
      )}
    </div>
  );
}
