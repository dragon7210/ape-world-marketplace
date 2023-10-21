/** @format */

import { useEffect, useState } from "react";
import Pagination from "components/common/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { getCollectionName } from "utils";
import { useGetOptions, useWallet } from "hooks";
import ViewOptionModal from "components/lab/ViewOptionModal";
import { setLoading } from "actions/loading";
import { EyeIcon } from "@heroicons/react/24/outline";

const Market = () => {
  const [selector, setSelector] = useState(true);
  const [open, setOpen] = useState(false);
  const [pageData, setPageData] = useState<any[]>([]);
  const [optionSel, setOptionSel] = useState<number>(-1);
  const [block, setBlock] = useState<number>(0);
  const dispatch = useDispatch();
  const { connex } = useWallet();

  useEffect(() => {
    if (connex) {
      setBlock(connex.thor.status["head"]["number"]);
    }
  }, [connex]);

  const { collectionOptions } = useSelector((state: any) => state.collections);
  const { loading, optionData, myOptionData } = useGetOptions();
  const data = selector ? optionData : myOptionData;

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  return (
    <div className='lg:px-10 md:px-5 p-3 shadow-lg min-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_300px)] bg-[#20202050] rounded-xl tracking-wide'>
      <div className='flex justify-between items-center md:mt-3 border-b-2 pb-1'>
        <p className='md:text-4xl text-md'>
          Here are{" "}
          <span className='text-[#006ec9]'>
            {selector ? "All" : "My"} Options
          </span>
        </p>
        <div className='flex md:text-2xl text-base'>
          <button
            className={`lg:px-5 md:py-1 px-2 rounded-l-[99px] ${
              selector ? "bg-[#008cff]" : "bg-[#006ec9]"
            }`}
            onClick={() => setSelector(true)}>
            All Options
          </button>
          <button
            className={`lg:px-5 md:py-1 px-2 rounded-r-[99px] ${
              !selector ? "bg-[#008cff]" : "bg-[#006ec9]"
            }`}
            onClick={() => setSelector(false)}>
            My Options
          </button>
        </div>
      </div>
      {pageData.length > 0 ? (
        <div className='min-h-[calc(100vh_-_300px)] md:min-h-[calc(100vh_-_450px)]'>
          <table className='w-full md:text-xl text-base mt-2'>
            <thead className='uppercase backdrop-blur-2xl bg-[#0a0b1336]'>
              <tr className='text-center'>
                <th className='px-3 md:py-4 py-1 text-left'>Collection</th>
                <th className='hidden md:table-cell'>Type</th>
                <th className='hidden md:table-cell'>Id</th>
                <th className='hidden md:table-cell'>Status</th>
                <th className='hidden md:table-cell'>Price(VET)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((item: any, index: number) => (
                <tr
                  key={index}
                  className='border-b text-center backdrop-blur-sm'>
                  <td className='md:py-3 px-3 text-left'>
                    {getCollectionName(collectionOptions, item.tokenAddress)}
                  </td>
                  <td className='hidden md:table-cell'>{item.type}</td>
                  <td className='hidden md:table-cell'>
                    {item.type === "CALL" ? item.tokenId : "Any"}
                  </td>
                  <td className='hidden md:table-cell'>
                    {Number(item.expirationDate) > block
                      ? item.takeable
                        ? "Available"
                        : "Sold"
                      : "Expired"}
                  </td>
                  <td className='hidden md:table-cell'>
                    {item.optionPrice / 10 ** 18}
                  </td>
                  <td>
                    <div className='flex items-center justify-center md:py-1 py-[1px]'>
                      <button
                        className='hover:bg-[#008cff] bg-[#006ec9] md:p-[5px] p-[2px] rounded-[99px]'
                        onClick={() => {
                          setOptionSel(index);
                          setOpen(true);
                          dispatch(setLoading(true));
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
      <Pagination data={data} color='#006ec9' setPageData={setPageData} />
      <ViewOptionModal
        open={open}
        setOpen={setOpen}
        data={pageData[optionSel]}
        block={block}
      />
    </div>
  );
};

export default Market;
