import './Footer.css'
import { AiOutlineYoutube } from "react-icons/ai";
import { CiTwitter } from "react-icons/ci";
import { RiFacebookBoxLine } from "react-icons/ri";


function Footer() {
    return (
        <>
        <footer className="site-footer">
            <div className="site-footer-copyright">@2022 All Rights Reserved</div>
            <div className='site-footer-image'>
                <AiOutlineYoutube className='site-footer-space'/>
                <CiTwitter className='site-footer-space'/>
                <RiFacebookBoxLine className='site-footer-space'/>

            </div>

             <div className='site-footer-contact'>
                <button className='site-footer-space' title="Contact us">Contact us</button>
                <button className='site-footer-space'>Privacy Policies</button>
                <button className='site-footer-space'>Help</button>
            </div>
  
        </footer>
        </>
    )
}

export default Footer;