/** @format */

import { setLoading } from "actions/loading";
import { useWallet, useMyApes } from "hooks";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import InputSelect from "components/common/InputSelect";
import InputValue from "components/common/InputValue";
import CreateLoanModal from "components/pawnShop/CreateLoanModal";

const CreateLoan = () => {
  const { address } = useWallet();
  const [activeButton, setActiveButton] = useState(false);
  const [idOption, setIdOption] = useState<any[]>([]);
  const [collectionOption, setCollectionOption] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!address) {
      navigate("/shop");
    }
  }, [address, navigate]);
  const [createValue, setCreateValue] = useState<{ [key: string]: string }>({
    id: "",
    collectionId: "",
    vet: "",
    period: "",
    interest: "",
  });

  const { connectedCollections } = useSelector(
    (state: any) => state.collections
  );

  const { myApes } = useMyApes({ createValue });

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
      const data = myApes.map((item: any) => {
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
    const data = connectedCollections.map((item: any) => {
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
        <InputValue
          label='Value'
          name='vet'
          placeholder='VET'
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
          className={`w-full md:text-2xl text-lg border-2 border-[#FF4200] rounded-[99px] md:py-2 md:mb-4 py-1 mt-3 ${
            activeButton && "bg-[#FF4200]"
          } `}
          disabled={!activeButton}
          onClick={() => {
            if (parseInt(createValue.period) >= 1) {
              setOpen(true);
              dispatch(setLoading(true));
            } else {
              toast.error("The period must be greater than 1 hours.");
            }
          }}>
          CREATE LOAN
        </button>
      </div>
      <CreateLoanModal
        open={open}
        collections={connectedCollections}
        createValue={createValue}
        apes={myApes}
        setOpen={setOpen}
      />
    </div>
  );
};
export default CreateLoan;
