import useSWR, { SWRResponse } from "swr";

export interface IWellKnownAccount {
  account: string;
  name: string;
  domain?: string;
  verified?: boolean;
  twitter?: string;
  desc?: string;
}

export function useWellKnownName(
  accountAddress?: string
): IWellKnownAccount | undefined {
  const { data } = useSWR<IWellKnownAccount[]>(
    !!accountAddress ? "https://api.xrpscan.com/api/v1/names/well-known" : null,
    (url) => fetch(url).then((res) => res.json())
  );
  return data?.find(
    ({ account }: IWellKnownAccount) => account === accountAddress
  );
}
