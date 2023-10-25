/** @format */
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { useMyApes } from "hooks";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import InputSelect from "components/common/InputSelect";

const ViewNftModal = ({
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
  const [createValue, setCreateValue] = useState<{ [key: string]: string }>({
    id: "",
    collectionId: "",
  });

  const { myApes } = useMyApes({ createValue });
  const dispatch = useDispatch();
  const { connectedCollections } = useSelector(
    (state: any) => state.collections
  );
  const [idOption, setIdOption] = useState<any[]>([]);
  const [collectionOption, setCollectionOption] = useState<any[]>([]);
  const [activeButton, setActiveButton] = useState<boolean>(false);

  useEffect(() => {
    if (myApes?.length === 0) {
      toast.error("There is no NFT.");
    }
  }, [myApes]);

  useEffect(() => {
    const objectName = Object.keys(createValue);
    const areAllValuesValid = objectName.every(
      (item) => createValue[item] !== "" && createValue[item] !== "0"
    );
    setActiveButton(areAllValuesValid);
  }, [createValue]);

  useEffect(() => {
    if (myApes) {
      const data = myApes?.map((item: any) => {
        return {
          label: <p className='m-0 text-white'>{item.tokenId}</p>,
          value: item.tokenId,
        };
      });
      setIdOption(data);
      if (createValue.collectionId === "") {
        setIdOption([]);
      }
    }
  }, [myApes, createValue, dispatch]);

  useEffect(() => {
    const data = connectedCollections?.map((item: any) => {
      return {
        value: item.collectionId,
        label: (
          <div className='flex items-center md:text-base'>
            <img
              src={item.thumbnailImageUrl}
              alt={item.name}
              className='rounded-[99px] mr-3 w-7 h-7'
            />
            <p className='m-0 text-white'>{item.name}</p>
          </div>
        ),
      };
    });
    setCollectionOption(data);
  }, [connectedCollections]);

  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm z-30'
      open={open}
      onClose={() => {}}>
      <div className='bg-gray-200 p-3 rounded-lg shadow-lg shadow-gray-500 text-gray-600'>
        <div className='flex justify-end '>
          <XMarkIcon
            className='w-6 cursor-pointer hover:bg-gray-500 rounded-md'
            onClick={() => setOpen(!open)}
          />
        </div>
        <p className='text-center text-4xl md:px-20'>Please Select the NFT</p>
        <div className='px-2 bg-gray-800 py-2 rounded-lg mt-2'>
          <InputSelect
            label='Collection'
            onChange={(e) => {
              setCreateValue({
                ...createValue,
                collectionId: e ? e.value : "",
              });
              dispatch(setLoading(true));
            }}
            options={collectionOption}
          />
          <InputSelect
            label='Id'
            onChange={(e) => {
              setCreateValue({
                ...createValue,
                id: e ? e.value : "",
              });
            }}
            options={idOption}
          />
        </div>
        <div
          className={`flex mt-2 justify-end text-gray-200 md:text-xl text-base`}>
          <button
            className='bg-[#44a1b5] hover:bg-[#40bcd7] py-1 rounded-lg w-28 ml-5'
            disabled={!activeButton}
            onClick={() => {
              setOpen(!open);
              if (
                data.filter(
                  (e: any) => JSON.stringify(e) === JSON.stringify(createValue)
                ).length > 0
              ) {
                toast.error("Already exit the NFT");
              } else {
                setData(data?.concat(createValue));
                dispatch(setLoading(true));
              }
            }}>
            Add
          </button>
          <button
            className='bg-[#FF0000] py-1 rounded-lg w-28 ml-5'
            onClick={() => {
              setOpen(!open);
            }}>
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewNftModal;
