/** @format */
import { Dialog } from "@headlessui/react";
import { useWallet } from "hooks";
import { useDispatch } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { options_address } from "config/contractAddress";
import { exercisePutABI } from "abi/abis";
import InputValue from "components/common/InputValue";
import toast from "react-hot-toast";
import { useState } from "react";

const ExercisePutModal = ({
  openExercisePut,
  setOpenExercisePut,
  data,
}: {
  openExercisePut: boolean;
  setOpenExercisePut: any;
  data: any;
}) => {
  const dispatch = useDispatch();
  const [collection, setCollection] = useState<string>("");
  const { connex } = useWallet();

  const handleOption = () => {
    try {
      if (connex) {
        const namedMethod = connex.thor
          .account(options_address)
          .method(exercisePutABI);
        const last_clause = namedMethod.asClause(
          data?.tokenId,
          data?.tokenAddress,
          collection
        );
        var clauses = [];
        clauses.push(last_clause);
        connex.vendor
          .sign("tx", clauses)
          .comment("Exercise Put.")
          .request()
          .then(() => {
            dispatch(setLoading(false));
            setOpenExercisePut(!openExercisePut);
            toast.success("Success.");
          })
          .catch(() => {
            dispatch(setLoading(false));
            setOpenExercisePut(!openExercisePut);
            toast.error("Could not exercise put.");
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm overflow-y-auto m-3 z-30'
      open={openExercisePut}
      onClose={() => {}}>
      <div className=' bg-gray-200 p-3 rounded-lg shadow-lg text-gray-700 shadow-gray-500'>
        <div className='flex justify-end '>
          <XMarkIcon
            className='w-6 cursor-pointer hover:bg-gray-500 rounded-md'
            onClick={() => setOpenExercisePut(!openExercisePut)}
          />
        </div>
        <div className='px-5'>
          <p className='text-4xl'>Please select id of Collection</p>
          <div className='bg-gray-800 text-gray-200 m-5 px-4 rounded-lg md:px-[30px]'>
            <InputValue
              label='Option price'
              name='optionPrice'
              onChange={(e) => {
                setCollection(e.target.value);
              }}
              placeholder=''
              value={collection}
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
              onClick={() => setOpenExercisePut(!openExercisePut)}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ExercisePutModal;
