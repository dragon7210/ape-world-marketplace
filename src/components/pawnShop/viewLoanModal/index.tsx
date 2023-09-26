/** @format */

import { Dialog } from "@headlessui/react";
import {
  claimLoanABI,
  grantLoanABI,
  removeItemABI,
  settleLoanABI,
} from "abi/abis";
import Spinner from "components/common/Spinner";
import { pawn_address } from "config/contractAddress";
import { months } from "constant";
import { useCustomQuery, useWallet } from "hooks";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { shortenAddress } from "utils";
import { getToken } from "utils/query";

const ViewLoanModal = ({
  open,
  setOpenModal,
  loanSel,
}: {
  open: boolean;
  setOpenModal: any;
  loanSel: any;
}) => {
  const { address, connex } = useWallet();
  const [state, setState] = useState<string>("Available for Loan");
  const [Button, setButton] = useState<any>();

  const selData = useCustomQuery({
    query: getToken({
      tokenId: loanSel?.tokenId,
      smartContractAddress: loanSel?.tokenAddress,
    }),
    variables: {},
  });
  const [loading, setLoading] = useState(true);

  const removeItem = useCallback(
    async ({ id }: { id: string }) => {
      if (connex) {
        const namedMethod = connex.thor
          .account(pawn_address)
          .method(removeItemABI);
        const clause = namedMethod.asClause(id);
        connex.vendor
          .sign("tx", [clause])
          .comment("Remove Item.")
          .request()
          .then(() => {
            setLoading(false);
            setOpenModal(!open);
            toast.success("Removed successfully");
          })
          .catch(() => {
            setLoading(false);
            setOpenModal(!open);
            toast.error("Could not remove Item.");
          });
      }
    },
    [connex, open, setOpenModal]
  );

  const claimLoan = useCallback(
    async ({ id }: { id: string }) => {
      if (connex) {
        const namedMethod = connex.thor
          .account(pawn_address)
          .method(claimLoanABI);
        const clause = namedMethod.asClause(id);

        connex.vendor
          .sign("tx", [clause])
          .comment("Claim Loan.")
          .request()
          .then(() => {
            toast.success("Success");
            setLoading(false);
            setOpenModal(!open);
          })
          .catch(() => {
            setLoading(false);
            setOpenModal(!open);
            toast.error("Could not Claim Loan.");
          });
      }
    },
    [connex, open, setOpenModal]
  );

  const settleLoan = useCallback(
    async (loanSel: { itemId: any; loanValue: any; loanFee: any }) => {
      if (connex) {
        const { itemId, loanValue, loanFee } = loanSel;
        const realLoanValue = (
          (parseInt(loanValue) / 10 ** 18) *
          (1 + parseInt(loanFee) / 100) *
          10 ** 18
        ).toString();

        const namedMethod = connex.thor
          .account(pawn_address)
          .method(settleLoanABI);

        var clause = namedMethod.asClause(itemId);
        clause["value"] = realLoanValue;
        connex.vendor
          .sign("tx", [clause])
          .comment("Settle Loan.")
          .request()
          .then(() => {
            setOpenModal(!open);
            setLoading(false);
            toast.success("Success");
          })
          .catch(() => {
            setOpenModal(!open);
            setLoading(false);
            toast.error("Could not Settle Loan.");
          });
      }
    },
    [connex, open, setOpenModal]
  );

  const grantLoan = useCallback(
    async ({ id, loanValue }: { id: string; loanValue: string }) => {
      if (connex) {
        const namedMethod = connex.thor
          .account(pawn_address)
          .method(grantLoanABI);
        var clause = namedMethod.asClause(id);

        clause["value"] = loanValue;

        connex.vendor
          .sign("tx", [clause])
          .comment("Grant Loan.")
          .request()
          .then(() => {
            toast.success("Grant loan successfully");
            setLoading(false);
            setOpenModal(!open);
          })
          .catch(() => {
            toast.error("Could not grant Loan.");
            setLoading(false);
            setOpenModal(!open);
          });
      }
    },
    [connex, open, setOpenModal]
  );

  useEffect(() => {
    if (loanSel?.status === "1") {
      setState("Available for Loan");
      if (loanSel?.owner === address) {
        setButton(
          <button
            className='bg-[#FF0000] py-1 rounded-lg md:w-32 w-24'
            onClick={() => {
              removeItem({ id: loanSel?.itemId });
              setLoading(true);
            }}>
            REMOVE
          </button>
        );
      } else {
        setButton(
          <button
            className='bg-[#FF0000] py-1 rounded-lg md:w-32 w-24'
            onClick={() => {
              grantLoan({ id: loanSel?.itemId, loanValue: loanSel?.loanValue });
              setLoading(true);
            }}>
            GRANT
          </button>
        );
      }
    } else if (loanSel?.status === "2") {
      setState("Currently on Loan");
      if (loanSel?.owner === address) {
        setButton(
          <button
            className='bg-[#FF0000] py-1 rounded-lg md:w-32 w-24'
            onClick={() => {
              settleLoan(loanSel);
              setLoading(true);
            }}>
            SETTLE
          </button>
        );
      } else if (loanSel?.messiah === address) {
        setButton(
          <button
            className='bg-[#FF0000] py-1 rounded-lg md:w-32 w-24'
            onClick={() => {
              claimLoan({ id: loanSel?.itemId });
              setLoading(true);
            }}>
            CLAIM
          </button>
        );
      }
    }
  }, [loanSel, address, claimLoan, grantLoan, settleLoan, removeItem]);

  const getEndTime = (end_block: string) => {
    if (connex) {
      var block_info = connex.thor.status["head"];
      const current_block = block_info["number"];
      const current_unix = block_info["timestamp"];
      const delta_block = parseInt(end_block) - current_block;
      const delta_seconds = delta_block * 10;
      const end_unixtimestamp = current_unix + delta_seconds;
      return timeConverter(end_unixtimestamp);
    }
  };

  const timeConverter = (UNIX_timestamp: number) => {
    let a = new Date(UNIX_timestamp * 1000);
    let year = a.getFullYear();
    let month = months[a.getMonth()];
    let date = a.getDate();
    let hour = a.getHours();
    let min = a.getMinutes();
    let sec = a.getSeconds();
    let time =
      date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  };

  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm overflow-y-auto m-3'
      open={open}
      onClose={() => {}}>
      <div className='w-[270px] md:w-[720px] bg-gray-200 p-3 md:flex justify-between rounded-lg shadow-lg text-gray-600 shadow-gray-500 '>
        <img
          className='rounded-lg'
          src={selData?.getToken?.assets[1]?.url}
          alt='loanImg'
          onLoad={() => setLoading(false)}
        />
        <div className='pt-3'>
          <span className='bg-green-600 ml-2 text-gray-50 md:text-base text-[10px] px-3 py-1 rounded-xl'>
            Rank {selData?.getToken?.rank}
          </span>
          <p className='md:text-xl text-sm mt-1 font-[700] text-black'>
            {selData?.getToken?.name}
          </p>
          <div className='md:flex justify-between md:mt-1 md:text-sm text-[8px] text-gray-100'>
            <div className='mr-6'>
              <span className='bg-rose-700 rounded-md p-1'>
                Item owner By {shortenAddress(loanSel?.owner)}
              </span>
            </div>
            <div className='mt-2 md:mt-0'>
              <span className='bg-violet-700 rounded-md p-1'>{state}</span>
            </div>
          </div>
          <div className='bg-gray-900 text-gray-100 md:px-5 md:py-2 p-2 mt-2 rounded-xl'>
            <p className='md:text-xltext-sm'>Details</p>
            <div className='columns-2 md:px-5 px-2 text-[10px] md:text-sm'>
              <div>
                <p className='text-gray-500'>Ask Value</p>
                <p>{loanSel?.loanValue / 10 ** 18} VET</p>
              </div>
              <div>
                <div>
                  <p className='text-gray-500'>Start time</p>
                  {loanSel?.status !== "1" ? (
                    <p className='md:text-[11px] text-[7px]'>
                      {getEndTime(loanSel?.startTime)}
                    </p>
                  ) : (
                    <p>Not granted</p>
                  )}
                </div>
                <p className='text-gray-500'>Interest</p>
                <p>{loanSel?.loanFee} %</p>
              </div>
              <div>
                <p className='text-gray-500'>Duration</p>
                <p>{loanSel?.duration} H</p>
              </div>

              <div>
                <p className='text-gray-500'>End time</p>
                {loanSel?.status !== "1" ? (
                  <p className='md:text-[11px] text-[7px]'>
                    {getEndTime(loanSel?.endTime)}{" "}
                  </p>
                ) : (
                  <p>Not granted</p>
                )}
              </div>
              <div>
                <p className='text-gray-500'>Messiah</p>
                <p>
                  {loanSel?.status !== "1"
                    ? shortenAddress(loanSel?.messiah)
                    : "Not granted"}
                </p>
              </div>
            </div>
          </div>

          <div className='flex md:text-lg text-[12px] justify-end mt-2 text-gray-100'>
            <button
              className='bg-[#FF4200] py-1 rounded-lg md:mr-[40px] mr-5 md:w-32 w-24'
              onClick={() => {
                setOpenModal(!open);
                setLoading(true);
              }}>
              OK
            </button>
            {Button}
          </div>
        </div>
      </div>
      <Spinner loading={loading} />
    </Dialog>
  );
};

export default ViewLoanModal;
