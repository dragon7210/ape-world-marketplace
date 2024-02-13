/** @format */

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { options_address } from "config/contractAddress";
import { editOptionPriceABI } from "abi/abis";
import InputValue from "components/common/InputValue";
import toast from "react-hot-toast";
import { useConnex } from "@vechain/dapp-kit-react";

const EditOptionModal = ({
  openEditOption,
  setOpenEditOption,
  data,
}: {
  openEditOption: boolean;
  setOpenEditOption: any;
  data: any;
}) => {
  const dispatch = useDispatch();
  const [optionPrice, setOptionPrice] = useState<string>("");
  const { thor, vendor } = useConnex();

  useEffect(() => {
    setOptionPrice((Number(data?.optionPrice) / 10 ** 18).toString());
  }, [data]);

  const handleOption = () => {
    try {
      const namedMethod = thor
        .account(options_address)
        .method(editOptionPriceABI);
      var clause = namedMethod.asClause(data?.itemId, optionPrice);
      vendor
        .sign("tx", [clause])
        .comment("Edit option price.")
        .request()
        .then(() => {
          setOpenEditOption(!openEditOption);
          dispatch(setLoading(false));
          toast.success("Success");
        })
        .catch(() => {
          setOpenEditOption(!openEditOption);
          dispatch(setLoading(false));
          toast.error("Could not edit option price.");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm overflow-y-auto m-3 z-30"
      open={openEditOption}
      onClose={() => {}}
    >
      <div className=" bg-gray-200 p-3 rounded-lg shadow-lg text-gray-700 shadow-gray-500">
        <div className="flex justify-end ">
          <XMarkIcon
            className="w-6 cursor-pointer hover:bg-gray-500 rounded-md"
            onClick={() => setOpenEditOption(!openEditOption)}
          />
        </div>
        <div className="px-5">
          <p className="text-4xl">Please specify the new option Price in VET</p>
          <div className="bg-gray-800 text-gray-200 m-5 px-4 rounded-lg md:mx-[30px]">
            <InputValue
              label="Option price"
              name="optionPrice"
              onChange={(e) => {
                setOptionPrice(e.target.value);
              }}
              placeholder="VET"
              value={optionPrice}
            />
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
              onClick={() => setOpenEditOption(!openEditOption)}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EditOptionModal;
