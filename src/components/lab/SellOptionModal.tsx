/** @format */

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useWallet } from "hooks";
import { mva_token_address, options_address } from "config/contractAddress";
import { getMarketFeeABI, mvaApproveABI, sellOptionABI } from "abi/abis";
import InputValue from "components/common/InputValue";
import toast from "react-hot-toast";

const SellOptionModal = ({
  openSellOption,
  setOpenSellOption,
  data,
}: {
  openSellOption: boolean;
  setOpenSellOption: any;
  data: any;
}) => {
  const dispatch = useDispatch();
  const [sellPrice, setSellPrice] = useState<string>("");
  const { connex } = useWallet();

  const getMarketFee = async () => {
    try {
      if (connex) {
        const getMarketFeeMethod = connex.thor
          .account(options_address)
          .method(getMarketFeeABI);
        const rawOutput = await getMarketFeeMethod.call();
        return rawOutput["decoded"]["0"] * 10 ** 18;
      }
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  };

  const handleOption = async () => {
    try {
      if (connex) {
        const namedMethod = connex.thor
          .account(options_address)
          .method(sellOptionABI);
        const yetAnotherMethod = connex.thor
          .account(mva_token_address)
          .method(mvaApproveABI);

        var clauses = [];
        const fee = await getMarketFee();
        if (fee) {
          clauses.push(
            yetAnotherMethod.asClause(options_address, fee.toString())
          );
          clauses.push(namedMethod.asClause(data?.itemId, sellPrice));
        }
        connex.vendor
          .sign("tx", clauses)
          .comment("Sell option.")
          .request()
          .then(() => {
            dispatch(setLoading(false));
            setOpenSellOption(!openSellOption);
            toast.success("Success");
          })
          .catch(() => {
            dispatch(setLoading(false));
            setOpenSellOption(!openSellOption);
            toast.error("Could not list option for sale.");
          });
      }
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  };

  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm overflow-y-auto m-3 z-30'
      open={openSellOption}
      onClose={() => {}}>
      <div className=' bg-gray-200 p-3 rounded-lg shadow-lg text-gray-700 shadow-gray-500'>
        <div className='flex justify-end '>
          <XMarkIcon
            className='w-6 cursor-pointer hover:bg-gray-500 rounded-md'
            onClick={() => setOpenSellOption(!openSellOption)}
          />
        </div>
        <div className='px-5'>
          <p className='text-4xl'>Please specify the new option Price in VET</p>
          <div className='bg-gray-800 text-gray-200 m-5 px-4 rounded-lg md:px-[30px]'>
            <InputValue
              label='Option price'
              name='optionPrice'
              onChange={(e) => {
                setSellPrice(e.target.value);
              }}
              placeholder='VET'
              value={sellPrice}
            />
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
              onClick={() => setOpenSellOption(!openSellOption)}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SellOptionModal;
