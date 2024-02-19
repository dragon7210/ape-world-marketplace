/** @format */

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { setLoading } from "actions/loading";
import { pawn_address } from "config/contractAddress";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getEndTime, get_image, shortenAddress } from "utils";
import {
  claimLoanABI,
  grantLoanABI,
  removeItemABI,
  settleLoanABI,
} from "abi/abis";
import toast from "react-hot-toast";
import { useConnex, useWallet } from "@vechain/dapp-kit-react";
import { getName } from "@vechain.energy/dapp-kit-hooks";

const ViewLoanModal = ({
  open,
  setOpenModal,
  loanSel,
  setLoanSel,
}: {
  open: boolean;
  setOpenModal: any;
  loanSel: any;
  setLoanSel: any;
}) => {
  const { account } = useWallet();
  const connex = useConnex();
  const dispatch = useDispatch();

  const [state, setState] = useState<string>("Available for Loan");
  const [Button, setButton] = useState<any>();
  const [selData, setSelData] = useState<any>();
  const [ownerName, setOwnerName] = useState<string>();
  const [messiahName, setMessiahName] = useState<string>();

  useEffect(() => {
    (async () => {
      const temp = await get_image(loanSel?.tokenAddress, loanSel?.tokenId);
      setSelData(temp);
    })();
  }, [dispatch, loanSel]);

  const removeItem = useCallback(
    async ({ id }: { id: string }) => {
      try {
        const namedMethod = connex.thor
          .account(pawn_address)
          .method(removeItemABI);
        const clause = namedMethod.asClause(id);
        connex.vendor
          .sign("tx", [clause])
          .comment("Remove Item.")
          .request()
          .then(() => {
            dispatch(setLoading(false));
            setOpenModal(!open);
            toast.success("Removed successfully");
          })
          .catch(() => {
            dispatch(setLoading(false));
            setOpenModal(!open);
            toast.error("Could not remove Item.");
          });
      } catch (error) {
        console.log(error);
      }
    },
    [open, setOpenModal, dispatch]
  );

  const claimLoan = useCallback(
    async ({ id }: { id: string }) => {
      try {
        const namedMethod = connex.thor
          .account(pawn_address)
          .method(claimLoanABI);
        const clause = namedMethod.asClause(id);

        connex.vendor
          .sign("tx", [clause])
          .comment("Claim Loan.")
          .request()
          .then(() => {
            toast.success("Success");
            dispatch(setLoading(false));
            setLoanSel();
            setOpenModal(!open);
          })
          .catch(() => {
            dispatch(setLoading(false));
            setOpenModal(!open);
            setLoanSel();
            toast.error("Could not Claim Loan.");
          });
      } catch (error) {
        console.log(error);
      }
    },
    [open, setOpenModal, dispatch, setLoanSel]
  );

  const settleLoan = useCallback(
    async (loanSel: { itemId: string; loanValue: string; loanFee: string }) => {
      try {
        const { itemId, loanValue, loanFee } = loanSel;
        const realLoanValue =
          Math.round(
            (parseInt(loanValue) / 10 ** 18) * (100 + parseInt(loanFee))
          ) *
          10 ** 16;
        const namedMethod = connex.thor
          .account(pawn_address)
          .method(settleLoanABI);

        var clause = namedMethod.asClause(itemId);
        clause["value"] = realLoanValue.toString();
        connex.vendor
          .sign("tx", [clause])
          .comment("Settle Loan.")
          .request()
          .then(() => {
            setOpenModal(!open);
            dispatch(setLoading(false));
            setLoanSel();
            toast.success("Success");
          })
          .catch(() => {
            setOpenModal(!open);
            dispatch(setLoading(false));
            setLoanSel();
            toast.error("Could not Settle Loan.");
          });
      } catch (error) {
        console.log(error);
      }
    },
    [open, setOpenModal, dispatch, setLoanSel]
  );

  const grantLoan = useCallback(
    async ({ id, loanValue }: { id: string; loanValue: string }) => {
      try {
        const namedMethod = connex.thor
          .account(pawn_address)
          .method(grantLoanABI);
        var clause = namedMethod.asClause(id);

        clause["value"] = loanValue;

        connex.vendor
          .sign("tx", [clause])
          .comment("Grant Loan.")
          .request()
          .then(() => {
            toast.success("Grant loan successfully");
            dispatch(setLoading(false));
            setLoanSel();
            setOpenModal(!open);
          })
          .catch(() => {
            toast.error("Could not grant Loan.");
            dispatch(setLoading(false));
            setLoanSel();
            setOpenModal(!open);
          });
      } catch (error) {
        console.log(error);
      }
    },
    [open, setOpenModal, dispatch, setLoanSel]
  );

  useEffect(() => {
    if (loanSel?.status === "1") {
      setState("Available for Loan");
      if (loanSel?.owner === account) {
        setButton(
          <button
            className="bg-[#FF0000] py-1 rounded-lg w-24"
            onClick={() => {
              removeItem({ id: loanSel?.itemId });
              dispatch(setLoading(true));
            }}
          >
            REMOVE
          </button>
        );
      } else {
        setButton(
          <button
            className="bg-[#FF0000] py-1 rounded-lg w-24"
            onClick={() => {
              grantLoan({ id: loanSel?.itemId, loanValue: loanSel?.loanValue });
              dispatch(setLoading(true));
            }}
          >
            GRANT
          </button>
        );
      }
    } else if (loanSel?.status === "2") {
      setState("Currently on Loan");
      if (loanSel?.owner === account) {
        setButton(
          <button
            className="bg-[#FF0000] py-1 rounded-lg w-24"
            onClick={() => {
              settleLoan(loanSel);
              dispatch(setLoading(true));
            }}
          >
            SETTLE
          </button>
        );
      } else if (loanSel?.messiah === account) {
        setButton(
          <button
            className="bg-[#FF0000] py-1 rounded-lg w-24"
            onClick={() => {
              let date = getEndTime(loanSel?.endTime, connex.thor);
              if (date) {
                if (new Date(date) < new Date()) {
                  claimLoan({ id: loanSel?.itemId });
                  dispatch(setLoading(true));
                } else {
                  toast.error("Please wait until end time");
                }
              }
            }}
          >
            CLAIM
          </button>
        );
      } else {
        setButton(<></>);
      }
    }
  }, [
    loanSel,
    account,
    dispatch,
    claimLoan,
    grantLoan,
    settleLoan,
    removeItem,
  ]);

  useEffect(() => {
    if (connex && loanSel?.owner) {
      getName(loanSel.owner, connex).then(setOwnerName);
    }
  }, [connex, loanSel?.owner]);

  useEffect(() => {
    if (connex && loanSel?.messiah) {
      getName(loanSel.messiah, connex).then(setMessiahName);
    }
  }, [connex, loanSel?.messiah]);

  return (
    <Dialog
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm overflow-y-auto m-3 z-30"
      open={open}
      onClose={() => {}}
    >
      <div className="w-[270px] md:w-[720px] bg-gray-200 md:flex justify-between p-3 rounded-lg shadow-lg text-gray-600 shadow-gray-500 ">
        <div className="flex justify-end md:hidden">
          <XMarkIcon
            className="w-6 cursor-pointer hover:bg-gray-500 rounded-md"
            onClick={() => {
              setOpenModal(!open);
              setLoanSel();
            }}
          />
        </div>
        <img
          className="rounded-lg"
          src={selData?.img}
          alt="loanImg"
          onLoad={() => dispatch(setLoading(false))}
        />
        <div className="md:pt-0 pt-2">
          <div className="md:flex justify-end hidden">
            <XMarkIcon
              className="w-6 cursor-pointer hover:bg-gray-500 rounded-md"
              onClick={() => {
                setOpenModal(!open);
                setLoanSel();
              }}
            />
          </div>
          <div className="flex justify-between items-center ">
            <p className="md:text-3xl text-2xl mt-1 font-[700] text-black">
              {selData?.name}
            </p>
            <span className="bg-green-600 ml-1 text-gray-50 md:text-md text-sm px-3 py-1 rounded-xl">
              Rank {selData?.rank ? selData?.rank : "Any"}
            </span>
          </div>
          <div className="flex justify-between md:mt-1 md:text-base text-sm text-gray-100">
            <span className="bg-rose-700 rounded-md p-1 px-2">
              Item owner By{" "}
              {ownerName?.length ? ownerName : shortenAddress(loanSel?.owner)}
            </span>
            <span className="bg-violet-700 rounded-md p-1 px-2">{state}</span>
          </div>
          <div className="bg-gray-900 md:w-[430px] text-gray-100 md:px-5 md:py-2 p-2 mt-1 rounded-xl">
            <p className="md:text-xltext-sm">Details</p>
            <div className="md:columns-3 columns-2 md:px-5 px-2 text-base md:text-md">
              <div>
                <p className="text-gray-500">Ask Value</p>
                <p>{loanSel?.loanValue / 10 ** 18} VET</p>
              </div>
              <div>
                <p className="text-gray-500">Interest</p>
                <p>{loanSel?.loanFee} %</p>
              </div>
              <div>
                <p className="text-gray-500">Duration</p>
                <p>{loanSel?.duration} H</p>
              </div>
              <div>
                <p className="text-gray-500">Messiah</p>
                <p>
                  {loanSel?.status !== "1"
                    ? messiahName?.length
                      ? messiahName
                      : shortenAddress(loanSel?.messiah)
                    : "Not granted"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Start time</p>
                {loanSel?.status !== "1"
                  ? getEndTime(loanSel?.startTime, connex.thor)
                  : "Not granted"}
              </div>
              <div>
                <p className="text-gray-500">End time</p>
                {loanSel?.status !== "1"
                  ? getEndTime(loanSel?.endTime, connex.thor)
                  : "Not granted"}
              </div>
            </div>
          </div>
          <div className="flex md:text-lg text-base justify-end mt-1 text-gray-100">
            {Button}
            <button
              className="bg-[#FF4200] py-1 rounded-lg ml-5 w-24"
              onClick={() => {
                setOpenModal(!open);
                setLoanSel();
              }}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewLoanModal;
