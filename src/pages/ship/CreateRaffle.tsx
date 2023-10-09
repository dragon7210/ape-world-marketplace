/** @format */

import { setLoading } from "actions/loading";
import InputSelect from "components/common/InputSelect";
import InputValue from "components/common/InputValue";
import CreateRaffleModal from "components/ship/CreateRaffleModal";
import { TokenOption } from "constant";
import { useWallet, useCustomQuery } from "hooks";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { getCollections, searchNFTs } from "utils/query";

const CreateRaffle = () => {
  const { address } = useWallet();
  const [activeButton, setActiveButton] = useState(false);
  const [idOption, setIdOption] = useState<any[]>([]);
  const [collectionOption, setCollectionOption] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!address) {
      navigate("/ship");
    }
  }, [address, navigate]);

  const [createValue, setCreateValue] = useState<{ [key: string]: string }>({
    collectionId: "",
    id: "",
    value: "",
    duration: "",
    count: "",
    token: "",
  });

  const collectionOptions = useCustomQuery({
    query: getCollections,
    variables: { ownerAddress: address },
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
    const objectName = Object.keys(createValue);
    const areAllValuesValid = objectName.every(
      (item) => createValue[item] !== "" && createValue[item] !== "0"
    );
    setActiveButton(areAllValuesValid);
  }, [createValue]);

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
      if (createValue.collectionId === "") {
        setIdOption([]);
      }
    }
  }, [apes, createValue, dispatch]);

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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCreateValue({
      ...createValue,
      [name]: value,
    });
  };

  return (
    <div className='lg:px-10 md:px-5 p-3 bg-[#00000050] min-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_300px)] flex justify-center items-center rounded-xl'>
      <div className='bg-[#0a0b1336] md:rounded-3xl rounded-lg m-6 px-2 py-4 md:px-6 lg:px-10 md:w-[450px] w-[300px]'>
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
        <InputSelect
          label='Token'
          onChange={(e) => {
            setCreateValue({
              ...createValue,
              token: e ? e.value : "",
            });
          }}
          options={TokenOption}
        />
        <InputValue
          label='Value'
          name='value'
          placeholder={
            createValue.token !== ""
              ? createValue.token === "false"
                ? "VET"
                : "MVA"
              : ""
          }
          value={createValue.value}
          onChange={handleChange}
        />
        <InputValue
          label='Count'
          name='count'
          placeholder=''
          value={createValue.count}
          onChange={handleChange}
        />
        <InputValue
          label='Duration'
          name='duration'
          placeholder='Hours'
          value={createValue.duration}
          onChange={handleChange}
        />

        <button
          className={`w-full md:text-2xl text-lg border-2 border-[#ff9933] rounded-[99px] md:py-2 md:mb-4 py-1 mt-3 ${
            activeButton && "bg-[#ff9933]"
          } `}
          disabled={!activeButton}
          onClick={() => {
            if (
              Number(createValue.duration) >= 24 &&
              Number(createValue.count) > 0
            ) {
              setOpen(true);
              dispatch(setLoading(true));
            } else if (Number(createValue.duration) < 24) {
              toast.error("The period must be greater than 24 hours.");
            } else {
              toast.error("The Count must be greater than 0.");
            }
          }}>
          CREATE RAFFLE
        </button>
      </div>
      <CreateRaffleModal
        open={open}
        collections={collectionOptions?.collections}
        createValue={createValue}
        apes={apes}
        setOpen={setOpen}
      />
    </div>
  );
};
export default CreateRaffle;
