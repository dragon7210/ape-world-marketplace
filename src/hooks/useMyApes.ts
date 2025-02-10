import { useEffect, useState } from "react";
import { useCustomQuery } from "./useCustomQuery";
import { searchNFTs } from "utils/query";
import { useDispatch } from "react-redux";
import { setLoading } from "actions/loading";
import { useWallet } from "@vechain/dapp-kit-react";

export const useMyApes = ({ createValue }: { createValue: any }) => {
  const [myApes, setMyApes] = useState<any[]>();
  const [filters, setFilters] = useState<any>();
  const dispatch = useDispatch();

  const { account } = useWallet();

  useEffect(() => {
    try {
      if (createValue.collectionId === "") {
        setFilters({ ownerAddress: account });
        dispatch(setLoading(false));
      } else {
        setFilters({
          ownerAddress: account,
          collectionId: createValue.collectionId,
        });
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.log(error);
    }
  }, [createValue, account, dispatch]);

  const temp = useCustomQuery({
    query: searchNFTs,
    variables: {
      filters,
      pagination: { page: 1, perPage: 1000 },
    },
  });

  useEffect(() => {
    if (account) {
      setMyApes(temp?.tokens?.items);
      dispatch(setLoading(false));
    }
  }, [temp, account, dispatch]);

  return { myApes };
};
