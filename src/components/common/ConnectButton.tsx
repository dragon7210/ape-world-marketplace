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
import { ONE_ETH } from "config/chain";

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
        onClick={!isConnected ? handleConnect : () => setIsOpen(true)}
        className='md:w-32 w-24 flex justify-center items-center md:py-[6px] py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl md:text-xl text-base text-white border-2'>
        {isConnecting ? (
          "Connecting ..."
        ) : isConnected ? (
          <div className='flex items-center justify-center gap-2'>
            <div
              className='w-6 h-6 rounded-full flex justify-center items-center text-sm bg-opacity-70'
              style={{ backgroundColor: avatar.color }}>
              {avatar.emoji}
            </div>
            {shortenAddress(address)}
          </div>
        ) : (
          "Connect"
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
        </div>
      </Dialog>
    </>
  );
};
