/** @format */

import {
  createContext,
  PropsWithChildren,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { WalletConnectOptions, WalletSource } from "@vechain/dapp-kit";
import { DAppKit } from "@vechain/dapp-kit";
import { Connex } from "@vechain/connex";

interface ContextType {
  thor: Connex.Thor;
  vendor: Connex.Vendor;
  isConnected: boolean;
  isConnecting: boolean;
  address: string | undefined;
  balance: bigint;
  energy: bigint;
  connect: (source: WalletSource) => Promise<void>;
  disconnect: () => void;
}

const walletConnectOptions: WalletConnectOptions = {
  projectId: "b52fe5c046268442d171c23fbd6d7ac7", // Create your project here: https://cloud.walletconnect.com/sign-up
  metadata: {
    name: "Ape World",
    description: "Ape world",
    url: window.location.origin, // Your app URL
    icons: [`${window.location.origin}/face.svg`], // Your app Icon
  },
};

const { thor, vendor, wallet } = new DAppKit({
  nodeUrl: "https://mainnet.veblocks.net/", //Required
  genesis: "main", //Optional - "main" | "test" | Connex.Thor.Block
  walletConnectOptions, //Optional
});

// const mainnetChainId = 100009;
// const testnetChainId = 100010;

export const WalletContext = createContext<ContextType>({} as ContextType);

const WalletContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [address, setAddress] = useState<string>();
  const [balance, setBalance] = useState<bigint>(0n);
  const [energy, setEnergy] = useState<bigint>(0n);

  const connect = async (source: WalletSource) => {
    if (isConnected) {
      throw Error("Already Connected");
    }

    wallet.setSource(source);

    try {
      setIsConnecting(true);
      await wallet.connect();
      const signResponse = await vendor
        .sign("cert", {
          purpose: "identification",
          payload: {
            type: "text",
            content: "Please sign the certificate to continue.",
          },
        })
        .request();

      setAddress(signResponse.annex.signer);
      setIsConnected(true);
    } catch (err: any) {
      throw Error(err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(undefined);
  };

  const updateBalance = useCallback(async () => {
    if (!address) {
      return;
    }

    const balanceResponse = await thor.account(address).get();
    setBalance(BigInt(balanceResponse.balance));
    setEnergy(BigInt(balanceResponse.energy));
  }, [address]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  return (
    <WalletContext.Provider
      value={{
        thor,
        vendor,
        isConnected,
        isConnecting,
        address,
        balance,
        energy,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContextProvider;
