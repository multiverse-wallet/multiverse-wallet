import React, { useEffect, useState } from 'react';
import {
  SelectedAccountActions,
  SelectedAccountActivity,
  SelectedAccountBalance,
  SelectedAccountCurrencies,
  Tabs,
} from '@multiverse-wallet/wallet/components';
import { useSupportsNFTokenMethods } from '@multiverse-wallet/wallet/hooks';

export function SelectAction() {
  const supportsNFTokenMethods = useSupportsNFTokenMethods();
  const defaultTabs = [
    {
      name: 'Assets',
      component: <SelectedAccountCurrencies />,
    },
    {
      name: 'Activity',
      component: <SelectedAccountActivity />,
    },
  ];

  const nftTabs = [
    {
      name: 'NFTs',
      component: <SelectedAccountActivity />,
    },
  ];

  const [tabs, setTabs] = useState(defaultTabs);

  useEffect(() => {
    if (supportsNFTokenMethods) {
      setTabs(defaultTabs.concat(nftTabs));
    } else {
      setTabs(defaultTabs);
    }
  }, [supportsNFTokenMethods]);

  return (
    <div className="flex flex-col overflow-hidden">
      <SelectedAccountBalance />
      <SelectedAccountActions />
      <Tabs tabs={tabs} />
    </div>
  );
}
