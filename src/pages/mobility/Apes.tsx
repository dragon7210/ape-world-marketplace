/** @format */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCollectionName } from "utils";
import { useGetApes } from "hooks/useGetApes";
import { ArrowUpOnSquareStackIcon, EyeIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import RegisterModal from "components/mobility/RegisterModal";
import ViewModal from "components/mobility/ViewModal";
import Pagination from "components/common/Pagination";
import MoveModal from "components/mobility/MoveModal";

const Apes = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openView, setOpenView] = useState<boolean>(false);
  const [openMove, setOpenMove] = useState<boolean>(false);
  const [pageData, setPageData] = useState<any[]>([]);
  const [ape, setApe] = useState<{ [key: string]: string }>({
    tokenAddress: "",
    tokenId: "",
  });
  const dispatch = useDispatch();
  const { collectionOptions } = useSelector((state: any) => state.collections);
  const { apes, loading } = useGetApes();

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  return (
    <div className='lg:px-10 md:px-5 p-3 bg-[#00000050] min-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_300px)] rounded-xl'>
      <div className='flex justify-end items-center md:mt-3 border-b-2 border-[#00d2ff50] pb-1'>
        <button
          className='bg-[#00a4c7] hover:bg-[#00d2ff] py-[1px] md:py-[5px] rounded-lg w-24 md:text-xl text-base'
          onClick={() => {
            setOpen(!open);
          }}>
          Register
        </button>
      </div>
      {apes.length > 0 ? (
        <div className='h-[calc(100vh_-_300px)] overflow-y-auto md:h-[calc(100vh_-_450px)]'>
          <table className='w-full md:text-xl text-base mt-2 tracking-wider'>
            <thead className='uppercase backdrop-blur-xl bg-[#0a0b1336]'>
              <tr className='text-center'>
                <th className='px-3 md:py-4 py-1 text-left'>Collection</th>
                <th className='hidden md:table-cell'>Id</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((item: any, index: number) => (
                <tr
                  key={index}
                  className='border-b text-center backdrop-blur-sm'>
                  <td className='md:py-3 px-3 text-left'>
                    {getCollectionName(collectionOptions, item?.tokenAddress)}
                  </td>
                  <td className='hidden md:table-cell'>{item?.tokenId}</td>
                  <td>
                    <div className='flex items-center justify-center md:py-1 py-[1px]'>
                      <button
                        className='bg-[#00a4c7] hover:bg-[#00d2ff] md:p-[5px] p-[2px] rounded-[99px]'
                        onClick={() => {
                          dispatch(setLoading(true));
                          setOpenView(true);
                          setApe({
                            ...ape,
                            tokenAddress: item?.tokenAddress,
                            tokenId: item?.tokenId,
                          });
                        }}>
                        <EyeIcon className='md:w-6 w-4' />
                      </button>
                      <button
                        className='bg-[#00a4c7] hover:bg-[#00d2ff] md:p-[5px] p-[2px] rounded-[99px] ml-2'
                        onClick={() => {
                          setOpenMove(true);
                          setApe({
                            ...ape,
                            tokenAddress: item?.tokenAddress,
                            tokenId: item?.tokenId,
                          });
                        }}>
                        <ArrowUpOnSquareStackIcon className='md:w-6 w-4' />
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
          <p className='pt-5 text-2xl'>No Apes Data</p>
        </div>
      )}
      <Pagination data={apes} color='#00a4c7' setPageData={setPageData} />
      <ViewModal
        open={openView}
        setOpen={setOpenView}
        ape={ape}
        setApe={setApe}
      />
      <MoveModal open={openMove} setOpen={setOpenMove} ape={ape} />
      <RegisterModal open={open} setOpen={setOpen} />
    </div>
  );
};
export default Apes;
