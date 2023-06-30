import React, { useEffect, useState } from 'react';
import {
  SelectedAccountActions,
  SelectedAccountActivity,
  SelectedAccountBalance,
  SelectedAccountCurrencies,
  SelectedAccountNFTs,
  Tabs,
} from '@multiverse-wallet/wallet/components';
import { useSupportsNFTokenMethods } from '@multiverse-wallet/wallet/hooks';

export function SelectAction() {
  const supportsNFTokenMethods = useSupportsNFTokenMethods();
  const defaultTabs = [
    {
      name: 'Activity',
      component: <SelectedAccountActivity />,
    },
    {
      name: 'Assets',
      component: <SelectedAccountCurrencies />,
    },
  ];

  const nftTabs = [
    {
      name: 'NFTs',
      component: <SelectedAccountNFTs />,
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
