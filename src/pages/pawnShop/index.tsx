/** @format */

import { useState } from "react";
import AllLoan from "./AllLoan";
import CreateLoan from "./CreateLoan";

import "./pawnShop.css";

const PawnShop = () => {
  const [select, setSelect] = useState(0);
  return (
    <div className='pawnshop'>
      <p className='text-[70px] text-white text-center font-bold'>Pawn Shop</p>
      <div className='text-white rounded-[35px] bg-[#373C6C78] mx-[15%] my-[10px] border-8 border-[#464040] '>
        <div className='flex '>
          <p
            className={`text-[32px] font-[700] w-[50%] text-center border-r-2 pt-[30px] pb-[15px] border-b-4 cursor-pointer ${
              select === 0 ? "border-[#FF4200]" : "border-[#322A2A] "
            }`}
            onClick={() => setSelect(0)}>
            All Loans
          </p>
          <p
            className={`text-[32px] font-[700] w-[50%] text-center pt-[30px] border-b-4 cursor-pointer pb-[15px] ${
              select === 1 ? "border-[#FF4200]" : "border-[#322A2A] "
            }`}
            onClick={() => setSelect(1)}>
            Create Loan
          </p>
        </div>
        <div className='main-body'>
          {select === 0 ? <AllLoan /> : <CreateLoan />}
        </div>
      </div>
    </div>
  );
};

export default PawnShop;
