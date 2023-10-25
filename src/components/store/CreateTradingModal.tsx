/** @format */

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useWallet } from "hooks";
import { mva_token_address, trade_address } from "config/contractAddress";
import {
  approveABI,
  createTradingABI,
  getTradingFeeABI,
  mvaApproveABI,
} from "abi/abis";
import { get_image } from "utils";
import toast from "react-hot-toast";

const CreateTradingModal = ({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: any;
  data: any;
}) => {
  const dispatch = useDispatch();
  const { collectionOptions } = useSelector((state: any) => state.collections);
  const [allData, setAllData] = useState<any>([]);
  const { connex } = useWallet();

  useEffect(() => {
    if (data?.length > 0) {
      Promise.all(
        data.map(async (item: any) => {
          return await get_image(
            collectionOptions.filter(
              (i: any) => i?.collectionId === item?.collectionId
            )[0]?.smartContractAddress,
            item.id
          );
        })
      )
        .then((result) => {
          setAllData(result);
        })
        .catch((error) => {
          dispatch(setLoading(false));
          console.error(error);
        });
    }
  }, [dispatch, data, setAllData, collectionOptions]);

  const createTradingList = async () => {
    if (connex) {
      const feeMethod = connex.thor
        .account(trade_address)
        .method(getTradingFeeABI);
      const fee = await feeMethod.call();
      const offerFee = fee["decoded"]["1"] * 10 ** 18;

      const namedMethod = connex.thor
        .account(trade_address)
        .method(createTradingABI);

      let nftPayload: any[] = [];

      for (const item of data) {
        nftPayload.push([
          collectionOptions.filter(
            (i: any) => i?.collectionId === item?.collectionId
          )[0]?.smartContractAddress,
          item?.id,
        ]);
      }
      const last_clause = namedMethod.asClause(nftPayload);

      const yetAnotherMethod = connex.thor
        .account(mva_token_address)
        .method(mvaApproveABI);

      var clauses = [];
      clauses.push(
        yetAnotherMethod.asClause(trade_address, offerFee.toString())
      );

      var anotherNamedMethod;
      for (let j = 0; j < nftPayload.length; j++) {
        anotherNamedMethod = connex.thor
          .account(nftPayload[j][0])
          .method(approveABI);
        clauses.push(
          anotherNamedMethod.asClause(trade_address, nftPayload[j][1])
        );
      }
      clauses.push(last_clause);

      connex.vendor
        .sign("tx", clauses)
        .comment("Create Listing.")
        .request()
        .then(() => {
          dispatch(setLoading(false));
          toast.success("Success");
          setOpen(!open);
          setAllData([]);
        })
        .catch(() => {
          dispatch(setLoading(false));
          setOpen(!open);
          setAllData([]);
          toast.error("Could not create list.");
        });
    }
  };

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
              setAllData([]);
            }}
          />
        </div>
        <p className='text-2xl md:text-4xl font-bold text-gray-800 px-2 mb-1'>
          You are about to LIST
        </p>
        <div
          className={`grid grid-col-1 h-[292px] overflow-y-auto ${
            allData.length === 1 ? "" : "md:grid-cols-2"
          }`}>
          {allData.map((item: any, index: number) => (
            <div key={index}>
              <img
                className='rounded-lg'
                src={item?.img}
                onLoad={() => dispatch(setLoading(false))}
                alt='createLoan'
              />
              <div className='flex justify-between px-3 text-xl my-1'>
                <p>{item.name}</p>
                <p>Rank : {item.rank ? item.rank : "Any"}</p>
              </div>
            </div>
          ))}
        </div>
        <div className='flex justify-end md:text-xl text-base text-gray-200 mt-1'>
          <button
            className='bg-[#44a1b5] hover:bg-[#40bcd7] py-1 rounded-lg w-28 ml-5'
            onClick={() => {
              createTradingList();
              dispatch(setLoading(true));
            }}>
            Confirm
          </button>
          <button
            className='bg-[#FF0000]  py-1 rounded-lg w-28 ml-5'
            onClick={() => {
              setOpen(!open);
              setAllData([]);
            }}>
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateTradingModal;
