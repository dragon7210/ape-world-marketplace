/** @format */

import { useLocation, useNavigate } from "react-router";
import { useWallet } from "hooks";
import toast from "react-hot-toast";
import Market from "./Market";
import Call from "./Call";
import Put from "./Put";
import LabImg from "assets/png/lab/lab.png";
import BorderImage from "assets/png/header/border.png";

const Lab = () => {
  const { pathname } = useLocation();
  const { address } = useWallet();
  const navigate = useNavigate();
  return (
    <div className='bg-[#2260a9] pt-28 text-gray-200 md:px-[10%] tracking-widest lg:px-[13%] p-3 md:pt-32 min-h-[100vh]'>
      <div className='md:mb-4 mb-2 flex justify-center'>
        <span className='text-5xl tracking-widest text-center bg-[#00000050] w-[300px] py-2 rounded-[40px]'>
          LAB
        </span>
      </div>
      <div className='md:rounded-3xl rounded-lg bg-[#20202050] md:text-4xl text-2xl relative z-20'>
        <div className='flex text-center'>
          <p
            className={`w-[33%] md:pt-5 md:pb-3 pt-2 pb-1 cursor-pointer md:rounded-md rounded-sm ${
              pathname === "/lab" ? "text-gray-100" : "text-gray-900"
            }`}
            onClick={() => navigate("/lab")}>
            OPTIONS MARKET
            {pathname === "/lab" && <img src={BorderImage} alt='borderImg' />}
          </p>
          <p
            className={`w-[34%] md:pt-5 cursor-pointer md:pb-3 pt-2 pb-1 mx-1  md:rounded-md rounded-sm ${
              pathname === "/lab/call" ? "text-gray-100" : "text-gray-900"
            }`}
            onClick={() => {
              if (address) {
                navigate("/lab/call");
              } else {
                toast.error("Please connect the Wallet");
              }
            }}>
            WRITE A CALL OPTION
            {pathname === "/lab/call" && (
              <img src={BorderImage} alt='borderImg' />
            )}
          </p>
          <p
            className={`w-[33%] md:pt-5 cursor-pointer md:pb-3 pt-2 pb-1 md:rounded-md rounded-sm ${
              pathname === "/lab/put" ? "text-gray-100" : "text-gray-900"
            }`}
            onClick={() => {
              if (address) {
                navigate("/lab/put");
              } else {
                toast.error("Please connect the Wallet");
              }
            }}>
            WRITE A PUT OPTION
            {pathname === "/lab/put" && (
              <img src={BorderImage} alt='borderImg' />
            )}
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
