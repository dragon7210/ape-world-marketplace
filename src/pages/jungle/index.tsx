/** @format */
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setLoading } from "actions/loading";
import { mobility_address } from "config/contractAddress";
import { getApesFromLocationABI } from "abi/abis";
import { getCollectionName } from "utils";
import { EyeIcon } from "@heroicons/react/24/outline";
import Pagination from "components/common/Pagination";
import ViewModal from "components/mobility/ViewModal";
import JungleImg from "assets/svg/apeworld/jungle.svg";
import { useConnex } from "@vechain/dapp-kit-react";

const Jungle = () => {
  const { thor } = useConnex();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { collectionOptions } = useSelector((state: any) => state.collections);
  const [apes, setApes] = useState<any>([]);
  const [pageData, setPageData] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [ape, setApe] = useState<any>();

  useEffect(() => {
    if (collectionOptions.length === 0) {
      navigate("/");
    }
  }, [collectionOptions, navigate]);

  useEffect(() => {
    try {
      (async () => {
        if (thor) {
          dispatch(setLoading(true));
          const namedMethod = thor
            .account(mobility_address)
            .method(getApesFromLocationABI);
          const output = await namedMethod.call("Jungle");
          setApes(output.decoded["0"]);
          dispatch(setLoading(false));
        }
      })();
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  }, [thor, dispatch]);

  return (
    <div className="bg-gradient-to-t from-[#49c272] to-[#2fb356] text-gray-200 md:px-[10%] tracking-widest lg:px-[13%] p-3 min-h-[100vh] pt-24 relative flex items-center">
      <div className="md:text-5xl text-2xl relative z-20 bg-[#00000050] rounded-xl lg:px-10 md:px-5 px-3 py-8 w-full">
        {apes.length > 0 ? (
          <div className="h-[calc(100vh_-_300px)] overflow-y-auto md:h-[calc(100vh_-_450px)]">
            <table className="w-full md:text-xl text-base mt-2 tracking-wider">
              <thead className="uppercase backdrop-blur-xl bg-[#0a0b1336]">
                <tr className="text-center">
                  <th className="px-3 md:py-4 py-1 text-left">Collection</th>
                  <th className="table-cell">Id</th>
                  <th className="table-cell">Action</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((item: any, index: number) => (
                  <tr
                    key={index}
                    className="border-b text-center backdrop-blur-sm"
                  >
                    <td className="md:py-3 px-3 text-left">
                      {getCollectionName(collectionOptions, item?.tokenAddress)}
                    </td>
                    <td className="table-cell">{item?.tokenId}</td>
                    <td>
                      <div className="flex items-center justify-center md:py-1 py-[1px]">
                        <button
                          className="hover:bg-[#49c272] bg-[#2fb356] md:p-[5px] p-[2px] rounded-[99px]"
                          onClick={() => {
                            setOpen(!open);
                            setApe(item);
                            dispatch(setLoading(true));
                          }}
                        >
                          <EyeIcon className="md:w-6 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="min-h-[calc(100vh_-_300px)] md:min-h-[calc(100vh_-_450px)]">
            <p className="pt-5 text-2xl">No Jungle Data</p>
          </div>
        )}
        <Pagination data={apes} color="#2fb356" setPageData={setPageData} />
      </div>
      <img
        className="absolute bottom-5 right-5 z-10 hidden md:inline opacity-50"
        src={JungleImg}
        alt="jungle"
      />
      <ViewModal open={open} setOpen={setOpen} ape={ape} setApe={setApe} />
    </div>
  );
};

export default Jungle;
