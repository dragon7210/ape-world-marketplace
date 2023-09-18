/** @format */

import Spinner from "components/common/Spinner";
import { useCustomQuery, useGetLoanData } from "hooks";
import { useEffect, useState } from "react";
import { getCollections, getToken } from "utils/query";
import ViewImg from "assets/svg/apeworld/view.svg";
import { Dialog } from "@headlessui/react";
import { statusArray } from "constant";

const AllLoan = () => {
  const { loanData, myLoanData, loading } = useGetLoanData();
  const [selector, setSelector] = useState<boolean>(true);
  const [loanSel, setLoanSel] = useState(-1);
  const [url, setUrl] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);

  const collectionOptions = useCustomQuery({
    query: getCollections,
    variables: {},
  });

  const data = selector ? loanData : myLoanData;

  const selData = useCustomQuery({
    query: getToken({
      tokenId: data[loanSel]?.tokenId,
      smartContractAddress: data[loanSel]?.tokenAddress,
    }),
    variables: {},
  });

  useEffect(() => {
    if (selData) {
      setUrl(selData.getToken?.assets[2]?.url);
    }
  }, [selData]);

  const getCollectionName = (tokenAddress: string) => {
    let temp = collectionOptions?.collections.filter(
      (item: any) =>
        item.smartContractAddress?.toLowerCase() === tokenAddress?.toLowerCase()
    );
    if (temp.length !== 0) {
      return temp[0]?.name;
    }
  };

  return (
    <div className='p-10 shadow-lg'>
      <div className='flex justify-between item-center'>
        <p className='text-[32px]'>Here are {selector ? "All" : "My"} Items</p>
        <div className='flex'>
          <button
            className={`text-[20px] px-[32px] py-[16px]  rounded-[9px] mr-[28px] ${
              selector ? "bg-[#FF4200]" : "bg-[#F67D53]"
            }`}
            onClick={() => setSelector(true)}>
            List All Items
          </button>
          <button
            className={`text-[20px] px-[32px] py-[16px]  rounded-[9px] ${
              !selector ? "bg-[#FF4200]" : "bg-[#F67D53]"
            }`}
            onClick={() => setSelector(false)}>
            List My Items
          </button>
        </div>
      </div>
      <div className='relative overflow-x-auto shadow-lg rounded-lg mt-5 p-1'>
        {data.length > 0 ? (
          <table className='w-full text-left text-gray-500 shadow-lg rounded-lg text-[20px]'>
            <thead className='text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th className='p-6'>Collection</th>
                <th>Value</th>
                <th>Interest</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: any, index: number) => (
                <tr
                  key={index}
                  className='bg-white border-b dark:bg-gray-900 dark:border-gray-700'>
                  <td className='p-4'>
                    {getCollectionName(item.tokenAddress)}
                  </td>
                  <td>{item.loanValue / 10 ** 18}</td>
                  <td>{item.loanFee}</td>
                  <td>{item.duration}</td>
                  <td>{statusArray[item.status]}</td>
                  <td>
                    <button
                      className='bg-white px-3 py-1 rounded-md'
                      onClick={() => {
                        setLoanSel(index);
                        setOpenModal(true);
                      }}>
                      <img src={ViewImg} alt='view' width={25} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          "No Loan Data"
        )}
      </div>
      <Spinner loading={loading} />
      <Dialog
        className='fixed inset-0 flex items-center justify-center backdrop-blur-sm'
        open={openModal}
        onClose={() => {}}>
        <img src={url} alt='loanImg' />
        <button onClick={() => setOpenModal(!openModal)}>Close</button>
      </Dialog>
    </div>
  );
};

export default AllLoan;
