import { useEffect, useState } from "react";
import { useWallet } from "./useWallet";
import { useCustomQuery } from "./useCustomQuery";
import { searchNFTs } from "utils/query";

export const useMyApes = ({ createValue }: { createValue: any }) => {
  const [myApes, setMyApes] = useState<any[]>();
  const [filters, setFilters] = useState<any>()

  const { address } = useWallet();

  useEffect(() => {
    if (createValue.collectionId === "") {
      setFilters({ ownerAddress: address })
    } else {
      setFilters({
        ownerAddress: address,
        collectionId: createValue.collectionId,
      })
    }
  }, [createValue, address])

  const temp = useCustomQuery({
    query: searchNFTs,
    variables: {
      filters,
      pagination: { page: 1, perPage: 1000 },
    },
  });

  useEffect(() => {
    if (address) {
      setMyApes(temp?.tokens?.items)
    }
  }, [temp, address])

  return { myApes };
};
