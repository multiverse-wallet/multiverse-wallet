import {
  CodeIcon,
  CogIcon,
  CubeIcon,
  FolderIcon,
  GlobeAltIcon,
  LibraryIcon,
  LinkIcon,
  LockClosedIcon,
  ServerIcon,
  UsersIcon,
} from '@heroicons/react/solid';
import {
  useAccounts,
  useNetworks,
  useSelectedNetwork,
  useSiteConnectionRequests,
  useSites,
  useTransactions,
} from '@multiverse-wallet/wallet/hooks';
import React from 'react';
import { Link, Route, Routes, useMatch } from 'react-router-dom';
import { ManageAccounts } from './account/account';
import { Security } from './security/security';
import { Settings } from './settings/settings';
import { Networks } from './networks/networks';
import {
  SelectAccount,
  SelectNetwork,
} from '@multiverse-wallet/wallet/components';
import { Sites } from './sites/sites';
import { APILogs } from './api-logs/api-logs';
import { Transactions } from './transactions/transactions';
import { NFTs } from './nfts/nfts';

interface NavItemProps {
  linkTo: string;
  title: string;
  icon: JSX.Element;
  hide?: boolean;
}

function NavItem({ linkTo, title, icon }: NavItemProps) {
  const isSelected = useMatch(linkTo);

  return (
    <Link
      to={linkTo}
      className={`group rounded-md flex items-center text-sm leading-5 font-medium focus:outline-none ${
        !isSelected
          ? 'py-4 px-7 hover:text-gray-900 hover:bg-gray-50 focus:text-gray-900 focus:bg-gray-50'
          : 'py-4 px-7 text-white bg-gradient-to-br from-gray-600 to-gray-700'
      }`}
    >
      {React.cloneElement(icon, {
        className: `mr-5 h-6 w-6 ${!isSelected ? '' : 'text-white'}`,
      })}
      {title}
    </Link>
  );
}

export function ManageAccount() {
  const accounts = useAccounts();
  const sites = useSites();
  const siteConnectionRequests = useSiteConnectionRequests();
  const { selectedNetwork } = useSelectedNetwork();
  const networks = useNetworks();
  const transactions = useTransactions();
  const topBarHeight = '64px';
  const privateMessageBarHeight = '42px';
  const navItems: NavItemProps[] = [
    {
      title: 'Accounts',
      linkTo: '/admin/accounts',
      icon: <UsersIcon className="w-5 h-5" />,
    },
    {
      title: 'Networks',
      linkTo: '/admin/networks',
      icon: <ServerIcon className="w-5 h-5" />,
    },
    {
      title: 'Connected Sites',
      linkTo: '/admin/sites',
      icon: <GlobeAltIcon className="w-5 h-5" />,
    },
    {
      title: 'NFTs',
      linkTo: '/admin/nfts',
      icon: <FolderIcon className="w-5 h-5" />,
    },
    {
      title: 'Settings',
      linkTo: '/admin/settings',
      icon: <CogIcon className="w-5 h-5" />,
    },
    {
      title: 'Security',
      linkTo: '/admin/security',
      icon: <LockClosedIcon className="w-5 h-5" />,
    },
    {
      title: 'Transactions',
      linkTo: '/admin/transactions',
      icon: <CubeIcon className="w-5 h-5" />,
    },
    {
      title: 'API Logs',
      linkTo: '/admin/api-logs',
      icon: <CodeIcon className="w-5 h-5" />,
    },
  ].filter((e: NavItemProps) => !e.hide);

  return (
    <div
      className="h-screen text-sm"
      style={{
        height: `calc(100vh - ${privateMessageBarHeight})`,
      }}
    >
      <nav className="w-full z-10 shadow" style={{ height: topBarHeight }}>
        <div className="mx-auto px-2">
          <div className="flex justify-between h-16">
            <div className="flex-grow flex items-center">
              <SelectNetwork />
            </div>
            <div className="flex items-center mx-2">
              <SelectAccount />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-row gap-4">
        <div
          className="flex flex-shrink-0"
          style={{
            height: `calc(100vh - ${topBarHeight} - ${privateMessageBarHeight})`,
          }}
        >
          <div className="w-64 flex flex-col">
            <nav className="py-2 flex flex-col flex-grow overflow-y-auto">
              <div className="flex-grow flex flex-col">
                <div className="flex-1 space-y-1 ml-2">
                  {navItems.map((navItem, i) => (
                    <NavItem key={i} {...navItem} />
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 block ml-2">
                <NavItem
                  title="Lock Extension"
                  linkTo="/lock"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  }
                />
              </div>
            </nav>
          </div>
        </div>

        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            height: `calc(100vh - ${topBarHeight} - ${privateMessageBarHeight})`,
          }}
        >
          <main className="p-4 overflow-y-scroll">
            <Routes>
              <Route
                path="/admin/accounts"
                element={<ManageAccounts accounts={accounts || []} />}
              />
              <Route
                path="/admin/networks"
                element={<Networks networks={networks || []} />}
              />
              <Route
                path="/admin/sites"
                element={
                  <Sites
                    sites={sites || []}
                    connectionRequests={siteConnectionRequests || []}
                  />
                }
              />
              <Route path="/admin/nfts/*" element={<NFTs />} />
              <Route path="/admin/settings" element={<Settings />} />
              <Route path="/admin/security" element={<Security />} />
              <Route
                path="/admin/transactions"
                element={<Transactions transactions={transactions || []} />}
              />
              <Route path="/admin/api-logs" element={<APILogs />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}
