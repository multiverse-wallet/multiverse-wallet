import { ApproveSiteModal } from '@multiverse-wallet/wallet/home/feature-manage-account';
import { useSiteConnectionRequests } from '@multiverse-wallet/wallet/hooks';

/* eslint-disable-next-line */
export interface ConnectProps {}

export function Connect(props: ConnectProps) {
  const connectionRequests = useSiteConnectionRequests();
  if (!connectionRequests?.length) {
    return <>none</>;
  }
  return (
    <ApproveSiteModal
      connectionRequest={connectionRequests[0]}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      closeModal={() => {}}
      titleProps={{}}
    />
  );
}

export default Connect;
