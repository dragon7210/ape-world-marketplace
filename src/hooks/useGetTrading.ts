/** @format */

import { trade_address } from "config/contractAddress";
import { useWallet } from "./useWallet";
import { useEffect, useState } from "react";
import { getAllTradingABI, getTradingABI } from "abi/abis";
import { tradingTypes } from "constant";

export const useGetTrading = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [trading, setTradidng] = useState<any[]>([]);
  const [myTrading, setMyTrading] = useState<any[]>([]);

  const { connex, isConnected, address } = useWallet();
  useEffect(() => {
    setLoading(true)
    if (connex && isConnected && address) {
      (async () => {
        const tradingAddressMethod = connex.thor
          .account(trade_address)
          .method(getAllTradingABI);
        const tradingMethod = connex.thor
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
            tempTrading.push(item)
          }
        }
        const tempMyTrading = tempTrading.filter(
          (item: any) => item.owner?.toLowerCase() === address?.toLowerCase()
        );

        setTradidng(tempTrading);
        setMyTrading(tempMyTrading);
        setLoading(false);
      })();
    } else {
      setLoading(false);
      setTradidng([]);
      setMyTrading([])
    }
  }, [connex, isConnected, address]);

  return { trading, loading, myTrading, };
};
