/** @format */

import { Dialog } from "@headlessui/react";
import {
  approveABI,
  createLoanABI,
  getServiceFeeABI,
  mvaApproveABI,
} from "abi/abis";
import Spinner from "components/common/Spinner";
import { mva_token_address, pawn_address } from "config/contractAddress";
import { useWallet } from "hooks";
import { useState } from "react";
import toast from "react-hot-toast";

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
  const [loading, setLoading] = useState(true);
  const data = apes?.tokens?.items?.filter(
    (item: any) => item.collectionId === createValue.collectionId
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
          setLoading(false);
          setOpenModal(!open);
          toast.success("Created successfully");
        })
        .catch((e) => {
          setLoading(false);
          setOpenModal(!open);
          toast.error("Could not create loan.");
        });
    }
  };

  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm'
      open={open}
      onClose={() => {}}>
      {data?.length > 0 && (
        <div className='bg-gray-200 w-[270px] md:w-[40%] p-2 md:flex rounded-lg shadow-lg shadow-gray-500 text-gray-600'>
          <img
            className='rounded-lg'
            src={data[0]?.assets[1].url}
            alt='createLoan'
            onLoad={() => setLoading(false)}
          />
          <div className='md:ml-[50px] md:mt-6 mt-4'>
            <p className='md:text-3xl text-xl mt-2 md:text-left text-black text-center'>
              {data[0]?.name}
            </p>
            <p className='md:text-base text-[10px] md:mt-5 min-w-[256px] text-center'>
              You are about to REQUEST a {createValue.vet} VET LOAN for This.{" "}
            </p>
            <div className='flex md:text-xl text-md justify-end md:mt-6 mt-2 mr-5 text-white'>
              <button
                className='bg-[#FF4200] py-1 rounded-lg md:mr-[40px] mr-5 md:w-32 w-24'
                onClick={() => {
                  handleCreate();
                  setLoading(true);
                }}>
                Confirm
              </button>
              <button
                className='bg-[#FF0000] py-1 rounded-lg md:w-32 w-24'
                onClick={() => setOpenModal(!open)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Spinner loading={loading} />
    </Dialog>
  );
};

export default CreateLoanModal;
