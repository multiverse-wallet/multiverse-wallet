import React, { useState } from 'react';

export interface TabElement {
  name: string;
  component: any;
}

export interface TabsProps {
  tabs: TabElement[];
}

export const Tabs = (props: TabsProps) => {
  const [selectedTab, setSelectedTab] = useState(props.tabs[0]);
  return (
    <>
      <div>
        <div className="mt-5">
          <nav className="flex">
            {props.tabs.map((tab, i) => {
              return (
                <div
                  onClick={() => {
                    setSelectedTab(tab);
                  }}
                  key={i}
                  className={
                    tab.name === selectedTab.name
                      ? 'flex-grow bg-gradient-to-br from-purple-100 to-orange-100 py-4 px-4 cursor-pointer text-center border-b-4 border-purple-400 font-medium text-md leading-5 text-gray-900 focus:outline-none'
                      : 'flex-grow py-4 px-4 text-center border-b-4 border-orange-50 font-medium text-md leading-5 text-gray-500 hover:text-gray-700 hover:border-orange-100 focus:outline-none cursor-pointer'
                  }
                >
                  {tab.name}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {selectedTab.component}
    </>
  );
};
