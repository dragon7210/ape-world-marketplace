/** @format */
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getApeABI, getWorldInfoABI, moveToABI, mvaApproveABI } from "abi/abis";
import { setLoading } from "actions/loading";
import { mobility_address, mva_token_address } from "config/contractAddress";
import { positions } from "constant";
import { useWallet } from "hooks";
import { useState } from "react";
import { useDispatch } from "react-redux";
import InputSelect from "components/common/InputSelect";

const MoveModal = ({
  open,
  setOpen,
  ape,
}: {
  open: boolean;
  setOpen: any;
  ape: any;
}) => {
  const { connex } = useWallet();
  const [position, setPosition] = useState<string>("");
  const dispatch = useDispatch();

  const handle = () => {
    if (connex) {
      (async () => {
        const infoMethod = connex.thor
          .account(mobility_address)
          .method(getWorldInfoABI);
        const _price = await infoMethod.call();

        const apeMethod = connex.thor
          .account(mobility_address)
          .method(getApeABI);
        const _ape = await apeMethod.call(ape?.tokenAddress, ape?.tokenId);
        console.log(_ape);
        const namedMethod = connex.thor
          .account(mobility_address)
          .method(moveToABI);

        const anotherMethod = connex.thor
          .account(mva_token_address)
          .method(mvaApproveABI);

        let clause = namedMethod.asClause(
          ape?.tokenAddress,
          ape?.tokenId,
          position
        );
        let payClause: any;

        if (Number(_ape["decoded"]["0"]["3"]) > 0) {
          clause["value"] = "0";
        } else {
          payClause = anotherMethod.asClause(mobility_address, _price);
        }
        connex.vendor
          .sign("tx", [payClause, clause])
          .comment("Moving Ape.")
          .request()
          .then((result) => {
            console.log(result);
          })
          .catch(() => alert("Could not move."));
      })();
    }
  };

  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm overflow-y-auto m-3 z-30 '
      open={open}
      onClose={() => {}}>
      <div className=' bg-gray-200 p-3 rounded-lg shadow-lg text-gray-700 shadow-gray-500'>
        <div className='flex justify-end '>
          <XMarkIcon
            className='w-6 cursor-pointer hover:bg-gray-500 rounded-md'
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className='bg-gray-800 md:p-8 p-4 rounded-lg mt-1 text-gray-200'>
          <p className='md:text-5xl text-3xl text-center'>
            Please select the position
          </p>
          <InputSelect
            label='Position'
            onChange={(e: any) => {
              setPosition(e ? e.value : "");
            }}
            options={positions}
          />
          <div className='flex md:text-xl text-base justify-end mt-2 text-white'>
            <button
              className={`border-[#FF4200] border-2 py-1 rounded-lg mr-5 w-24 ${
                position ? "bg-[#FF4200]" : ""
              }`}
              onClick={() => {
                dispatch(setLoading(true));
                handle();
              }}
              disabled={position ? false : true}>
              MOVE TO
            </button>
            <button
              className='bg-[#FF0000] py-1 rounded-lg w-24'
              onClick={() => setOpen(!open)}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default MoveModal;
