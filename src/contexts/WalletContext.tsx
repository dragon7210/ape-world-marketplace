/** @format */

import {
  createContext,
  PropsWithChildren,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Connex } from "@vechain/connex";

interface ContextType {
  network: "mainnet" | "testnet";
  isConnected: boolean;
  isConnecting: boolean;
  address: string | undefined;
  connex: Connex | undefined;
  balance: bigint;
  energy: bigint;
  connect: () => Promise<void>;
  switchNetwork: () => Promise<void>;
  disconnect: () => void;
}

const mainnet = new Connex({
  node: "https://mainnet.veblocks.net/", // veblocks public node, use your own if needed
  network: "main", // defaults to mainnet, so it can be omitted here
});

const testnet = new Connex({
  node: "https://testnet.veblocks.net/",
  network: "test",
});

// const mainnetChainId = 100009;
// const testnetChainId = 100010;

export const WalletContext = createContext<ContextType>({} as ContextType);

const WalletContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [network, setNetwork] = useState<"mainnet" | "testnet">("mainnet");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [address, setAddress] = useState<string>();
  const [balance, setBalance] = useState<bigint>(0n);
  const [energy, setEnergy] = useState<bigint>(0n);
  const [connex, setConnex] = useState<Connex>();

  const connect = async () => {
    if (isConnected) {
      throw Error("Already Connected");
    }
    try {
      setIsConnecting(true);
      const signResponse = await (network === "mainnet"
        ? mainnet
        : testnet
      ).vendor
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

      if (!connex) {
        setConnex(network === "mainnet" ? mainnet : testnet);
      }
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

  const switchNetwork = async () => {
    if (network === "mainnet") {
      setNetwork("testnet");
    } else {
      setNetwork("mainnet");
    }

    setConnex(network === "mainnet" ? testnet : mainnet);
    await connect();
  };

  const updateBalance = useCallback(async () => {
    if (!connex || !address) {
      return;
    }

    const balanceResponse = await connex.thor.account(address).get();
    setBalance(BigInt(balanceResponse.balance));
    setEnergy(BigInt(balanceResponse.energy));
  }, [connex, address]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);
  return (
    <WalletContext.Provider
      value={{
        network,
        isConnected,
        isConnecting,
        address,
        balance,
        energy,
        connex,
        connect,
        disconnect,
        switchNetwork,
      }}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContextProvider;
