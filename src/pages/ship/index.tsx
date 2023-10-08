/** @format */

import ShipImg from "assets/svg/apeworld/ship.svg";
import { useLocation, useNavigate } from "react-router";
import BorderImage from "assets/png/header/border.png";
import { useWallet } from "hooks";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import AllList from "./AllList";
import CreateRaffle from "./CreateRaffle";

const Ship = () => {
  const { pathname } = useLocation();
  const { address } = useWallet();
  const navigate = useNavigate();
  const { collectionOptions } = useSelector(
    (state: any) => state.collectionOptions
  );

  useEffect(() => {
    if (collectionOptions.length === 0) {
      navigate("/");
    }
  }, [collectionOptions, navigate]);

  return (
    <div className='bg-gradient-to-t from-[#322630] to-[#32263050] text-gray-200 md:px-[10%] tracking-widest lg:px-[13%] p-3 md:pt-40 pt-28 min-h-[100vh]'>
      <div className='md:text-5xl text-2xl relative z-20'>
        <div className='flex text-center'>
          <div className={`w-[50%]`} onClick={() => navigate("/ship")}>
            <p
              className={`mb-2 cursor-pointer border-r-2 border-[#762e1550] ${
                pathname === "/ship" ? "text-gray-100" : "text-[#491806]"
              }`}>
              ALL LISTS
            </p>
            {pathname === "/ship" && (
              <img className='w-full' src={BorderImage} alt='borderImg' />
            )}
          </div>
          <div
            className={`w-[50%]`}
            onClick={() => {
              if (address) {
                navigate("/ship/create");
              } else {
                toast.error("Please connect the Wallet");
              }
            }}>
            <p
              className={` mb-2 cursor-pointer ${
                pathname === "/ship/create" ? "text-gray-100" : "text-[#491806]"
              }`}>
              CREATE RAFFLE
            </p>
            {pathname === "/ship/create" && (
              <img className='w-full' src={BorderImage} alt='borderImg' />
            )}
          </div>
        </div>
        {pathname === "/ship" ? <AllList /> : <CreateRaffle />}
      </div>
      <img
        className='absolute bottom-5 right-5 z-10 hidden md:inline opacity-50'
        src={ShipImg}
        alt='pawnship'
      />
    </div>
  );
};

export default Ship;
