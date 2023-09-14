import { FC, PropsWithChildren } from "react";
import WalletContextProvider from "./WalletContext";

const ContextProviders: FC<PropsWithChildren> = ({ children }) => {
  return <WalletContextProvider>{children}</WalletContextProvider>;
};

export default ContextProviders;
