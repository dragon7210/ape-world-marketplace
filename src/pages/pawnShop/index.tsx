/** @format */

import AllLoan from "./AllLoan";
import CreateLoan from "./CreateLoan";
import Star from "assets/svg/apeworld/star.svg";
import { useLocation, useNavigate } from "react-router";

import "./pawnShop.css";

const PawnShop = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <div className='pawnshop md:pt-10 text-white md:px-[10%] lg:px-[13%] p-3'>
      <div className='relative'>
        <p className='md:text-5xl text-3xl md:text-left text-center'>
          PAWN <span className='bg-[#38df37] px-2 rounded-lg'>SHOP</span>
        </p>
        <img
          className='md:top-[-25px] hidden md:inline absolute md:left-[410px]'
          alt='star'
          src={Star}
        />
      </div>
      <div className='text-white md:rounded-[35px] rounded-lg bg-[#AEAFBE36] md:my-8 my-4 md:border-8 border-[#565656AB] md:text-3xl text-md'>
        <div className='flex text-center'>
          <p
            className={`w-[50%] border-r-2 border-r-[#322A2A] md:pt-[30px] md:pb-3 pt-2 pb-1 md:border-b-8 border-b-4 cursor-pointer ${
              pathname === "/shop" ? "border-[#FF4200]" : "border-[#948E8E] "
            }`}
            onClick={() => navigate("/shop")}>
            ALL LOANS
          </p>
          <p
            className={`w-[50%] md:pt-[30px] md:border-b-8 border-b-4 cursor-pointer md:pb-3 pt-2 pb-1 ${
              pathname !== "/shop" ? "border-[#FF4200]" : "border-[#948E8E] "
            }`}
            onClick={() => navigate("/shop/create")}>
            CREATE LOAN
          </p>
        </div>
        {pathname === "/shop" ? <AllLoan /> : <CreateLoan />}
      </div>
    </div>
  );
};

export default PawnShop;
