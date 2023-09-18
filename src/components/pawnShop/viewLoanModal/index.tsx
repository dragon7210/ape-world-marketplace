/** @format */

import { Dialog } from "@headlessui/react";
import { useCustomQuery } from "hooks";
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
  const selData = useCustomQuery({
    query: getToken({
      tokenId: loanSel?.tokenId,
      smartContractAddress: loanSel?.tokenAddress,
    }),
    variables: {},
  });

  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm'
      open={open}
      onClose={() => {}}>
      <div className='bg-[#3D3D47] p-4 flex rounded-lg shadow-lg shadow-gray-500'>
        <img
          className='rounded-lg'
          src={selData?.getToken?.assets[2]?.url}
          alt='loanImg'
        />
        <div className='ml-[50px] text-gray-200'>
          <p className='text-[45px] mt-5'>{selData?.getToken?.name}</p>
          <span className='bg-[#1D57ED] px-2 rounded-md text-[18px]'>
            Item owner By : {loanSel?.owner}
          </span>
          <br />
          <span className='bg-[#1D57ED] px-2 rounded-md text-[18px]'>
            Available for Loan
          </span>
          <div className='flex text-[28px] font-[700]'>
            <p className='w-[200px]'>Rank :</p>
            <p>{selData?.getToken?.rank}</p>
          </div>
          <div className='flex text-[28px] font-[700]'>
            <p className='w-[200px]'>Ask Value :</p>
            <p>{loanSel?.loanValue / 10 ** 18} Vet</p>
          </div>
          <div className='flex text-[28px] font-[700]'>
            <p className='w-[200px]'>Interest :</p>
            <p>
              {loanSel?.loanFee} % (
              {(loanSel?.loanValue / 10 ** 20) * loanSel?.loanFee} Vet)
            </p>
          </div>
          <div className='flex text-[28px] font-[700]'>
            <p className='w-[200px]'>Duration :</p>
            <p>{loanSel?.duration} h</p>
          </div>
          <div className='flex text-[28px] font-[700]'>
            <p className='w-[200px]'>Start time :</p>
            <p>{loanSel?.startTime}</p>
          </div>
          <div className='flex text-[28px] font-[700]'>
            <p className='w-[200px]'>End time :</p>
            <p>{loanSel?.endTime}</p>
          </div>
          <div className='flex text-[28px] font-[700]'>
            <p className='w-[200px]'>Messiah :</p>
            <p>
              {loanSel?.messiah.slice(0, 4) +
                "..." +
                loanSel?.messiah.slice(-4)}
            </p>
          </div>
          <div className='flex text-[20px] font-[600] justify-end mt-[20px] mr-[20px]'>
            <button
              className='bg-[#FF4200] py-1 rounded-lg mr-[40px] w-[140px]'
              onClick={() => setOpenModal(!open)}>
              OK
            </button>
            <button
              className='bg-[#FF0000] py-1 rounded-lg w-[140px]'
              onClick={() => setOpenModal(!open)}>
              REMOVE
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewLoanModal;
