/** @format */

import { mobility_address } from "config/contractAddress";
import { useEffect, useState } from "react";
import { getUserApesABI } from "abi/abis";
import { useConnex, useWallet } from "@vechain/dapp-kit-react";

export const useGetApes = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [apes, setApes] = useState<any[]>([]);

  const { account } = useWallet();
  const { thor } = useConnex();

  useEffect(() => {
    try {
      setLoading(true);
      if (account) {
        (async () => {
          const namedMethod = thor
            .account(mobility_address)
            .method(getUserApesABI);
          const temp = await namedMethod.call(account);
          if (temp) {
            setApes(temp.decoded["0"]);
            setLoading(false);
          }
        })();
      } else {
        setLoading(false);
        setApes([]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [thor, account]);

  return { apes, loading };
};
