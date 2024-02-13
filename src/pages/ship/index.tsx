/** @format */

import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import toast from "react-hot-toast";
import ShipImg from "assets/svg/apeworld/ship.svg";
import BorderImage from "assets/png/header/border.png";
import AllList from "./AllList";
import CreateRaffle from "./CreateRaffle";
import { useWallet } from "@vechain/dapp-kit-react";

const Ship = () => {
  const { pathname } = useLocation();
  const { account } = useWallet();
  const navigate = useNavigate();
  const { collectionOptions } = useSelector((state: any) => state.collections);

  useEffect(() => {
    if (collectionOptions.length === 0) {
      navigate("/");
    }
  }, [collectionOptions, navigate]);

  return (
    <div className="bg-gradient-to-t from-[#944200] to-[#f8a866] text-gray-200 md:px-[10%] tracking-widest lg:px-[13%] p-3 pt-24 flex items-center min-h-[100vh] relative">
      <div className="md:text-5xl text-2xl relative z-20 w-full">
        <div className="flex text-center">
          <div className={`w-[50%]`} onClick={() => navigate("/ship")}>
            <p
              className={`md:mb-2 mt-1 cursor-pointer border-r-2 border-[#653300] ${
                pathname === "/ship" ? "text-gray-100" : "text-[#653300]"
              }`}
            >
              ALL LISTS
            </p>
            {pathname === "/ship" && (
              <img className="w-full" src={BorderImage} alt="borderImg" />
            )}
          </div>
          <div
            className={`w-[50%]`}
            onClick={() => {
              if (account) {
                navigate("/ship/create");
              } else {
                toast.error("Please connect the Wallet");
              }
            }}
          >
            <p
              className={`md:mb-2 mt-1 cursor-pointer ${
                pathname === "/ship/create" ? "text-gray-100" : "text-[#653300]"
              }`}
            >
              CREATE RAFFLE
            </p>
            {pathname === "/ship/create" && (
              <img className="w-full" src={BorderImage} alt="borderImg" />
            )}
          </div>
        </div>
        {pathname === "/ship" ? <AllList /> : <CreateRaffle />}
      </div>
      <img
        className="absolute bottom-5 right-5 z-10 hidden md:inline opacity-50"
        src={ShipImg}
        alt="ship"
      />
    </div>
  );
};

export default Ship;
