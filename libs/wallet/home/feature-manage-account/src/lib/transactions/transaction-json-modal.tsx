import { Button } from "@multiverse-wallet/shared/components/button";
import {
  ModalDialogBody,
  ModalDialogFooter,
  ModalDialogHeader,
  ModalTitleProps,
} from "@multiverse-wallet/shared/components/modal-dialog";
import { useMemo } from "react";

interface TransactionJSONModalJSONProps {
  title: string;
  json: any;
  titleProps: ModalTitleProps;
  closeModal: () => void;
}

export function TransactionJSONModal({
  json,
  title,
  titleProps,
  closeModal,
}: TransactionJSONModalJSONProps) {
  const transactionJson = useMemo(() => {
    return JSON.stringify(json, null, 2);
  }, [json]);
  return (
    <>
      <ModalDialogHeader titleProps={titleProps} title={title} />
      <ModalDialogBody>
        <pre className="bg-gray-50 overflow-y-scroll h-96 rounded-lg p-5">{transactionJson}</pre>
      </ModalDialogBody>
      <ModalDialogFooter>
        <Button variant="cancel" size="medium" onPress={closeModal}>
          Close
        </Button>
      </ModalDialogFooter>
    </>
  );
}
