import './Header.css'

function Header() {
    return (
        <header className="site-header">
            <div className="site-header__brand">Product Management System</div>
            <div className="site-header__userAuth">
                 <div className='site-header_login'>Guest</div>
                 <div className='site-header_login'>SignIn/Login</div>
            </div>
  
        </header>
    )
}

export default Header;
