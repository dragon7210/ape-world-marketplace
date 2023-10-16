/** @format */

import BorderImage from "assets/png/header/border.png";
import { useEffect, useState } from "react";
import Apes from "./Apes";
import Location from "./Location";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MobilityImg from "assets/png/mobility.png";

const Mobility = () => {
  const [tab, setTab] = useState<number>(0);
  const navigate = useNavigate();
  const { collectionOptions } = useSelector((state: any) => state.collections);

  useEffect(() => {
    if (collectionOptions.length === 0) {
      navigate("/");
    }
  }, [collectionOptions, navigate]);

  return (
    <div className='bg-gradient-to-t from-[#005365] to-[#00d2ff] text-gray-200 md:px-[10%] tracking-widest lg:px-[13%] p-3 md:pt-40 pt-28 min-h-[100vh] relative'>
      <div className='md:text-5xl text-2xl tracking-normal relative z-20'>
        <div className='flex text-center'>
          <div className={`w-[50%]`} onClick={() => setTab(0)}>
            <p
              className={`mb-2 cursor-pointer border-r-2 border-[#00333350] ${
                tab === 0 ? "text-gray-100" : "text-[#003333]"
              }`}>
              YOUR APES
            </p>
            {tab === 0 && (
              <img className='w-full' src={BorderImage} alt='borderImg' />
            )}
          </div>
          <div className={`w-[50%]`} onClick={() => setTab(1)}>
            <p
              className={` mb-2 cursor-pointer ${
                tab === 1 ? "text-gray-100" : "text-[#003333]"
              }`}>
              LOCATION OVERVIEW
            </p>
            {tab === 1 && (
              <img className='w-full' src={BorderImage} alt='borderImg' />
            )}
          </div>
        </div>
        {tab === 0 ? <Apes /> : <Location />}
      </div>
      <img
        className='absolute bottom-0 right-0 z-10 hidden md:inline opacity-50'
        src={MobilityImg}
        alt='pawnShop'
      />
    </div>
  );
};

export default Mobility;
