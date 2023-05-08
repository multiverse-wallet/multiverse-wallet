import React, { useMemo } from 'react';
import { CubeIcon } from '@heroicons/react/solid';
import { Transaction } from '@multiverse-wallet/multiverse';
import { Button } from '@multiverse-wallet/shared/components/button';
import { ModalDialog } from '@multiverse-wallet/shared/components/modal-dialog';
import { useWalletAPI } from '@multiverse-wallet/wallet/hooks';
import { OverlayContainer } from '@react-aria/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { TransactionJSONModal } from './transaction-json-modal';
import TimeAgo from 'react-timeago';

export interface TransactionsProps {
  transactions: Transaction[];
}

interface TransactionsPropsTableRowWithModalProps {
  transaction: Transaction;
}

function TransactionsTableRowWithModal({
  transaction,
}: TransactionsPropsTableRowWithModalProps) {
  const transactionJsonOverlayState = useOverlayTriggerState({});
  const transactionRawResponseJsonOverlayState = useOverlayTriggerState({});
  const txResult = useMemo(() => {
    return transaction?.txJson?.meta?.TransactionResult || '-';
  }, [transaction]);
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 font-medium text-gray-900 truncate">
        {transaction.id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 font-medium text-gray-900 truncate">
        {transaction.status}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 font-medium text-gray-900 truncate">
        {txResult}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 font-medium text-gray-900 truncate">
        <TimeAgo date={transaction.createdAt} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 font-medium text-gray-900 truncate">
        <TimeAgo date={transaction.lastUpdate} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 font-medium text-gray-900 truncate">
        <p
          className="text-blue-400 underline font-bold cursor-pointer text-xs"
          onClick={() => transactionJsonOverlayState.open()}
        >
          View Transaction JSON
        </p>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 font-medium text-gray-900 truncate">
        <p
          className="text-blue-400 underline font-bold cursor-pointer text-xs"
          onClick={() => transactionRawResponseJsonOverlayState.open()}
        >
          View Raw Transaction Response
        </p>
      </td>
      {transactionJsonOverlayState.isOpen && (
        <OverlayContainer>
          <ModalDialog
            isOpen
            onClose={transactionJsonOverlayState.close}
            isDismissable
            render={(titleProps) => (
              <TransactionJSONModal
                title="Transaction JSON"
                titleProps={titleProps}
                json={transaction.txJson}
                closeModal={transactionJsonOverlayState.close}
              />
            )}
          />
        </OverlayContainer>
      )}
      {transactionRawResponseJsonOverlayState.isOpen && (
        <OverlayContainer>
          <ModalDialog
            isOpen
            onClose={transactionRawResponseJsonOverlayState.close}
            isDismissable
            render={(titleProps) => (
              <TransactionJSONModal
                title="Raw Transaction Response"
                titleProps={titleProps}
                json={transaction.rawTxResponse}
                closeModal={transactionRawResponseJsonOverlayState.close}
              />
            )}
          />
        </OverlayContainer>
      )}
    </tr>
  );
}
export function Transactions({ transactions }: TransactionsProps) {
  const { api } = useWalletAPI();
  return (
    <div>
      <header className="mt-4 mb-12">
        <div className="mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
            Transactions
          </h1>

          <p className="mt-4 mx-auto text-lg leading-6 text-gray-500">
            View your previous transactions.
          </p>
        </div>
      </header>
      <div className="mb-12">
        <div className="flex space-x-3">
          {/*
          Because we use useButton() within our shared Button component, focus management is handled correctly across all
          browsers. Focus is restored to the button once the dialog closes.
        */}
          <Button
            variant="secondary"
            size="small"
            onPress={() => api.clearTransactionHistory()}
          >
            Clear Transaction History
          </Button>
        </div>
      </div>
      <div className="flex flex-col">
        <div>
          <div>
            <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
              {transactions?.length < 1 && (
                <div className="bg-white divide-y divide-gray-200 h-96">
                  <div className="flex flex-col items-center justify-center h-full">
                    <CubeIcon className="w-20 h-20 text-gray-200" />

                    <p className="mt-4 text-gray-300">
                      You don't have any transactions to view yet.
                    </p>
                  </div>
                </div>
              )}

              {transactions?.length > 0 && (
                <table className="table w-full min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Tx Hash
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Transaction Result
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Last Update
                      </th>
                      <th className="w-10 px-6 py-3 bg-gray-50" />
                      <th className="w-10 px-6 py-3 bg-gray-50" />
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction, i) => {
                      return (
                        <TransactionsTableRowWithModal
                          transaction={transaction}
                        />
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
