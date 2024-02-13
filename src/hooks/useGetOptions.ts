/** @format */

import { options_address } from "config/contractAddress";
import { useEffect, useState } from "react";
import { getAllOptionsABI, getOptionABI } from "abi/abis";
import { optionStatus, optionTypes } from "constant";
import { useConnex, useWallet } from "@vechain/dapp-kit-react";

export const useGetOptions = () => {
  const [loading, setLoading] = useState(true);
  const [optionData, setOptionData] = useState<any[]>([]);
  const [myOptionData, setMyOptionData] = useState<any[]>([]);

  const { account } = useWallet();
  const { thor } = useConnex();
  useEffect(() => {
    try {
      if (account) {
        (async () => {
          setLoading(true);
          const optionAddressMethod = thor
            .account(options_address)
            .method(getAllOptionsABI);

          const optionMethod = thor
            .account(options_address)
            .method(getOptionABI);
          const optionAddress = await optionAddressMethod.call();
          const _itemList: any = [];
          for (let i = 0; i < optionAddress.decoded[0].length; i++) {
            const _item = await optionMethod.call(optionAddress.decoded[0][i]);
            _itemList.push({
              type: optionTypes[_item["decoded"]["0"][0]],
              status: optionStatus[_item["decoded"]["0"][1] - 1],
              tokenAddress: _item["decoded"]["0"][2],
              tokenId: _item["decoded"]["0"][3],
              strikePrice: _item["decoded"]["0"][4],
              optionPrice: _item["decoded"]["0"][5],
              expirationDate: _item["decoded"]["0"][6],
              exerciseDate: _item["decoded"]["0"][7],
              owner: _item["decoded"]["0"][8],
              taker: _item["decoded"]["0"][9],
              takeable: _item["decoded"]["0"][10],
              itemId: optionAddress.decoded[0][i],
            });
          }
          const _myItemList = _itemList.filter(
            (item: any) => item.owner?.toLowerCase() === account?.toLowerCase()
          );
          setOptionData(_itemList);
          setMyOptionData(_myItemList);
          setLoading(false);
        })();
      } else {
        setLoading(false);
        setOptionData([]);
        setMyOptionData([]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [thor, account]);

  return { optionData, loading, myOptionData };
};
