/** @format */

import { useMemo, useState, useCallback, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "react-hot-toast";
import copy from "copy-to-clipboard";
import {
  ArrowRightOnRectangleIcon,
  Square2StackIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useWallet } from "hooks";
import { shortenAddress } from "utils";
import { emojiAvatarForAddress } from "utils/emojiAvatar";
import WalletImage from "assets/png/header/wallet.png";
import { ONE_ETH } from "config/chain";
import { useNavigate } from "react-router-dom";

export const ConnectButton = () => {
  const {
    isConnected,
    isConnecting,
    address,
    connect,
    balance,
    energy,
    disconnect,
  } = useWallet();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const avatar = useMemo(() => emojiAvatarForAddress(address!), [address]);

  const handleConnect = useCallback(async () => {
    let toastId;
    try {
      toastId = toast.loading("Connecting Wallet");
      await connect();
      toast.success("Successfully connected");
    } catch (err: any) {
      toast.error(err?.message ?? err?.reason);
    } finally {
      toast.dismiss(toastId);
    }
  }, [connect]);

  const handleCopy = useCallback(() => {
    if (!address) {
      return;
    }

    copy(address);
    toast.success("Copied address to clipboard");
  }, [address]);

  useEffect(() => {
    if (!isConnected) {
      setIsOpen(false);
    }
  }, [isConnected]);

  return (
    <>
      <button
        type='button'
        disabled={isConnecting}
        onClick={!isConnected ? handleConnect : () => setIsOpen(true)}>
        {isConnecting ? (
          <div className='relative'>
            <img className='md:w-40 w-24' src={WalletImage} alt='wallet' />
            <p className='absolute md:top-[6px] md:left-8 md:text-3xl text-xl top-[2px] left-[14px] text-gray-100'>
              isConnecting
            </p>
          </div>
        ) : isConnected ? (
          <div className='relative'>
            <img className='md:w-40 w-24' src={WalletImage} alt='wallet' />
            <p className='absolute md:top-[6px] md:left-8 md:text-3xl text-xl top-[2px] left-4 text-gray-100'>
              {shortenAddress(address)}
            </p>
          </div>
        ) : (
          <div className='relative'>
            <img className='md:w-40 w-24' src={WalletImage} alt='wallet' />
            <p className='absolute md:top-[6px] md:left-12 md:text-3xl text-xl top-[2px] left-6 text-gray-100'>
              Connect
            </p>
          </div>
        )}
      </button>
      <Dialog
        open={isOpen}
        onClose={() => {}}
        className='fixed inset-0 flex items-center justify-center tracking-widest transition-all z-30'>
        <div className='w-[260px] bg-white py-8 px-6 rounded-lg relative'>
          <button
            type='button'
            className='absolute top-2 right-2 inline-flex flex-col items-center justify-center rounded-full border border-transparent bg-blue-100 p-1 text-sm font-medium text-blue-900 hover:bg-blue-200 '
            onClick={() => setIsOpen(false)}>
            <XMarkIcon className='w-6 h-6' />
          </button>
          <div className='flex justify-center'>
            <div
              className='w-16 h-16 rounded-full flex justify-center items-center text-3xl bg-opacity-70'
              style={{ backgroundColor: avatar.color }}>
              {avatar.emoji}
            </div>
          </div>
          <h5 className='text-xl text-center font-bold mt-1'>
            {shortenAddress(address)}
          </h5>
          <div className='flex w-full justify-center gap-4 items-center'>
            <p className='text-md font-bold mt-1 uppercase text-gray-800'>
              {(Number((balance * 10000n) / ONE_ETH) / 10000).toString()} VET
            </p>
            <p className='text-md font-bold mt-1 uppercase text-gray-800'>
              {(Number((energy * 10000n) / ONE_ETH) / 10000).toString()} VTHO
            </p>
          </div>
          <div className='mt-4 flex justify-between'>
            <button
              className='inline-flex flex-col items-center justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 w-24'
              onClick={handleCopy}>
              <Square2StackIcon className='w-6 h-6' />
              Copy Address
            </button>
            <button
              className='inline-flex flex-col items-center justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 w-24'
              onClick={() => disconnect()}>
              <ArrowRightOnRectangleIcon className='w-6 h-6' />
              Disconnect
            </button>
          </div>
          <button
            className='rounded-md border bg-blue-100 py-2 text-blue-900 hover:bg-blue-400 w-full mt-2 tracking-wider'
            onClick={() => {
              navigate("/mobility");
              setIsOpen(!isOpen);
            }}>
            GO TO MOBILITY PAGE
          </button>
        </div>
      </Dialog>
    </>
  );
};
