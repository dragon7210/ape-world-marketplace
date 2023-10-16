/** @format */

import { useGetLoan, useWallet } from "hooks";
import { useEffect, useState } from "react";
import { statusArray } from "constant";
import ViewLoanModal from "components/pawnShop/ViewLoanModal";
import Pagination from "components/common/Pagination";
import { differentTime, getCollectionName } from "utils";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "actions/loading";
import { EyeIcon } from "@heroicons/react/24/outline";

const AllLoan = () => {
  let { loanData, myLoanData, loading } = useGetLoan();
  const [selector, setSelector] = useState<boolean>(true);
  const [loanSel, setLoanSel] = useState(-1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [pageData, setPageData] = useState<any[]>([]);
  const { connex } = useWallet();

  const dispatch = useDispatch();

  const { collectionOptions } = useSelector((state: any) => state.collections);

  const data = selector ? loanData : myLoanData;

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  return (
    <div className='lg:px-10 md:px-5 p-3 bg-[#00000050] min-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_300px)] rounded-xl'>
      <div className='flex justify-between items-center md:mt-3 border-b-2 pb-1'>
        <p className='md:text-4xl text-xl'>
          Here are{" "}
          <span className='text-[#FF4200]'>
            {selector ? "All" : "My"} Items
          </span>
        </p>
        <div className='flex md:text-2xl text-base'>
          <button
            className={`lg:px-5 md:py-1 px-2 rounded-l-[99px] ${
              selector ? "bg-[#ff4200]" : "bg-[#c43300]"
            }`}
            onClick={() => setSelector(true)}>
            List All Items
          </button>
          <button
            className={`lg:px-5 md:py-1 px-2 rounded-r-[99px] ${
              !selector ? "bg-[#ff4200]" : "bg-[#c43300]"
            }`}
            onClick={() => setSelector(false)}>
            List My Items
          </button>
        </div>
      </div>
      {pageData.length > 0 ? (
        <div className='h-[calc(100vh_-_300px)] overflow-y-auto md:h-[calc(100vh_-_450px)]'>
          <table className='w-full md:text-xl text-base mt-2'>
            <thead className='uppercase backdrop-blur-xl bg-[#0a0b1336]'>
              <tr className='text-center'>
                <th className='px-3 md:py-4 py-1 text-left'>Collection</th>
                <th className='hidden md:table-cell'>Value (Vet)</th>
                <th className='hidden md:table-cell'>Interest (%)</th>
                <th className='hidden md:table-cell'>Duration</th>
                <th className='hidden md:table-cell'>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((item: any, index: number) => (
                <tr
                  key={index}
                  className='border-b text-center backdrop-blur-sm'>
                  <td className='md:py-3 px-3 text-left'>
                    {getCollectionName(collectionOptions, item.tokenAddress) +
                      " #" +
                      item.tokenId}
                  </td>
                  <td className='hidden md:table-cell'>
                    {item.loanValue / 10 ** 18}
                  </td>
                  <td className='hidden md:table-cell'>{item.loanFee}</td>
                  <td className='hidden md:table-cell'>
                    {item.status === "1"
                      ? "Empty Duration"
                      : differentTime(item?.endTime, connex)}
                  </td>
                  <td className='hidden md:table-cell'>
                    <div className='flex justify-center'>
                      <p className='py-1'>{statusArray[item.status]}</p>
                    </div>
                  </td>
                  <td>
                    <div className='flex items-center justify-center md:py-1 py-[1px]'>
                      <button
                        className='hover:bg-[#ff4200] bg-[#c43300] md:p-[5px] p-[2px] rounded-[99px]'
                        onClick={() => {
                          setLoanSel(index);
                          dispatch(setLoading(true));
                          setOpenModal(true);
                        }}>
                        <EyeIcon className='md:w-6 w-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='min-h-[calc(100vh_-_300px)] md:min-h-[calc(100vh_-_450px)]'>
          <p className='pt-5 text-2xl'>No Loan Data</p>
        </div>
      )}
      <Pagination data={data} color='#c43300' setPageData={setPageData} />
      <ViewLoanModal
        open={openModal}
        setOpenModal={setOpenModal}
        loanSel={data[loanSel]}
      />
    </div>
  );
};

export default AllLoan;
