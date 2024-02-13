/** @format */

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mva_token_address, options_address } from "config/contractAddress";
import {
  approveABI,
  createCallABI,
  getMarketFeeABI,
  mvaApproveABI,
} from "abi/abis";
import { useConnex } from "@vechain/dapp-kit-react";

const CreateCallOptionModal = ({
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
  const { thor, vendor } = useConnex();
  const [imgUrl, setImgUrl] = useState<string>("");

  const getMarketFee = async () => {
    try {
      if (thor) {
        const getMarketFeeMethod = thor
          .account(options_address)
          .method(getMarketFeeABI);
        const rawOutput = await getMarketFeeMethod.call();
        return rawOutput["decoded"]["0"] * 10 ** 18;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOption = async () => {
    try {
      const data = collections.filter(
        (item: any) => item.collectionId === createValue.collectionId
      );
      const _tokenAddress = data[0].smartContractAddress;
      const { id, strikePrice, callPrice, duration } = createValue;
      const namedMethod = thor.account(options_address).method(createCallABI);
      const anotherNamedMethod = thor.account(_tokenAddress).method(approveABI);
      const yetAnotherMethod = thor
        .account(mva_token_address)
        .method(mvaApproveABI);
      var clauses = [];
      const fee = await getMarketFee();
      if (fee) {
        clauses.push(
          yetAnotherMethod.asClause(options_address, fee.toString())
        );
      }
      clauses.push(anotherNamedMethod.asClause(options_address, id));
      clauses.push(
        namedMethod.asClause(
          _tokenAddress,
          id,
          strikePrice,
          callPrice,
          duration
        )
      );
      vendor
        .sign("tx", clauses)
        .comment("Create Call.")
        .request()
        .then(() => {
          setOpen(!open);
          setImgUrl("");
          dispatch(setLoading(false));
          toast.success("Success.");
        })
        .catch(() => {
          setOpen(!open);
          setImgUrl("");
          dispatch(setLoading(false));
          toast.error("Could not create call.");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const data = apes?.filter((item: any) => item.tokenId === createValue.id);

  useEffect(() => {
    if (data) {
      setImgUrl(data[0]?.assets[1].url);
    }
  }, [data]);

  return (
    <Dialog
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-30"
      open={open}
      onClose={() => {}}
    >
      {data?.length > 0 && (
        <div className="bg-gray-200 w-[270px] md:w-[720px] md:flex p-3 rounded-lg shadow-lg shadow-gray-500 text-gray-600">
          <div className="flex justify-end md:hidden">
            <XMarkIcon
              className="w-6 cursor-pointer hover:bg-gray-500 rounded-md"
              onClick={() => {
                setOpen(!open);
                setImgUrl("");
              }}
            />
          </div>
          <img
            className="rounded-lg"
            src={imgUrl}
            alt="createCall"
            onLoad={() => dispatch(setLoading(false))}
          />
          <div className="md:ml-3 mt-2 md:mt-0">
            <div className="md:flex justify-end hidden ">
              <XMarkIcon
                className="w-6 cursor-pointer hover:bg-gray-500 rounded-md"
                onClick={() => {
                  setOpen(!open);
                  setImgUrl("");
                }}
              />
            </div>
            <div className="flex justify-between items-center ">
              <p className="md:text-3xl text-xl mt-1 font-[700] text-black">
                {data[0]?.name}
              </p>
              <span className="bg-green-600 ml-1 text-gray-50 md:text-md text-sm px-3 py-1 rounded-xl">
                Rank {data[0]?.rank ? data[0]?.rank : "Any"}
              </span>
            </div>
            <p className="md:text-3xl text-lg mt-2 min-w-[256px] text-center">
              You are about to create a Covered Call.
            </p>
            <div className="bg-gray-900 md:w-[430px] text-gray-100 md:px-5 md:py-2 p-2 mt-2 rounded-xl">
              <p className="md:text-xltext-sm">Details</p>
              <div className="md:columns-3 columns-1 md:px-5 px-2 text-base md:text-md">
                <div className="flex justify-between md:inline">
                  <p className="text-gray-500">Strike Price</p>
                  <p>{createValue?.strikePrice} VET</p>
                </div>
                <div className="flex justify-between md:inline">
                  <p className="text-gray-500">Call Price</p>
                  <p>{createValue?.callPrice} VET</p>
                </div>
                <div className="flex justify-between md:inline">
                  <p className="text-gray-500">Duration</p>
                  <p>{createValue?.duration} H</p>
                </div>
              </div>
            </div>
            <div className="flex md:text-xl text-base justify-end mt-2 text-white">
              <button
                className="bg-[#FF4200] py-1 rounded-lg mr-5 w-24"
                onClick={() => {
                  dispatch(setLoading(true));
                  handleOption();
                }}
              >
                CONFIRM
              </button>
              <button
                className="bg-[#FF0000] py-1 rounded-lg w-24"
                onClick={() => {
                  setOpen(!open);
                  setImgUrl("");
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default CreateCallOptionModal;
