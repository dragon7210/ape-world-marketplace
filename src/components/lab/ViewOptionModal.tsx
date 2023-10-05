/** @format */
import { Dialog } from "@headlessui/react";
import { useWallet } from "hooks";
import { useDispatch, useSelector } from "react-redux";
import { getCollectionName, getEndTime, shortenAddress } from "utils";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { options_address } from "config/contractAddress";
import { buyOptionABI, deleteOptionABI, exerciseCallABI } from "abi/abis";
import { useCallback, useEffect, useState } from "react";
import EditOptionModal from "./EditOptionModal";
import SellOptionModal from "./SellOptionModal";
import ExercisePutModal from "./ExercisePutModal";
import toast from "react-hot-toast";

const ViewOptionModal = ({
  open,
  setOpenModal,
  data,
}: {
  open: boolean;
  setOpenModal: any;
  data: any;
}) => {
  const dispatch = useDispatch();
  const [Button, setButton] = useState<any>();
  const [block, setBlock] = useState<number>(0);
  const [openEditOption, setOpenEditOption] = useState<boolean>(false);
  const [openSellOption, setOpenSellOption] = useState<boolean>(false);
  const [openExercisePut, setOpenExercisePut] = useState<boolean>(false);
  const { connex, address } = useWallet();
  const { collectionOptions } = useSelector(
    (state: any) => state.collectionOptions
  );
  useEffect(() => {
    if (connex) {
      setBlock(connex.thor.status["head"]["number"]);
    }
  }, [connex]);

  const removeItem = (tokenId: string) => {
    if (connex) {
      const namedMethod = connex.thor
        .account(options_address)
        .method(deleteOptionABI);
      const clause = namedMethod.asClause(tokenId);
      connex.vendor
        .sign("tx", [clause])
        .comment("Remove Option.")
        .request()
        .then(() => {
          toast.success("Success");
          dispatch(setLoading(false));
        })
        .catch(() => {
          toast.error("Could not remove Option.");
          dispatch(setLoading(false));
        });
    }
  };

  const editOption = useCallback(() => {
    setOpenModal(!open);
    setOpenEditOption(!openEditOption);
  }, [setOpenModal, open, openEditOption]);

  const sellOption = useCallback(() => {
    setOpenModal(!open);
    setOpenSellOption(!openSellOption);
  }, [setOpenModal, open, openSellOption]);

  const exercisePut = useCallback(() => {
    setOpenModal(!open);
    setOpenExercisePut(!openExercisePut);
  }, [setOpenModal, open, openExercisePut]);

  const buyOption = useCallback(() => {
    if (connex) {
      const namedMethod = connex.thor
        .account(options_address)
        .method(buyOptionABI);
      var clause = namedMethod.asClause(data?.itemId);
      clause["value"] = data?.optionPrice;
      connex.vendor
        .sign("tx", [clause])
        .comment("Take option.")
        .request()
        .then(() => {
          dispatch(setLoading(false));
          toast.success("Success.");
        })
        .catch(() => {
          dispatch(setLoading(false));
          toast.error("Could not take option.");
        });
    }
  }, [connex, data, dispatch]);

  const exerciseCall = useCallback(() => {
    if (connex) {
      const namedMethod = connex.thor
        .account(options_address)
        .method(exerciseCallABI);
      var clause = namedMethod.asClause(data?.itemId);
      clause["value"] = data?.strikePrice;
      connex.vendor
        .sign("tx", [clause])
        .comment("Exercise Call.")
        .request()
        .then(() => {
          dispatch(setLoading(false));
          toast.success("Success.");
        })
        .catch(() => {
          dispatch(setLoading(false));
          toast.error("Could not exercise call.");
        });
    }
  }, [connex, data, dispatch]);

  useEffect(() => {
    if (
      (data?.status === "LIST" || data?.status === "OPEN") &&
      block < Number(data?.expirationDate)
    ) {
      if (data?.taker === address) {
        if (!data?.takeable) {
          setButton(
            <button
              className='bg-[#FF0000] py-1 ml-4 rounded-lg w-24'
              onClick={sellOption}>
              Sell this Option
            </button>
          );
        } else {
          setButton(
            <button
              className='bg-[#FF0000] py-1 ml-4 rounded-lg w-24'
              onClick={editOption}>
              Edit Option Price
            </button>
          );
        }
      } else {
        if (data?.takeable) {
          setButton(
            <button
              className='bg-[#FF0000] py-1 ml-4 rounded-lg w-24'
              onClick={() => {
                buyOption();
                dispatch(setLoading(true));
              }}>
              Buy This {data?.type}
            </button>
          );
        }
      }
    }
    if (
      data?.status === "OPEN" &&
      address === data?.taker &&
      block < Number(data?.expirationDate)
    ) {
      if (data?.type === "CALL") {
        setButton(
          <button
            className='bg-[#FF0000] py-1 ml-4 rounded-lg w-24'
            onClick={() => {
              exerciseCall();
              dispatch(setLoading(true));
            }}>
            Exercise Call (Pay {data?.strikePrice / 10 ** 18} VET)
          </button>
        );
      } else {
        setButton(
          <button
            className='bg-[#FF0000] py-1 ml-4 rounded-lg w-24'
            onClick={exercisePut}>
            Exercise Put (Click to select any
            {getCollectionName(collectionOptions, data?.tokenAddress)}
            ")
          </button>
        );
      }
    }
  }, [
    data,
    address,
    block,
    collectionOptions,
    dispatch,
    editOption,
    sellOption,
    buyOption,
    exerciseCall,
    exercisePut,
  ]);

  return (
    <>
      <Dialog
        className='fixed inset-0 flex items-center justify-center backdrop-blur-sm overflow-y-auto m-3 z-30'
        open={open}
        onClose={() => {}}>
        <div className='w-[270px] md:w-[720px] bg-gray-200 p-3 rounded-lg shadow-lg text-gray-600 shadow-gray-500'>
          <div className='md:flex justify-between'>
            <img
              className='rounded-lg'
              alt='loanImg'
              onLoad={() => dispatch(setLoading(false))}
            />
            <div className='pt-3 md:pt-0'>
              <div className='md:flex justify-end hidden'>
                <XMarkIcon
                  className='w-6 cursor-pointer'
                  onClick={() => setOpenModal(!open)}
                />
              </div>
              <p className='md:text-xl text-2xl font-[700] text-black'>
                {data?.type}
              </p>
              <p className='md:text-3xl text-2xl mt-1 font-[700] text-black'>
                {collectionOptions &&
                  getCollectionName(collectionOptions, data?.tokenAddress)}
              </p>
              <div className='flex justify-between md:mt-1 md:text-base text-sm text-gray-100'>
                <span className='bg-rose-700 rounded-md p-1 px-2'>
                  Item owner By {shortenAddress(data?.owner)}
                </span>
                <span className='bg-violet-700 rounded-md p-1 px-2'>
                  {data?.takeable ? "Available" : "Sold"}
                </span>
              </div>
              <div className='bg-gray-900 md:w-[430px] text-gray-100 md:px-5 md:py-2 p-2 mt-2 rounded-xl'>
                <p className='md:text-xltext-sm'>Details</p>
                <div className='md:columns-3 columns-2 md:px-3 px-2 text-base md:text-md'>
                  <div>
                    <p className='text-gray-500'>Token</p>
                    <p>{data?.type === "Call" ? data?.tokenId : "Any"}</p>
                  </div>
                  <div>
                    <p className='text-gray-500'>Strike Price</p>
                    <p>{data?.strikePrice / 10 ** 18} Vet</p>
                  </div>
                  <div>
                    <p className='text-gray-500'>Expiration</p>
                    <p>{getEndTime(data?.expirationDate, connex)}</p>
                  </div>
                  <div>
                    <p className='text-gray-500'>Option Price</p>
                    <p>{data?.optionPrice / 10 ** 18} Vet</p>
                  </div>
                  <div>
                    <p className='text-gray-500'>Excercise Date</p>
                    <p>
                      {data?.exerciseDate === "0" ? "N/A" : data?.exerciseDate}
                    </p>
                  </div>
                  <div>
                    <p className='text-gray-500'>Taker</p>
                    <p>
                      {data?.status !== "List"
                        ? "N/A"
                        : shortenAddress(data?.taker)}
                    </p>
                  </div>
                </div>
              </div>

              <div className='flex md:text-lg text-base justify-end mt-2 text-gray-100'>
                <button
                  className='bg-[#FF4200] py-1 rounded-lg ml-5 w-24'
                  onClick={() => {
                    removeItem(data?.itemId);
                    dispatch(setLoading(true));
                  }}>
                  Remove This {data?.type}
                </button>
                {Button}
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      <EditOptionModal
        openEditOption={openEditOption}
        data={data}
        setOpenEditOption={setOpenEditOption}
      />
      <SellOptionModal
        openSellOption={openSellOption}
        data={data}
        setOpenSellOption={setOpenSellOption}
      />
      <ExercisePutModal
        openExercisePut={openExercisePut}
        data={data}
        setOpenExercisePut={setOpenExercisePut}
      />
    </>
  );
};

export default ViewOptionModal;
