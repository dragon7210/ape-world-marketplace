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
import { useState } from "react";
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
  const selData = useCustomQuery({
    query: getToken({
      tokenId: loanSel?.tokenId,
      smartContractAddress: loanSel?.tokenAddress,
    }),
    variables: {},
  });
  const [loading, setLoading] = useState(true);

  const removeItem = async ({ id }: { id: string }) => {
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
  };

  const claimLoan = async ({ id }: { id: string }) => {
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
  };

  const settleLoan = async (loanSel: {
    itemId: any;
    loanValue: any;
    loanFee: any;
  }) => {
    if (connex) {
      const { itemId, loanValue, loanFee } = loanSel;
      const realLoanValue = Math.round(
        (loanValue / 10 ** 18) * (1 + loanFee / 100)
      );

      const namedMethod = connex.thor
        .account(pawn_address)
        .method(settleLoanABI);
      var clause = namedMethod.asClause(itemId);
      clause["value"] = (realLoanValue * 10 ** 18).toFixed(2);
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
  };

  const grantLoan = async ({
    id,
    loanValue,
  }: {
    id: string;
    loanValue: string;
  }) => {
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
  };

  let Button: any;
  if (loanSel?.status === "1") {
    if (loanSel?.owner === address) {
      Button = (
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
      Button = (
        <button
          className='bg-[#FF0000] py-1 rounded-lg md:w-32 w-24'
          onClick={() => {
            grantLoan({ id: loanSel?.itemId, loanValue: loanSel?.loanValue });
            setLoading(true);
          }}>
          Grant Loan
        </button>
      );
    }
  } else if (loanSel?.status === "2") {
    if (loanSel?.owner === address) {
      Button = (
        <button
          className='bg-[#FF0000] py-1 rounded-lg md:w-32 w-24'
          onClick={() => {
            settleLoan(loanSel);
            setLoading(true);
          }}>
          Settle Loan
        </button>
      );
    } else if (loanSel?.messiah === address) {
      Button = (
        <button
          className='bg-[#FF0000] py-1 rounded-lg md:w-32 w-24'
          onClick={() => {
            claimLoan({ id: loanSel?.itemId });
            setLoading(true);
          }}>
          Claim NFT
        </button>
      );
    }
  }

  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm overflow-y-auto m-3'
      open={open}
      onClose={() => {}}>
      <div className='bg-gray-200 p-2 md:flex rounded-lg shadow-lg text-gray-600 shadow-gray-500 '>
        <img
          className='rounded-lg'
          src={selData?.getToken?.assets[2]?.url}
          alt='loanImg'
          onLoad={() => setLoading(false)}
        />
        <div className='md:ml-12 p-3'>
          <span className='bg-green-600 text-gray-50 px-3 py-1 rounded-xl'>
            Rank {selData?.getToken?.rank}
          </span>
          <p className='md:text-4xl text-xl md:mt-5 mt-2 font-[700] text-black'>
            {selData?.getToken?.name}
          </p>
          <div className='md:flex mt-3 md:text-lg text-sm text-gray-100'>
            <span className='bg-blue-600 mr-5 rounded-md px-1'>
              Item owner By {shortenAddress(loanSel?.owner)}
            </span>
            <br />
            <span className='bg-[blue] rounded-md px-1'>
              Available for Loan
            </span>
          </div>
          <div className='bg-gray-900 text-gray-100 p-5 md:mt-7 mt-2 rounded-xl'>
            <p className='md:text-2xl md:mt-2 text-md'>Details</p>
            <div className='columns-2 px-6'>
              <div className='md:text-lg md:mt-2 text-md'>
                <p className='text-gray-500'>Ask Value</p>
                <p className='text-sm'>{loanSel?.loanValue / 10 ** 18} Vet</p>
              </div>
              <div className='md:text-lg md:mt-2 text-md'>
                <p className='text-gray-500'>Interest</p>
                <p className='text-sm'>{loanSel?.loanFee} %</p>
              </div>
              <div className='md:text-xl md:mt-2 text-md'>
                <p className='text-gray-500'>Duration</p>
                <p className='text-sm'>{loanSel?.duration} h</p>
              </div>
              <div className='md:text-xl md:mt-2 text-md'>
                <p className='text-gray-500'>Start time</p>
                <p className='text-sm'>
                  {loanSel?.status !== "1" ? loanSel?.startTime : "Not granted"}
                </p>
              </div>
              <div className='md:text-xl md:mt-2 text-md'>
                <p className='text-gray-500'>End time</p>
                <p className='text-sm'>
                  {loanSel?.status !== "1" ? loanSel?.endTime : "Not granted"}
                </p>
              </div>
              <div className='md:text-xl md:mt-2 text-md'>
                <p className='text-gray-500'>Messiah</p>
                <p className='text-sm'>
                  {loanSel?.status !== "1"
                    ? shortenAddress(loanSel?.messiah)
                    : "Not granted"}
                </p>
              </div>
            </div>
          </div>

          <div className='flex md:text-lg text-sm justify-end md:mt-8 mt-4 md:mr-5 text-gray-100'>
            <button
              className='bg-[#FF4200] py-1 rounded-lg md:mr-[40px] mr-5 md:w-32 w-24'
              onClick={() => setOpenModal(!open)}>
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
