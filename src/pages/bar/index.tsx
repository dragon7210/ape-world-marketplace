/** @format */

import BarImg from "assets/svg/apeworld//bar.svg";
import { useLocation, useNavigate } from "react-router";
import BorderImage from "assets/png/header/border.png";
import { useWallet } from "hooks";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Fighter from "./Fighter";
import Player from "./Player";

const Bar = () => {
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
    <div className='bg-gradient-to-t from-[#421313] to-[#421313cc] text-gray-200 md:px-[10%] tracking-widest lg:px-[13%] p-3 md:pt-40 pt-28 min-h-[100vh] relative'>
      <div className='md:text-5xl text-2xl relative z-20'>
        <div className='flex text-center'>
          <div className={`w-[50%]`} onClick={() => navigate("/bar")}>
            <p
              className={`mb-2 cursor-pointer border-r-2 border-[#762e1550] ${
                pathname === "/bar" ? "text-gray-100" : "text-[#491806]"
              }`}>
              BAR
            </p>
            {pathname === "/bar" && (
              <img className='w-full' src={BorderImage} alt='borderImg' />
            )}
          </div>
          <div
            className={`w-[50%]`}
            onClick={() => {
              if (address) {
                navigate("/bar/info");
              } else {
                toast.error("Please connect the Wallet");
              }
            }}>
            <p
              className={` mb-2 cursor-pointer ${
                pathname === "/bar/info" ? "text-gray-100" : "text-[#491806]"
              }`}>
              FIGHTER INFO
            </p>
            {pathname === "/bar/info" && (
              <img className='w-full' src={BorderImage} alt='borderImg' />
            )}
          </div>
        </div>
        {pathname === "/bar" ? <Player /> : <Fighter />}
      </div>
      <img
        className='absolute bottom-5 right-5 z-10 hidden md:inline opacity-50'
        src={BarImg}
        alt='pawnShop'
      />
    </div>
  );
};

export default Bar;
