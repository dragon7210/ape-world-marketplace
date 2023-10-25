/** @format */

import { TrashIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateTradingModal from "components/store/CreateTradingModal";
import ViewNftModal from "components/store/ViewNftModal";

const CreateTrading = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const { collectionOptions } = useSelector((state: any) => state.collections);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setLoading(false));
    }
  }, [data, dispatch]);

  return (
    <div className='lg:px-10 md:px-5 p-3 bg-[#00000050] min-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_300px)] rounded-xl'>
      <div className='flex justify-end items-center md:mt-3 border-b-2 pb-1 md:text-2xl text-base'>
        <button
          className={`md:py-1 px-2 rounded-lg w-[160px] hover:bg-[#40bcd7]  bg-[#44a1b5]`}
          onClick={() => setOpen(!open)}>
          ADD NFT
        </button>
      </div>
      {data?.length > 0 ? (
        <>
          <div className='h-[calc(100vh_-_300px)] overflow-y-auto md:h-[calc(100vh_-_450px)]'>
            <table className='w-full md:text-xl text-base mt-2'>
              <thead className='uppercase backdrop-blur-xl bg-[#0a0b1336]'>
                <tr className='text-center'>
                  <th className='px-3 md:py-4 py-1 text-left'>Collection</th>
                  <th className='hidden md:table-cell'>Id</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item: any, index: number) => (
                  <tr
                    key={index}
                    className='border-b text-center backdrop-blur-sm'>
                    <td className='md:py-3 px-3 text-left'>
                      {
                        collectionOptions.filter(
                          (i: any) => i?.collectionId === item?.collectionId
                        )[0]?.name
                      }
                    </td>
                    <td className='hidden md:table-cell'>{item?.id}</td>
                    <td>
                      <div className='flex items-center justify-center md:py-1 py-[1px]'>
                        <button
                          className='hover:bg-[#40bcd7] bg-[#44a1b5] md:p-[5px] p-[2px] rounded-[99px]'
                          onClick={() => {
                            data?.splice(index, 1);
                            setData([...data]);
                          }}>
                          <TrashIcon className='md:w-6 w-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className={`w-full md:text-2xl text-lg hover:bg-[#40bcd7]  bg-[#44a1b5] rounded-[99px] md:py-2 md:mb-4 py-1 mt-3`}
            onClick={() => {
              dispatch(setLoading(true));
              setOpenCreate(!openCreate);
            }}>
            Create New List
          </button>
        </>
      ) : (
        <div className='min-h-[calc(100vh_-_300px)] md:min-h-[calc(100vh_-_450px)]'>
          <p className='pt-5 text-2xl'>No Create Trading Data</p>
        </div>
      )}
      <ViewNftModal
        open={open}
        setOpen={setOpen}
        data={data}
        setData={setData}
      />
      <CreateTradingModal
        open={openCreate}
        setOpen={setOpenCreate}
        data={data}
      />
    </div>
  );
};

export default CreateTrading;
