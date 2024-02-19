/** @format */

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { useCallback, useEffect, useState } from "react";
import { trade_address } from "config/contractAddress";
import { useDispatch } from "react-redux";
import { get_image, shortenAddress } from "utils";
import { acceptOfferABI, getTradingABI, removeTradingABI } from "abi/abis";
import toast from "react-hot-toast";
import { useConnex, useWallet } from "@vechain/dapp-kit-react";
import { getName } from "@vechain.energy/dapp-kit-hooks";

const ViewTradingModal = ({
  open,
  selData,
  setOpen,
  setViewData,
  viewData,
  setOpenOffer,
  setSelData,
}: {
  open: boolean;
  selData: any;
  setOpen: any;
  setViewData: any;
  viewData: any;
  setOpenOffer: any;
  setSelData: any;
}) => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const { thor, vendor } = useConnex();
  const connex = useConnex();
  const [offerList, setOfferList] = useState<any>([]);

  const [ownerName, setOwnerName] = useState<string>();
  const [offerrerName, setOfferrerName] = useState<string>();

  useEffect(() => {
    if (selData) {
      Promise.all(
        selData?.nfts?.map(async (item: any) => {
          return await get_image(item[0], item[1]);
        })
      )
        .then((result) => {
          setViewData(result);
        })
        .catch((error) => {
          dispatch(setLoading(false));
          console.error(error);
        });
    }
  }, [dispatch, setViewData, selData]);

  const removeItem = useCallback(async () => {
    const namedMethod = thor.account(trade_address).method(removeTradingABI);
    const clause = namedMethod.asClause(selData?.itemId);
    vendor
      .sign("tx", [clause])
      .comment("Remove Item.")
      .request()
      .then(() => {
        dispatch(setLoading(false));
        setOpen(!open);
        toast.success("Success");
      })
      .catch(() => {
        dispatch(setLoading(false));
        setOpen(!open);
        toast.error("Could not remove Item.");
      });
  }, [selData, dispatch, setOpen, open, thor, vendor]);

  const acceptOffer = (param: string) => {
    try {
      dispatch(setLoading(true));
      const namedMethod = thor.account(trade_address).method(acceptOfferABI);
      const clause = namedMethod.asClause(selData?.itemId, param);
      vendor
        .sign("tx", [clause])
        .comment("Accept Offer.")
        .request()
        .then(() => {
          dispatch(setLoading(false));
          setOpen(!open);
          setSelData();
          toast.success("Success");
        })
        .catch(() => {
          dispatch(setLoading(false));
          setSelData();
          toast.error("Could not accept offer.");
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      let tempArray: any[] = [];
      const namedMethod = thor.account(trade_address).method(getTradingABI);
      for (const item of selData?.linked ?? []) {
        const temp = await namedMethod.call(item);
        const tokenId = temp["decoded"][0][3][0][1];
        const tokenAddress = temp["decoded"][0][3][0][0];
        const temp1 = await get_image(tokenAddress, tokenId);
        tempArray.push({
          ...temp1,
          owner: temp["decoded"][0][0],
        });
      }
      setOfferList(tempArray);
    })();
  }, [selData, thor, dispatch]);

  useEffect(() => {
    if (connex && selData?.owner) {
      getName(selData.owner, connex).then(setOwnerName);
    }
  }, [connex, selData?.owner]);

  useEffect(() => {
    if (connex && offerList[0]?.owner) {
      getName(offerList[0].owner, connex).then(setOfferrerName);
    }
  }, [connex, offerList[0]?.owner]);

  return (
    <Dialog
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-30"
      open={open}
      onClose={() => {}}
    >
      <div className="bg-gray-200 p-3 rounded-lg shadow-lg shadow-gray-500 text-gray-600">
        <div className="flex justify-end">
          <XMarkIcon
            className="w-6 cursor-pointer hover:bg-gray-500 rounded-md"
            onClick={() => {
              setOpen(!open);
              setViewData([]);
              setOfferList([]);
              setSelData();
            }}
          />
        </div>
        <div className="md:flex">
          <div className="mr-2">
            <div className="flex justify-between md:mt-1 px-2 md:text-base text-sm text-gray-100">
              <span className="text-rose-700 rounded-md">
                Item owner By{" "}
                {ownerName?.length ? ownerName : shortenAddress(selData?.owner)}
              </span>
            </div>
            <p className="text-xl md:text-4xl font-bold text-gray-800 px-2 text-center">
              {selData?.linked?.length > 0 ? "These NFTS" : ""}
            </p>
            <div className={`md:h-[292px] h-[200px] overflow-y-auto`}>
              {viewData.map((item: any, index: number) => (
                <div key={index} className="mx-1">
                  <img
                    className="rounded-lg"
                    src={item?.img}
                    alt="createLoan"
                    onLoad={() => dispatch(setLoading(false))}
                  />
                  <div className="flex justify-between px-3 text-xl my-1">
                    <p>{item.name}</p>
                    <p>Rank : {item.rank ? item.rank : "Any"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            {selData?.linked?.length > 0 ? (
              <div className="w-68">
                <div className="flex justify-between md:mt-1 md:text-base text-sm text-gray-100">
                  <span className="text-rose-700 rounded-md">
                    Item owner By{" "}
                    {offerrerName?.length
                      ? offerrerName
                      : shortenAddress(offerList[0]?.owner)}
                  </span>
                </div>
                <p className="text-xl md:text-4xl font-bold text-gray-800 px-2 text-center">
                  HAS OFFERS
                </p>
                <div className={`md:h-[292px] h-[200px] overflow-y-auto`}>
                  {offerList.map((item: any, index: number) => (
                    <div key={index} className="mx-1">
                      <img
                        className="rounded-lg"
                        src={item?.img}
                        alt="createLoan"
                        onLoad={() => dispatch(setLoading(false))}
                      />
                      <div className="flex justify-between items-center px-3 text-xl my-1">
                        <p>{item.name}</p>
                        {selData?.owner === account && (
                          <button
                            className="bg-blue-500 hover:bg-blue-700 rounded-md px-2 text-gray-200 text-base"
                            onClick={() => acceptOffer(selData?.linked[index])}
                          >
                            Accept This Offer
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xl md:text-4xl font-bold text-gray-800 px-2 text-center w-64">
                No Offers for this Item
              </p>
            )}
          </div>
        </div>
        <div
          className={`flex mt-2 justify-end text-gray-200 md:text-xl text-base`}
        >
          {selData?.type === "LIST" && (
            <button
              className="bg-[#44a1b5] hover:bg-[#40bcd7] py-1 rounded-lg w-28 ml-5"
              onClick={() => {
                setOpen(!open);
                setOpenOffer(true);
                dispatch(setLoading(true));
                setOfferList([]);
              }}
            >
              Create New Offer
            </button>
          )}
          {selData?.owner === account && (
            <button
              className="bg-[#FF0000] py-1 rounded-lg w-28 ml-5"
              onClick={() => {
                removeItem();
                dispatch(setLoading(true));
              }}
            >
              Remove This {selData?.type}
            </button>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default ViewTradingModal;
