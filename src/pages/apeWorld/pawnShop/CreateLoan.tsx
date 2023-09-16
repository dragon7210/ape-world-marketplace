/** @format */

import {
  approveABI,
  createLoanABI,
  getServiceFeeABI,
  mvaApproveABI,
} from "abi/abis";
import InputSelect from "components/common/InputSelect";
import InputValue from "components/common/InputValue";
import { mva_token_address, pawn_address } from "config/contractAddress";
import { useWallet, useCustomQuery } from "hooks";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getCollections, searchNFTs } from "utils/query";

const CreateLoan = () => {
  const { address, connex } = useWallet();
  const [activeButton, setActiveButton] = useState(false);
  const [idOption, setIdOption] = useState<any[]>([]);
  const [collectionOption, setCollectionOption] = useState<any[]>([]);

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

  useEffect(() => {
    if (apes) {
      const data = apes.tokens.items.map((item: any) => {
        return {
          label: <p className='m-0 text-white'>{item.tokenId}</p>,
          value: item.tokenId,
        };
      });
      setIdOption(data);
    }
  }, [apes]);

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

  const handleCreate = async () => {
    if (!address) {
      toast.error("Please connect the wallet");
      return;
    }
    if (connex) {
      const data = collectionOptions.collections.filter(
        (item: any) => item.collectionId === createValue.collectionId
      );
      const selAddress = data[0].smartContractAddress;

      const pawnShop = connex.thor.account(pawn_address);

      const getFeeMethod = pawnShop.method(getServiceFeeABI);
      const namedMethod = connex.thor.account(selAddress).method(approveABI);
      const anotherNamedMethod = connex.thor
        .account(pawn_address)
        .method(createLoanABI);
      const yetAnotherMethod = connex.thor
        .account(mva_token_address)
        .method(mvaApproveABI);

      const fee = await getFeeMethod.call();
      const clause1 = namedMethod.asClause(pawn_address, createValue.id);
      const clause2 = anotherNamedMethod.asClause(
        selAddress,
        createValue.id,
        createValue.vet,
        createValue.interest,
        createValue.period
      );
      const clause3 = yetAnotherMethod.asClause(
        pawn_address,
        (fee.decoded[0] * 10 ** 18).toString()
      );
      connex.vendor
        .sign("tx", [clause1, clause3, clause2])
        .comment("Create Listing.")
        .request()
        .then(() => {
          toast.success("Created successfully");
        })
        .catch(() => toast.error("Could not create loan."));
    }
  };

  return (
    <div className='px-20 m-20 flex justify-center'>
      <div className='min-w-[550px] max-w-3xl border-[#4D4D4D] border-2 rounded-[30px] px-6 py-10'>
        <InputSelect
          label='Collection'
          onChange={(e) => {
            setCreateValue({ ...createValue, collectionId: e.value });
          }}
          options={collectionOption}
        />
        <InputSelect
          label='Id'
          onChange={(e) => {
            setCreateValue({ ...createValue, id: e.value });
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
          onClick={handleCreate}>
          Create Loan
        </button>
      </div>
    </div>
  );
};
export default CreateLoan;
