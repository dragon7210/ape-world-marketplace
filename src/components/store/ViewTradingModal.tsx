/** @format */

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { removeTradingABI } from "abi/abis";
import { setLoading } from "actions/loading";
import { trade_address } from "config/contractAddress";
import { useWallet } from "hooks";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { get_image, shortenAddress } from "utils";
import toast from "react-hot-toast";

const ViewTradingModal = ({
  open,
  selData,
  setOpen,
  setViewData,
  viewData,
  setOpenOffer,
}: {
  open: boolean;
  selData: any;
  setOpen: any;
  setViewData: any;
  viewData: any;
  setOpenOffer: any;
}) => {
  const dispatch = useDispatch();
  const { address, connex } = useWallet();

  useEffect(() => {
    Promise.all(
      selData?.nfts?.map(async (item: any) => {
        return await get_image(item[0], item[1]);
      })
    )
      .then((result) => {
        setViewData(result);
      })
      .catch((error) => {
        dispatch(setLoading(false));
        console.error(error);
      });
  }, [dispatch, setViewData, selData]);

  const removeItem = useCallback(async () => {
    if (connex) {
      const namedMethod = connex.thor
        .account(trade_address)
        .method(removeTradingABI);
      const clause = namedMethod.asClause(selData?.itemId);
      connex.vendor
        .sign("tx", [clause])
        .comment("Remove Item.")
        .request()
        .then(() => {
          dispatch(setLoading(false));
          setOpen(!open);
          toast.success("Success");
        })
        .catch(() => {
          dispatch(setLoading(false));
          setOpen(!open);
          toast.error("Could not remove Item.");
        });
    }
  }, [selData, dispatch, setOpen, open, connex]);

  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm z-30'
      open={open}
      onClose={() => {}}>
      <div className='bg-gray-200 p-3 rounded-lg shadow-lg shadow-gray-500 text-gray-600'>
        <div className='flex justify-end'>
          <XMarkIcon
            className='w-6 cursor-pointer hover:bg-gray-500 rounded-md'
            onClick={() => {
              setOpen(!open);
              setViewData([]);
            }}
          />
        </div>
        <div
          className={`grid grid-col-1 h-[300px] overflow-y-auto ${
            viewData.length === 1 ? "" : "md:grid-cols-2"
          }`}>
          {viewData.map((item: any, index: number) => (
            <div key={index} className='mx-1'>
              <img
                className='rounded-lg'
                src={item?.img}
                onLoad={() => dispatch(setLoading(false))}
                alt='createLoan'
              />
              <div className='flex justify-between px-3 text-xl my-2'>
                <p>{item.name}</p>
                <p>Rank : {item.rank ? item.rank : "Any"}</p>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className='flex justify-between md:mt-1 md:text-base text-sm text-gray-100'>
            <span className='bg-rose-700 rounded-md p-1 px-2'>
              Item owner By {shortenAddress(selData?.owner)}
            </span>
            <span className='bg-violet-700 rounded-md p-1 px-2'>
              {selData?.type}
            </span>
          </div>
          <div className='bg-gray-900 text-gray-100 md:px-5 md:py-2 p-2 mt-2 rounded-xl'>
            <p className='md:text-xltext-sm'>Details</p>
          </div>
          <div
            className={`flex mt-2 justify-end text-gray-200 md:text-xl text-base`}>
            {selData?.type === "LIST" && (
              <button
                className='bg-[#44a1b5] hover:bg-[#40bcd7] py-1 rounded-lg w-28 ml-5'
                onClick={() => {
                  setOpen(!open);
                  setOpenOffer(true);
                }}>
                Create New Offer
              </button>
            )}
            {selData?.owner === address && (
              <button
                className='bg-[#FF0000] py-1 rounded-lg w-28 ml-5'
                onClick={() => {
                  removeItem();
                  dispatch(setLoading(true));
                }}>
                Remove This {selData?.type}
              </button>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewTradingModal;
