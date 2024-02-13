/** @format */

import { fight_address } from "config/contractAddress";
import { useEffect, useState } from "react";
import { playersABI, tournamentInfoABI } from "abi/abis";
import { useConnex, useWallet } from "@vechain/dapp-kit-react";

export const useGetPlayers = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [info, setInfo] = useState<any>();
  const [players, setPlayers] = useState<any[]>([]);

  const { account } = useWallet();
  const { thor } = useConnex();

  useEffect(() => {
    try {
      setLoading(true);
      if (account) {
        (async () => {
          const tournamentMethod = thor
            .account(fight_address)
            .method(tournamentInfoABI);
          const temp1 = await tournamentMethod.call();

          const _info = {
            price: temp1["decoded"]["0"]["0"],
            players: temp1["decoded"]["0"]["1"],
            registered: temp1["decoded"]["0"]["4"] / temp1["decoded"]["0"]["0"],
          };
          setInfo(_info);

          const playerMethod = thor.account(fight_address).method(playersABI);
          const temp2 = await playerMethod.call();
          let playerList = [];
          for (let p of temp2["decoded"]["0"]) {
            playerList.push({ owner: p[0], tokenAddress: p[1], tokenId: p[2] });
          }
          setPlayers(playerList);
          setLoading(false);
        })();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }, [account]);

  return { info, players, loading };
};
