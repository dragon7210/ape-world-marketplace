/** @format */

import { useEffect, useState } from "react";
import Spinner from "components/common/Spinner";
import Pagination from "components/common/Pagination";
import { useSelector } from "react-redux";
import { getCollectionName } from "utils";
import { useGetOptions } from "hooks";
import ViewImg from "assets/svg/apeworld/view.svg";

const Market = () => {
  const [selector, setSelector] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selPage, setSelPage] = useState(1);
  const [pageData, setPageData] = useState<any[]>([]);

  const { collectionOptions } = useSelector(
    (state: any) => state.collectionOptions
  );
  const { loading, optionData, myOptionData } = useGetOptions();
  const data = selector ? optionData : myOptionData;

  useEffect(() => {
    setPageData(data.slice((selPage - 1) * 10, selPage * 10));
  }, [selPage, data]);

  return (
    <div className='lg:px-10 md:px-5 p-3 shadow-lg min-h-[60vh]'>
      <div className='flex justify-between items-center border-b-2 pb-1'>
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
                  <th className='px-3 md:py-4 py-1 text-left'>Type</th>
                  <th className='hidden md:table-cell'>Collection</th>
                  <th className='hidden md:table-cell'>Id</th>
                  <th className='hidden md:table-cell'>Status</th>
                  <th className='hidden md:table-cell'>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((item: any, index: number) => (
                  <tr
                    key={index}
                    className='border-b text-center backdrop-blur-xl'>
                    <td className='md:py-3 px-3 text-left'>
                      {item.type === "1" ? "PUT" : "CALL"}
                    </td>
                    <td className='hidden md:table-cell'>
                      {collectionOptions &&
                        getCollectionName(collectionOptions, item.collection)}
                    </td>
                    <td className='hidden md:table-cell'>{item.nftId}</td>
                    <td className='hidden md:table-cell'>
                      {item.status ? "Available" : "Sold"}
                    </td>
                    <td className='hidden md:table-cell'>{item.price}</td>
                    <td>
                      <div className='flex items-center justify-center md:py-1 py-[1px]'>
                        <button
                          className='border-gray-200 md:py-1 border-2 hover:bg-[#FF4200] md:px-2 px-1 rounded-md'
                          onClick={() => {
                            // setLoanSel(index);
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
      <Spinner loading={loading} />
      {/* <ViewLoanModal
        open={openModal}
        setOpenModal={setOpenModal}
        loanSel={data[loanSel]}
        getEndTime={getEndTime}
      /> */}
    </div>
  );
};

export default Market;
