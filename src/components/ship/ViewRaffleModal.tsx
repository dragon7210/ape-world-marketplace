/** @format */

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  approveABI,
  createRaffleABI,
  getFeeABI,
  mvaApproveABI,
} from "abi/abis";
import { setLoading } from "actions/loading";
import { mva_token_address, raffle_address } from "config/contractAddress";
import { useWallet } from "hooks";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const ViewRaffleModal = ({
  open,
  selData,
  collections,
  setOpen,
}: {
  open: boolean;
  selData: any;
  collections: any;
  setOpen: any;
}) => {
  const { connex } = useWallet();
  const dispatch = useDispatch();
  const data = collections?.filter(
    (item: any) =>
      item?.smartContractAddress?.toLowerCase() ===
      selData?.tokenAddress?.toLowerCase()
  );
  const getServiceFee = async () => {
    if (connex) {
      const namedMethod = connex.thor.account(raffle_address).method(getFeeABI);
      const output = await namedMethod.call();
      return output["decoded"]["0"] * 10 ** 18;
    }
  };

  const handleCreate = async () => {};
  console.log(data);
  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm z-30'
      open={open}
      onClose={() => {}}>
      {data?.length > 0 && (
        <div className='bg-gray-200 w-[270px] md:w-[720px] md:flex p-3 rounded-lg shadow-lg shadow-gray-500 text-gray-600'>
          <div className='flex justify-end md:hidden'>
            <XMarkIcon
              className='w-6 cursor-pointer hover:bg-gray-500 rounded-md'
              onClick={() => setOpen(!open)}
            />
          </div>
          {/* <img
            className='rounded-lg'
            src={data[0]?.assets[1].url}
            alt='createLoan'
            onLoad={() => dispatch(setLoading(false))}
          /> */}
          <div className='md:ml-3 mt-2 '>
            <div className='md:flex justify-end hidden '>
              <XMarkIcon
                className='w-6 cursor-pointer hover:bg-gray-500 rounded-md'
                onClick={() => setOpen(!open)}
              />
            </div>
            <div className='flex justify-between items-center'>
              <p className='md:text-3xl text-xl mt-1 font-[700] text-black'>
                {data[0]?.name}
              </p>
              <p className='bg-green-600 ml-1 text-gray-50 md:text-md text-sm px-3 py-1 rounded-xl'>
                Rank {data[0]?.rank}
              </p>
            </div>
            <p className='md:text-3xl text-lg mt-2 min-w-[256px] text-center'>
              You are about to LIST
            </p>
            <div className='bg-gray-900 md:w-[430px] text-gray-100 md:px-5 md:py-2 p-2 mt-2 rounded-xl'>
              <p className='md:text-xltext-sm'>Details</p>
              <div className='md:columns-3 columns-1 md:px-5 px-2 text-base md:text-md'>
                <div className='flex justify-between md:inline'>
                  <p className='text-gray-500'>Ticket Value</p>
                  <p>{selData?.value} VET</p>
                </div>
                <div className='flex justify-between md:inline'>
                  <p className='text-gray-500'>Number Of Tickets</p>
                  <p>{selData?.count}</p>
                </div>
                <div className='flex justify-between md:inline'>
                  <p className='text-gray-500'>Duration</p>
                  <p>{selData?.duration} H</p>
                </div>
              </div>
            </div>
            <div className='flex md:text-xl text-base justify-end mt-2 text-white'>
              <button
                className='bg-[#FF4200] py-1 rounded-lg mr-5 w-24'
                onClick={() => {
                  dispatch(setLoading(true));
                  handleCreate();
                }}>
                CONFIRM
              </button>
              <button
                className='bg-[#FF0000] py-1 rounded-lg w-24'
                onClick={() => setOpen(!open)}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default ViewRaffleModal;
