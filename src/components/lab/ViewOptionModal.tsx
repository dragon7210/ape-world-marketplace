/** @format */
import { Dialog } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { options_address } from "config/contractAddress";
import { buyOptionABI, deleteOptionABI, exerciseCallABI } from "abi/abis";
import { useCallback, useEffect, useState } from "react";
import EditOptionModal from "./EditOptionModal";
import SellOptionModal from "./SellOptionModal";
import ExercisePutModal from "./ExercisePutModal";
import {
  getCollectionName,
  getEndTime,
  get_image,
  shortenAddress,
} from "utils";
import toast from "react-hot-toast";
import { useConnex, useWallet } from "@vechain/dapp-kit-react";
import { getName } from "@vechain.energy/dapp-kit-hooks";

const ViewOptionModal = ({
  open,
  setOpen,
  data,
  block,
  setOptionSel,
}: {
  open: boolean;
  setOpen: any;
  data: any;
  block: number;
  setOptionSel: any;
}) => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const connex = useConnex();
  const [Button, setButton] = useState<any>();

  const [openEditOption, setOpenEditOption] = useState<boolean>(false);
  const [openSellOption, setOpenSellOption] = useState<boolean>(false);
  const [openExercisePut, setOpenExercisePut] = useState<boolean>(false);
  const { collectionOptions } = useSelector((state: any) => state.collections);
  const [selData, setSelData] = useState<any>();
  const [img, setImg] = useState<string>("");
  const [ownerName, setOwnerName] = useState<string>();
  const [takerName, setTakerName] = useState<string>();

  const removeItem = useCallback(
    (tokenId: string) => {
      try {
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
            setOpen(!open);
            dispatch(setLoading(false));
          })
          .catch(() => {
            toast.error("Could not remove Option.");
            setOpen(!open);
            dispatch(setLoading(false));
          });
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch, setOpen, open]
  );

  const editOption = useCallback(() => {
    setOpen(!open);
    setOpenEditOption(!openEditOption);
  }, [setOpen, open, openEditOption]);

  const sellOption = useCallback(() => {
    setOpen(!open);
    setOpenSellOption(!openSellOption);
  }, [setOpen, open, openSellOption]);

  const exercisePut = useCallback(() => {
    setOpen(!open);
    setOpenExercisePut(!openExercisePut);
  }, [setOpen, open, openExercisePut]);

  const buyOption = useCallback(() => {
    try {
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
          setOpen(!open);
          setOptionSel();
          toast.success("Success.");
        })
        .catch(() => {
          dispatch(setLoading(false));
          setOpen(!open);
          setOptionSel();
          toast.error("Could not take option.");
        });
    } catch (error) {
      console.log(error);
    }
  }, [data, dispatch, setOpen, open, setOptionSel]);

  const exerciseCall = useCallback(() => {
    try {
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
          setOpen(!open);
          toast.success("Success.");
        })
        .catch(() => {
          dispatch(setLoading(false));
          setOpen(!open);
          toast.error("Could not exercise call.");
        });
    } catch (error) {
      console.log(error);
    }
  }, [data, dispatch, setOpen, open]);

  useEffect(() => {
    if (data?.status === "LIST" && data?.owner === account) {
      setButton(
        <button
          className="bg-[#006ec9] py-1 rounded-lg ml-5 w-24"
          onClick={() => {
            removeItem(data?.itemId);
            dispatch(setLoading(true));
          }}
        >
          Remove This {data?.type}
        </button>
      );
    } else if (
      (data?.status === "LIST" || data?.status === "OPEN") &&
      block < Number(data?.expirationDate)
    ) {
      if (data?.taker === account) {
        if (!data?.takeable) {
          setButton(
            <button
              className="bg-[#006ec9] py-1 ml-4 rounded-lg w-24"
              onClick={sellOption}
            >
              Sell this Option
            </button>
          );
        } else {
          setButton(
            <button
              className="bg-[#006ec9] py-1 ml-4 rounded-lg w-24"
              onClick={editOption}
            >
              Edit Option Price
            </button>
          );
        }
      } else {
        if (data?.takeable) {
          setButton(
            <button
              className="bg-[#006ec9] py-1 ml-4 rounded-lg w-24"
              onClick={() => {
                buyOption();
                dispatch(setLoading(true));
              }}
            >
              Buy This {data?.type}
            </button>
          );
        } else {
          setButton("");
        }
      }
    } else if (
      data?.status === "OPEN" &&
      account === data?.taker &&
      block < Number(data?.expirationDate)
    ) {
      if (data?.type === "CALL") {
        setButton(
          <button
            className="bg-[#006ec9] py-1 ml-4 rounded-lg w-24"
            onClick={() => {
              exerciseCall();
              dispatch(setLoading(true));
            }}
          >
            Exercise Call (Pay {data?.strikePrice / 10 ** 18} VET)
          </button>
        );
      } else {
        setButton(
          <button
            className="bg-[#006ec9] py-1 ml-4 rounded-lg w-24"
            onClick={exercisePut}
          >
            Exercise Put (Click to select any
            {getCollectionName(collectionOptions, data?.tokenAddress)}
            ")
          </button>
        );
      }
    } else {
      setButton("");
    }
  }, [
    data,
    block,
    account,
    collectionOptions,
    dispatch,
    editOption,
    sellOption,
    buyOption,
    exerciseCall,
    exercisePut,
    removeItem,
  ]);

  useEffect(() => {
    if (data?.type === "CALL") {
      setImg(selData?.img);
    } else {
      const temp = collectionOptions?.filter((item: any) => {
        return (
          item?.smartContractAddress?.toLowerCase() ===
          data?.tokenAddress?.toLowerCase()
        );
      });
      setImg(temp[0]?.thumbnailImageUrl);
    }
  }, [selData, data, collectionOptions]);

  useEffect(() => {
    try {
      (async () => {
        if (data?.type !== "PUT") {
          const temp = await get_image(data?.tokenAddress, data?.tokenId);
          setSelData(temp);
        }
      })();
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, data]);

  useEffect(() => {
    if (connex && data?.owner) {
      getName(data.owner, connex).then(setOwnerName);
    }
  }, [data?.owner, connex]);

  useEffect(() => {
    if (connex && data?.taker) {
      getName(data.taker, connex).then(setTakerName);
    }
  }, [data?.taker, connex]);

  return (
    <>
      <Dialog
        className="fixed inset-0 flex items-center justify-center backdrop-blur-sm overflow-y-auto m-3 z-30"
        open={open}
        onClose={() => {}}
      >
        <div className="w-[270px] md:w-[720px] bg-gray-200 p-3 rounded-lg shadow-lg text-gray-600 shadow-gray-500">
          <div className="flex justify-end md:hidden">
            <XMarkIcon
              className="w-6 cursor-pointer hover:bg-gray-500 rounded-md"
              onClick={() => {
                setOpen(!open);
                setOptionSel();
              }}
            />
          </div>
          <div className="md:flex justify-between">
            <img
              className="rounded-lg w-64"
              alt="loanImg"
              src={img}
              onLoad={() => dispatch(setLoading(false))}
            />
            <div className="pt-3 md:pt-0">
              <div className="md:flex justify-end hidden">
                <XMarkIcon
                  className="w-6 cursor-pointer hover:bg-gray-500 rounded-md"
                  onClick={() => {
                    setOpen(!open);
                    setOptionSel();
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="md:text-3xl text-2xl mt-1 font-[700] text-black">
                  {collectionOptions &&
                    getCollectionName(collectionOptions, data?.tokenAddress) +
                      (data?.tokenId === "0" ? "" : " #" + data?.tokenId)}
                </p>
                <p className="md:text-xl text-base font-[700] text-gray-600 bg-yellow-200 px-2">
                  {data?.type}
                </p>
              </div>
              <div className="flex justify-between md:mt-1 md:text-base text-sm text-gray-100">
                <span className="bg-rose-700 rounded-md p-1 px-2">
                  Item owner By{" "}
                  {ownerName?.length ? ownerName : shortenAddress(data?.owner)}
                </span>
                <span className="bg-violet-700 rounded-md p-1 px-2">
                  {Number(data?.expirationDate) > block
                    ? data?.takeable
                      ? "Available"
                      : "Sold"
                    : "Expired"}
                </span>
              </div>
              <div className="bg-gray-900 md:w-[430px] text-gray-100 md:px-5 md:py-2 p-2 mt-1 rounded-xl">
                <p className="md:text-xltext-sm">Details</p>
                <div className="md:columns-3 columns-2 md:px-3 px-2 text-base md:text-md">
                  <div>
                    <p className="text-gray-500">Token</p>
                    <p>{data?.type === "CALL" ? data?.tokenId : "Any"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Strike Price</p>
                    <p>{data?.strikePrice / 10 ** 18} VET</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Expiration</p>
                    <p>{getEndTime(data?.expirationDate, connex.thor)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Option Price</p>
                    <p>{data?.optionPrice / 10 ** 18} VET</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Exercise Date</p>
                    <p>
                      {data?.exerciseDate === "0" ? "N/A" : data?.exerciseDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Taker</p>
                    <p>
                      {data?.status !== "LIST"
                        ? "N/A"
                        : takerName?.length
                        ? takerName
                        : shortenAddress(data?.taker)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex md:text-lg text-base justify-end mt-1 text-gray-100">
                {Button}
                <button
                  className="bg-[#FF0000] py-1 rounded-lg ml-5 w-24"
                  onClick={() => {
                    setOpen(!open);
                    setOptionSel();
                  }}
                >
                  CANCEL
                </button>
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
