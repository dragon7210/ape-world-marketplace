/** @format */

import AllLoan from "./AllLoan";
import StarImg from "assets/svg/apeworld/star.svg";

const PawnShop = () => {
  return (
    <div className='md:px-40 px-3 pt-36 h-[100vh] bg-gradient-to-r from-[#092135] via-[#431E4D] to-[#170F37] text-white'>
      <div className='relative'>
        <p className='text-5xl md:text-left text-center'>
          PAWN <span className='bg-purple-600 px-2'>SHOP</span>
        </p>
        <img
          className='absolute top-[-25px] left-[405px]'
          alt='start'
          src={StarImg}
        />
      </div>
      <AllLoan />
    </div>
  );
};

export default PawnShop;
