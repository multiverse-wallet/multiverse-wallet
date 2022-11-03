import { ChevronLeftIcon } from "@heroicons/react/outline";
import {
  ApproveTransactionButton,
  TopBar,
  TransactionSummary,
} from "@multiverse-wallet/wallet/components";
import {
  useTransaction,
  useWalletState,
} from "@multiverse-wallet/wallet/hooks";
import { useParams } from "react-router-dom";
import { Button } from "@multiverse-wallet/shared/components/button";

/* eslint-disable-next-line */
export interface TransactionProps {}

export function Transaction(props: TransactionProps) {
  const { transactionId } = useParams();
  const { transaction, error } = useTransaction(transactionId);
  if (error) {
    return <p>{error?.message}</p>;
  }
  if (!transaction) {
    return <>Loading...</>;
  }
  return (
    <>
      <TopBar />
      <TransactionSummary transaction={transaction} />
      <ApproveTransactionButton transaction={transaction} />
    </>
  );
}

export default Transaction;
