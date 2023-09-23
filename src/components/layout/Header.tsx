/** @format */

import { ConnectButton } from "components/common/ConnectButton";
import TwitterImage from "assets/svg/header/twitter.svg";
import DiscordImage from "assets/svg/header/discord.svg";
import FaceImage from "assets/svg/header/face.svg";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className='w-full h-24 bg-[#14151B59] backdrop-blur-md flex justify-between items-center md:px-40 px-3 fixed'>
      <div className='md:flex items-center hidden'>
        <a href='https://www.twitter.com/'>
          <img alt='twitter' src={TwitterImage} />
        </a>
        <a href='https://discord.gg/'>
          <img alt='discord' src={DiscordImage} />
        </a>
      </div>
      <div className='flex text-white items-center text-xl uppercase'>
        <p
          className='cursor-pointer hover:text-[#FF4200] w-[200px] text-right hidden md:inline'
          onClick={() => navigate("/")}>
          Ape World
        </p>
        <img alt='face' src={FaceImage} className='px-6' />
        <a href='https://marketplace.worldofv.art/collections'>
          <p className='cursor-pointer hover:text-[#FF4200] w-[200px]  hidden md:inline'>
            Wov Marketplace
          </p>
        </a>
      </div>
      <ConnectButton />
    </div>
  );
};

export default Header;
