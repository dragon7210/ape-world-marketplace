/** @format */

import BorderImage from "assets/png/header/border.png";
import { useState } from "react";
import Apes from "./Apes";
import Location from "./Location";

const Mobility = () => {
  const [tab, setTab] = useState<number>(0);

  return (
    <div className='bg-gradient-to-t from-[#771f00] to-[#c64b20] text-gray-200 md:px-[10%] tracking-widest lg:px-[13%] p-3 md:pt-40 pt-28 min-h-[100vh] relative'>
      <div className='md:text-5xl text-base tracking-normal relative z-20'>
        <div className='flex text-center'>
          <div className={`w-[50%]`} onClick={() => setTab(0)}>
            <p
              className={`mb-2 cursor-pointer border-r-2 border-[#762e1550] ${
                tab === 0 ? "text-gray-100" : "text-[#491806]"
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
                tab === 1 ? "text-gray-100" : "text-[#491806]"
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
    </div>
  );
};

export default Mobility;
