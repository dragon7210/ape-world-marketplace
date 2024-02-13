/** @format */

import Select from "react-select";
import { setLoading } from "actions/loading";
import { useGetApes } from "hooks/useGetApes";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { stats_address } from "config/contractAddress";
import { getRecordABI } from "abi/abis";
import { get_image } from "utils";
import { useConnex } from "@vechain/dapp-kit-react";

const Fighter = () => {
  const [collectionOption, setCollectionOption] = useState<any>([]);
  const [idOption, setIdOption] = useState<any>([]);
  const [activeButton, setActiveButton] = useState(false);
  const [info, setInfo] = useState<any>();
  const [ape, setApe] = useState<any>();

  const [registerValue, setRegisterValue] = useState<{
    [key: string]: string;
  }>({
    collectionId: "",
    id: "",
  });
  const { collectionOptions } = useSelector((state: any) => state.collections);
  const { apes, loading } = useGetApes();
  const { thor } = useConnex();
  const dispatch = useDispatch();

  useEffect(() => {
    const objectName = Object.keys(registerValue);
    const areAllValuesValid = objectName.every(
      (item) => registerValue[item] !== "" && registerValue[item] !== "0"
    );
    setActiveButton(areAllValuesValid);
  }, [registerValue]);

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [dispatch, loading]);

  useEffect(() => {
    const temp = apes.map((item: any) => item.tokenAddress);
    const data = [...new Set(temp)]?.map((item: any) => {
      const temp = collectionOptions.filter(
        (list: any) =>
          list.smartContractAddress?.toLowerCase() === item?.toLowerCase()
      )[0];
      return {
        value: temp.collectionId,
        name: temp.name,
        label: (
          <div className="flex items-center md:text-base">
            <img
              src={temp.thumbnailImageUrl}
              alt={temp.name}
              className="rounded-[99px] mr-3 md:w-7 md:h-7 w-5 h-5"
            />
            <p className="m-0 text-white">{temp.name}</p>
          </div>
        ),
      };
    });
    setCollectionOption(data);
  }, [collectionOptions, apes]);

  useEffect(() => {
    const temp = collectionOptions.filter(
      (list: any) =>
        list.collectionId?.toLowerCase() ===
        registerValue?.collectionId?.toLowerCase()
    )[0];

    const temp1 = apes?.filter((item: any) => {
      return (
        item?.tokenAddress?.toLowerCase() ===
        temp?.smartContractAddress?.toLowerCase()
      );
    });

    const temp2 = temp1.map((item: any) => {
      return {
        value: item.tokenId,
        label: (
          <div className="flex items-center md:text-base">
            <p className="m-0 text-white">{item.tokenId}</p>
          </div>
        ),
      };
    });
    setIdOption(temp2);
  }, [registerValue, apes, collectionOptions]);

  const getInfo = () => {
    try {
      dispatch(setLoading(true));
      (async () => {
        const contractAddress = collectionOptions.filter(
          (item: any) => item?.collectionId === registerValue.collectionId
        )[0]?.smartContractAddress;

        const temp = await get_image(contractAddress, registerValue?.id);
        setInfo(temp);

        const namedMethod = thor.account(stats_address).method(getRecordABI);

        const output = await namedMethod.call(
          contractAddress,
          registerValue?.id
        );
        const ape = {
          valid: output["decoded"]["0"]["0"],
          win: output["decoded"]["0"]["1"],
          loss: output["decoded"]["0"]["2"],
          "tournament wins": output["decoded"]["0"]["3"],
          "training days": output["decoded"]["0"]["4"],
          "last fight on": output["decoded"]["0"]["5"],
          score: output["decoded"]["0"]["6"],
          level: output["decoded"]["0"]["7"],
        };
        setApe(ape);
        dispatch(setLoading(false));
      })();
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  };

  return (
    <div className="lg:px-10 md:px-5 p-3 bg-[#00000050] min-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_300px)] rounded-xl">
      <div className="md:flex justify-end items-center text-sm md:mt-3 border-b-2 border-[#b13535] pb-1">
        <Select
          onChange={(e: any) => {
            setRegisterValue({
              ...registerValue,
              collectionId: e ? e.value : "",
            });
          }}
          options={collectionOption}
          isClearable={true}
          styles={{
            menu: (baseStyles) => ({
              ...baseStyles,
              background: "#373953",
              width: "250px",
            }),
            control: (baseStyles) => ({
              ...baseStyles,
              background: "transparent",
              border: "solid 1px #b13535",
              borderRadius: "4px",
              width: "100%",
              minHeight: "22px",
              marginRight: "20px",
              outline: "none",
              "@media(min-width: 768px)": {
                width: "250px",
                padding: "0px 10px",
                borderRadius: "8px",
              },
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              background: state.isSelected ? "#4D4D4D" : "#373953",
              padding: "1px 12px",
              "@media(min-width: 768px)": {
                padding: "4px 24px",
              },
              ":hover": {
                background: "#4D4D4D",
                cursor: "pointer",
              },
            }),
            valueContainer: (baseStyles) => ({
              ...baseStyles,
              padding: "0px 8px",
            }),
            indicatorsContainer: (base) => ({
              ...base,
              height: "28px",
              "@media(min-width: 768px)": {
                height: "36px",
              },
            }),
          }}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
        />
        <Select
          onChange={(e: any) => {
            setRegisterValue({
              ...registerValue,
              id: e ? e.value : "",
            });
          }}
          isClearable={true}
          options={idOption}
          styles={{
            menu: (baseStyles) => ({
              ...baseStyles,
              background: "#373953",
              width: "120px",
            }),
            control: (baseStyles) => ({
              ...baseStyles,
              background: "transparent",
              border: "solid 1px #b13535",
              marginRight: "20px",
              borderRadius: "4px",
              width: "100%",
              minHeight: "22px",
              outline: "none",
              marginTop: "4px",
              "@media(min-width: 768px)": {
                width: "120px",
                padding: "0px 10px",
                borderRadius: "8px",
                marginTop: "0px",
              },
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              background: state.isSelected ? "#4D4D4D" : "#373953",
              padding: "1px 12px",
              "@media(min-width: 768px)": {
                padding: "4px 24px",
              },
              ":hover": {
                background: "#4D4D4D",
                cursor: "pointer",
              },
            }),
            valueContainer: (baseStyles) => ({
              ...baseStyles,
              padding: "0px 8px",
            }),
            indicatorsContainer: (base) => ({
              ...base,
              height: "28px",
              "@media(min-width: 768px)": {
                height: "36px",
              },
            }),
          }}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
        />
        <button
          className="bg-[#b13535] hover:bg-[#ec5151] py-[1px] md:py-[5px] md:rounded-lg rounded-sm  md:w-36 w-full mt-1 md:mt-0 md:text-xl text-base"
          disabled={!activeButton ? true : false}
          onClick={getInfo}
        >
          Get On-chain Fight Info
        </button>
      </div>
      <div className="mt-2 md:flex justify-between">
        {info ? (
          <>
            <div className="flex md:flex-col bg-[#ddaeae] rounded-md items-center p-2">
              <img
                className="md:rounded-t-md md:rounded-bl-none rounded-l-md w-24 md:w-64 mr-0"
                alt="nft"
                src={info?.img}
              />
              <div className="text-center md:mt-2 w-full text-gray-800">
                <p className="text-2xl">{info?.name}</p>
                <p className="text-3xl">Rank : {info?.rank}</p>
              </div>
            </div>
            <div className="md:w-[calc(100%_-_300px)] md:h-[352px] flex items-center justify-center bg-[#00000050] rounded-md md:mt-0 mt-2 p-5 md:p-0">
              {ape?.valid ? (
                <div className="w-full lg:px-20 md:px-10 lg:text-3xl md:text-2xl text-base">
                  <div className="grid grid-cols-2 text-gray-100">
                    <p className="md:py-2 py-1">Win : {ape?.win}</p>
                    <p className="md:py-2 py-1">
                      Last Fight On : {ape["last fight on"]}
                    </p>
                    <p className="md:py-2 py-1">Level : {ape?.level}</p>
                    <p className="md:py-2 py-1">
                      Tournament Wins : {ape["tournament wins"]}
                    </p>
                    <p className="md:py-2 py-1">Loss : {ape?.loss}</p>
                    <p className="md:py-2 py-1">
                      Training Days : {ape["training days"]}
                    </p>
                    <p className="md:py-2 py-1">Score : {ape?.score}</p>
                  </div>
                </div>
              ) : (
                <p className="text-center mt-2 md:mt-0">No Fight History</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-center">Please select the NFT</p>
        )}
      </div>
    </div>
  );
};

export default Fighter;
