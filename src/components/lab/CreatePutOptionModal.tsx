/** @format */

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { useDispatch } from "react-redux";
import { useWallet } from "hooks";
import { mva_token_address, options_address } from "config/contractAddress";
import { createPutABI, getMarketFeeABI, mvaApproveABI } from "abi/abis";
import toast from "react-hot-toast";

const CreatePutOptionModal = ({
  open,
  setOpen,
  createValue,
  collections,
  apes,
}: {
  open: boolean;
  setOpen: any;
  collections: any;
  createValue: any;
  apes: any;
}) => {
  const dispatch = useDispatch();
  const { connex } = useWallet();

  const getMarketFee = async () => {
    if (connex) {
      const getMarketFeeMethod = connex.thor
        .account(options_address)
        .method(getMarketFeeABI);
      const rawOutput = await getMarketFeeMethod.call();
      return rawOutput["decoded"]["0"] * 10 ** 18;
    }
  };

  const handleOption = async () => {
    if (connex) {
      const data = collections.filter(
        (item: any) => item.collectionId === createValue.collectionId
      );
      const _tokenAddress = data[0].smartContractAddress;
      const _strike = createValue?.strikePrice;
      const _price = createValue?.putPrice;
      const _duration = createValue?.duration;

      const namedMethod = connex.thor
        .account(options_address)
        .method(createPutABI);
      const yetAnotherMethod = connex.thor
        .account(mva_token_address)
        .method(mvaApproveABI);

      var last_clause = namedMethod.asClause(
        _tokenAddress,
        _strike,
        _price,
        _duration
      );
      last_clause["value"] = (Number(_strike) * 10 ** 18).toString();
      var clauses = [];
      const fee = await getMarketFee();
      if (fee) {
        clauses.push(
          yetAnotherMethod.asClause(options_address, fee.toString())
        );
      }
      clauses.push(last_clause);
      connex.vendor
        .sign("tx", clauses)
        .comment("Create Put.")
        .request()
        .then(() => {
          setOpen(!open);
          dispatch(setLoading(false));
          toast.success("Success.");
        })
        .catch(() => {
          setOpen(!open);
          dispatch(setLoading(false));
          toast.error("Could not create call.");
        });
    }
  };

  const data = apes?.tokens?.items?.filter(
    (item: any) => item.tokenId === createValue.id
  );

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
            alt='createCall'
            onLoad={() => dispatch(setLoading(false))}
          />
          <div className='md:ml-3 mt-2 '>
            <div className='md:flex justify-end hidden '>
              <XMarkIcon
                className='w-6 cursor-pointer'
                onClick={() => setOpen(!open)}
              />
            </div>
            <span className='bg-green-600 ml-1 text-gray-50 md:text-md text-sm px-3 py-1 rounded-xl'>
              Rank {data[0]?.rank}
            </span>
            <p className='md:text-3xl text-xl mt-1 font-[700] text-black'>
              {data[0]?.name}
            </p>
            <p className='md:text-3xl text-lg mt-2 min-w-[256px] text-center'>
              You are about to create a Covered Put.
            </p>
            <div className='bg-gray-900 md:w-[430px] text-gray-100 md:px-5 md:py-2 p-2 mt-2 rounded-xl'>
              <p className='md:text-xltext-sm'>Details</p>
              <div className='md:columns-3 columns-2 md:px-5 px-2 text-base md:text-md'>
                <div>
                  <p className='text-gray-500'>Strike Price</p>
                  <p>{createValue?.strikePrice} Vet</p>
                </div>
                <div>
                  <p className='text-gray-500'>Call Price</p>
                  <p>{createValue?.putPrice} Vet</p>
                </div>
                <div>
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
                  handleOption();
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

export default CreatePutOptionModal;
