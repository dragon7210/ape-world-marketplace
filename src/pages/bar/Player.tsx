/** @format */

import RegisterModal from "components/bar/RegisterModal";
import { setLoading } from "actions/loading";
import { useGetPlayers } from "hooks";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Player = () => {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { players, loading, info } = useGetPlayers();

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  console.log(players, info);
  return (
    <div className='lg:px-10 md:px-5 p-3 bg-[#00000050] min-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_300px)] rounded-xl'>
      <div className='flex justify-end items-center md:mt-3 border-b-2 border-[#b13535] pb-1'>
        <button
          className='bg-[#b13535] hover:bg-[#ec5151] py-[1px] md:py-[5px] rounded-lg w-24 md:text-xl text-base'
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

export default Player;
