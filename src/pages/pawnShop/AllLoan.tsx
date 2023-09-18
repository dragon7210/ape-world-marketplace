/** @format */

import Spinner from "components/common/Spinner";
import { useCustomQuery, useGetLoanData } from "hooks";
import { useState } from "react";
import { getCollections } from "utils/query";
import ViewImg from "assets/svg/apeworld/view.svg";
import { statusArray } from "constant";
import ViewLoanModal from "components/pawnShop/viewLoanModal";

const AllLoan = () => {
  let { loanData, myLoanData, loading } = useGetLoanData();
  const [selector, setSelector] = useState<boolean>(true);
  const [loanSel, setLoanSel] = useState(-1);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const collectionOptions = useCustomQuery({
    query: getCollections,
    variables: {},
  });

  const data = selector ? loanData : myLoanData;

  const getCollectionName = (tokenAddress: string) => {
    let temp = collectionOptions?.collections?.filter(
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
        <p className='text-[32px]'>
          Here are{" "}
          <span className='text-[#FF4200]'>
            {selector ? "All" : "My"} Items
          </span>
        </p>
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
      <div className='shadow-lg rounded-lg mt-5 p-5'>
        {data.length > 0 ? (
          <table className='w-full text-gray-200 text-[20px]'>
            <thead className='uppercase bg-[#4F4F54]'>
              <tr className='text-center'>
                <th className='p-6 text-left'>Collection</th>
                <th>Value</th>
                <th>Interest</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: any, index: number) => (
                <tr key={index} className='border-b text-center bg-[#656264]'>
                  <td className='p-4 text-left'>
                    {getCollectionName(item.tokenAddress)}
                  </td>
                  <td>{item.loanValue / 10 ** 18}</td>
                  <td>{item.loanFee}</td>
                  <td>{item.duration}</td>
                  <td>{statusArray[item.status]}</td>
                  <td>
                    <button
                      className='bg-[#F67D53] hover:bg-[#FF4200] px-3 py-1 rounded-md'
                      onClick={() => {
                        setLoanSel(index);
                        setOpenModal(true);
                        loading = true;
                      }}>
                      <img
                        className='mt-[1px]'
                        src={ViewImg}
                        alt='view'
                        width={25}
                      />
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
      <ViewLoanModal
        open={openModal}
        setOpenModal={setOpenModal}
        loanSel={data[loanSel]}
      />
    </div>
  );
};

export default AllLoan;
