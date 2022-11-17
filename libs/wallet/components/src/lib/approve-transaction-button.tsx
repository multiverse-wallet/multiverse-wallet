import React, { useMemo } from 'react';
import { Button } from '@multiverse-wallet/shared/components/button';
import { Transaction } from '@multiverse-wallet/multiverse';
import { useWalletAPI } from '@multiverse-wallet/wallet/hooks';
import { Spinner } from '@multiverse-wallet/shared/components/spinner';
import { CheckIcon, XIcon } from '@heroicons/react/solid';
import ReactTimeago from 'react-timeago';
import { useNavigate } from 'react-router-dom';
import { useXRPLContext } from '@xrpl-components/react/hooks/xrpl';

export interface ApproveTransactionButtonProps {
  transaction: Transaction;
}

export function ApproveTransactionButton({
  transaction,
}: ApproveTransactionButtonProps) {
  const { api } = useWalletAPI();
  const navigate = useNavigate();
  const expiresAt = useMemo(() => {
    return (transaction.createdAt || Date.now()) + 60_000;
  }, [transaction]);
  const isExpired = Date.now() > expiresAt;
  const isPending = transaction.status === 'pending';
  const closePopup = () => {
    navigate('/popup');
    api.closePopup();
  };
  switch (transaction.status) {
    case 'pending':
      return (
        <>
          <Button
            className="mx-5"
            isDisabled={!transaction?.id}
            onPress={() =>
              transaction?.id && api.signAndSubmitTransaction(transaction.id)
            }
          >
            Approve & Submit
          </Button>
          <Button
            className="mx-5 mt-1"
            variant="cancel"
            size="small"
            isDisabled={!transaction?.id}
            onPress={() =>
              transaction?.id && api.cancelTransaction(transaction.id)
            }
          >
            Cancel
          </Button>
          {!isExpired && isPending && (
            <div className="mx-5 mt-2 text-gray-400">
              Pending transaction expires <ReactTimeago date={expiresAt} />
            </div>
          )}
        </>
      );
    case 'submitted':
      return (
        <div className="px-5">
          <div className="rounded-full shadow hover:shadow-lg bg-gradient-to-br from-blue-300 to-blue-400 border-none text-white -outline-teal active:bg-teal-600 px-5 py-2.5 text-sm leading-6 font-medium inline-flex items-center justify-center transition ease-in-out duration-500 mb-3 w-full">
            Submitted{' '}
            <span className="ml-2">
              <Spinner size="small" variant="light" />
            </span>
          </div>
        </div>
      );
    case 'validated':
      return (
        <div className="px-5">
          <div className="rounded-full shadow hover:shadow-lg bg-gradient-to-br from-green-300 to-green-400 border-none text-white -outline-teal active:bg-teal-600 px-5 py-2.5 text-sm leading-6 font-medium inline-flex items-center justify-center transition ease-in-out duration-500 mb-3 w-full">
            Validated <CheckIcon className="ml-2 h-6 w-6" />
          </div>
          <Button
            variant="dark"
            className="w-full"
            size="small"
            onPress={() => closePopup()}
          >
            Close
          </Button>
        </div>
      );
    case 'cancelled':
      return (
        <div className="px-5">
          <div className="rounded-full shadow hover:shadow-lg bg-gradient-to-br from-gray-300 to-gray-400 border-none text-white -outline-teal active:bg-teal-600 px-5 py-2.5 text-sm leading-6 font-medium inline-flex items-center justify-center transition ease-in-out duration-500 mb-3 w-full">
            Cancelled <XIcon className="ml-2 h-6 w-6" />
          </div>
          <Button
            variant="cancel"
            className="w-full"
            size="small"
            onPress={() => closePopup()}
          >
            Close
          </Button>
        </div>
      );
    case 'failed':
      return (
        <div className="px-5">
          <div className="rounded-full shadow hover:shadow-lg bg-gradient-to-br from-red-300 to-red-400 border-none text-white -outline-teal active:bg-teal-600 px-5 py-2.5 text-sm leading-6 font-medium inline-flex items-center justify-center transition ease-in-out duration-500 mb-3 w-full">
            Failed <XIcon className="ml-2 h-6 w-6" />
          </div>
          <Button
            variant="cancel"
            className="w-full"
            size="small"
            onPress={() => closePopup()}
          >
            Close
          </Button>
        </div>
      );
    default:
      return null;
  }
}
