/** @format */

import InputSelect from "components/common/InputSelect";
import InputValue from "components/common/InputValue";
import { useWallet, useCustomQuery } from "hooks";
import { useEffect, useState } from "react";
import { getCollections, searchNFTs } from "utils/query";

const CreateLoan = () => {
  const { address } = useWallet();
  const [activeButton, setActiveButton] = useState(false);
  const options = useCustomQuery({
    query: getCollections,
    variables: { ownerAddress: address },
  });
  const [createValue, setCreateValue] = useState<{ [key: string]: string }>({
    id: "",
    collectionAddress: "",
    vet: "",
    period: "",
    interest: "",
  });

  const apes = useCustomQuery({
    query: searchNFTs,
    variables: {
      filters: {
        ownerAddress: address,
      },
      pagination: { page: 1, perPage: 24 },
    },
  });
  useEffect(() => {
    const objectName = Object.keys(createValue);
    const areAllValuesValid = objectName.every(
      (item) => createValue[item] !== "" && createValue[item] !== "0"
    );
    setActiveButton(areAllValuesValid);
  }, [createValue]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCreateValue({
      ...createValue,
      [name]: value,
    });
  };

  return (
    <div className='px-20 m-20 flex justify-center'>
      <div className='min-w-[550px] max-w-3xl border-[#4D4D4D] border-2 rounded-[30px] px-6 py-10'>
        <InputSelect
          label='Collection'
          onChange={(e) => {
            console.log(e);
          }}
          options={options}
        />
        <InputValue
          label='ID'
          name='id'
          placeholder='ID'
          value={createValue.id}
          onChange={handleChange}
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
          className='w-full text-[30px] font-[600] border-2 border-[#FF4200] rounded-[99px] py-2 mt-5'
          disabled={!activeButton}>
          Create Loan
        </button>
      </div>
    </div>
  );
};

export default CreateLoan;
