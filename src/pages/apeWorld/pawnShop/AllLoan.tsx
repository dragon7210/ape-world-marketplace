/** @format */

import { useGetLoanData } from "hooks";
import { useEffect, useState } from "react";

const AllLoan = () => {
  const [selector, setSelector] = useState(true);
  const data = useGetLoanData();
  console.log(data);
  return (
    <div className='p-10'>
      <div className='flex justify-between item-center'>
        <p className='text-[32px]'>Here are {selector ? "All" : "My"} Items</p>
        <div className='flex'>
          <button
            className={`text-[20px] px-[32px] py-[16px]  rounded-[9px] mr-[28px] ${
              selector ? "bg-[#FF4200]" : "bg-[#F67D53]"
            }`}
            onClick={() => setSelector(true)}>
            List All Items
          </button>
          <button
            className={`text-[20px] px-[32px] py-[16px]  rounded-[9px] mr-[28px] ${
              !selector ? "bg-[#FF4200]" : "bg-[#F67D53]"
            }`}
            onClick={() => setSelector(false)}>
            List My Items
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllLoan;
