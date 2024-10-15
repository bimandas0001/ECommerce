import React, {useState, useEffect, useContext} from 'react';
import { Link, useLocation } from 'react-router-dom';

import './Navbar.css';
import three_line from '/public/three_line.png';
import logo from '/public/logo.png';
import cross from '/public/cross_icon.png';
import cart_icon from '/public/cart_icon.png';

import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {
  const {totalItemsInCart} = useContext(ShopContext);
  const [menu, setMenu] = useState('shop');
  const [showSideMenu, setShowSideMenu] = useState(false);

  // setMenu() when the pages are visited
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    const lastSegment = path.split('/').filter(Boolean).pop();
    if(lastSegment === 'men' || lastSegment === 'women' || lastSegment === 'kids') {
      setMenu(lastSegment)
    }
  }, [location.pathname])

  return (
    <div className='navbar'>
        {/* Nav Left */}
        <div className="nav-left">
          <button className='menu-btn' onClick={()=>setShowSideMenu(true)}>
            <img src={three_line} />
          </button>

          <Link to='/' onClick={()=>setMenu('shop')}>
            <img src={logo} alt="logo"/>
          </Link>
        </div>

        {/* Nav Menus */}
        <div className="nav-mid">
          <ul>
            <li>
              <Link to='/men' onClick={()=>setMenu('men')}>
                Men
                {menu==='men' ? <hr/> : <></>}
              </Link>
            </li>
            <li>
              <Link to='/women' onClick={()=>setMenu('women')}>
                Women
                {menu==='women' ? <hr/> : <></>}
              </Link>
            </li>
            <li>
              <Link to='/kids' onClick={()=>setMenu('kids')}>
                Kids
                {menu==='kids' ? <hr/> : <></>}
              </Link>
            </li>
          </ul>
        </div>

        {/* Nav Right */}
        <div className="nav-right">
          {
            localStorage.getItem('auth-token') ?
              <Link to="#" className='login' onClick={()=>{localStorage.removeItem('auth-token'); localStorage.removeItem('isAdmin'); window.location.replace("/");}}>Log Out</Link> 
            :
              <Link to='/login' onClick={()=>setMenu("link")} className='login'>LogIn</Link>
          }
          <Link to='/cart' onClick={()=>setMenu("cart")} className="cart">
            <img src={cart_icon} alt="cart_icon" />
            <span className="cart-item-count"> {totalItemsInCart} </span>
          </Link>
        </div>

        {/* Side menu for mobile screen */}
        <div className={`side-menu-box ${showSideMenu ? 'show-sidemenu' : 'remove-sidemenu'}`}>
          <div>
            <Link className='sidemenu-logo' to='/' onClick={()=>{setMenu('shop');setShowSideMenu(false);}}>
              <img src={logo} alt="logo"/>
            </Link>

            <button className='sidemenu-cross' onClick={()=>setShowSideMenu(false)}>
              <img src={cross}/>
            </button>
            
            <ul className='menu-items'>
              <li className={menu==='men' && 'selected-menu'}>
                <Link to='/men' onClick={()=>{setMenu('men');setShowSideMenu(false);}}>
                  Men
                </Link>
              </li>
              <li className={menu==='women' && 'selected-menu'}>
                <Link to='/women' onClick={()=>{setMenu('women');setShowSideMenu(false);}}>
                  Women
                </Link>
              </li>
              <li className={menu==='kids' && 'selected-menu'}>
                <Link to='/kids' onClick={()=>{setMenu('kids');setShowSideMenu(false);}}>
                  Kids
                </Link>
              </li>
            </ul>
          </div>
        </div>
    </div>
  )
}

export default Navbar;