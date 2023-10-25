/** @format */

import AllLoan from "./AllLoan";
import CreateLoan from "./CreateLoan";
import PawnShopImg from "assets/svg/apeworld/shop.svg";
import { useLocation, useNavigate } from "react-router";
import BorderImage from "assets/png/header/border.png";
import { useWallet } from "hooks";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const PawnShop = () => {
  const { pathname } = useLocation();
  const { address } = useWallet();
  const navigate = useNavigate();
  const { collectionOptions } = useSelector((state: any) => state.collections);

  useEffect(() => {
    if (collectionOptions.length === 0) {
      navigate("/");
    }
  }, [collectionOptions, navigate]);

  return (
    <div className='bg-gradient-to-t from-[#771f00] to-[#c64b20] text-gray-200 md:px-[10%] tracking-widest lg:px-[13%] p-3 pt-24 flex items-center min-h-[100vh] relative'>
      <div className='md:text-5xl text-2xl relative z-20 w-full'>
        <div className='flex text-center'>
          <div className={`w-[50%]`} onClick={() => navigate("/shop")}>
            <p
              className={`mb-2 cursor-pointer border-r-2 border-[#762e1550] ${
                pathname === "/shop" ? "text-gray-100" : "text-[#491806]"
              }`}>
              ALL LOANS
            </p>
            {pathname === "/shop" && (
              <img className='w-full' src={BorderImage} alt='borderImg' />
            )}
          </div>
          <div
            className={`w-[50%]`}
            onClick={() => {
              if (address) {
                navigate("/shop/create");
              } else {
                toast.error("Please connect the Wallet");
              }
            }}>
            <p
              className={` mb-2 cursor-pointer ${
                pathname === "/shop/create" ? "text-gray-100" : "text-[#491806]"
              }`}>
              CREATE LOAN
            </p>
            {pathname === "/shop/create" && (
              <img className='w-full' src={BorderImage} alt='borderImg' />
            )}
          </div>
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
