/** @format */

import { useState } from "react";
import AllLoan from "./AllLoan";
import CreateLoan from "./CreateLoan";

import "./pawnShop.css";

const PawnShop = () => {
  const [select, setSelect] = useState(0);
  return (
    <div className='pawnshop'>
      <p className='text-[70px] text-[#38df37] font-bold mx-[5%]'>PAWN SHOP</p>
      <div className='text-white rounded-[35px] bg-[#AEAFBE36] mx-[15%] my-[30px] border-8 border-[#565656AB]'>
        <div className='flex text-center text-[32px] font-[700]'>
          <p
            className={`w-[50%] border-r-2 border-r-[#322A2A] pt-[30px] pb-[15px] border-b-8 ${
              select === 0 ? "border-[#FF4200]" : "border-[#948E8E] "
            }`}
            onClick={() => setSelect(0)}>
            All Loans
          </p>
          <p
            className={`w-[50%] pt-[30px] border-b-8 cursor-pointer pb-[15px] ${
              select === 1 ? "border-[#FF4200]" : "border-[#948E8E] "
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
