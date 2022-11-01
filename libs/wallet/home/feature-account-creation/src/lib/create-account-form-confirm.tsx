import { Button } from '@multiverse-wallet/shared/components/button';
import { delay, shuffleArray } from '@multiverse-wallet/shared/utils';
import React, { useEffect, useState } from 'react';
import { MnemonicViewer } from '@multiverse-wallet/wallet/components';

interface CreateAccountFormConfirmProps {
  mnemonic: string;
  /**
   * We separate save into two stages so we can update the visuals of the stepper
   * and then delay to show the user a message before actually committing the data.
   */
  onSaveStart: () => void;
  onSaveEnd: () => void;
}

export function CreateAccountFormConfirm({
  mnemonic,
  onSaveStart,
  onSaveEnd,
}: CreateAccountFormConfirmProps) {
  const [unshuffledWords, setUnshuffledWords] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [showCheckmark, setShowCheckmark] = useState(false);
  /**
   * We need to track which index in the shuffled words array the word belongs to because it is possible
   * that a mnemonic could contain duplicate words
   */
  const [selectedWordsAndIndices, setSelectedWordsAndIndices] = useState<
    [string, number][]
  >([]);

  useEffect(() => {
    const unshuffled = (mnemonic || '').split(' ');
    setUnshuffledWords(unshuffled);
    const shuffled = shuffleArray(unshuffled);
    setShuffledWords(shuffled);
  }, [mnemonic]);

  function isWordAndIndexSelected(word: string, index: number) {
    return selectedWordsAndIndices.some(([w, i]) => w === word && i === index);
  }

  function selectWordByIndex(word: string, index: number) {
    setSelectedWordsAndIndices([...selectedWordsAndIndices, [word, index]]);
  }

  function deselectWordByIndex(word: string, index: number) {
    setSelectedWordsAndIndices(
      selectedWordsAndIndices.filter(([w, i]) => !(w === word && i === index))
    );
  }

  function hasMatchingWordsAndOrder() {
    return unshuffledWords.every((word, i) => {
      const selectedWord = selectedWordsAndIndices[i]?.[0];
      return word === selectedWord;
    });
  }

  async function onSaveAndContinue() {
    setShowCheckmark(true);
    onSaveStart();
    await delay(1000);
    onSaveEnd();
  }

  return (
    <div className="space-y-8 pb-8">
      {!showCheckmark && (
        <div className="px-8 pt-8 pb-2">
          <h2 className="text-3xl font-extrabold leading-tight text-gray-900">
            Confirm Seed Phrase
          </h2>
          <p className="mt-3 text-gray-600 text-sm">
            Please select each phrase{' '}
            <span className="font-bold">in order</span> to make sure that your
            backup is correct.
          </p>
        </div>
      )}

      {showCheckmark && (
        <div className="px-8 pt-8 text-center pb-8">
          <div className="flex items-center justify-center h-32">
            <svg
              className="animated-checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className="animated-checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="animated-checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
          </div>
          <p>Seed phrase confirmed, keep the backup safe!</p>
          <p className="mt-8 font-bold">Encrypting on your device</p>
          <p className="mt-1 font-bold ellipsis-animation"></p>
        </div>
      )}

      {!showCheckmark && (
        <div className="px-8">
          <MnemonicViewer
            decryptedMnemonic={selectedWordsAndIndices
              .map(([w]) => w)
              .join(' ')}
            showCopyButton={false}
            showPlaceholder={false}
          />
        </div>
      )}

      {!showCheckmark && (
        <div className="px-8">
          <div className="grid grid-flow-row grid-cols-3 grid-rows-5 gap-4">
            {shuffledWords.map((word, i) => (
              <div
                key={i}
                className={`bg-white hover:bg-gray-50 text-base font-mono text-teal-700 cursor-pointer rounded-sm shadow py-2 px-4 transition duration-150 ease-in-out ${
                  isWordAndIndexSelected(word, i) ? 'bg-gray-100' : ''
                }`}
                onClick={() => {
                  if (!isWordAndIndexSelected(word, i)) {
                    selectWordByIndex(word, i);
                    return;
                  }
                  deselectWordByIndex(word, i);
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      )}

      {!showCheckmark && (
        <div className="px-8 flex justify-end">
          <Button
            isDisabled={!hasMatchingWordsAndOrder()}
            type="button"
            size="medium"
            variant="primary"
            onPress={() => onSaveAndContinue()}
          >
            Save &amp; Confirm
          </Button>
        </div>
      )}
    </div>
  );
}
