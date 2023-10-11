/** @format */

import RegisterModal from "components/mobility/RegisterModal";
import { useState } from "react";

const Apes = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className='lg:px-10 md:px-5 p-3 bg-[#00000050] min-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_300px)] rounded-xl'>
      <div className='flex justify-end items-center md:mt-3 border-b-2 border-[#FF420050] pb-1'>
        <button
          className='bg-[#FF4200] py-1 rounded-lg ml-5 w-24 md:text-2xl text-base'
          onClick={() => {
            setOpen(!open);
          }}>
          Register
        </button>
      </div>
      <RegisterModal open={open} setOpen={setOpen} />
    </div>
  );
};
export default Apes;
