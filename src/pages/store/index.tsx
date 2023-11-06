/** @format */

import { useLocation, useNavigate } from "react-router";
import { useWallet } from "hooks";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import BorderImage from "assets/png/header/border.png";
import StoreImg from "assets/svg/apeworld/store.svg";
import toast from "react-hot-toast";
import AllList from "./AllList";
import CreateTrading from "./CreateTrading";

const Store = () => {
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
    <div className='bg-gradient-to-t from-[#268297] to-[#00c4ee] text-gray-200 md:px-[10%] tracking-widest lg:px-[13%] p-3 pt-24 flex items-center min-h-[100vh] relative'>
      <div className='md:text-5xl text-2xl relative z-20 w-full'>
        <div className='flex text-center'>
          <div className={`w-[50%]`} onClick={() => navigate("/store")}>
            <p
              className={`mb-2 cursor-pointer border-r-2 border-[#762e1550] ${
                pathname === "/store" ? "text-gray-100" : "text-gray-800"
              }`}>
              ALL LISTS
            </p>
            {pathname === "/store" && (
              <img className='w-full' src={BorderImage} alt='borderImg' />
            )}
          </div>
          <div
            className={`w-[50%]`}
            onClick={() => {
              if (address) {
                navigate("/store/create");
              } else {
                toast.error("Please connect the Wallet");
              }
            }}>
            <p
              className={` mb-2 cursor-pointer ${
                pathname === "/store/create" ? "text-gray-100" : "text-gray-800"
              }`}>
              CREATE TRADING
            </p>
            {pathname === "/store/create" && (
              <img className='w-full' src={BorderImage} alt='borderImg' />
            )}
          </div>
        </div>
        {pathname === "/store" ? <AllList /> : <CreateTrading />}
      </div>
      <img
        className='absolute bottom-5 right-5 z-10 hidden md:inline opacity-50'
        src={StoreImg}
        alt='store'
      />
    </div>
  );
};

export default Store;
