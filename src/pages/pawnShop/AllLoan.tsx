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
  // const data = Array(57)
  //   .fill(0)
  //   .map((item, index) => ({
  //     owner: "0x91e5e50cf953c3853dcb10b01c41a6a8a0adc46a",
  //     tokenAddress: "0xd861be8e33ebd09764bfca242ca6a8c54dcf844a",
  //     tokenId: "4227",
  //     loanValue: "11000000000000000000",
  //     loanFee: index,
  //     duration: "25",
  //     startTime: "0",
  //     endTime: "0",
  //     messiah: "0x0000000000000000000000000000000000000000",
  //     status: "1",
  //   }));
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
    <div className='md:p-10 p-3 shadow-lg min-h-[50vh]'>
      <div className='md:flex justify-between item-center border-b-2 pb-1'>
        <p className='md:text-[32px] text-[20px] font-[700]'>
          Here are{" "}
          <span className='text-[#FF4200]'>
            {selector ? "All" : "My"} Items
          </span>
        </p>
        <div className='flex md:text-[20px] text-[15px] mt-2 md:mt-0'>
          <button
            className={`md:px-[32px] md:py-[16px] py-[5px] px-[10px] rounded-[9px] md:mr-5 mr-2 ${
              selector ? "bg-[#FF4200]" : "bg-[#F67D53]"
            }`}
            onClick={() => setSelector(true)}>
            List All Items
          </button>
          <button
            className={`md:px-[32px] md:py-[16px] py-[5px] px-[10px] rounded-[9px] ${
              !selector ? "bg-[#FF4200]" : "bg-[#F67D53]"
            }`}
            onClick={() => setSelector(false)}>
            List My Items
          </button>
        </div>
      </div>
      {pageData.length > 0 ? (
        <>
          <div className='min-h-[30vh]'>
            <table className='w-full text-gray-200 md:text-[20px] text-[16px] mt-2'>
              <thead className='uppercase bg-[#4F4F54]'>
                <tr className='text-center'>
                  <th className='px-3 py-4 text-left'>Collection</th>
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
                    <td className='p-3 text-left'>
                      {getCollectionName(item.tokenAddress)}
                    </td>
                    <td className='hidden md:table-cell'>
                      {item.loanValue / 10 ** 18}
                    </td>
                    <td className='hidden md:table-cell'>{item.loanFee}</td>
                    <td className='hidden md:table-cell'>{item.duration}</td>
                    <td className='hidden md:table-cell'>
                      {statusArray[item.status]}
                    </td>
                    <td>
                      <button
                        className='bg-gray-200 hover:bg-[#FF4200] px-3 py-1 rounded-md'
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
