/** @format */
import { Dialog } from "@headlessui/react";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewNftModal from "./ViewNftModal";
import { get_image } from "utils";
import toast from "react-hot-toast";

const CreateOfferModal = ({
  open,
  setOpen,
  data,
  setData,
}: {
  open: boolean;
  setOpen: any;
  data: any;
  setData: any;
}) => {
  const dispatch = useDispatch();
  const [offerList, setOfferList] = useState<any>([]);
  const [openNft, setOpenNft] = useState<boolean>(false);
  const { collectionOptions } = useSelector((state: any) => state.collections);
  const [offerData, setOfferData] = useState<any>([]);

  useEffect(() => {
    Promise.all(
      offerList.map(async (item: any) => {
        const temp = collectionOptions.filter(
          (i: any) => i.collectionId === item.collectionId
        )[0]?.smartContractAddress;
        return await get_image(temp, item.id);
      })
    )
      .then((result) => {
        setOfferData(result);
      })
      .catch((error) => {
        dispatch(setLoading(false));
        console.error(error);
      });
  }, [dispatch, offerList, collectionOptions]);

  const createOffer = () => {};

  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm z-30'
      open={open}
      onClose={() => {}}>
      <div className='bg-gray-200 p-3 rounded-lg shadow-lg shadow-gray-500 text-gray-600'>
        <div className='flex justify-end'>
          <XMarkIcon
            className='w-6 cursor-pointer hover:bg-gray-500 rounded-md'
            onClick={() => {
              setOpen(!open);
              setOfferList([]);
              setData([]);
            }}
          />
        </div>
        <div className='flex justify-between'>
          <div className='md:mr-4 mr-1'>
            <p className='text-xl md:text-4xl font-bold text-gray-800 px-2 mb-4'>
              You are about to OFFER
            </p>
            <div
              className={`md:h-[300px] h-[180px] overflow-y-auto md:w-64 w-36`}>
              {offerData.map((item: any, index: number) => (
                <div key={index}>
                  <div className='relative'>
                    <img
                      className='rounded-lg w-36 md:w-64'
                      src={item?.img}
                      onLoad={() => dispatch(setLoading(false))}
                      alt='createLoan'
                    />
                    <TrashIcon
                      className='absolute w-6 text-red-700 top-4 right-4 cursor-pointer'
                      onClick={() => {
                        offerList.splice(index, 1);
                        setOfferList([...offerList]);
                      }}
                    />
                  </div>
                  <div className='flex justify-between px-3 md:text-xl text-sm my-2'>
                    <p>{item.name}</p>
                    <p>Rank : {item.rank ? item.rank : "Any"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className='text-xl md:text-4xl font-bold text-gray-800 px-2 mb-4'>
              FOR the following items
            </p>
            <div className={`md:h-[300px] h-[180px] overflow-y-auto`}>
              {data.map((item: any, index: number) => (
                <div key={index}>
                  <img
                    className='rounded-lg w-36 md:w-64'
                    src={item?.img}
                    alt='createLoan'
                  />
                  <div className='flex justify-between px-3 md:text-xl text-sm my-2'>
                    <p>{item.name}</p>
                    <p>Rank : {item.rank ? item.rank : "Any"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='flex justify-between md:text-xl text-base text-gray-200 mt-2'>
          <button
            className='bg-blue-600  py-1 rounded-lg md:w-28 w-20'
            onClick={() => {
              setOpenNft(!openNft);
            }}>
            ADD NFT
          </button>
          <div className='flex'>
            <button
              className='bg-[#44a1b5] hover:bg-[#40bcd7] py-1 rounded-lg md:w-28 w-20'
              onClick={() => {
                if (offerData.length === 0) {
                  toast.error("Please add the NFTs");
                } else {
                  createOffer();
                  dispatch(setLoading(true));
                }
              }}>
              Confirm
            </button>
            <button
              className='bg-[#FF0000]  py-1 rounded-lg md:w-28 w-20 md:ml-5 ml-1'
              onClick={() => {
                setOpen(!open);
                setData([]);
                setOfferList([]);
              }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <ViewNftModal
        open={openNft}
        setOpen={setOpenNft}
        data={offerList}
        setData={setOfferList}
      />
    </Dialog>
  );
};

export default CreateOfferModal;
