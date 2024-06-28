import React, {useState, useEffect, useContext} from 'react';
import { Link, useLocation } from 'react-router-dom';

import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { ShopContext } from '../../Context/ShopContext';

export const Navbar = () => {
  const {totalItemsInCart} = useContext(ShopContext);
  const [menu, setMenu] = useState('shop');

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
        <div className="nav-left">
          <Link to='/' onClick={()=>setMenu('shop')}>
            <img src={logo} alt="logo"/>
          </Link>
        </div>
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
        <div className="nav-right">
          {
            localStorage.getItem('auth-token') ?
              <Link to="#" className='login' onClick={()=>{localStorage.removeItem('auth-token'); window.location.replace("/");}}>Log Out</Link> 
            :
              <Link to='/login' onClick={()=>setMenu("link")} className='login'>LogIn</Link>
          }
          <Link to='/cart' onClick={()=>setMenu("cart")} className="cart">
            <img src={cart_icon} alt="cart_icon" />
            <span className="cart-item-count"> {totalItemsInCart} </span>
          </Link>
        </div>
    </div>
  )
}
