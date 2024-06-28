import React, {useContext, useState} from 'react';
import { useParams } from 'react-router-dom';

import './CSS/Product.css';
import { ShopContext } from '../Context/ShopContext';

export const Product = () => {
  const {all_product, cartItems, updateCartItems, totalItemsInCart} = useContext(ShopContext);
  const {productId} = useParams();
  
  let prod;
  all_product.map((item) => {
    if(item.id == productId) {
      prod = item;
    }
  })

  return (
    <div className="product-page">
      <div className="product-show">
        <div className="left">
          <img src={prod.image} alt="prod.image" />
        </div>
        <div className="right">
          <p className='name'>{prod.name}</p>
          <p className='old-price'> {prod.old_price} </p>
          <p className='new-price'> {prod.new_price} </p>
          <button className='add-to-cart-btn' onClick={()=>updateCartItems(productId, 1)}>
            Add to Cart 
            <span className="current-item-added-to-cart-count"> {cartItems[productId] ?? 0} </span>
          </button>
        </div>
      </div>
    </div>
  )
}
