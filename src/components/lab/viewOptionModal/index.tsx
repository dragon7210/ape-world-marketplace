/** @format */
import { Dialog } from "@headlessui/react";
import { useWallet } from "hooks";
import { useDispatch, useSelector } from "react-redux";
import { getCollectionName, getEndTime, shortenAddress } from "utils";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";

const ViewOptionModal = ({
  open,
  setOpenModal,
  data,
}: {
  open: boolean;
  setOpenModal: any;
  data: any;
}) => {
  const dispatch = useDispatch();

  const { collectionOptions } = useSelector(
    (state: any) => state.collectionOptions
  );
  const { connex } = useWallet();

  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm overflow-y-auto m-3 z-30'
      open={open}
      onClose={() => {}}>
      <div className='w-[270px] md:w-[720px] bg-gray-200 p-3 rounded-lg shadow-lg text-gray-600 shadow-gray-500'>
        <div className='md:flex justify-between'>
          <img
            className='rounded-lg'
            alt='loanImg'
            onLoad={() => dispatch(setLoading(false))}
          />
          <div className='pt-3 md:pt-0'>
            <div className='flex justify-end'>
              <XMarkIcon
                className='w-6 cursor-pointer'
                onClick={() => setOpenModal(!open)}
              />
            </div>
            <p className='md:text-xl text-2xl font-[700] text-black'>
              {data?.type}
            </p>
            <p className='md:text-3xl text-2xl mt-1 font-[700] text-black'>
              {collectionOptions &&
                getCollectionName(collectionOptions, data?.tokenAddress)}
            </p>
            <div className='flex justify-between md:mt-1 md:text-base text-sm text-gray-100'>
              <span className='bg-rose-700 rounded-md p-1 px-2'>
                Item owner By {shortenAddress(data?.owner)}
              </span>
              <span className='bg-violet-700 rounded-md p-1 px-2'>
                {data?.takeable ? "Available" : "Sold"}
              </span>
            </div>
            <div className='bg-gray-900 md:w-[430px] text-gray-100 md:px-5 md:py-2 p-2 mt-2 rounded-xl'>
              <p className='md:text-xltext-sm'>Details</p>
              <div className='md:columns-3 columns-2 md:px-3 px-2 text-base md:text-md'>
                <div>
                  <p className='text-gray-500'>Token</p>
                  <p>{data?.type === "Call" ? data?.tokenId : "Any"}</p>
                </div>
                <div>
                  <p className='text-gray-500'>Strike Price</p>
                  <p>{data?.strikePrice / 10 ** 18} Vet</p>
                </div>
                <div>
                  <p className='text-gray-500'>Expiration</p>
                  <p>{getEndTime(data?.expirationDate, connex)}</p>
                </div>
                <div>
                  <p className='text-gray-500'>Option Price</p>
                  <p>{data?.optionPrice / 10 ** 18} Vet</p>
                </div>
                <div>
                  <p className='text-gray-500'>Excercise Date</p>
                  <p>
                    {data?.exerciseDate === "0" ? "N/A" : data?.exerciseDate}
                  </p>
                </div>
                <div>
                  <p className='text-gray-500'>Taker</p>
                  <p>
                    {data?.status !== "List"
                      ? "N/A"
                      : shortenAddress(data?.taker)}
                  </p>
                </div>
              </div>
            </div>

            <div className='flex md:text-lg text-base justify-end mt-2 text-gray-100'>
              {/* {Button} */}
              <button
                className='bg-[#FF4200] py-1 rounded-lg ml-5 w-24'
                onClick={() => {
                  setOpenModal(!open);
                }}>
                Remove This Put
              </button>
              <button
                className='bg-blue-500 py-1 rounded-lg ml-5 w-24'
                onClick={() => {
                  setOpenModal(!open);
                }}>
                Edit Option Price
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewOptionModal;
