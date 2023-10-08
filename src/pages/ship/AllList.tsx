/** @format */

import { useState } from "react";

const AllList = () => {
  const [tab, setTab] = useState<number>(0);
  return (
    <div className='lg:px-10 md:px-5 p-3 bg-[#00000050] min-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_300px)] rounded-xl'>
      <div className='flex justify-end items-center md:mt-3 border-b-2 pb-1 md:text-2xl text-base'>
        <button
          className={`lg:px-5 md:py-1 px-2 rounded-l-[99px] w-[200px] ${
            tab === 0 ? "bg-[#ff4200]" : "bg-[#c43300]"
          }`}
          onClick={() => setTab(0)}>
          List Live Auctions
        </button>
        <button
          className={`lg:px-5 md:py-1 px-2 w-[200px] border-x-2 ${
            tab === 1 ? "bg-[#ff4200]" : "bg-[#c43300]"
          }`}
          onClick={() => setTab(1)}>
          List All My Auctions
        </button>
        <button
          className={`lg:px-5 md:py-1 px-2 rounded-r-[99px] w-[200px] ${
            tab === 2 ? "bg-[#ff4200]" : "bg-[#c43300]"
          }`}
          onClick={() => setTab(2)}>
          List Concluded Auctions
        </button>
      </div>
    </div>
  );
};

export default AllList;
