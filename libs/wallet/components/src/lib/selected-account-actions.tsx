import { Button } from "@multiverse-wallet/shared/components/button";
import React from "react";
import {
  ArrowRightIcon,
  SwitchVerticalIcon,
  DownloadIcon,
  ArrowDownIcon,
} from "@heroicons/react/solid";
import { Link } from "react-router-dom";

export function SelectedAccountActions() {
  return (
    <div className="flex items-center">
      <div className="mx-auto flex gap-4">
        <Link to="/popup/send-payment">
          <Button size="small" variant="primary" className="rounded-full">
            <>
              <ArrowRightIcon className="inline w-5 h-5 mr-1" />
              <span>Send Payment</span>
            </>
          </Button>
        </Link>
        {/* <Link to="/popup/exchange">
          <Button size="small" variant="primary" className="rounded-full">
            <>
              <SwitchVerticalIcon className="inline w-5 h-5 mr-1" />
              <span>Exchange</span>
            </>
          </Button>
        </Link> */}
      </div>
    </div>
  );
}
