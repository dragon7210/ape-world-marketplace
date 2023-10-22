/** @format */

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getApeABI } from "abi/abis";
import { setLoading } from "actions/loading";
import { mobility_address } from "config/contractAddress";
import { useWallet } from "hooks";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getEndTime, get_image, shortenAddress } from "utils";

const ViewModal = ({
  open,
  setOpen,
  ape,
  setApe,
}: {
  open: boolean;
  setOpen: any;
  ape: any;
  setApe: any;
}) => {
  const [selData, setSelData] = useState<any>();
  const { connex } = useWallet();
  const [apeDetail, setApeDetail] = useState<{ [key: string]: string }>({});
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const temp = await get_image(ape?.tokenAddress, ape?.tokenId);
      setSelData(temp);
    })();
  }, [dispatch, ape]);

  useEffect(() => {
    if (connex && ape?.tokenAddress) {
      (async () => {
        const namedMethod = connex.thor
          .account(mobility_address)
          .method(getApeABI);
        const output = await namedMethod.call(ape?.tokenAddress, ape?.tokenId);
        if (output) {
          const temp = {
            owner: output?.decoded[0][0],
            location: output?.decoded[0][1],
            lastMoveOn: output?.decoded[0][2],
            freeMoves: output?.decoded[0][3],
            paidMoves: output?.decoded[0][4],
            lastReset: output?.decoded[0][5],
          };
          setApeDetail(temp);
        }
      })();
    }
  }, [ape, connex]);

  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm overflow-y-auto m-3 z-30 '
      open={open}
      onClose={() => {}}>
      <div className='p-3 rounded-lg shadow-lg bg-gray-200 shadow-gray-500 w-[270px] md:w-[720px]'>
        <div className='flex justify-end '>
          <XMarkIcon
            className='md:hidden w-6 cursor-pointer hover:bg-gray-500 rounded-md'
            onClick={() => {
              setOpen(!open);
              setApe();
            }}
          />
        </div>
        <div className='md:flex justify-between'>
          <img
            className='rounded-lg'
            src={selData?.img}
            alt='apeImg'
            onLoad={() => dispatch(setLoading(false))}
          />
          <div className='mt-2 md:mt-0'>
            <div className='md:flex justify-end hidden'>
              <XMarkIcon
                className='w-6 cursor-pointer hover:bg-gray-500 rounded-md'
                onClick={() => {
                  setOpen(!open);
                  setApe();
                }}
              />
            </div>
            <div className='flex justify-between items-center'>
              <p className='md:text-3xl text-2xl mt-1 font-[700] text-black'>
                {selData?.name}
              </p>
              <span className='bg-green-600 ml-1 text-gray-50 md:text-md text-sm px-3 py-1 rounded-xl'>
                Rank {selData?.rank ? selData?.rank : "Any"}
              </span>
            </div>
            <div className='bg-gray-900 md:w-[430px] text-gray-100 md:px-5 md:py-2 p-2 mt-2 rounded-xl'>
              <p className='md:text-xltext-sm'>Details</p>
              <div className='md:columns-3 columns-2 md:px-5 px-2 text-base md:text-md'>
                <div>
                  <p className='text-gray-500'>Owner</p>
                  <p>{shortenAddress(apeDetail?.owner)} </p>
                </div>
                <div>
                  <p className='text-gray-500'>Location</p>
                  <p>{apeDetail?.location}</p>
                </div>
                <div>
                  <p className='text-gray-500'>Free Moves</p>
                  <p>{apeDetail?.freeMoves}</p>
                </div>
                <div>
                  <p className='text-gray-500'>Paid Moves</p>
                  <p> {apeDetail?.paidMoves}</p>
                </div>
                <div>
                  <p className='text-gray-500'>Last Move On</p>
                  <p>{getEndTime(apeDetail?.lastMoveOn, connex)}</p>
                </div>
                <div>
                  <p className='text-gray-500'>Last Reset</p>
                  <p>{getEndTime(apeDetail?.lastReset, connex)}</p>
                </div>
              </div>
            </div>
            <div className='flex md:text-lg text-base justify-end mt-2 text-gray-100'>
              <button
                className='bg-[#FF4200] py-1 rounded-lg ml-5 w-24'
                onClick={() => {
                  setOpen(!open);
                  setApe();
                }}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewModal;
