/** @format */

import { setLoading } from "actions/loading";
import InputSelect from "components/common/InputSelect";
import { useCustomQuery, useWallet } from "hooks";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCollections, searchNFTs } from "utils/query";
import toast from "react-hot-toast";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const RegisterModal = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
  const [registerValue, setRegisterValue] = useState<{
    [key: string]: string;
  }>({
    collectionId: "",
    id: "",
  });
  const [idOption, setIdOption] = useState<any[]>([]);
  const [collectionOption, setCollectionOption] = useState<any[]>([]);
  const { address } = useWallet();
  const [activeButton, setActiveButton] = useState(false);
  const dispatch = useDispatch();

  const collectionOptions = useCustomQuery({
    query: getCollections,
    variables: { ownerAddress: address },
  });

  const filters = {
    ownerAddress: address,
  };
  const collectionFilter = {
    ownerAddress: address,
    collectionId: registerValue.collectionId,
  };

  const apes = useCustomQuery({
    query: searchNFTs,
    variables: {
      filters: registerValue.collectionId === "" ? filters : collectionFilter,
      pagination: { page: 1, perPage: 1000 },
    },
  });

  useEffect(() => {
    if (!apes) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
      if (apes.tokens.items.length === 0) {
        toast.error("There is no NFT.");
      }
    }
  }, [apes, dispatch]);

  useEffect(() => {
    const objectName = Object.keys(registerValue);
    const areAllValuesValid = objectName.every(
      (item) => registerValue[item] !== "" && registerValue[item] !== "0"
    );
    setActiveButton(areAllValuesValid);
  }, [registerValue]);

  useEffect(() => {
    if (apes) {
      dispatch(setLoading(true));
      const data = apes.tokens?.items.map((item: any) => {
        return {
          label: <p className='m-0 text-white'>{item.tokenId}</p>,
          value: item.tokenId,
        };
      });
      setIdOption(data);
      dispatch(setLoading(false));
      if (registerValue.collectionId === "") {
        setIdOption([]);
      }
    }
  }, [apes, registerValue, dispatch]);

  useEffect(() => {
    const data = collectionOptions?.collections?.map((item: any) => {
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
  }, [collectionOptions]);

  const handle = () => {};
  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm overflow-y-auto m-3 z-30'
      open={open}
      onClose={() => {}}>
      <div className=' bg-gray-200 p-3 rounded-lg shadow-lg shadow-gray-500'>
        <div className='flex justify-end '>
          <XMarkIcon
            className='w-6 cursor-pointer hover:bg-gray-500 rounded-md'
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className='px-5 text-gray-200'>
          <div className='bg-gray-600 mb-5 px-4 rounded-lg'>
            <InputSelect
              label='Collection'
              onChange={(e) => {
                setRegisterValue({
                  ...registerValue,
                  collectionId: e ? e.value : "",
                });
              }}
              options={collectionOption}
            />
          </div>
          <div className='bg-gray-600 my-5  px-4 rounded-lg'>
            <InputSelect
              label='id'
              onChange={(e) => {
                setRegisterValue({
                  ...registerValue,
                  id: e ? e.value : "",
                });
              }}
              options={idOption}
            />
          </div>
          <div className='flex md:text-xl text-base justify-end mt-2 text-white'>
            <button
              className={` border-2 py-1 rounded-lg mr-5 w-24  ${
                activeButton
                  ? "text-gray-200 bg-[#FF4200]"
                  : "text-[#FF4200] border-[#FF4200]"
              }`}
              onClick={() => {
                handle();
                dispatch(setLoading(true));
              }}>
              CONFIRM
            </button>
            <button
              className='bg-[#FF0000] py-1 rounded-lg w-24'
              onClick={() => setOpen(!open)}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default RegisterModal;
