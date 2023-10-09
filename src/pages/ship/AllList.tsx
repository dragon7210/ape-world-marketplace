/** @format */

import { setLoading } from "actions/loading";
import { useGetRaffle, useWallet } from "hooks";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { differentTime, getCollectionName, shortenAddress } from "utils";
import Pagination from "components/common/Pagination";
import ViewImg from "assets/svg/apeworld/view.svg";
import ViewRaffleModal from "components/ship/ViewRaffleModal";

const AllList = () => {
  const [tab, setTab] = useState<number>(0);
  const { raffles, myRaffles, oldRaffles, loading } = useGetRaffle();
  const [data, setData] = useState<any>([]);
  const [pageData, setPageData] = useState<any[]>([]);
  const { connex } = useWallet();
  const [open, setOpen] = useState<boolean>(false);
  const [selData, setSelData] = useState<any>();
  const dispatch = useDispatch();

  const { collectionOptions } = useSelector(
    (state: any) => state.collectionOptions
  );

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  useEffect(() => {
    if (tab === 0) {
      setData(raffles);
    } else if (tab === 1) {
      setData(myRaffles);
    } else {
      setData(oldRaffles);
    }
  }, [tab, raffles, myRaffles, oldRaffles]);

  return (
    <div className='lg:px-10 md:px-5 p-3 bg-[#00000050] min-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_300px)] rounded-xl'>
      <div className='flex justify-end items-center md:mt-3 border-b-2 pb-1 md:text-2xl text-base'>
        <button
          className={`md:py-1 px-2 rounded-l-[99px] w-[160px] ${
            tab === 0 ? "bg-[#ff9933]" : "bg-[#cb6500]"
          }`}
          onClick={() => setTab(0)}>
          Live Auctions
        </button>
        <button
          className={`md:py-1 px-2 w-[160px] border-x-2 border-[#ff9933] ${
            tab === 1 ? "bg-[#ff9933]" : "bg-[#cb6500]"
          }`}
          onClick={() => setTab(1)}>
          All My Auctions
        </button>
        <button
          className={`md:py-1 px-2 rounded-r-[99px] w-[160px] ${
            tab === 2 ? "bg-[#ff9933]" : "bg-[#cb6500]"
          }`}
          onClick={() => setTab(2)}>
          Concluded Auctions
        </button>
      </div>
      {pageData.length > 0 ? (
        <div className='h-[calc(100vh_-_300px)] overflow-y-auto md:h-[calc(100vh_-_450px)]'>
          <table className='w-full md:text-xl text-base mt-2'>
            <thead className='uppercase backdrop-blur-xl bg-[#0a0b1336]'>
              <tr className='text-center'>
                <th className='px-3 md:py-4 py-1 text-left'>Collection</th>
                <th className='hidden md:table-cell'>Price</th>
                <th className={`hidden ${tab !== 2 && "md:table-cell"} `}>
                  Sold
                </th>
                <th className={`hidden ${tab !== 2 && "md:table-cell"} `}>
                  Duration
                </th>
                {tab === 2 && (
                  <>
                    <th className='hidden md:table-cell'>Owner</th>
                    <th className='hidden md:table-cell'>Pot</th>
                    <th className='hidden md:table-cell'>Winning Ticket</th>
                  </>
                )}
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
                    {item.ticketValue / 10 ** 18 +
                      (item?.paymentToken ===
                      "0xc3fd50a056dc4025875fa164ced1524c93053f29"
                        ? "MVA"
                        : "VET")}
                  </td>
                  <td className={`hidden ${tab !== 2 && "md:table-cell"} `}>
                    {item.nTickets + "/" + item.ticketNumber}
                  </td>
                  <td className={`hidden ${tab !== 2 && "md:table-cell"} `}>
                    {differentTime(item.endTime, connex)}
                  </td>
                  {tab === 2 && (
                    <>
                      <td className='hidden md:table-cell'>
                        {shortenAddress(item.owner)}
                      </td>
                      <td className='hidden md:table-cell'>
                        {(item.nTickets * item.ticketValue) / 10 ** 18 +
                          (item?.paymentToken ===
                          "0xc3fd50a056dc4025875fa164ced1524c93053f29"
                            ? "MVA"
                            : "VET")}
                      </td>
                      <td className='hidden md:table-cell'>{item.winner}</td>
                    </>
                  )}
                  <td>
                    <div className='flex items-center justify-center md:py-1 py-[1px]'>
                      <button
                        className='hover:bg-[#ff9933] bg-[#cb6500] md:p-[5px] p-[2px] rounded-[99px]'
                        onClick={() => {
                          setSelData(item);
                          setOpen(!open);
                          dispatch(setLoading(true));
                        }}>
                        <img
                          src={ViewImg}
                          alt='view'
                          className='md:w-6 md:h-6 w-4 h-4'
                        />
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
          <p className='pt-5 text-2xl'>No Raffle Data</p>
        </div>
      )}
      <Pagination data={data} color='#cb6500' setPageData={setPageData} />
      <ViewRaffleModal open={open} setOpen={setOpen} selData={selData} />
    </div>
  );
};

export default AllList;
