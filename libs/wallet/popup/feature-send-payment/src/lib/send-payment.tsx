import { ChevronLeftIcon } from '@heroicons/react/outline';
import { Button } from '@multiverse-wallet/shared/components/button';
import {
  AddressInput,
  AmountInput,
  TopBar,
} from '@multiverse-wallet/wallet/components';
import {
  useSelectedAccount,
  useWalletState,
} from '@multiverse-wallet/wallet/hooks';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TransferAccount from './transfer-account';

/* eslint-disable-next-line */
export interface SendPaymentProps {}

export function SendPayment(props: SendPaymentProps) {
  const [isTransfer, setIsTransfer] = useState(false);
  const { api } = useWalletState();
  const [address, setAddress] = useState<string>();
  const [tag, setTag] = useState<number>();
  const { selectedAccount } = useSelectedAccount();
  const [amount, setAmount] = useState<{
    value?: string;
    currency?: string;
    issuer?: string | undefined;
  }>();
  const navigate = useNavigate();
  const isButtonEnabled = useMemo(() => {
    return selectedAccount?.address && amount && address;
  }, [amount, address, selectedAccount]);
  const requestTransaction = async () => {
    const tx = {
      TransactionType: 'Payment',
      Account: selectedAccount?.address,
      Amount: formatAmount(amount),
      Destination: address,
      DestinationTag: tag! > 0 ? tag : undefined,
    };
    api.requestTransaction(tx).then((txId) => {
      navigate(`/popup/transaction/${txId}`);
    });
  };
  return (
    <>
      <TopBar />
      <div className="border-t border-b border-gray-50">
        <Link
          to="/popup"
          className="p-2 text-xs text-blue-400 underline flex items-center"
        >
          <ChevronLeftIcon className="w-5 h-5 text-black inline" />
          Back
        </Link>
      </div>
      <div className="text-center text-lg py-3">Send Payment</div>
      <div className="p-5 relative">
        <AddressInput
          defaultValue={address}
          onChange={({ address, tag }) => {
            setAddress(address);
            setTag(tag);
          }}
        />
        <AmountInput onChange={setAmount} />
        <Button
          isDisabled={!isButtonEnabled}
          onPress={() => requestTransaction()}
          size="medium"
          variant="primary"
          className="w-full mt-3"
        >
          Send Payment
        </Button>
      </div>
    </>
  );
}

function formatAmount(amount?: {
  value?: string;
  currency?: string;
  issuer?: string | undefined;
}):
  | undefined
  | string
  | {
      value?: string;
      currency?: string;
      issuer?: string | undefined;
    } {
  if (amount?.currency === 'XRP' && amount.value) {
    return (+amount.value * 1e6).toString();
  }
  return amount;
}

export default SendPayment;
