/** @format */

import { PropsWithChildren } from "react";
import type { WalletConnectOptions, WalletSource } from "@vechain/dapp-kit";
import { DAppKitProvider } from "@vechain/dapp-kit-react";

const walletConnectOptions: WalletConnectOptions = {
  projectId: "b52fe5c046268442d171c23fbd6d7ac7", // Create your project here: https://cloud.walletconnect.com/sign-up
  metadata: {
    name: "Ape World",
    description: "Ape world",
    url: window.location.origin, // Your app URL
    icons: [`${window.location.origin}/face.svg`], // Your app Icon
  },
};

const WalletContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <DAppKitProvider
      // REQUIRED: The URL of the node you want to connect to
      nodeUrl={"https://mainnet.veblocks.net/"}
      // OPTIONAL: Required if you're not connecting to the main net
      genesis={"main"}
      // OPTIONAL: Whether or not to persist state in local storage (account, wallet source)
      usePersistence={true}
      // OPTIONAL: Options to enable wallet connect
      walletConnectOptions={walletConnectOptions}
      // OPTIONAL: A log level for console logs
      logLevel="DEBUG"
    >
      {children}
    </DAppKitProvider>
  );
};

export default WalletContextProvider;
