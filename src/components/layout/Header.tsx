/** @format */

import { ConnectButton } from "components/common/ConnectButton";
import TwitterImage from "assets/svg/header/twitter.svg";
import DiscordImage from "assets/svg/header/discord.svg";
import FaceImage from "assets/svg/header/face.svg";
import { useNavigate } from "react-router-dom";
import { Bars4Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Dialog } from "@headlessui/react";

const Header = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className='w-full h-24 bg-black shadow-lg backdrop-blur-2xl flex justify-between items-center px-[5%]'>
      <div className='flex w-36 items-center'>
        <a href='https://twitter.com/madvapesnft'>
          <img alt='twitter' src={TwitterImage} />
        </a>
        <a href='https://discord.gg/madvapesnft'>
          <img alt='discord' src={DiscordImage} />
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
          className='md:hidden w-12 cursor-pointer px-2'
          color='white'
          onClick={() => setOpen(!open)}
        />
      </div>
      <Dialog
        open={open}
        onClose={() => {}}
        className='fixed inset-0 tracking-widest transition-all text-gray-500 text-3xl'>
        <div className='bg-black w-full h-[100vh] p-[5%]'>
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
              onClick={() => setOpen(!open)}>
              Wov Marketplace
            </a>
          </p>
        </div>
      </Dialog>
    </div>
  );
};

export default Header;
