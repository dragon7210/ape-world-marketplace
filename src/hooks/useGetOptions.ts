/** @format */

import { options_address, } from "config/contractAddress";
import { useWallet } from "./useWallet";
import { useEffect, useState } from "react";
import { getAllOptionsABI, getOptionABI, } from "abi/abis";

export const useGetOptions = () => {
  const [loading, setLoading] = useState(true);
  const [optionData, setOptionData] = useState<any[]>([]);
  const [myOptionData, setMyOptionData] = useState<any[]>([]);

  const { connex, isConnected, address } = useWallet();
  useEffect(() => {
    if (connex && isConnected && address) {
      (async () => {
        const optionAddressMethod = connex.thor
          .account(options_address)
          .method(getAllOptionsABI);

        const optionMethod = connex.thor.account(options_address).method(getOptionABI);
        const optionAddress = await optionAddressMethod.call();

        const _itemList: any = [];

        for (let i = 0; i < optionAddress.decoded[0].length; i++) {
          const _item = await optionMethod.call(optionAddress.decoded[0][i]);
          _itemList.push({
            expiration: Number(_item.decoded[0]?.expirationDate),
            nftId: _item.decoded[0]?.tokenId,
            price: _item.decoded[0]?.optionPrice / 10 ** 18,
            status: _item.decoded[0]?.takeable,
            type: _item.decoded[0]?._type,
            collection: _item.decoded[0]?.tokenAddress,
            owner: _item.decoded[0]?.owner,
            itemId: i,
          });
        }
        const _myItemList = _itemList.filter(
          (item: any) => item.owner?.toLowerCase() === address?.toLowerCase()
        );
        setOptionData(_itemList);
        setMyOptionData(_myItemList);
        setLoading(false);
      })();
    } else {
      setLoading(false);
      setOptionData([]);
    }
  }, [connex, isConnected, address]);

  return { optionData, loading, myOptionData };
};
