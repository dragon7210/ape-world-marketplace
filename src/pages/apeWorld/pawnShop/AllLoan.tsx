/** @format */

import Spinner from "components/common/Spinner";
import { useGetLoanData } from "hooks";
import { useState } from "react";

const AllLoan = () => {
  const { loanData, myLoanData, loading } = useGetLoanData();
  const [selector, setSelector] = useState(true);

  const data = selector ? loanData : myLoanData;

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
      <div className='mt-5'>
        {data.length > 0
          ? data.map((item: any, index: number) => (
              <div key={index}>{item.owner}</div>
            ))
          : "No Loan Data"}
      </div>
      <Spinner loading={loading} />
    </div>
  );
};

export default AllLoan;
