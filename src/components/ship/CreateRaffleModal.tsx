/** @format */

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { useWallet } from "hooks";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { mva_token_address, raffle_address } from "config/contractAddress";
import {
  approveABI,
  createRaffleABI,
  getFeeABI,
  mvaApproveABI,
} from "abi/abis";
import toast from "react-hot-toast";

const CreateRaffleModal = ({
  open,
  createValue,
  collections,
  apes,
  setOpen,
}: {
  open: boolean;
  createValue: any;
  collections: any;
  apes: any;
  setOpen: any;
}) => {
  const { connex } = useWallet();
  const dispatch = useDispatch();
  const [imgUrl, setImgUrl] = useState<string>("");
  const data = apes?.filter((item: any) => item.tokenId === createValue.id);

  const getServiceFee = async () => {
    if (connex) {
      const namedMethod = connex.thor.account(raffle_address).method(getFeeABI);
      const output = await namedMethod.call();
      return output["decoded"]["0"] * 10 ** 18;
    }
  };

  const handleCreate = async () => {
    if (connex) {
      const data = collections.filter(
        (item: any) => item.collectionId === createValue.collectionId
      );
      const selAddress = data[0].smartContractAddress;
      const namedMethod = connex.thor.account(selAddress).method(approveABI);
      var clause1 = namedMethod.asClause(raffle_address, createValue.id);

      const anotherNamedMethod = connex.thor
        .account(raffle_address)
        .method(createRaffleABI);
      var clause2 = anotherNamedMethod.asClause(
        selAddress,
        createValue.id,
        createValue.value,
        createValue.count,
        createValue.duration,
        createValue.token
      );
      const fee = await getServiceFee();
      const yetAnotherMethod = connex.thor
        .account(mva_token_address)
        .method(mvaApproveABI);
      if (fee) {
        const clause3 = yetAnotherMethod.asClause(
          raffle_address,
          fee.toString()
        );
        connex.vendor
          .sign("tx", [clause1, clause3, clause2])
          .comment("Create Raffle.")
          .request()
          .then(() => {
            dispatch(setLoading(false));
            setOpen(!open);
            setImgUrl("");
            toast.success("Success");
          })
          .catch(() => {
            dispatch(setLoading(false));
            setOpen(!open);
            setImgUrl("");
            toast.error("Could not create raffle.");
          });
      }
    }
  };

  useEffect(() => {
    if (data) {
      setImgUrl(data[0]?.assets[1].url);
    }
  }, [data]);

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
              onClick={() => {
                setOpen(!open);
                setImgUrl("");
              }}
            />
          </div>
          <img
            className='rounded-lg'
            src={imgUrl}
            alt='createLoan'
            onLoad={() => dispatch(setLoading(false))}
          />
          <div className='md:ml-3 mt-2 '>
            <div className='md:flex justify-end hidden '>
              <XMarkIcon
                className='w-6 cursor-pointer hover:bg-gray-500 rounded-md'
                onClick={() => {
                  setOpen(!open);
                  setImgUrl("");
                }}
              />
            </div>
            <div className='flex justify-between items-center'>
              <p className='md:text-3xl text-xl mt-1 font-[700] text-black'>
                {data[0]?.name}
              </p>
              <p className='bg-green-600 ml-1 text-gray-50 md:text-md text-sm px-3 py-1 rounded-xl'>
                Rank {data[0]?.rank ? data[0]?.rank : "Any"}
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
                  <p>
                    {createValue?.value +
                      " " +
                      (createValue.token === "false" ? "VET" : "MVA")}{" "}
                  </p>
                </div>
                <div className='flex justify-between md:inline'>
                  <p className='text-gray-500'>Number Of Tickets</p>
                  <p>{createValue?.count}</p>
                </div>
                <div className='flex justify-between md:inline'>
                  <p className='text-gray-500'>Duration</p>
                  <p>{createValue?.duration} H</p>
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
                onClick={() => {
                  setOpen(!open);
                  setImgUrl("");
                }}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default CreateRaffleModal;
