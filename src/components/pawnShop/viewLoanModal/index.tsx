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
          className='bg-[#FF0000] py-1 rounded-lg md:w-[140px] w-[100px]'
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
          className='bg-[#FF0000] py-1 rounded-lg md:w-[140px] w-[100px]'
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
          className='bg-[#FF0000] py-1 rounded-lg md:w-[140px] w-[100px]'
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
          className='bg-[#FF0000] py-1 rounded-lg md:w-[140px] w-[100px]'
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
      <div className='bg-[#3D3D47] p-4 md:flex rounded-lg shadow-lg shadow-gray-500 '>
        <img
          className='rounded-lg'
          src={selData?.getToken?.assets[2]?.url}
          alt='loanImg'
          onLoad={() => setLoading(false)}
        />
        <div className='md:ml-12 text-gray-200'>
          <p className='md:text-4xl text-xl md:mt-9 mt-4 font-[700]'>
            {selData?.getToken?.name}
          </p>
          <div className='flex mt-3 md:text-lg text-sm '>
            <span className='bg-[#1D57ED] mr-5 rounded-md px-1'>
              Item owner By {shortenAddress(loanSel?.owner)}
            </span>
            <br />
            <span className='bg-[blue] rounded-md px-1'>
              Available for Loan
            </span>
          </div>
          <div className='flex md:text-2xl text-lg font-[700] md:mt-6 mt-3'>
            <p className='w-[200px]'>Rank :</p>
            <p>{selData?.getToken?.rank}</p>
          </div>
          <div className='flex md:text-2xl md:mt-2 text-lg font-[700]'>
            <p className='w-[200px]'>Ask Value :</p>
            <p>{loanSel?.loanValue / 10 ** 18} Vet</p>
          </div>
          <div className='flex md:text-2xl md:mt-2 text-lg font-[700]'>
            <p className='w-[200px]'>Interest :</p>
            <p>
              {loanSel?.loanFee} % (
              {(loanSel?.loanValue / 10 ** 20) * loanSel?.loanFee} Vet)
            </p>
          </div>
          <div className='flex md:text-2xl md:mt-2 text-lg font-[700]'>
            <p className='w-[200px]'>Duration :</p>
            <p>{loanSel?.duration + "h"}</p>
          </div>
          <div className='flex md:text-2xl md:mt-2 text-lg font-[700]'>
            <p className='w-[200px]'>Start time :</p>
            <p>
              {loanSel?.status !== "1" ? loanSel?.startTime : "Not granted"}
            </p>
          </div>
          <div className='flex md:text-2xl md:mt-2 text-lg font-[700]'>
            <p className='w-[200px]'>End time :</p>
            <p>{loanSel?.status !== "1" ? loanSel?.endTime : "Not granted"}</p>
          </div>
          <div className='flex md:text-2xl md:mt-2 text-lg font-[700]'>
            <p className='w-[200px]'>Messiah :</p>
            <p>
              {loanSel?.status !== "1"
                ? shortenAddress(loanSel?.messiah)
                : "Not granted"}
            </p>
          </div>
          <div className='flex md:text-2xl text-xl font-[600] justify-end md:mt-8 mt-4 md:mr-5'>
            <button
              className='bg-[#FF4200] py-1 rounded-lg md:mr-[40px] mr-5 md:w-[140px] w-[100px]'
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
