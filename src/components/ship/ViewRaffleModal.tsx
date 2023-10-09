/** @format */

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { buyTicketsABI, getRaffleABI, removeRaffleABI } from "abi/abis";
import { setLoading } from "actions/loading";
import { raffle_address } from "config/contractAddress";
import { raffleStatus } from "constant";
import { useCustomQuery, useWallet } from "hooks";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getEndTime, shortenAddress } from "utils";
import { getToken } from "utils/query";
import toast from "react-hot-toast";

const ViewRaffleModal = ({
  open,
  selData,
  setOpen,
}: {
  open: boolean;
  selData: any;
  setOpen: any;
}) => {
  const dispatch = useDispatch();
  const [Button, setButton] = useState<any>();
  const { address, connex } = useWallet();
  const [block, setBlock] = useState<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (connex) {
      setBlock(connex.thor.status["head"]["number"]);
    }
  }, [connex]);
  const data = useCustomQuery({
    query: getToken({
      tokenId: selData?.tokenId,
      smartContractAddress: selData?.tokenAddress,
    }),
    variables: {},
  });

  const removeItem = useCallback(async () => {
    if (connex) {
      const namedMethod = connex.thor
        .account(raffle_address)
        .method(removeRaffleABI);
      const clause = namedMethod.asClause(selData?.itemId);
      connex.vendor
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
    }
  }, [selData, dispatch, setOpen, open, connex]);

  const buyTickets = useCallback(async () => {
    if (connex) {
      const anotherNamedMethod = connex.thor
        .account(raffle_address)
        .method(getRaffleABI);
      const output = await anotherNamedMethod.call(selData?.itemId);
      const ticketValue = output["decoded"]["0"][3];

      const namedMethod = connex.thor
        .account(raffle_address)
        .method(buyTicketsABI);
      var clause = namedMethod.asClause(selData?.itemId);

      clause["value"] = (Number(ticketValue) * count).toString();

      connex.vendor
        .sign("tx", [clause])
        .comment("Buy Tickets.")
        .request()
        .then(() => {
          dispatch(setLoading(false));
          setOpen(!open);
          toast.success("Success");
        })
        .catch(() => {
          dispatch(setLoading(false));
          setOpen(!open);
          toast.error("Could not Buy Tickets.");
        });
    }
  }, [connex, count, selData, dispatch, setOpen, open]);

  useEffect(() => {
    if (selData?.status === "1" && block < selData?.endTime) {
      setButton(
        <button
          className='bg-[#FF0000] py-1 rounded-lg w-24'
          onClick={() => {
            if (count > 0 && count <= selData?.ticketNumber) {
              buyTickets();
              dispatch(setLoading(true));
            } else {
              toast.error("The Count must be greater than 1");
            }
          }}>
          I want to buy
        </button>
      );
    } else if (selData?.status === "1" && block >= selData?.endTime) {
      setButton(
        <button
          className='bg-[#FF0000] py-1 rounded-lg w-24'
          onClick={() => {
            removeItem();
            dispatch(setLoading(true));
          }}>
          Raffle Time Elapsed
        </button>
      );
    } else {
      setButton("");
    }
  }, [selData, address, dispatch, removeItem, buyTickets, block, count]);

  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm z-30'
      open={open}
      onClose={() => {}}>
      <div className='bg-gray-200 w-[270px] md:w-[720px] md:flex p-3 rounded-lg shadow-lg shadow-gray-500 text-gray-600'>
        <div className='flex justify-end md:hidden'>
          <XMarkIcon
            className='w-6 cursor-pointer hover:bg-gray-500 rounded-md'
            onClick={() => setOpen(!open)}
          />
        </div>
        <img
          className='rounded-lg'
          src={data?.getToken?.assets[1].url}
          alt='createLoan'
          onLoad={() => dispatch(setLoading(false))}
        />
        <div className='md:ml-3'>
          <div className='md:flex justify-end hidden '>
            <XMarkIcon
              className='w-6 cursor-pointer hover:bg-gray-500 rounded-md'
              onClick={() => setOpen(!open)}
            />
          </div>
          <div className='flex justify-between items-center'>
            <p className='md:text-3xl text-xl mt-1 font-[700] text-black'>
              {data?.getToken?.name}
            </p>
            <p className='bg-green-600 ml-1 text-gray-50 md:text-md text-sm px-3 py-1 rounded-xl'>
              Rank {data?.getToken?.rank}
            </p>
          </div>
          <div className='flex justify-between md:mt-1 md:text-base text-sm text-gray-100'>
            <span className='bg-rose-700 rounded-md p-1 px-2'>
              Item owner By {shortenAddress(selData?.owner)}
            </span>
            <span className='bg-violet-700 rounded-md p-1 px-2'>
              {raffleStatus[selData?.status]}
            </span>
          </div>
          <div className='bg-gray-900 md:w-[430px] text-gray-100 md:px-5 md:py-2 p-2 mt-2 rounded-xl'>
            <p className='md:text-xltext-sm'>Details</p>
            <div className='md:columns-3 columns-2 md:px-5 px-2 text-base md:text-md'>
              <div>
                <p className='text-gray-500'>Ticket Price</p>
                <p>{selData?.ticketValue / 10 ** 18} VET</p>
              </div>
              <div>
                <p className='text-gray-500'>Ticket Targets</p>
                <p>{selData?.ticketNumber}</p>
              </div>
              <div>
                <p className='text-gray-500'>Duration</p>
                <p>{selData?.duration} H</p>
              </div>
              <div>
                <p className='text-gray-500'>Tickets Bought</p>
                <p>{selData?.nTickets}</p>
              </div>
              <div>
                <p className='text-gray-500'>Start Time</p>
                <p>{getEndTime(selData?.startTime, connex)}</p>
              </div>
              <div>
                <p className='text-gray-500'>End Time</p>
                <p>{getEndTime(selData?.endTime, connex)}</p>
              </div>
            </div>
          </div>
          <div className='md:flex md:text-xl text-base justify-between mt-2 text-white'>
            {selData?.status === "1" && block < selData?.endTime && (
              <input
                className='border-2 border-gray-400 rounded-md px-7 text-gray-800 w-full mr-5 text-right'
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                placeholder='Tickets'
              />
            )}
            <div className='flex mt-2 md:mt-0 justify-end'>
              {Button}
              {selData?.status === "1" && selData?.owner === address && (
                <button
                  className='bg-[#FF0000] py-1 rounded-lg w-24 ml-5'
                  onClick={() => {
                    removeItem();
                    dispatch(setLoading(true));
                  }}>
                  Remove
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
