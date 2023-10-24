/** @format */

import RegisterModal from "components/bar/RegisterModal";
import { setLoading } from "actions/loading";
import { useGetPlayers, useWallet } from "hooks";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { shortenAddress } from "utils";
import { TrashIcon } from "@heroicons/react/24/outline";
import { fight_address } from "config/contractAddress";
import { fightUnregisterABI } from "abi/abis";
import toast from "react-hot-toast";

const Player = () => {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { connex, address } = useWallet();
  const { players, loading, info } = useGetPlayers();

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  const unRegister = () => {
    if (connex) {
      dispatch(setLoading(true));
      const namedMethod = connex.thor
        .account(fight_address)
        .method(fightUnregisterABI);

      var clause = namedMethod.asClause();

      connex.vendor
        .sign("tx", [clause])
        .comment("Fight Unregister")
        .request()
        .then(() => {
          dispatch(setLoading(false));
          toast.success("Success");
        })
        .catch(() => {
          dispatch(setLoading(false));
          toast.error("Could not unregister.");
        });
    }
  };

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
      {players.length !== 0 ? (
        <div className='h-[calc(100vh_-_300px)] overflow-y-auto md:h-[calc(100vh_-_450px)]'>
          <p className='mt-2 text-3xl'>
            Current Players : {info?.registered + "/" + info?.players}
          </p>
          <table className='w-full md:text-xl text-base mt-2 tracking-wider'>
            <thead className='uppercase backdrop-blur-xl bg-[#0a0b1336]'>
              <tr className='text-center'>
                <th className='px-3 md:py-4 py-1 text-left'>Collection</th>
                <th className='hidden md:table-cell'>Id</th>
                <th className='hidden md:table-cell'>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {players.map((item: any, index: number) => (
                <tr
                  key={index}
                  className='border-b text-center backdrop-blur-sm'>
                  <td className='md:py-3 px-3 text-left'>{item?.collection}</td>
                  <td className='hidden md:table-cell'>{item?.id}</td>
                  <td className='hidden md:table-cell'>
                    {shortenAddress(item?.owner)}
                  </td>
                  <td>
                    <div className='flex items-center justify-center md:py-1 py-[1px]'>
                      {item?.owner === address && (
                        <button
                          className='bg-[#b13535] hover:bg-[#ec5151] md:p-[5px] p-[2px] rounded-[99px]'
                          onClick={unRegister}>
                          <TrashIcon className='md:w-6 w-4' />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='min-h-[calc(100vh_-_300px)] md:min-h-[calc(100vh_-_450px)]'>
          <p className='pt-5 text-2xl'>No Bars Data</p>
        </div>
      )}
      <RegisterModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default Player;
