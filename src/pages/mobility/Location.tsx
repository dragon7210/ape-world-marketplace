/** @format */

import { EyeIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { positions } from "constant";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCollectionName } from "utils";
import { mobility_address } from "config/contractAddress";
import { getApesFromLocationABI } from "abi/abis";
import Select from "react-select";
import Pagination from "components/common/Pagination";
import ViewModal from "components/mobility/ViewModal";
import { useConnex } from "@vechain/dapp-kit-react";

const Location = () => {
  const { thor } = useConnex();
  const [position, setPosition] = useState<string>("");
  const [apes, setApes] = useState<any[]>([]);
  const { collectionOptions } = useSelector((state: any) => state.collections);
  const [pageData, setPageData] = useState<any[]>([]);
  const [ape, setApe] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  const show = async () => {
    try {
      dispatch(setLoading(true));
      const namedMethod = thor
        .account(mobility_address)
        .method(getApesFromLocationABI);
      const output = await namedMethod.call(position);
      setApes(output.decoded["0"]);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  };

  return (
    <div className="lg:px-10 md:px-5 p-3 bg-[#00000050] min-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_300px)] rounded-xl">
      <div className="flex justify-end items-center md:mt-3 border-b-2 border-[#00d2ff50] pb-1 text-gray-200">
        <div className="w-[120px] md:text-xl text-sm">
          <Select
            onChange={(e: any) => {
              setPosition(e ? e.value : "");
            }}
            options={positions}
            isClearable={true}
            styles={{
              menu: (baseStyles) => ({
                ...baseStyles,
                background: "#373953",
              }),
              control: (baseStyles) => ({
                ...baseStyles,
                background: "transparent",
                border: "solid 1px #00a4c7",
                borderRadius: "4px",
                minHeight: "22px",
                outline: "none",
                "@media(min-width: 768px)": {
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
        </div>
        <button
          className="bg-[#00a4c7] hover:bg-[#00d2ff] py-[2px] md:py-[5px] md:rounded-lg rounded-sm ml-5 w-24 md:text-xl text-base"
          onClick={show}
        >
          SHOW
        </button>
      </div>
      {apes.length > 0 ? (
        <div className="h-[calc(100vh_-_250px)] overflow-y-auto md:h-[calc(100vh_-_400px)]">
          <table className="w-full md:text-xl text-base mt-2 tracking-wider">
            <thead className="uppercase backdrop-blur-xl bg-[#0a0b1336]">
              <tr className="text-center">
                <th className="px-3 md:py-4 py-1 text-left">Collection</th>
                <th className="table-cell">Id</th>
                <th className="table-cell">Action</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((item: any, index: number) => (
                <tr
                  key={index}
                  className="border-b text-center backdrop-blur-sm"
                >
                  <td className="md:py-3 px-3 text-left">
                    {getCollectionName(collectionOptions, item?.tokenAddress)}
                  </td>
                  <td className="table-cell">{item?.tokenId}</td>
                  <td>
                    <button
                      className="bg-[#00a4c7] hover:bg-[#00d2ff] md:p-[5px] p-[2px] rounded-[99px]"
                      onClick={() => {
                        setOpen(!open);
                        dispatch(setLoading(true));
                        setApe(item);
                      }}
                    >
                      <EyeIcon className="md:w-6 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="min-h-[calc(100vh_-_250px)] md:min-h-[calc(100vh_-_400px)]">
          <p className="pt-5 md:text-2xl text-xl">No Apes Data</p>
        </div>
      )}
      <Pagination data={apes} color="#00a4c7" setPageData={setPageData} />
      <ViewModal open={open} setOpen={setOpen} ape={ape} setApe={setApe} />
    </div>
  );
};
export default Location;
