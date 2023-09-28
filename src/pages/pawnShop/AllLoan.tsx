/** @format */

import Spinner from "components/common/Spinner";
import { useCustomQuery, useGetLoanData } from "hooks";
import { useEffect, useState } from "react";
import { getCollections } from "utils/query";
import ViewImg from "assets/svg/apeworld/view.svg";
import { statusArray } from "constant";
import ViewLoanModal from "components/pawnShop/viewLoanModal";
import Pagination from "components/common/Pagination";

const AllLoan = () => {
  let { loanData, myLoanData, loading } = useGetLoanData();
  const [selector, setSelector] = useState<boolean>(true);
  const [loanSel, setLoanSel] = useState(-1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selPage, setSelPage] = useState(1);
  const [pageData, setPageData] = useState<any[]>([]);

  const collectionOptions = useCustomQuery({
    query: getCollections,
    variables: {},
  });

  const data = selector ? loanData : myLoanData;
  useEffect(() => {
    setPageData(data.slice((selPage - 1) * 10, selPage * 10));
  }, [selPage, data]);

  const getCollectionName = (tokenAddress: string) => {
    let temp = collectionOptions?.collections?.filter(
      (item: any) =>
        item.smartContractAddress?.toLowerCase() === tokenAddress?.toLowerCase()
    );
    if (temp?.length !== 0) {
      return temp[0]?.name;
    }
  };

  return (
    <div className='lg:px-10 md:px-5 p-3 shadow-lg min-h-[62vh]'>
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
            <table className='w-full text-gray-200 md:text-xl text-base mt-2'>
              <thead className='uppercase bg-[#4F4F54]'>
                <tr className='text-center'>
                  <th className='px-3 md:py-4 py-1 text-left'>Collection</th>
                  <th className='hidden md:table-cell'>Value (Vet)</th>
                  <th className='hidden md:table-cell'>Interest (%)</th>
                  <th className='hidden md:table-cell'>Duration (h)</th>
                  <th className='hidden md:table-cell'>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((item: any, index: number) => (
                  <tr key={index} className='border-b text-center bg-[#656264]'>
                    <td className='md:py-3 px-3 text-left'>
                      {getCollectionName(item.tokenAddress) +
                        " #" +
                        item.tokenId}
                    </td>
                    <td className='hidden md:table-cell'>
                      {item.loanValue / 10 ** 18}
                    </td>
                    <td className='hidden md:table-cell'>{item.loanFee}</td>
                    <td className='hidden md:table-cell'>{item.duration}</td>
                    <td className='hidden md:table-cell'>
                      <div className='flex justify-center'>
                        <p className='border-2 py-1 rounded-lg w-20'>
                          {statusArray[item.status]}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div className='flex items-center justify-center md:py-1 py-[2px]'>
                        <button
                          className='border-gray-200 border-2 hover:bg-[#FF4200] md:px-2 px-1 rounded-md'
                          onClick={() => {
                            setLoanSel(index);
                            setOpenModal(true);
                            loading = true;
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
        <p className='mt-5'>No Loan Data</p>
      )}
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
