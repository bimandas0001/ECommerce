import React, {useContext} from 'react';

import './CSS/Cart.css';
import { CartItem } from '../Components/CartItem/CartItem'
import { ShopContext } from '../Context/ShopContext';
// import all_product from '../Components/Assets/all_product';

export const Cart = () => {
  const {cartItems, totalItemsInCart, totalAmount} = useContext(ShopContext);

  return (
    <div className='cart'>
      {
        Object.entries(cartItems).map(([key, value]) => {
          if(value > 0) {
            return <CartItem productId={key} count={value}/>
          }
        })
      }

      {/* Total count and amount */}
      {
        totalItemsInCart === 0 ? (
          <div className="no-item-dialouge"> <p> No item in cart </p> </div> 
        ) : (
          <>
          <div className="row-total">
            <div className="row-total-left">
                <p> Total </p>
            </div>
            <div className="row-total-count">
              <p>Count : {totalItemsInCart}</p>
            </div>
            <div className="row-total-price">
                <p>Amount : Rs. {totalAmount}</p>
            </div>
          </div>

          <div className="checkout">
            <button> Checkout </button>
          </div>
          </>
        )
      } 
    </div>
  )
}
