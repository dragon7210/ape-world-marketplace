/** @format */

import { ConnectButton } from "components/common/ConnectButton";
import { useNavigate } from "react-router-dom";
import { Bars4Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useCustomQuery, useWallet } from "hooks";
import { getCollections } from "utils/query";
import { useDispatch } from "react-redux";
import { setconnectedCollections } from "actions/collections";
import TwitterImage from "assets/png/header/twiter.png";
import DiscordImage from "assets/png/header/discord.png";
import FaceImage from "assets/svg/header/face.svg";

const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const { address } = useWallet();
  const dispatch = useDispatch();

  const collectionOptions = useCustomQuery({
    query: getCollections,
    variables: { ownerAddress: address },
  });

  useEffect(() => {
    const temp = collectionOptions?.collections.filter((item: any) => {
      return (
        item.name !== ("Lickers" || "StonerPunksOfficialNFT" || "MVA The HiVe")
      );
    });
    dispatch(setconnectedCollections(temp));
  }, [dispatch, collectionOptions]);

  return (
    <div className='w-full h-24 bg-[#00000050] fixed shadow-lg backdrop-blur-2xl flex justify-between items-center px-[5%] z-30'>
      <div className='flex items-center'>
        <a href='https://twitter.com/madvapesnft'>
          <img alt='twitter' src={TwitterImage} className='w-12 md:w-16' />
        </a>
        <a href='https://discord.gg/madvapesnft'>
          <img alt='discord' src={DiscordImage} className='w-12 md:w-16' />
        </a>
      </div>
      <div className='flex text-gray-200 items-center text-2xl uppercase'>
        <p
          className='cursor-pointer hover:text-[#FF4200] text-right w-32 hidden md:inline mr-3'
          onClick={() => navigate("/")}>
          Ape World
        </p>
        <img alt='face' src={FaceImage} />
        <a href='https://marketplace.worldofv.art/collections'>
          <p className='cursor-pointer hover:text-[#FF4200]  hidden md:inline'>
            Wov Marketplace
          </p>
        </a>
      </div>
      <div className='flex items-center'>
        <ConnectButton />
        <Bars4Icon
          className='md:hidden w-8 cursor-pointer'
          color='white'
          onClick={() => setOpen(!open)}
        />
      </div>
      <Dialog
        open={open}
        onClose={() => {}}
        className='fixed inset-0 tracking-widest transition-all text-gray-500 text-3xl z-30'>
        <div className='bg-[#000000ee] w-full h-[100vh] p-[5%]'>
          <div className='flex justify-end'>
            <XMarkIcon
              onClick={() => setOpen(!open)}
              className='w-8 cursor-pointer hover:text-gray-100 '
            />
          </div>
          <p
            className='py-2 cursor-pointer hover:text-gray-100'
            onClick={() => {
              navigate("/");
              setOpen(!open);
            }}>
            Ape World
          </p>
          <p className='py-2 cursor-pointer hover:text-gray-100'>
            <a
              href='https://marketplace.worldofv.art/collections'
              onClick={() => setOpen(!open)}
              className='outline-none'>
              Wov Marketplace
            </a>
          </p>
        </div>
      </Dialog>
    </div>
  );
};

export default Header;
