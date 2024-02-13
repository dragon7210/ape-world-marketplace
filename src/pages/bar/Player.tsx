/** @format */

import { setLoading } from "actions/loading";
import { useGetPlayers } from "hooks";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCollectionName, shortenAddress } from "utils";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { fight_address } from "config/contractAddress";
import toast from "react-hot-toast";
import { useConnex, useWallet } from "@vechain/dapp-kit-react";
import { fightUnregisterABI } from "abi/abis";
import ViewModal from "components/mobility/ViewModal";
import RegisterModal from "components/bar/RegisterModal";

const Player = () => {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { account } = useWallet();
  const { thor, vendor } = useConnex();
  const { players, loading, info } = useGetPlayers();
  const [openView, setOpenView] = useState<boolean>(false);
  const [ape, setApe] = useState<any>();
  const { collectionOptions } = useSelector((state: any) => state.collections);

  const unRegister = () => {
    try {
      dispatch(setLoading(true));
      const namedMethod = thor
        .account(fight_address)
        .method(fightUnregisterABI);

      var clause = namedMethod.asClause();

      vendor
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading, dispatch]);

  return (
    <div className="lg:px-10 md:px-5 p-3 bg-[#00000050] min-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_300px)] rounded-xl">
      <div className="flex justify-end items-center md:mt-3 border-b-2 border-[#b13535] pb-1">
        <button
          className="bg-[#b13535] hover:bg-[#ec5151] py-[1px] md:py-[5px] rounded-lg w-24 md:text-xl text-base"
          onClick={() => {
            setOpen(!open);
          }}
        >
          Register
        </button>
      </div>
      {players.length !== 0 ? (
        <div className="h-[calc(100vh_-_250px)] overflow-y-auto md:h-[calc(100vh_-_400px)]">
          <p className="mt-2 md:text-3xl text-xl">
            Current Players : {info?.registered + "/" + info?.players}
          </p>
          <table className="w-full md:text-xl text-base mt-2 tracking-wider">
            <thead className="uppercase backdrop-blur-xl bg-[#0a0b1336]">
              <tr className="text-center">
                <th className="px-3 md:py-4 py-1 text-left">Collection</th>
                <th className="hidden md:table-cell">Id</th>
                <th className="hidden md:table-cell">Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {players.map((item: any, index: number) => (
                <tr
                  key={index}
                  className="border-b text-center backdrop-blur-sm"
                >
                  <td className="md:py-3 px-3 text-left">
                    {getCollectionName(collectionOptions, item?.tokenAddress)}
                  </td>
                  <td className="hidden md:table-cell">{item?.tokenId}</td>
                  <td className="hidden md:table-cell">
                    {shortenAddress(item?.owner)}
                  </td>
                  <td>
                    <div className="flex items-center justify-center md:py-1 py-[1px]">
                      <button
                        className="bg-[#b13535] hover:bg-[#ec5151] md:p-[5px] p-[2px] rounded-[99px]"
                        onClick={() => {
                          setOpenView(!openView);
                          dispatch(setLoading(true));
                          setApe(item);
                        }}
                      >
                        <EyeIcon className="md:w-6 w-4" />
                      </button>
                      {item?.owner === account && (
                        <button
                          className="bg-[#b13535] hover:bg-[#ec5151] md:p-[5px] p-[2px] rounded-[99px] ml-2"
                          onClick={unRegister}
                        >
                          <TrashIcon className="md:w-6 w-4" />
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
        <div className="min-h-[calc(100vh_-_250px)] md:min-h-[calc(100vh_-_400px)]">
          <p className="pt-5 md:text-2xl text-xl">No Bars Data</p>
        </div>
      )}
      <RegisterModal open={open} setOpen={setOpen} />
      <ViewModal
        open={openView}
        setOpen={setOpenView}
        ape={ape}
        setApe={setApe}
      />
    </div>
  );
};

export default Player;
