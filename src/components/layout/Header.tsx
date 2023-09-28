/** @format */

import { ConnectButton } from "components/common/ConnectButton";
import TwitterImage from "assets/svg/header/twitter.svg";
import DiscordImage from "assets/svg/header/discord.svg";
import FaceImage from "assets/svg/header/face.svg";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className='w-full h-24 bg-black fixed shadow-lg backdrop-blur-2xl flex justify-between items-center px-[5%]'>
      <div className='md:flex md:w-32 w-24 items-center hidden'>
        <a href='https://twitter.com/madvapesnft'>
          <img alt='twitter' src={TwitterImage} />
        </a>
        <a href='https://discord.gg/madvapesnft'>
          <img alt='discord' src={DiscordImage} />
        </a>
      </div>
      <div className='flex text-gray-200 items-center text-2xl uppercase'>
        <p
          className='cursor-pointer hover:text-[#FF4200] text-right w-32 hidden lg:inline mr-3'
          onClick={() => navigate("/")}>
          Ape World
        </p>
        <img alt='face' src={FaceImage} />
        <a href='https://marketplace.worldofv.art/collections'>
          <p className='cursor-pointer hover:text-[#FF4200]  hidden lg:inline'>
            Wov Marketplace
          </p>
        </a>
      </div>
      <ConnectButton />
    </div>
  );
};

export default Header;
