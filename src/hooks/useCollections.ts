/** @format */

import abi from "abi/abi.json";
import { ethers } from "ethers";
import * as thor from "web3-providers-connex";
import { pawn_address } from "config/contractAddress";
import { useWallet } from "./useWallet";

const useGetLoanData = async () => {
  const { connex } = useWallet();
  let modifiedProvider: any = "";
  if (connex) {
    const provider = new thor.ConnexProvider({ connex: connex });
    const web3Provider = new ethers.providers.Web3Provider(provider);
    modifiedProvider = thor.ethers.modifyProvider(web3Provider);
    const pawnShopContract = new ethers.Contract(
      pawn_address,
      abi,
      modifiedProvider
    );
    const loanedDataAddress = await pawnShopContract.getItemList();
    const loanedData: any = [];
    loanedDataAddress.map(async (item: string) => {
      const temp = await pawnShopContract.getItem(item);
      const _item = {
        owner: temp[0],
        tokenAddress: temp[1],
        tokenId: temp[2],
        loanValue: temp[3],
        loanFee: temp[4],
        duration: temp[5],
        startTime: temp[6],
        endTime: temp[7],
        messiah: temp[8],
        status: temp[9],
      };
      loanedData.push(_item);
    });
    console.log(loanedData);
    return loanedData;
  }
};

export default useGetLoanData;
