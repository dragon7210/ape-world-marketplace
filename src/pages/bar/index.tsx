/** @format */

import BarInfo from "./BarInfo";
import Fighter from "./Fighter";
import { useLocation, useNavigate } from "react-router";
import { useWallet } from "hooks";
import toast from "react-hot-toast";
import BarImg from "assets/png/apeworld/bar/bar.png";
import "./bar.css";

const Bar = () => {
  const { pathname } = useLocation();
  const { address } = useWallet();
  const navigate = useNavigate();
  return (
    <div className='pawnshop text-gray-200 md:px-[10%] tracking-widest lg:px-[13%] p-3 md:pt-8 pt-4'>
      <div className='md:rounded-3xl rounded-lg bg-[#7a7c9e36] md:my-6 my-4 md:border-2 shadow-2xl  md:text-5xl text-2xl relative z-20'>
        <div className='flex text-center'>
          <p
            className={`w-[50%] md:pt-5 md:pb-3 pt-2 pb-1 md:rounded-tl-3xl rounded-tl-xl cursor-pointer tracking-widest ${
              pathname === "/bar" ? "bg-[#931217]" : "bg-gray-700"
            }`}
            onClick={() => navigate("/bar")}>
            BAR
          </p>
          <p
            className={`w-[50%] md:pt-5 cursor-pointer md:pb-3 md:rounded-tr-3xl rounded-tr-xl pt-2 pb-1 tracking-widest  ${
              pathname !== "/bar" ? "bg-[#931217]" : "bg-gray-700"
            }`}
            onClick={() => {
              if (address) {
                navigate("/bar/fighter");
              } else {
                toast.error("Please connect the Wallet");
              }
            }}>
            FIGHTER
          </p>
        </div>
        {pathname === "/bar" ? <BarInfo /> : <Fighter />}
      </div>
      <img
        className='absolute bottom-5 right-5 z-10 hidden md:inline opacity-50'
        src={BarImg}
        alt='bar'
      />
    </div>
  );
};

export default Bar;
