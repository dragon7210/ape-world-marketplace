/** @format */

import { getApesFromLocationABI } from "abi/abis";
import { mobility_address } from "config/contractAddress";
import { positions } from "constant";
import { useWallet } from "hooks";
import { useState } from "react";
import Select from "react-select";

const Location = () => {
  const { connex } = useWallet();
  const [position, setPosition] = useState<string>("");

  const show = async () => {
    if (connex) {
      const namedMethod = connex.thor
        .account(mobility_address)
        .method(getApesFromLocationABI);

      const output = await namedMethod.call(position);
      console.log(output);
    }
  };
  return (
    <div className='lg:px-10 md:px-5 p-3 bg-[#00000050] min-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_300px)] rounded-xl'>
      <div className='flex justify-end items-center md:mt-3 border-b-2 border-[#FF420050] pb-1 text-gray-200'>
        <div className='w-[120px] md:text-xl text-sm'>
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
                border: "solid 1px #BEBEBE",
                borderRadius: "8px",
                padding: "0px 10px",
                outline: "none",
              }),
              option: (baseStyles, state) => ({
                ...baseStyles,
                background: state.isSelected ? "#4D4D4D" : "#373953",
                padding: "4px 24px",
                ":hover": {
                  background: "#4D4D4D",
                  cursor: "pointer",
                },
              }),
              valueContainer: (baseStyles) => ({
                ...baseStyles,
                padding: "0px 8px",
              }),
            }}
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
          />
        </div>
        <button
          className='bg-[#FF4200] py-[7px] md:py-[5px] rounded-lg ml-5 w-24 md:text-xl text-base'
          onClick={show}>
          SHOW
        </button>
      </div>
    </div>
  );
};
export default Location;
