import React, { useEffect, useState } from "react";
import {
  SelectedAccountActions,
  SelectedAccountActivity,
  SelectedAccountBalance,
  SelectedAccountCurrencies,
  Tabs,
} from "@multiverse-wallet/wallet/components";
import { Link, Route, useNavigate } from "react-router-dom";
import { useSupportsNFTokenMethods } from "@multiverse-wallet/wallet/hooks";

export function SelectAction() {
  const navigate = useNavigate();
  const supportsNFTokenMethods = useSupportsNFTokenMethods();
  function navigateToRoot() {
    navigate("/");
  }
  const defaultTabs = [
    {
      name: "Assets",
      component: <SelectedAccountCurrencies />,
    },
    {
      name: "Activity",
      component: <SelectedAccountActivity />,
    },
  ];

  const nftTabs = [
    {
      name: "NFTs",
      component: <SelectedAccountActivity />,
    },
  ];

  const [tabs, setTabs] = useState(defaultTabs);

  useEffect(() => {
    if (supportsNFTokenMethods) {
      setTabs(defaultTabs.concat(nftTabs));
    } else {
      setTabs(defaultTabs)
    }
  }, [supportsNFTokenMethods]);

  return (
    <div className="flex-grow flex flex-col">
      <SelectedAccountBalance />
      <SelectedAccountActions />
      <Tabs tabs={tabs} />
    </div>
  );
}
