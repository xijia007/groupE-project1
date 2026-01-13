import './Header.css'
import { FaRegUser } from 'react-icons/fa'
import { MdOutlineShoppingCart } from 'react-icons/md'

function Header() {
    return (
        <header className="site-header">
            <div className="site-header-brand">Product Management System</div>
            <div className='site-header-search'>
                <input
                    placeholder='Search'
                />
            </div>
            <div className="site-header-userAuth">
                 <div className='site-header-userInfo'><FaRegUser /></div>
                 <div className='site-header-login'>SignIn/SignOut</div>
            </div>
             <div className='site-header-shoppingcart'>
                <MdOutlineShoppingCart />
            </div>
  
        </header>
    )
}

export default Header;
