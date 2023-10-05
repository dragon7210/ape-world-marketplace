/** @format */

import { useGetLoan, useWallet } from "hooks";
import { useEffect, useState } from "react";
import ViewImg from "assets/svg/apeworld/view.svg";
import { statusArray } from "constant";
import ViewLoanModal from "components/pawnShop/ViewLoanModal";
import Pagination from "components/common/Pagination";
import { getCollectionName, getEndTime } from "utils";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "actions/loading";

const AllLoan = () => {
  let { loanData, myLoanData, loading } = useGetLoan();
  const [selector, setSelector] = useState<boolean>(true);
  const [loanSel, setLoanSel] = useState(-1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selPage, setSelPage] = useState(1);
  const [pageData, setPageData] = useState<any[]>([]);
  const { connex } = useWallet();
  const dispatch = useDispatch();

  const { collectionOptions } = useSelector(
    (state: any) => state.collectionOptions
  );
  const data = selector ? loanData : myLoanData;

  useEffect(() => {
    setPageData(data.slice((selPage - 1) * 10, selPage * 10));
  }, [selPage, data]);

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  const differentTime = (time: string) => {
    let endTime = getEndTime(time, connex);
    let returnTime;
    if (endTime) {
      let temp =
        (new Date(endTime).getTime() - new Date().getTime()) / 1000 / 60;
      returnTime =
        temp > 0
          ? Math.floor(temp / 60) + "h " + Math.floor(temp % 60) + "min"
          : "-" +
            Math.abs(Math.floor(temp / 60 + 1)) +
            "h " +
            Math.abs(Math.floor(temp % 60)) +
            "min";
    }
    return returnTime;
  };

  return (
    <div className='lg:px-10 md:px-5 p-3 shadow-lg min-h-[60vh]'>
      <div className='flex justify-between items-center md:mt-3 border-b-2 pb-1'>
        <p className='md:text-4xl text-xl'>
          Here are{" "}
          <span className='text-[#FF4200]'>
            {selector ? "All" : "My"} Items
          </span>
        </p>
        <div className='flex lg:text-xl text-base'>
          <button
            className={`lg:px-5 lg:py-2 px-2 rounded-l-[99px] ${
              selector ? "bg-[#FF4200]" : "bg-[#F67D53]"
            }`}
            onClick={() => setSelector(true)}>
            List All Items
          </button>
          <button
            className={`lg:px-5 lg:py-2 px-2 rounded-r-[99px] ${
              !selector ? "bg-[#FF4200]" : "bg-[#F67D53]"
            }`}
            onClick={() => setSelector(false)}>
            List My Items
          </button>
        </div>
      </div>
      {pageData.length > 0 ? (
        <>
          <div className='min-h-[40vh]'>
            <table className='w-full md:text-xl text-base mt-2'>
              <thead className='uppercase backdrop-blur-2xl bg-[#0a0b1336]'>
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
                    className='border-b text-center backdrop-blur-xl'>
                    <td className='md:py-3 px-3 text-left'>
                      {collectionOptions &&
                        getCollectionName(
                          collectionOptions,
                          item.tokenAddress
                        ) +
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
                        : differentTime(item?.endTime)}
                    </td>
                    <td className='hidden md:table-cell'>
                      <div className='flex justify-center'>
                        <p className='border-2 py-1 rounded-lg w-20'>
                          {statusArray[item.status]}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className='flex items-center justify-center md:py-1 py-[1px]'>
                        <button
                          className='border-gray-200 md:py-1 border-2 hover:bg-[#FF4200] md:px-2 px-1 rounded-md'
                          onClick={() => {
                            setLoanSel(index);
                            dispatch(setLoading(true));
                            setOpenModal(true);
                          }}>
                          <img src={ViewImg} alt='view' width={25} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination data={data} selPage={selPage} setSelPage={setSelPage} />
        </>
      ) : (
        <p className='mt-5 text-2xl'>No Loan Data</p>
      )}
      <ViewLoanModal
        open={openModal}
        setOpenModal={setOpenModal}
        loanSel={data[loanSel]}
        getEndTime={getEndTime}
      />
    </div>
  );
};

export default AllLoan;
