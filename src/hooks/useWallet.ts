import { WalletContext } from "contexts/WalletContext";
import { useContext } from "react";

export const useWallet = () => {
  return useContext(WalletContext);
};
