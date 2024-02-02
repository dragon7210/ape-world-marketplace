/** @format */

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { useWallet } from "hooks";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { mva_token_address, raffle_address } from "config/contractAddress";
import { raffleStatus } from "constant";
import {
  buyTicketsABI,
  mvaApproveABI,
  removeRaffleABI,
  settlRaffleABI,
} from "abi/abis";
import { getEndTime, get_image, shortenAddress } from "utils";
import toast from "react-hot-toast";

const ViewRaffleModal = ({
  open,
  selData,
  setOpen,
  setSelData,
}: {
  open: boolean;
  selData: any;
  setOpen: any;
  setSelData: any;
}) => {
  const dispatch = useDispatch();
  const [Button, setButton] = useState<any>();
  const { address, thor, vendor } = useWallet();
  const [block, setBlock] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [data, setData] = useState<any>();

  useEffect(() => {
    setBlock(thor.status["head"]["number"]);
  }, [thor]);

  useEffect(() => {
    try {
      (async () => {
        const temp = await get_image(selData?.tokenAddress, selData?.tokenId);
        setData(temp);
      })();
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, selData]);

  const removeItem = useCallback(async () => {
    try {
      const namedMethod = thor.account(raffle_address).method(removeRaffleABI);
      const clause = namedMethod.asClause(selData?.itemId);
      vendor
        .sign("tx", [clause])
        .comment("Remove Item.")
        .request()
        .then(() => {
          dispatch(setLoading(false));
          setOpen(!open);
          toast.success("Success");
        })
        .catch(() => {
          dispatch(setLoading(false));
          setOpen(!open);
          toast.error("Could not remove Item.");
        });
    } catch (error) {
      console.log(error);
    }
  }, [selData, dispatch, setOpen, open]);

  const settleItem = useCallback(async () => {
    try {
      const namedMethod = thor.account(raffle_address).method(settlRaffleABI);
      const clause = namedMethod.asClause(selData?.itemId);
      vendor
        .sign("tx", [clause])
        .comment("Settle Item.")
        .request()
        .then(() => {
          dispatch(setLoading(false));
          setOpen(!open);
          toast.success("Success");
        })
        .catch(() => {
          dispatch(setLoading(false));
          setOpen(!open);
          toast.error("Could not settle Item.");
        });
    } catch (error) {
      console.log(error);
    }
  }, [selData, dispatch, setOpen, open]);

  const buyTickets = useCallback(async () => {
    try {
      const namedMethod = thor.account(raffle_address).method(buyTicketsABI);

      const yetAnotherMethod = thor
        .account(mva_token_address)
        .method(mvaApproveABI);

      let clauses = [];

      let clause1 = namedMethod.asClause(selData?.itemId, count);
      let value = (Number(selData?.ticketValue) * count).toString();
      if (
        selData?.paymentToken === "0x0000000000000000000000000000000000000000"
      ) {
        clause1["value"] = value;
        clauses.push(clause1);
      } else {
        clauses.push(
          yetAnotherMethod.asClause(raffle_address, value.toString())
        );
        clauses.push(clause1);
      }

      vendor
        .sign("tx", clauses)
        .comment("Buy Tickets.")
        .request()
        .then(() => {
          dispatch(setLoading(false));
          setOpen(!open);
          setSelData();
          toast.success("Success");
        })
        .catch(() => {
          dispatch(setLoading(false));
          setOpen(!open);
          setSelData();
          toast.error("Could not Buy Tickets.");
        });
    } catch (error) {
      console.log(error);
    }
  }, [count, selData, dispatch, setOpen, open, setSelData]);

  useEffect(() => {
    if (selData?.status === "1" && block < selData?.endTime) {
      setButton(
        <button
          className="bg-blue-700 py-1 rounded-lg w-24"
          onClick={() => {
            if (
              count > 0 &&
              count <= selData?.ticketNumber - selData?.nTickets
            ) {
              buyTickets();
              dispatch(setLoading(true));
            } else if (count < 0) {
              toast.error("The Count must be greater than 1");
            } else {
              toast.error(
                `The Count must be smaller than ${
                  selData?.ticketNumber - selData?.nTickets + 1
                }`
              );
            }
          }}
        >
          I want to buy
        </button>
      );
    } else if (selData?.status === "1" && block >= selData?.endTime) {
      setButton(
        <button
          className="bg-blue-700 py-1 rounded-lg w-32"
          onClick={() => {
            removeItem();
            dispatch(setLoading(true));
          }}
        >
          Raffle Time Elapsed
        </button>
      );
    } else {
      setButton("");
    }
  }, [selData, address, dispatch, removeItem, buyTickets, block, count]);

  return (
    <Dialog
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-30"
      open={open}
      onClose={() => {}}
    >
      <div className="bg-gray-200 w-[270px] md:w-[720px] md:flex p-3 rounded-lg shadow-lg shadow-gray-500 text-gray-600">
        <div className="flex justify-end md:hidden">
          <XMarkIcon
            className="w-6 cursor-pointer hover:bg-gray-500 rounded-md"
            onClick={() => {
              setOpen(!open);
              setSelData();
            }}
          />
        </div>
        <img
          className="rounded-lg"
          src={data?.img}
          alt="createLoan"
          onLoad={() => dispatch(setLoading(false))}
        />
        <div className="md:ml-3">
          <div className="md:flex justify-end hidden ">
            <XMarkIcon
              className="w-6 cursor-pointer hover:bg-gray-500 rounded-md"
              onClick={() => {
                setOpen(!open);
                setSelData();
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="md:text-3xl text-xl mt-1 font-[700] text-black">
              {data?.name}
            </p>
            <p className="bg-green-600 ml-1 text-gray-50 md:text-md text-sm px-3 py-1 rounded-xl">
              Rank {data?.rank ? data?.rank : "Any"}
            </p>
          </div>
          <div className="flex justify-between md:mt-1 md:text-base text-sm text-gray-100">
            <span className="bg-rose-700 rounded-md p-1 px-2">
              Item owner By {shortenAddress(selData?.owner)}
            </span>
            <span className="bg-violet-700 rounded-md p-1 px-2">
              {raffleStatus[selData?.status]}
            </span>
          </div>
          <div className="bg-gray-900 md:w-[430px] text-gray-100 md:px-5 md:py-2 p-2 mt-2 rounded-xl">
            <p className="md:text-xltext-sm">Details</p>
            <div className="md:columns-3 columns-2 md:px-5 px-2 text-base md:text-md">
              <div>
                <p className="text-gray-500">Ticket Price</p>
                <p>
                  {selData?.ticketValue / 10 ** 18 +
                    (selData?.paymentToken ===
                    "0xc3fd50a056dc4025875fa164ced1524c93053f29"
                      ? " MVA"
                      : " VET")}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Ticket Targets</p>
                <p>{selData?.ticketNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Duration</p>
                <p>{selData?.duration} H</p>
              </div>
              <div>
                <p className="text-gray-500">Tickets Bought</p>
                <p>{selData?.nTickets}</p>
              </div>
              <div>
                <p className="text-gray-500">Start Time</p>
                <p>{getEndTime(selData?.startTime, thor)}</p>
              </div>
              <div>
                <p className="text-gray-500">End Time</p>
                <p>{getEndTime(selData?.endTime, thor)}</p>
              </div>
            </div>
          </div>
          <div
            className={`md:flex md:text-xl text-base  mt-2 text-white ${
              selData?.status === "1" && block < selData?.endTime
                ? "justify-between"
                : "justify-end"
            }`}
          >
            {selData?.status === "1" && block < selData?.endTime && (
              <input
                className="border-2 border-gray-400 rounded-md px-7 text-gray-800 w-full mr-5 text-right focus:outline-none"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                placeholder="Tickets"
              />
            )}
            <div className={`flex mt-2 md:mt-0 justify-end`}>
              {Button}
              {selData?.status === "1" && selData?.owner === address && (
                <button
                  className="bg-[#FF0000] py-1 rounded-lg w-24 ml-5"
                  onClick={() => {
                    removeItem();
                    dispatch(setLoading(true));
                  }}
                >
                  Remove
                </button>
              )}
              {selData?.status === "4" && selData?.owner === address && (
                <button
                  className="bg-[#FF0000] py-1 rounded-lg w-24 ml-5"
                  onClick={() => {
                    settleItem();
                    dispatch(setLoading(true));
                  }}
                >
                  Settle
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewRaffleModal;
