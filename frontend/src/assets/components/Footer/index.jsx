import './Footer.css'
import { AiOutlineYoutube } from "react-icons/ai";
import { CiTwitter } from "react-icons/ci";
import { RiFacebookBoxLine } from "react-icons/ri";


function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-footer-copyright">©2022 All Rights Reserved.</div>
            <div className='site-footer-social'>
                <AiOutlineYoutube className='social-icon'/>
                <CiTwitter className='social-icon'/>
                <RiFacebookBoxLine className='social-icon'/>
            </div>
            <div className='site-footer-links'>
                <a href="#" className='footer-link'>Contact us</a>
                <a href="#" className='footer-link'>Privacy Policies</a>
                <a href="#" className='footer-link'>Help</a>
            </div>
        </footer>
    )
}

export default Footer;