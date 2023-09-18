/** @format */

import InputSelect from "components/common/InputSelect";
import InputValue from "components/common/InputValue";
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

  const collectionOptions = useCustomQuery({
    query: getCollections,
    variables: { ownerAddress: address },
  });

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
      const data = apes.tokens.items.map((item: any) => {
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
  }, [apes, createValue]);

  useEffect(() => {
    const data = collectionOptions?.collections?.map((item: any) => {
      return {
        value: item.collectionId,
        label: (
          <div className='flex item-center'>
            <img
              src={item.thumbnailImageUrl}
              alt={item.name}
              className='rounded-[99px] mr-5 w-[28px] h-[28px]'
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
    <div className='px-20 m-20 flex justify-center'>
      <div className='min-w-[550px] max-w-3xl border-[#BEBEBE] border-2 rounded-[30px] px-6 py-10'>
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
              id: e.value,
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
          className={`w-full text-[30px] font-[600] border-2 border-[#FF4200] rounded-[99px] py-2 mt-5 ${
            activeButton && "bg-[#FF4200]"
          } `}
          disabled={!activeButton}
          onClick={() => setOpenModal(true)}>
          Create Loan
        </button>
      </div>
      <CreateLoanModal
        open={openModal}
        collections={collectionOptions?.collections}
        createValue={createValue}
        apes={apes}
        setOpenModal={setOpenModal}
      />
    </div>
  );
};
export default CreateLoan;
