import React, {useContext} from 'react';

import './CartItem.css';
import { ShopContext } from '../../Context/ShopContext';
import plus_icon from './../Assets/plus_icon.png';
import minus_icon from './../Assets/minus_icon.png';


export const CartItem = (props) => {
  const productId = props.productId;
  const {all_product, updateCartItems} = useContext(ShopContext);

  return (
    (all_product[productId] === undefined || all_product[productId].new_price === undefined) ? <></> :
    <div className='cart-item'>
        <div className="cart-item-row">
            <div className="cart-item-img">
            <img src={all_product[productId].image} alt="all_product[productId].image"/>
            </div>
            <div className="cart-item-name">
              <p> {all_product[productId].name} </p>
            </div>
            <div className="cart-item-price">
              <p> Rs. {all_product[productId].new_price} </p>
            </div>
            <div className="cart-item-count">
              <p> {props.count} item{props.count>1 ? 's':''} </p>
            </div>
            <div className="cart-item-total-price">
              <p> Rs. {all_product[productId].new_price * props.count} </p>
            </div>
            <div className="cart-item-count-change">
              <button onClick={()=>updateCartItems(productId, 1)}>
                <img src={plus_icon} alt="plus_icon" />
              </button>
              <button onClick={()=>updateCartItems(productId, -1)}>
                <img src={minus_icon} alt="minus_icon" />
              </button>
            </div>
      </div>
    </div>
  )
}
