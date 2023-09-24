/** @format */

import InputSelect from "components/common/InputSelect";
import InputValue from "components/common/InputValue";
import Spinner from "components/common/Spinner";
import CreateLoanModal from "components/pawnShop/createLoanModal";
import { useWallet, useCustomQuery } from "hooks";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getCollections, searchNFTs } from "utils/query";

const CreateLoan = () => {
  const { address } = useWallet();
  const [activeButton, setActiveButton] = useState(false);
  const [idOption, setIdOption] = useState<any[]>([]);
  const [collectionOption, setCollectionOption] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const collectionOptions = useCustomQuery({
    query: getCollections,
    variables: { ownerAddress: address },
  });

  useEffect(() => {
    if (!collectionOptions) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [collectionOptions]);

  const [createValue, setCreateValue] = useState<{ [key: string]: string }>({
    id: "",
    collectionId: "",
    vet: "",
    period: "",
    interest: "",
  });

  const filters = {
    ownerAddress: address,
  };
  const collectionFilter = {
    ownerAddress: address,
    collectionId: createValue.collectionId,
  };

  const apes = useCustomQuery({
    query: searchNFTs,
    variables: {
      filters: createValue.collectionId === "" ? filters : collectionFilter,
      pagination: { page: 1, perPage: 1000 },
    },
  });

  useEffect(() => {
    const objectName = Object.keys(createValue);
    const areAllValuesValid = objectName.every(
      (item) => createValue[item] !== "" && createValue[item] !== "0"
    );
    setActiveButton(areAllValuesValid);
  }, [createValue]);

  useEffect(() => {
    if (apes) {
      setLoading(true);
      const data = apes.tokens?.items.map((item: any) => {
        return {
          label: <p className='m-0 text-white'>{item.tokenId}</p>,
          value: item.tokenId,
        };
      });
      setIdOption(data);
      setLoading(false);
      if (createValue.collectionId === "") {
        setIdOption([]);
      }
    }
  }, [apes, createValue]);

  useEffect(() => {
    const data = collectionOptions?.collections?.map((item: any) => {
      return {
        value: item.collectionId,
        label: (
          <div className='flex items-center'>
            <img
              src={item.thumbnailImageUrl}
              alt={item.name}
              className='rounded-[99px] mr-5 w-7 h-7'
            />
            <p className='m-0 text-white'>{item.name}</p>
          </div>
        ),
      };
    });
    setCollectionOption(data);
  }, [collectionOptions]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCreateValue({
      ...createValue,
      [name]: value,
    });
  };

  return (
    <div className='lg:px-20 md:px-10 md:my-10 p-3 flex justify-center '>
      <div className='border-[#BEBEBE] border-2 md:rounded-3xl rounded-lg m-6 px-2 py-4 md:py-8 md:px-6 lg:px-10'>
        <InputSelect
          label='Collection'
          onChange={(e) => {
            address
              ? setCreateValue({
                  ...createValue,
                  collectionId: e ? e.value : "",
                })
              : toast.error("Please connect the wallet");
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
        <InputValue
          label='Value'
          name='vet'
          placeholder='Vet'
          value={createValue.vet}
          onChange={handleChange}
        />
        <InputValue
          label='Period'
          name='period'
          placeholder='Hours'
          value={createValue.period}
          onChange={handleChange}
        />
        <InputValue
          label='Interest'
          name='interest'
          placeholder='%'
          value={createValue.interest}
          onChange={handleChange}
        />
        <button
          className={`w-full md:text-3xl text-lg font-[600] border-2 border-[#FF4200] rounded-[99px] py-2 mt-5 ${
            activeButton && "bg-[#FF4200]"
          } `}
          disabled={!activeButton}
          onClick={() => setOpenModal(true)}>
          CREATE LOAN
        </button>
      </div>
      <CreateLoanModal
        open={openModal}
        collections={collectionOptions?.collections}
        createValue={createValue}
        apes={apes}
        setOpenModal={setOpenModal}
      />
      <Spinner loading={loading} />
    </div>
  );
};
export default CreateLoan;
