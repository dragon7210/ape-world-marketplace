/** @format */

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  approveABI,
  createLoanABI,
  getServiceFeeABI,
  mvaApproveABI,
} from "abi/abis";
import { setLoading } from "actions/loading";
import { mva_token_address, pawn_address } from "config/contractAddress";
import { useWallet } from "hooks";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const CreateLoanModal = ({
  open,
  createValue,
  collections,
  apes,
  setOpenModal,
}: {
  open: boolean;
  createValue: any;
  collections: any;
  apes: any;
  setOpenModal: any;
}) => {
  const { address, connex } = useWallet();
  const dispatch = useDispatch();
  const data = apes?.tokens?.items?.filter(
    (item: any) => item.tokenId === createValue.id
  );
  const handleCreate = async () => {
    if (!address) {
      toast.error("Please connect the wallet");
      return;
    }
    if (connex) {
      const data = collections.filter(
        (item: any) => item.collectionId === createValue.collectionId
      );
      const selAddress = data[0].smartContractAddress;

      const pawnShop = connex.thor.account(pawn_address);

      const getFeeMethod = pawnShop.method(getServiceFeeABI);
      const namedMethod = connex.thor.account(selAddress).method(approveABI);
      const anotherNamedMethod = connex.thor
        .account(pawn_address)
        .method(createLoanABI);
      const yetAnotherMethod = connex.thor
        .account(mva_token_address)
        .method(mvaApproveABI);

      const fee = await getFeeMethod.call();
      const clause1 = namedMethod.asClause(pawn_address, createValue.id);
      const clause2 = anotherNamedMethod.asClause(
        selAddress,
        createValue.id,
        createValue.vet,
        createValue.interest,
        createValue.period
      );
      const clause3 = yetAnotherMethod.asClause(
        pawn_address,
        (fee.decoded[0] * 10 ** 18).toString()
      );
      connex.vendor
        .sign("tx", [clause1, clause3, clause2])
        .comment("Create Listing.")
        .request()
        .then(() => {
          dispatch(setLoading(false));
          setOpenModal(!open);
          toast.success("Created successfully");
        })
        .catch(() => {
          dispatch(setLoading(false));
          setOpenModal(!open);
          toast.error("Could not create loan.");
        });
    }
  };

  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm z-30'
      open={open}
      onClose={() => {}}>
      {data?.length > 0 && (
        <div className='bg-gray-200 w-[270px] md:w-[720px] md:flex p-3 rounded-lg shadow-lg shadow-gray-500 text-gray-600'>
          <img
            className='rounded-lg'
            src={data[0]?.assets[1].url}
            alt='createLoan'
            onLoad={() => dispatch(setLoading(false))}
          />
          <div className='md:ml-5 mt-2 '>
            <div className='md:flex justify-end hidden '>
              <XMarkIcon
                className='w-6 cursor-pointer'
                onClick={() => setOpenModal(!open)}
              />
            </div>
            <span className='bg-green-600 ml-1 text-gray-50 md:text-md text-sm px-3 py-1 rounded-xl'>
              Rank {data[0]?.rank}
            </span>
            <p className='md:text-5xl text-2xl mt-1 font-[700] text-black'>
              {data[0]?.name}
            </p>
            <p className='md:text-3xl text-lg md:mt-5 mt-2 min-w-[256px] text-center'>
              You are about to REQUEST a {createValue.vet} VET LOAN for This.
            </p>
            <div className='flex md:text-xl text-base justify-end md:mt-8 mt-2 text-white'>
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
                onClick={() => setOpenModal(!open)}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default CreateLoanModal;
