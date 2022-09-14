import { useState } from 'react';
import { delay } from '@multiverse-wallet/shared/utils';

interface CopyValueProps {
  valueToCopy: string;
  render: (copyState: CopyValueState, onCopyClicked: () => void) => JSX.Element;
}

export type CopyValueState = 'copy' | 'copied';

export function CopyValue({ valueToCopy, render }: CopyValueProps) {
  const [copyState, setCopyState] = useState<CopyValueState>('copy');

  async function onCopyClicked() {
    try {
      await navigator.clipboard.writeText(valueToCopy);

      setCopyState('copied');

      await delay(2000);

      setCopyState('copy');
    } catch (err) {
      console.error('Error: Could not copy text: ', err);
    }
  }

  return render(copyState, onCopyClicked);
}
