/** @format */

import AllLoan from "./AllLoan";
import CreateLoan from "./CreateLoan";
import PawnShopImg from "assets/png/apeworld/pawnshop/pawnShop.png";
import { useLocation, useNavigate } from "react-router";
import { useWallet } from "hooks";
import toast from "react-hot-toast";

import "./pawnShop.css";

const PawnShop = () => {
  const { pathname } = useLocation();
  const { address } = useWallet();
  const navigate = useNavigate();
  return (
    <div className='pawnshop text-gray-200 md:px-[10%] tracking-widest lg:px-[13%] p-3 md:pt-8 pt-4'>
      <div className='md:mb-4 mb-2'>
        <p className='md:text-[70px] text-5xl tracking-widest ml-5 text-center md:text-left'>
          PAWN <span className='bg-green-500 px-2 rounded-lg'>SHOP</span>
        </p>
      </div>
      <div className='md:rounded-3xl rounded-lg bg-[#7a7c9e36] md:text-5xl text-2xl relative z-20'>
        <div className='flex text-center'>
          <p
            className={`w-[50%] md:pt-5 md:pb-3 pt-2 pb-1 cursor-pointer md:rounded-tl-3xl rounded-tl-xl tracking-widest ${
              pathname === "/shop" ? "bg-[#FF4200]" : "bg-gray-700"
            }`}
            onClick={() => navigate("/shop")}>
            ALL LOANS
          </p>
          <p
            className={`w-[50%] md:pt-5 cursor-pointer md:pb-3 pt-2 pb-1 md:rounded-tr-3xl rounded-tr-xl tracking-widest ${
              pathname !== "/shop" ? "bg-[#FF4200]" : "bg-gray-700"
            }`}
            onClick={() => {
              if (address) {
                navigate("/shop/create");
              } else {
                toast.error("Please connect the Wallet");
              }
            }}>
            CREATE LOAN
          </p>
        </div>
        {pathname === "/shop" ? <AllLoan /> : <CreateLoan />}
      </div>
      <img
        className='absolute bottom-5 right-5 z-10 hidden md:inline opacity-50'
        src={PawnShopImg}
        alt='pawnShop'
      />
    </div>
  );
};

export default PawnShop;
