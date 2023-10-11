/** @format */

import { setLoading } from "actions/loading";
import InputSelect from "components/common/InputSelect";
import { useCustomQuery, useWallet } from "hooks";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchNFTs } from "utils/query";
import toast from "react-hot-toast";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { mobility_address } from "config/contractAddress";
import { worldRegisterABI } from "abi/abis";
import { MVACollectionId } from "constant";

const RegisterModal = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
  const [registerValue, setRegisterValue] = useState<{
    [key: string]: string;
  }>({
    collectionId: "",
    id: "",
  });
  const [idOption, setIdOption] = useState<any[]>([]);
  const [collectionOption, setCollectionOption] = useState<any[]>([]);
  const { address, connex } = useWallet();
  const [activeButton, setActiveButton] = useState(false);
  const dispatch = useDispatch();

  const { connectedCollections } = useSelector(
    (state: any) => state.collections
  );

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
    const data = connectedCollections?.map((item: any) => {
      return {
        value: item.collectionId,
        name: item.name,
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

  const handle = () => {
    if (!MVACollectionId.includes(registerValue.collectionId)) {
      toast.error("This is not MVA NFT");
      return;
    }

    dispatch(setLoading(true));
    if (connex) {
      const data = connectedCollections?.filter(
        (item: any) => item.collectionId === registerValue.collectionId
      );
      const namedMethod = connex.thor
        .account(mobility_address)
        .method(worldRegisterABI);

      var clause = namedMethod.asClause(
        data[0].smartContractAddress,
        registerValue.id
      );

      connex.vendor
        .sign("tx", [clause])
        .comment("Ape World Register")
        .request()
        .then(() => {
          setOpen(!open);
          dispatch(setLoading(false));
          toast.success("Success");
        })
        .catch(() => {
          setOpen(!open);
          dispatch(setLoading(false));
          toast.error("Could not register.");
        });
    }
  };

  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm overflow-y-auto m-3 z-30 '
      open={open}
      onClose={() => {}}>
      <div className='p-3 rounded-lg shadow-lg bg-gray-200 shadow-gray-500 w-[350px] md:w-[450px]'>
        <div className='flex justify-end '>
          <XMarkIcon
            className='w-6 cursor-pointer hover:bg-gray-500 rounded-md'
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className='text-gray-200 bg-gray-800 md:p-8 p-4 rounded-lg mt-1'>
          <p className='text-center md:text-5xl text-3xl text-gray-200 mb-2'>
            Welcome to the APE-world!
          </p>
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
          <InputSelect
            label='Id'
            onChange={(e) => {
              setRegisterValue({
                ...registerValue,
                id: e ? e.value : "",
              });
            }}
            options={idOption}
          />
          <div className='flex md:text-xl text-base justify-end mt-2 text-white'>
            <button
              className={` border-2 border-[#FF4200] py-1 rounded-lg mr-5 w-24  ${
                activeButton && "bg-[#FF4200]"
              }`}
              onClick={handle}
              disabled={!activeButton}>
              REGISTER
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
