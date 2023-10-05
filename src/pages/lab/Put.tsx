/** @format */

import { setLoading } from "actions/loading";
import InputSelect from "components/common/InputSelect";
import InputValue from "components/common/InputValue";
import CreatePutOptionModal from "components/lab/CreatePutOptionModal";
import { useWallet, useCustomQuery } from "hooks";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { getCollections, searchNFTs } from "utils/query";

const Put = () => {
  const { address } = useWallet();
  const [activeButton, setActiveButton] = useState(false);
  const [idOption, setIdOption] = useState<any[]>([]);
  const [collectionOption, setCollectionOption] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!address) {
      navigate("/lab");
    }
  }, [address, navigate]);

  const collectionOptions = useCustomQuery({
    query: getCollections,
    variables: { ownerAddress: address },
  });

  const [createValue, setCreateValue] = useState<{ [key: string]: string }>({
    id: "",
    collectionId: "",
    strikePrice: "",
    putPrice: "",
    duration: "",
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
    <div className='md:my-3 flex justify-center'>
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
        <InputValue
          label='Strike Price'
          name='strikePrice'
          placeholder='Vet'
          value={createValue.strikePrice}
          onChange={handleChange}
        />
        <InputValue
          label='Put Price'
          name='putPrice'
          placeholder='Vet'
          value={createValue.putPrice}
          onChange={handleChange}
        />
        <InputValue
          label='Duration'
          name='duration'
          placeholder='hour'
          value={createValue.duration}
          onChange={handleChange}
        />
        <button
          className={`w-full md:text-2xl text-lg border-2 border-[#FF4200] rounded-[99px] md:py-2 py-1 mt-3 ${
            activeButton && "bg-[#FF4200]"
          } `}
          disabled={!activeButton}
          onClick={() => {
            if (parseInt(createValue.duration) >= 1) {
              setOpen(true);
              dispatch(setLoading(true));
            } else {
              toast.error("The period must be greater than 1 hours.");
            }
          }}>
          CREATE COVERED PUT
        </button>
      </div>
      <CreatePutOptionModal
        open={open}
        createValue={createValue}
        setOpen={setOpen}
        apes={apes}
        collections={collectionOptions?.collections}
      />
    </div>
  );
};
export default Put;