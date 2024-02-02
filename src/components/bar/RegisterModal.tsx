/** @format */

import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setLoading } from "actions/loading";
import { useGetApes } from "hooks/useGetApes";
import { useGetPlayers, useWallet } from "hooks";
import {
  fight_address,
  mobility_address,
  mva_token_address,
} from "config/contractAddress";
import {
  fightRegisterABI,
  getApeABI,
  getWorldInfoABI,
  moveToABI,
  mvaApproveABI,
  worldRegisterABI,
} from "abi/abis";
import toast from "react-hot-toast";
import InputSelect from "components/common/InputSelect";

const RegisterModal = ({ open, setOpen }: { open: boolean; setOpen: any }) => {
  const dispatch = useDispatch();
  const { thor, vendor } = useWallet();
  const [activeButton, setActiveButton] = useState(false);
  const [collectionOption, setCollectionOption] = useState<any>([]);
  const [idOption, setIdOption] = useState<any>([]);
  const [registerValue, setRegisterValue] = useState<{
    [key: string]: string;
  }>({
    collectionId: "",
    id: "",
  });
  const { apes, loading } = useGetApes();
  const { info } = useGetPlayers();
  const { collectionOptions } = useSelector((state: any) => state.collections);

  useEffect(() => {
    dispatch(setLoading(loading));
  }, [dispatch, loading]);

  useEffect(() => {
    const objectName = Object.keys(registerValue);
    const areAllValuesValid = objectName.every(
      (item) => registerValue[item] !== "" && registerValue[item] !== "0"
    );
    setActiveButton(areAllValuesValid);
  }, [registerValue]);

  useEffect(() => {
    const temp = apes.map((item: any) => item.tokenAddress);
    const data = [...new Set(temp)]?.map((item: any) => {
      const temp = collectionOptions.filter(
        (list: any) =>
          list.smartContractAddress?.toLowerCase() === item?.toLowerCase()
      )[0];
      return {
        value: temp.collectionId,
        name: temp.name,
        label: (
          <div className="flex items-center md:text-base">
            <img
              src={temp.thumbnailImageUrl}
              alt={temp.name}
              className="rounded-[99px] mr-3 w-7 h-7"
            />
            <p className="m-0 text-white">{temp.name}</p>
          </div>
        ),
      };
    });
    setCollectionOption(data);
  }, [collectionOptions, apes]);

  useEffect(() => {
    const temp = collectionOptions.filter(
      (list: any) =>
        list.collectionId?.toLowerCase() ===
        registerValue?.collectionId?.toLowerCase()
    )[0];

    const temp1 = apes?.filter((item: any) => {
      return (
        item?.tokenAddress?.toLowerCase() ===
        temp?.smartContractAddress?.toLowerCase()
      );
    });

    const temp2 = temp1.map((item: any) => {
      return {
        value: item.tokenId,
        label: (
          <div className="flex items-center md:text-base">
            <p className="m-0 text-white">{item.tokenId}</p>
          </div>
        ),
      };
    });
    setIdOption(temp2);
  }, [registerValue, apes, collectionOptions]);

  const handle = () => {
    try {
      dispatch(setLoading(true));
      if (thor) {
        (async () => {
          const namedMethod1 = thor
            .account(fight_address)
            .method(fightRegisterABI);
          const namedMethod2 = thor
            .account(mobility_address)
            .method(worldRegisterABI);
          const namedMethod3 = thor.account(mobility_address).method(moveToABI);
          const namedMethod4 = thor
            .account(mva_token_address)
            .method(mvaApproveABI);
          const namedMethod = thor.account(mobility_address).method(getApeABI);

          const temp = collectionOptions.filter(
            (item: any) => item.collectionId === registerValue.collectionId
          )[0];

          const output = await namedMethod.call(
            temp?.smartContractAddress,
            registerValue?.id
          );
          const _ape = {
            owner: output?.decoded[0][0],
            location: output?.decoded[0][1],
            lastMoveOn: output?.decoded[0][2],
            freeMoves: output?.decoded[0][3],
            paidMoves: output?.decoded[0][4],
            lastReset: output?.decoded[0][5],
          };

          var clauses = [];
          var moveClause;
          var payClause;

          const infoMethod = thor
            .account(mobility_address)
            .method(getWorldInfoABI);
          const _price = await infoMethod.call();
          const price = _price["decoded"]["0"][0];

          if (_ape["lastMoveOn"] === 0) {
            clauses.push(
              namedMethod2.asClause(
                temp?.smartContractAddress,
                registerValue?.id
              )
            );
            clauses.push(
              namedMethod3.asClause(
                temp?.smartContractAddress,
                registerValue?.id,
                "Bar"
              )
            );
            toast.error("You are going to be registered in Ape World.");
          } else if (_ape["location"] !== "Bar" && _ape["freeMoves"] > 0) {
            clauses.push(
              namedMethod3.asClause(
                temp?.smartContractAddress,
                registerValue?.id,
                "Bar"
              )
            );
            toast.error(
              "You are going to be automatically moved FREELY to the Bar."
            );
          } else if (_ape["location"] !== "Bar" && _ape["paidMoves"] > 0) {
            moveClause = namedMethod3.asClause(
              temp?.smartContractAddress,
              registerValue?.id,
              "Bar"
            );
            payClause = namedMethod4.asClause(mobility_address, price);
            clauses.push(payClause);
            clauses.push(moveClause);
            toast.error(
              "You are going to be automatically moved to the Bar for 1 VET because you don't have free moves."
            );
          }

          var register_clause = namedMethod1.asClause(
            temp?.smartContractAddress,
            registerValue?.id
          );
          payClause = namedMethod4.asClause(fight_address, info["price"]);
          clauses.push(payClause);
          clauses.push(register_clause);

          vendor
            .sign("tx", clauses)
            .comment("Fight Register")
            .request()
            .then(() => {
              toast.success("Success");
              dispatch(setLoading(false));
              setOpen(!open);
            })
            .catch(() => {
              toast.error("Could not register.");
              dispatch(setLoading(false));
              setOpen(!open);
            });
        })();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm overflow-y-auto m-3 z-30 "
      open={open}
      onClose={() => {}}
    >
      <div className="p-3 rounded-lg shadow-lg bg-gray-200 shadow-gray-500 w-[350px] md:w-[450px]">
        <div className="flex justify-end ">
          <XMarkIcon
            className="w-6 cursor-pointer hover:bg-gray-500 rounded-md"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="text-gray-200">
          <p className="text-center md:text-5xl text-4xl text-gray-800 mb-2">
            Welcome to the APE-world!
          </p>
          <div className="bg-gray-800 md:p-4 p-2 rounded-lg md:mx-[30px]">
            <InputSelect
              label="Collection"
              onChange={(e) => {
                setRegisterValue({
                  ...registerValue,
                  collectionId: e ? e.value : "",
                });
              }}
              options={collectionOption}
            />
            <InputSelect
              label="Id"
              onChange={(e) => {
                setRegisterValue({
                  ...registerValue,
                  id: e ? e.value : "",
                });
              }}
              options={idOption}
            />
          </div>
          <div className="flex md:text-xl text-base justify-end mt-2 text-white md:px-[30px]">
            <button
              className={`border-2 border-[#00a4c7]  py-1 rounded-lg mr-5 w-24  ${
                activeButton ? "bg-[#00a4c7] text-white" : "text-[#00a4c7]"
              }`}
              onClick={handle}
              disabled={!activeButton}
            >
              REGISTER
            </button>
            <button
              className="bg-[#FF0000] py-1 rounded-lg w-24"
              onClick={() => setOpen(!open)}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default RegisterModal;
