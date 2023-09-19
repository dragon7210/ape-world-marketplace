/** @format */

import { useState } from "react";
import AllLoan from "./AllLoan";
import CreateLoan from "./CreateLoan";

import "./pawnShop.css";

const PawnShop = () => {
  const [select, setSelect] = useState(0);
  return (
    <div className='pawnshop p-3'>
      <p className='md:text-[70px] text-[#38df37] font-bold mx-[5%] text-[50px] text-center'>
        PAWN SHOP
      </p>
      <div className='text-white md:rounded-[35px] rounded-lg bg-[#AEAFBE36] md:mx-[15%] md:my-[30px] md:border-8 border-[#565656AB]'>
        <div className='flex text-center md:text-[32px] text-[24px] font-[700]'>
          <p
            className={`w-[50%] border-r-2 border-r-[#322A2A] md:pt-[30px] md:pb-3 pt-2 pb-1 md:border-b-8 border-b-4 cursor-pointer ${
              select === 0 ? "border-[#FF4200]" : "border-[#948E8E] "
            }`}
            onClick={() => setSelect(0)}>
            All Loans
          </p>
          <p
            className={`w-[50%] md:pt-[30px] md:border-b-8 border-b-4 cursor-pointer md:pb-3 pt-2 pb-1 ${
              select === 1 ? "border-[#FF4200]" : "border-[#948E8E] "
            }`}
            onClick={() => setSelect(1)}>
            Create Loan
          </p>
        </div>
        <div>{select === 0 ? <AllLoan /> : <CreateLoan />}</div>
      </div>
    </div>
  );
};

export default PawnShop;
