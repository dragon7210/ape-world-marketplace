/** @format */

import { trade_address } from "config/contractAddress";
import { useEffect, useState } from "react";
import { getAllTradingABI, getTradingABI } from "abi/abis";
import { tradingTypes } from "constant";
import { useConnex, useWallet } from "@vechain/dapp-kit-react";

export const useGetTrading = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [trading, setTradidng] = useState<any[]>([]);
  const [myTrading, setMyTrading] = useState<any[]>([]);

  const { account } = useWallet();
  const { thor } = useConnex();
  useEffect(() => {
    try {
      setLoading(true);
      if (account) {
        (async () => {
          const tradingAddressMethod = thor
            .account(trade_address)
            .method(getAllTradingABI);
          const tradingMethod = thor
            .account(trade_address)
            .method(getTradingABI);

          const tradingAddress = await tradingAddressMethod.call();
          const tempTrading: any = [];

          for (let i of tradingAddress.decoded[0]) {
            const tradingData = await tradingMethod.call(i);
            const item = {
              owner: tradingData["decoded"]["0"][0],
              type: tradingTypes[tradingData["decoded"]["0"][1] - 1],
              num: tradingData["decoded"]["0"][2],
              nfts: tradingData["decoded"]["0"][3],
              linked: tradingData["decoded"]["0"][4],
              itemId: i,
            };
            if (item.type === "LIST") {
              tempTrading.push(item);
            }
          }
          const tempMyTrading = tempTrading.filter(
            (item: any) => item.owner?.toLowerCase() === account?.toLowerCase()
          );

          setTradidng(tempTrading);
          setMyTrading(tempMyTrading);
          setLoading(false);
        })();
      } else {
        setLoading(false);
        setTradidng([]);
        setMyTrading([]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [account]);

  return { trading, loading, myTrading };
};
