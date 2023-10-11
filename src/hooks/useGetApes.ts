/** @format */

import { mobility_address, } from "config/contractAddress";
import { useWallet } from "./useWallet";
import { useEffect, useState } from "react";
import { getUserApesABI } from "abi/abis";

export const useGetApes = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [apes, setApes] = useState<any[]>([]);

  const { connex, isConnected, address } = useWallet();
  useEffect(() => {
    if (connex && isConnected && address) {
      (async () => {
        const namedMethod = connex.thor
          .account(mobility_address)
          .method(getUserApesABI);
        const temp = await namedMethod.call(address);
        if (temp) {
          setApes(temp.decoded["0"]);
        }
        setLoading(false);
      })();
    } else {
      setLoading(false);
      setApes([]);
    }
  }, [connex, isConnected, address]);

  return { apes, loading };
};
