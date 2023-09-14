import { ConnectButton } from "components/common/ConnectButton";
import TwitterImage from "assets/svg/twitter.svg";
import DiscordImage from "assets/svg/discord.svg";
import FaceImage from "assets/svg/face.svg";

const Header = () => {
  return (
    <div className="w-full h-24 shadow shadow-gray-700 bg-[black] flex justify-between items-center px-20">
      <div className="flex items-center">
        <a href='https://www.twitter.com/'>
          <img alt="twitter" src={TwitterImage} />
        </a>
        <a href='https://discord.gg/'>
          <img alt="discord" src={DiscordImage} />
        </a>
      </div>
      <div className="flex text-white items-center text-xl" >
        <p className="cursor-pointer hover:text-[red]">ApeWorld</p>
        <img alt="face" src={FaceImage} className="px-6" />
        <a href='https://marketplace.worldofv.art/collections'>
          <p className="cursor-pointer hover:text-[red]">Wov Marketplace</p>
        </a>
      </div>
      <ConnectButton />
    </div>
  );
};

export default Header;
