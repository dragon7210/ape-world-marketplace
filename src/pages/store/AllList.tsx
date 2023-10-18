/** @format */

import { EyeIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { useGetTrading } from "hooks";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCollectionName, shortenAddress } from "utils";
import Pagination from "components/common/Pagination";
import ViewTradingModal from "components/store/ViewTradingModal";

const AllList = () => {
  const [tab, setTab] = useState<number>(0);
  const { trading, myTrading, loading } = useGetTrading();
  const [pageData, setPageData] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selData, setSelData] = useState<any>();
  const dispatch = useDispatch();
  const { collectionOptions } = useSelector((state: any) => state.collections);

  const data = tab === 0 ? trading : myTrading;

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [dispatch, loading]);

  return (
    <div className='lg:px-10 md:px-5 p-3 bg-[#00000050] min-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_300px)] rounded-xl'>
      <div className='flex justify-end items-center md:mt-3 border-b-2 pb-1 md:text-2xl text-base'>
        <button
          className={`md:py-1 px-2 rounded-l-[99px] w-[160px] ${
            tab === 0 ? "bg-[#40bcd7]" : "bg-[#44a1b5]"
          }`}
          onClick={() => setTab(0)}>
          All Trading Items
        </button>
        <button
          className={`md:py-1 px-2 w-[160px] rounded-r-[99px] ${
            tab === 1 ? "bg-[#40bcd7]" : "bg-[#44a1b5]"
          }`}
          onClick={() => setTab(1)}>
          My Trading Items
        </button>
      </div>
      {pageData.length > 0 ? (
        <div className='h-[calc(100vh_-_300px)] overflow-y-auto md:h-[calc(100vh_-_450px)]'>
          <table className='w-full md:text-xl text-base mt-2'>
            <thead className='uppercase backdrop-blur-xl bg-[#0a0b1336]'>
              <tr className='text-center'>
                <th className='px-3 md:py-4 py-1 text-left'>Collection</th>
                <th className='hidden md:table-cell'>Linked Items</th>
                <th className='hidden md:table-cell'>Owner</th>
                <th className='hidden md:table-cell'>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((item: any, index: number) => (
                <tr
                  key={index}
                  className='border-b text-center backdrop-blur-sm'>
                  <td className='md:py-3 px-3 text-left'>
                    {item.nfts.map((i: any, index: number) => {
                      return (
                        <p key={index}>
                          {getCollectionName(collectionOptions, i[0]) +
                            " #" +
                            i[1]}
                        </p>
                      );
                    })}
                  </td>
                  <td className='hidden md:table-cell'>{item.linked.length}</td>
                  <td className='hidden md:table-cell'>
                    {shortenAddress(item.owner)}
                  </td>
                  <td className='hidden md:table-cell'>{item.type}</td>
                  <td>
                    <div className='flex items-center justify-center md:py-1 py-[1px]'>
                      <button
                        className='hover:bg-[#40bcd7] bg-[#44a1b5] md:p-[5px] p-[2px] rounded-[99px]'
                        onClick={() => {
                          setSelData(item);
                          setOpen(!open);
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
          <p className='pt-5 text-2xl'>No Trading Data</p>
        </div>
      )}
      <Pagination data={data} color='#44a1b5' setPageData={setPageData} />
      <ViewTradingModal open={open} setOpen={setOpen} selData={selData} />
    </div>
  );
};
// 40bcd7
export default AllList;
