/** @format */

import { pawn_address } from "config/contractAddress";
import { useWallet } from "./useWallet";
import { useEffect, useState } from "react";
import { getAllItemsABI, getItemABI } from "abi/abis";

export const useGetLoan = () => {
  const [loading, setLoading] = useState(true);
  const [loanData, setLoanData] = useState<any[]>([]);
  const [myLoanData, setMyLoanData] = useState<any[]>([]);

  const { connex, isConnected, address } = useWallet();
  useEffect(() => {
    setLoading(true)
    if (connex && isConnected && address) {
      (async () => {
        const pawnShop = connex.thor.account(pawn_address);

        const loanedDataAddressMethod = pawnShop.method(getAllItemsABI);
        const loanedDataMethod = pawnShop.method(getItemABI);

        const loanedDataAddress = await loanedDataAddressMethod.call();

        const tempLoan: any = [];

        for (let i = 0; i < loanedDataAddress.decoded[0].length; i++) {
          const temploanedData = await loanedDataMethod.call(
            loanedDataAddress.decoded[0][i]
          );
          const item = {
            owner: temploanedData.decoded[0][0],
            tokenAddress: temploanedData.decoded[0][1],
            tokenId: temploanedData.decoded[0][2],
            loanValue: temploanedData.decoded[0][3],
            loanFee: temploanedData.decoded[0][4],
            duration: temploanedData.decoded[0][5],
            startTime: temploanedData.decoded[0][6],
            endTime: temploanedData.decoded[0][7],
            messiah: temploanedData.decoded[0][8],
            status: temploanedData.decoded[0][9],
            itemId: loanedDataAddress["decoded"]["0"][i]
          };
          tempLoan.push(item);
        }
        const tempMyLoan = tempLoan.filter(
          (item: any) => item.owner?.toLowerCase() === address?.toLowerCase()
        );
        setLoanData(tempLoan);
        setMyLoanData(tempMyLoan);
        setLoading(false);
      })();
    } else {
      setLoading(false);
      setLoanData([]);
      setMyLoanData([])
    }
  }, [connex, isConnected, address]);

  return { loanData, loading, myLoanData };
};
