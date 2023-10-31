/** @format */

import { setLoading } from "actions/loading";
import { useWallet, useMyApes } from "hooks";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { mobility_address } from "config/contractAddress";
import { worldRegisterABI } from "abi/abis";
import { MVACollectionId } from "constant";
import InputSelect from "components/common/InputSelect";
import toast from "react-hot-toast";

const RegisterModal = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
  const [registerValue, setRegisterValue] = useState<{
    [key: string]: string;
  }>({
    collectionId: "",
    id: "",
  });
  const [idOption, setIdOption] = useState<any[]>([]);
  const [collectionOption, setCollectionOption] = useState<any[]>([]);
  const { connex } = useWallet();
  const [activeButton, setActiveButton] = useState(false);
  const dispatch = useDispatch();

  const { connectedCollections } = useSelector(
    (state: any) => state.collections
  );

  const { myApes } = useMyApes({ createValue: registerValue });

  useEffect(() => {
    if (myApes?.length === 0) {
      toast.error("There is no NFT.");
    }
  }, [myApes]);

  useEffect(() => {
    const objectName = Object.keys(registerValue);
    const areAllValuesValid = objectName.every(
      (item) => registerValue[item] !== "" && registerValue[item] !== "0"
    );
    setActiveButton(areAllValuesValid);
  }, [registerValue]);

  useEffect(() => {
    if (myApes) {
      const data = myApes?.map((item: any) => {
        return {
          label: <p className='m-0 text-white'>{item.tokenId}</p>,
          value: item.tokenId,
        };
      });
      setIdOption(data);
      if (registerValue.collectionId === "") {
        setIdOption([]);
      }
    }
  }, [myApes, registerValue, dispatch]);

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
    try {
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
    } catch (error) {
      console.log(error);
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
        <div className='text-gray-200'>
          <p className='text-center md:text-5xl text-4xl text-gray-800 mb-2'>
            Welcome to the APE-world!
          </p>
          <div className='bg-gray-800 md:p-4 p-2 rounded-lg md:mx-[30px]'>
            <InputSelect
              label='Collection'
              onChange={(e) => {
                setRegisterValue({
                  ...registerValue,
                  collectionId: e ? e.value : "",
                });
                dispatch(setLoading(true));
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
          </div>
          <div className='flex md:text-xl text-base justify-end mt-2 text-white md:px-[30px]'>
            <button
              className={`border-2 border-[#00a4c7]  py-1 rounded-lg mr-5 w-24  ${
                activeButton ? "bg-[#00a4c7] text-white" : "text-[#00a4c7]"
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
