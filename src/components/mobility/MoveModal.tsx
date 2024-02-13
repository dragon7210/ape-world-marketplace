/** @format */
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getApeABI, getWorldInfoABI, moveToABI, mvaApproveABI } from "abi/abis";
import { mobility_address, mva_token_address } from "config/contractAddress";
import { positions } from "constant";
import InputSelect from "components/common/InputSelect";
import toast from "react-hot-toast";
import { useConnex } from "@vechain/dapp-kit-react";

const MoveModal = ({
  open,
  setOpen,
  ape,
}: {
  open: boolean;
  setOpen: any;
  ape: any;
}) => {
  const { thor, vendor } = useConnex();
  const [position, setPosition] = useState<string>("");
  const dispatch = useDispatch();

  const handle = () => {
    try {
      (async () => {
        const infoMethod = thor
          .account(mobility_address)
          .method(getWorldInfoABI);
        const _price = await infoMethod.call();

        const apeMethod = thor.account(mobility_address).method(getApeABI);
        const _ape = await apeMethod.call(ape?.tokenAddress, ape?.tokenId);

        const namedMethod = thor.account(mobility_address).method(moveToABI);

        const anotherMethod = thor
          .account(mva_token_address)
          .method(mvaApproveABI);

        let clause = namedMethod.asClause(
          ape?.tokenAddress,
          ape?.tokenId,
          position
        );

        let clauses = [];
        if (_ape["decoded"]["0"]["3"] < 1) {
          let payClause = anotherMethod.asClause(
            mobility_address,
            _price["decoded"]["0"][0]
          );
          clauses.push(payClause);
        }
        clauses.push(clause);
        vendor
          .sign("tx", clauses)
          .comment("Moving Ape.")
          .request()
          .then(() => {
            dispatch(setLoading(false));
            setOpen(!open);
            toast.success("Success");
          })
          .catch(() => {
            dispatch(setLoading(false));
            setOpen(!open);
            toast.error("Could not move.");
          });
      })();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm overflow-y-auto m-3 z-30 "
      open={open}
      onClose={() => {}}
    >
      <div className=" bg-gray-200 p-3 rounded-lg shadow-lg text-gray-700 shadow-gray-500 w-[350px] md:w-[450px]">
        <div className="flex justify-end ">
          <XMarkIcon
            className="w-6 cursor-pointer hover:bg-gray-500 rounded-md"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="rounded-lg mt-1 text-gray-800">
          <p className="md:text-5xl text-4xl text-center mb-2">
            Please Select the Position
          </p>

          <div className="bg-gray-800 md:p-4 p-2 rounded-lg mt-2 text-gray-200 md:mx-[30px]">
            <InputSelect
              label="Position"
              onChange={(e: any) => {
                setPosition(e ? e.value : "");
              }}
              options={positions}
            />
          </div>
          <div className="flex md:text-xl text-base justify-end mt-2 text-white md:px-[30px]">
            <button
              className={`border-[#00a4c7] border-2 py-1 rounded-lg mr-5 w-24 ${
                position ? "bg-[#00a4c7] text-white" : "text-[#00a4c7]"
              }`}
              onClick={() => {
                dispatch(setLoading(true));
                handle();
              }}
              disabled={position ? false : true}
            >
              MOVE TO
            </button>
            <button
              className="bg-[#FF0000] py-1 rounded-lg w-24"
              onClick={() => setOpen(!open)}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default MoveModal;
