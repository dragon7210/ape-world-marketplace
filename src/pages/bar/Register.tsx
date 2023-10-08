/** @format */

import RegisterModal from "components/bar/RegisterModal";
import { useWallet } from "hooks";
import { useState } from "react";
import toast from "react-hot-toast";

const Register = () => {
  const { address } = useWallet();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className='lg:px-10 md:px-5 p-3 bg-[#00000050] min-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_300px)] rounded-xl'>
      <div className='flex justify-end items-center md:mt-3 border-b-2 pb-1'>
        <button
          className='bg-[#FF4200] py-1 rounded-lg ml-5 w-24 md:text-2xl text-base'
          onClick={() => {
            if (address) {
              setOpen(!open);
            } else {
              toast.error("Please connect the Wallet");
            }
          }}>
          Register
        </button>
      </div>
      <RegisterModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default Register;
