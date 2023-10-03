/** @format */

import BarInfo from "./BarInfo";
import Fighter from "./Fighter";
import { useLocation, useNavigate } from "react-router";
import { useWallet } from "hooks";
import toast from "react-hot-toast";
import "./bar.css";

const Bar = () => {
  const { pathname } = useLocation();
  const { address } = useWallet();
  const navigate = useNavigate();
  return (
    <div className='pawnshop text-gray-200 md:px-[10%] tracking-widest lg:px-[13%] p-3 md:pt-8 pt-4'>
      <div className='md:rounded-3xl rounded-lg bg-[#7a7c9e36] md:my-6 my-4 md:border-2 shadow-2xl  md:text-5xl text-2xl'>
        <div className='flex text-center'>
          <p
            className={`w-[50%] border-r-2 border-r-gray-200 md:pt-5 md:pb-3 pt-2 pb-1 md:border-b-8 border-b-4 cursor-pointer ${
              pathname === "/bar" ? "border-[#FF4200]" : "border-gray-200"
            }`}
            onClick={() => navigate("/bar")}>
            BAR
          </p>
          <p
            className={`w-[50%] md:pt-5 md:border-b-8 border-b-4 cursor-pointer md:pb-3 pt-2 pb-1 ${
              pathname !== "/bar" ? "border-[#FF4200]" : "border-gray-200"
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
    </div>
  );
};

export default Bar;
