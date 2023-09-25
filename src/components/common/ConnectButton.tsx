/** @format */

import { useMemo, useState, useCallback, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
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
        className='md:w-40 w-32 flex justify-center items-center md:py-2 py-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-md md:text-sm text-[10px] text-white font-bold'>
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
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'>
                <Dialog.Panel className='relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-gray-200 p-6 text-left align-middle shadow-xl transition-all'>
                  <div className='w-full flex flex-col items-center'>
                    <div
                      className='w-16 h-16 rounded-full flex justify-center items-center text-3xl bg-opacity-70'
                      style={{ backgroundColor: avatar.color }}>
                      {avatar.emoji}
                    </div>
                    <h5 className='text-xl font-bold mt-1'>
                      {shortenAddress(address)}
                    </h5>
                    <div className='flex w-full justify-center gap-4 items-center'>
                      <p className='text-md font-bold mt-1 uppercase text-gray-800'>
                        {(
                          Number((balance * 10000n) / ONE_ETH) / 10000
                        ).toString()}{" "}
                        VET
                      </p>
                      <p className='text-md font-bold mt-1 uppercase text-gray-800'>
                        {(
                          Number((energy * 10000n) / ONE_ETH) / 10000
                        ).toString()}{" "}
                        VTHO
                      </p>
                    </div>
                  </div>

                  <div className='mt-4 flex justify-around'>
                    <button
                      type='button'
                      className='inline-flex flex-col items-center justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      onClick={handleCopy}>
                      <Square2StackIcon className='w-6 h-6' />
                      Copy Address
                    </button>
                    <button
                      type='button'
                      className='inline-flex flex-col items-center justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      onClick={() => disconnect()}>
                      <ArrowRightOnRectangleIcon className='w-6 h-6' />
                      Disconnect
                    </button>
                  </div>

                  <button
                    type='button'
                    className='absolute top-4 right-4 inline-flex flex-col items-center justify-center rounded-full border border-transparent bg-blue-100 p-1 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                    onClick={() => setIsOpen(false)}>
                    <XMarkIcon className='w-6 h-6' />
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
