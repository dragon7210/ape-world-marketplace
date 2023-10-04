/** @format */

import { useLocation, useNavigate } from "react-router";
import { useWallet } from "hooks";
import toast from "react-hot-toast";
import Market from "./Market";
import Call from "./Call";
import Put from "./Put";
import LabImg from "assets/png/lab/lab.png";

const Lab = () => {
  const { pathname } = useLocation();
  const { address } = useWallet();
  const navigate = useNavigate();
  return (
    <div className='pawnshop text-gray-200 md:px-[10%] tracking-widest lg:px-[13%] p-3 md:pt-8 pt-4'>
      <div className='md:mb-4 mb-2'>
        <span className='md:text-[70px] text-5xl tracking-widest ml-5 text-center md:text-left bg-green-500 px-2 rounded-lg'>
          LAB
        </span>
      </div>
      <div className='md:rounded-3xl rounded-lg bg-[#7a7c9e36] md:text-5xl text-2xl relative z-20'>
        <div className='flex text-center'>
          <p
            className={`w-[33%] md:pt-5 md:pb-3 pt-2 pb-1 cursor-pointer md:rounded-md border-2 rounded-sm tracking-widest ${
              pathname === "/lab" ? "bg-[#FF4200]" : "bg-gray-700"
            }`}
            onClick={() => navigate("/lab")}>
            OPTIONS MARKET
          </p>
          <p
            className={`w-[34%] md:pt-5 cursor-pointer md:pb-3 pt-2 pb-1 mx-1 tracking-widest border-2  md:rounded-md rounded-sm ${
              pathname === "/lab/call" ? "bg-[#FF4200]" : "bg-gray-700"
            }`}
            onClick={() => {
              if (address) {
                navigate("/lab/call");
              } else {
                toast.error("Please connect the Wallet");
              }
            }}>
            WRITE A CALL OPTION
          </p>
          <p
            className={`w-[33%] md:pt-5 cursor-pointer md:pb-3 pt-2 pb-1 md:rounded-md rounded-sm tracking-widest border-2 ${
              pathname === "/lab/put" ? "bg-[#FF4200]" : "bg-gray-700"
            }`}
            onClick={() => {
              if (address) {
                navigate("/lab/put");
              } else {
                toast.error("Please connect the Wallet");
              }
            }}>
            WRITE A PUT OPTION
          </p>
        </div>
        {pathname === "/lab" ? (
          <Market />
        ) : pathname === "/lab/call" ? (
          <Call />
        ) : (
          <Put />
        )}
      </div>
      <img
        className='absolute bottom-5 right-5 z-10 hidden md:inline opacity-50'
        src={LabImg}
        alt='pawnShop'
      />
    </div>
  );
};

export default Lab;
