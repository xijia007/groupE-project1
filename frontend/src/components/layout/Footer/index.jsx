// import './Footer.css'
import { AiOutlineYoutube } from "react-icons/ai";
import { CiTwitter } from "react-icons/ci";
import { RiFacebookBoxLine } from "react-icons/ri";

function Footer() {
  return (
    <footer className="flex items-center justify-between p-4 bg-gray-800 text-white flex-nowrap py-5 px-10 gap-5 border-t border-gray-700">
      <div className="text-xs font-normal text-white order-1 flex-none text-left">
        ©2022 All Rights Reserved.
      </div>
      <div className="flex items-center gap-5 order-2 justify-center flex-none">
        <AiOutlineYoutube className="text-2xl text-white cursor-pointer transition-opacity duration-300 ease-in" />
        <CiTwitter className="text-2xl text-white cursor-pointer transition-opacity duration-300 ease-in" />
        <RiFacebookBoxLine className="text-2xl text-white cursor-pointer transition-opacity duration-300 ease-in" />
      </div>
      <div className="flex items-center flex-wrap gap-5 order-3 justify-end flex-none">
        <a
          href="#"
          className="text-xs font-normal text-white no-underline cursor-pointer transition-opacity duration-300 ease-in whitespace-nowrap"
        >
          Contact us
        </a>
        <a
          href="#"
          className="text-xs font-normal text-white no-underline cursor-pointer transition-opacity duration-300 ease-in whitespace-nowrap"
        >
          Privacy Policies
        </a>
        <a
          href="#"
          className="text-xs font-normal text-white no-underline cursor-pointer transition-opacity duration-300 ease-in whitespace-nowrap"
        >
          Help
        </a>
      </div>
    </footer>
  );
}

export default Footer;
