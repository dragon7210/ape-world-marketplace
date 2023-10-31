/** @format */
import { Dialog } from "@headlessui/react";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWallet } from "hooks";
import toast from "react-hot-toast";
import { get_image } from "utils";
import { mva_token_address, trade_address } from "config/contractAddress";
import {
  approveABI,
  createTradingOfferABI,
  getTradingFeeABI,
  mvaApproveABI,
} from "abi/abis";
import ViewNftModal from "./ViewNftModal";

const CreateOfferModal = ({
  open,
  setOpen,
  data,
  setData,
  selData,
  setSelData,
}: {
  open: boolean;
  setOpen: any;
  data: any;
  setData: any;
  selData: any;
  setSelData: any;
}) => {
  const dispatch = useDispatch();
  const [offerList, setOfferList] = useState<any>([]);
  const [openNft, setOpenNft] = useState<boolean>(false);
  const { collectionOptions } = useSelector((state: any) => state.collections);
  const [offerData, setOfferData] = useState<any>([]);
  const [offerValue, setOfferValue] = useState<number>(0);
  const { connex } = useWallet();

  useEffect(() => {
    Promise.all(
      offerList.map(async (item: any) => {
        const temp = collectionOptions.filter(
          (i: any) => i.collectionId === item.collectionId
        )[0]?.smartContractAddress;
        return await get_image(temp, item.id);
      })
    )
      .then((result) => {
        setOfferData(result);
      })
      .catch((error) => {
        dispatch(setLoading(false));
        console.error(error);
      });
  }, [dispatch, offerList, collectionOptions]);

  const createOffer = async () => {
    try {
      if (connex) {
        const feeMethod = connex.thor
          .account(trade_address)
          .method(getTradingFeeABI);
        const fee = await feeMethod.call();
        const offerFee = fee["decoded"]["1"] * 10 ** 18;

        let nftPayload: any[] = [];

        for (const item of offerList) {
          nftPayload.push([
            collectionOptions.filter(
              (i: any) => i?.collectionId === item?.collectionId
            )[0]?.smartContractAddress,
            item?.id,
          ]);
        }
        const namedMethod = connex.thor
          .account(trade_address)
          .method(createTradingOfferABI);
        let last_clause = namedMethod.asClause(selData?.itemId, nftPayload);
        last_clause["value"] = (offerValue * 10 ** 18).toString();
        const yetAnotherMethod = connex.thor
          .account(mva_token_address)
          .method(mvaApproveABI);

        let clauses = [];
        clauses.push(
          yetAnotherMethod.asClause(trade_address, offerFee.toString())
        );

        let anotherNamedMethod;
        for (let j = 0; j < nftPayload.length; j++) {
          anotherNamedMethod = connex.thor
            .account(nftPayload[j][0])
            .method(approveABI);
          clauses.push(
            anotherNamedMethod.asClause(trade_address, nftPayload[j][1])
          );
        }
        clauses.push(last_clause);
        connex.vendor
          .sign("tx", clauses)
          .comment("Create Offer.")
          .request()
          .then(() => {
            toast.success("Success");
            setOpen(!open);
            setOfferList([]);
            setData([]);
            setSelData();
            dispatch(setLoading(false));
          })
          .catch(() => {
            toast.error("Could not create offer.");
            setOpen(!open);
            setOfferList([]);
            setData([]);
            setSelData();
            dispatch(setLoading(false));
          });
      }
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
    }
  };

  return (
    <Dialog
      className='fixed inset-0 flex items-center justify-center backdrop-blur-sm z-30'
      open={open}
      onClose={() => {}}>
      <div className='bg-gray-200 p-3 rounded-lg shadow-lg shadow-gray-500 text-gray-600'>
        <div className='flex justify-end'>
          <XMarkIcon
            className='w-6 cursor-pointer hover:bg-gray-500 rounded-md'
            onClick={() => {
              setOpen(!open);
              setOfferList([]);
              setData([]);
              setSelData();
            }}
          />
        </div>
        <div className='md:flex justify-between'>
          <div className='md:mr-4 mr-1'>
            <p className='text-xl md:text-4xl font-bold text-gray-800 px-2'>
              You are about to OFFER
            </p>
            <div
              className={`md:h-[292px] h-[200px] overflow-y-auto md:w-64 w-36`}>
              {offerData.map((item: any, index: number) => (
                <div key={index}>
                  <div className='relative'>
                    <img
                      className='rounded-lg w-64'
                      src={item?.img}
                      onLoad={() => dispatch(setLoading(false))}
                      alt='createLoan'
                    />
                    <TrashIcon
                      className='absolute w-6 text-red-700 top-4 right-4 cursor-pointer'
                      onClick={() => {
                        offerList.splice(index, 1);
                        setOfferList([...offerList]);
                      }}
                    />
                  </div>
                  <div className='flex justify-between px-3 md:text-xl text-sm my-2'>
                    <p>{item.name}</p>
                    <p>Rank : {item.rank ? item.rank : "Any"}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className='flex justify-between items-center md:text-xl text-base text-gray-200 mt-1'>
              <button
                className='bg-blue-600  py-1 rounded-lg md:w-28 w-20'
                onClick={() => {
                  setOpenNft(!openNft);
                }}>
                ADD NFT
              </button>
              <div className='relative'>
                <input
                  className='text-gray-800 py-[2px] px-3 w-24 border-gray-500 border-2 outline-none rounded-md'
                  value={offerValue}
                  onChange={(e) => setOfferValue(Number(e.target.value))}
                />
                <p className='absolute text-gray-500 top-1 right-1'>VET</p>
              </div>
            </div>
          </div>
          <div>
            <p className='text-xl md:text-4xl font-bold text-gray-800 px-2'>
              FOR the following items
            </p>
            <div className={`md:h-[292px] h-[200px] overflow-y-auto`}>
              {data.map((item: any, index: number) => (
                <div key={index}>
                  <img
                    className='rounded-lg w-64'
                    src={item?.img}
                    alt='createLoan'
                    onLoad={() => dispatch(setLoading(false))}
                  />
                  <div className='flex justify-between px-3 md:text-xl text-sm my-2'>
                    <p>{item.name}</p>
                    <p>Rank : {item.rank ? item.rank : "Any"}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className='flex justify-between md:text-xl text-base text-gray-200 mt-1'>
              <button
                className='bg-[#44a1b5] hover:bg-[#40bcd7] py-1 rounded-lg md:w-28 w-20'
                onClick={() => {
                  if (offerData.length === 0) {
                    toast.error("Please add the NFTs");
                  } else {
                    createOffer();
                    dispatch(setLoading(true));
                  }
                }}>
                Confirm
              </button>
              <button
                className='bg-[#FF0000]  py-1 rounded-lg md:w-28 w-20 md:ml-5 ml-1'
                onClick={() => {
                  setOpen(!open);
                  setData([]);
                  setOfferList([]);
                  setSelData();
                }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <ViewNftModal
        open={openNft}
        setOpen={setOpenNft}
        data={offerList}
        setData={setOfferList}
      />
    </Dialog>
  );
};

export default CreateOfferModal;
