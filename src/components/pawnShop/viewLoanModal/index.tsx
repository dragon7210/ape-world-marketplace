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
import { useCustomQuery, useWallet } from "hooks";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { shortenAddress } from "utils";
import { getToken } from "utils/query";

const ViewLoanModal = ({
  open,
  setOpenModal,
  loanSel,
  getEndTime,
}: {
  open: boolean;
  setOpenModal: any;
  loanSel: any;
  getEndTime: any;
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
    async (loanSel: { itemId: string; loanValue: string; loanFee: string }) => {
      if (connex) {
        const { itemId, loanValue, loanFee } = loanSel;
        const realLoanValue =
          (parseInt(loanValue) * (100 + parseInt(loanFee))) / 100;

        const namedMethod = connex.thor
          .account(pawn_address)
          .method(settleLoanABI);

        var clause = namedMethod.asClause(itemId);
        clause["value"] = realLoanValue.toString();
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
            className='bg-[#FF0000] py-1 rounded-lg w-24'
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
            className='bg-[#FF0000] py-1 rounded-lg w-24'
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
            className='bg-[#FF0000] py-1 rounded-lg w-24'
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
            className='bg-[#FF0000] py-1 rounded-lg w-24'
            onClick={() => {
              let date = getEndTime(loanSel?.endTime);
              if (date) {
                if (new Date(date) < new Date()) {
                  claimLoan({ id: loanSel?.itemId });
                  setLoading(true);
                } else {
                  toast.error("Please wait until end time");
                }
              }
            }}>
            CLAIM
          </button>
        );
      } else {
        setButton(<></>);
      }
    }
  }, [
    loanSel,
    address,
    claimLoan,
    grantLoan,
    settleLoan,
    removeItem,
    getEndTime,
  ]);

  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm overflow-y-auto m-3 z-30'
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
          <span className='bg-green-600 ml-1 text-gray-50 md:text-md text-sm px-3 py-1 rounded-xl'>
            Rank {selData?.getToken?.rank}
          </span>
          <p className='md:text-3xl text-2xl mt-1 font-[700] text-black'>
            {selData?.getToken?.name}
          </p>
          <div className='flex justify-between md:mt-1 md:text-base text-sm text-gray-100'>
            <span className='bg-rose-700 rounded-md p-1 px-2'>
              Item owner By {shortenAddress(loanSel?.owner)}
            </span>
            <span className='bg-violet-700 rounded-md p-1 px-2'>{state}</span>
          </div>
          <div className='bg-gray-900 md:w-[430px] text-gray-100 md:px-5 md:py-2 p-2 mt-2 rounded-xl'>
            <p className='md:text-xltext-sm'>Details</p>
            <div className='md:columns-3 columns-2 md:px-5 px-2 text-base md:text-md'>
              <div>
                <p className='text-gray-500'>Ask Value</p>
                <p>{loanSel?.loanValue / 10 ** 18} VET</p>
              </div>
              <div>
                <p className='text-gray-500'>Interest</p>
                <p>{loanSel?.loanFee} %</p>
              </div>
              <div>
                <p className='text-gray-500'>Duration</p>
                <p>{loanSel?.duration} H</p>
              </div>
              <div>
                <p className='text-gray-500'>Messiah</p>
                <p>
                  {loanSel?.status !== "1"
                    ? shortenAddress(loanSel?.messiah)
                    : "Not granted"}
                </p>
              </div>
              <div>
                <p className='text-gray-500'>Start time</p>
                {loanSel?.status !== "1"
                  ? getEndTime(loanSel?.startTime)
                  : "Not granted"}
              </div>
              <div>
                <p className='text-gray-500'>End time</p>
                {loanSel?.status !== "1"
                  ? getEndTime(loanSel?.endTime)
                  : "Not granted"}
              </div>
            </div>
          </div>

          <div className='flex md:text-lg text-base justify-end mt-2 text-gray-100'>
            {Button}
            <button
              className='bg-[#FF4200] py-1 rounded-lg ml-5 w-24'
              onClick={() => {
                setOpenModal(!open);
                setLoading(true);
              }}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
      <Spinner loading={loading} />
    </Dialog>
  );
};

export default ViewLoanModal;
