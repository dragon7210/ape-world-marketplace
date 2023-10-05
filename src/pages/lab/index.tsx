/** @format */

import { useLocation, useNavigate } from "react-router";
import { useWallet } from "hooks";
import toast from "react-hot-toast";
import Market from "./Market";
import Call from "./Call";
import Put from "./Put";
import LabImg from "assets/svg/apeworld/lab.svg";
import BorderImage from "assets/png/header/border.png";

const Lab = () => {
  const { pathname } = useLocation();
  const { address } = useWallet();
  const navigate = useNavigate();
  return (
    <div className='bg-[#2260a9] pt-28 text-gray-200 md:px-[10%] lg:px-[13%] p-3 md:pt-44 min-h-[100vh]'>
      <div className='md:rounded-3xl rounded-lg md:text-5xl text-lg relative font-700 z-20'>
        <div className='flex text-center'>
          <div className={`w-[33%]`} onClick={() => navigate("/lab")}>
            <p
              className={`mb-2 cursor-pointer border-r-2 border-[#003366] ${
                pathname === "/lab" ? "text-gray-100" : "text-gray-900"
              }`}>
              OPTIONS MARKET
            </p>
            {pathname === "/lab" && <img src={BorderImage} alt='borderImg' />}
          </div>
          <div
            className={`w-[34%]`}
            onClick={() => {
              if (address) {
                navigate("/lab/call");
              } else {
                toast.error("Please connect the Wallet");
              }
            }}>
            <p
              className={` mb-2 cursor-pointer border-r-2 border-[#003366] ${
                pathname === "/lab/call" ? "text-gray-100" : "text-gray-900"
              }`}>
              WRITE A CALL OPTION
            </p>
            {pathname === "/lab/call" && (
              <img src={BorderImage} alt='borderImg' />
            )}
          </div>
          <div
            className={`w-[33%]`}
            onClick={() => {
              if (address) {
                navigate("/lab/put");
              } else {
                toast.error("Please connect the Wallet");
              }
            }}>
            <p
              className={`mb-2 cursor-pointer border-[#003366] ${
                pathname === "/lab/put" ? "text-gray-100" : "text-gray-900"
              }`}>
              WRITE A PUT OPTION
            </p>
            {pathname === "/lab/put" && (
              <img src={BorderImage} alt='borderImg' />
            )}
          </div>
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
