import { CodeIcon, CubeIcon } from "@heroicons/react/solid";
import { Button } from "@multiverse-wallet/shared/components/button";
import { useAPILogs, useWalletState } from "@multiverse-wallet/wallet/hooks";
import React from "react";

interface APILogsTableRowWithModalProps {
  apiLog: any;
}

function APILogsTableRowWithModal({ apiLog }: APILogsTableRowWithModalProps) {
  const date = new Date(apiLog.date).toLocaleString();
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 font-medium text-gray-900 truncate">
        {date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 font-medium text-gray-900 truncate">
        {apiLog.method}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm leading-5 font-medium text-gray-900 truncate">
        {apiLog.origin}
      </td>
    </tr>
  );
}

export function APILogs() {
  const apiLogs = useAPILogs();
  const { api } = useWalletState();
  return (
    <div >
      <header className="mt-4 mb-12">
        <div className="mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
            API Logs
          </h1>

          <p className="mt-4 mx-auto text-lg leading-6 text-gray-500">
            View logs of API calls by connected sites.
          </p>
        </div>
      </header>

      <div className="mb-12">
        <div className="flex space-x-3">
          {/*
          Because we use useButton() within our shared Button component, focus management is handled correctly across all
          browsers. Focus is restored to the button once the dialog closes.
        */}
          <Button
            variant="secondary"
            size="small"
            onPress={() => api.clearApiLogs()}
          >
            Clear API Logs
          </Button>
        </div>
      </div>

      <div className="flex flex-col">
        <div>
          <div>
            <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
              {!apiLogs ||
                (apiLogs?.length < 1 && (
                  <div className="bg-white divide-y divide-gray-200 h-96">
                    <div className="flex flex-col items-center justify-center h-full">
                      <CodeIcon className="w-20 h-20 text-gray-200" />

                      <p className="mt-4 text-gray-300">
                        There are no API Logs yet.
                      </p>
                    </div>
                  </div>
                ))}
              {!!apiLogs && apiLogs?.length > 0 && (
                <table className="table w-full min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                        Origin
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {apiLogs?.map((apiLog, i) => {
                      return (
                        <APILogsTableRowWithModal
                          key={apiLog.i}
                          apiLog={apiLog}
                        />
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
