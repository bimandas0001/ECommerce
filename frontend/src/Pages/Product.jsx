import React, {useContext} from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

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

  // Delete product
  async function deleteProduct(productId) {
    await fetch(`${import.meta.env.VITE_BE_URL}/removeproduct`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        "auth-token": localStorage.getItem('auth-token')
      },
      body: JSON.stringify({id: productId})
    })
    .then(response => response.json())
    .then(data => {
      if(data.success)    toast.success("Product deleted")
      else    toast.error(data.error)
    })
    .catch(() => toast.error("Error from server. Try again"))
  }

  return (
    <div className="product-page">
      <div className="product-show">
        <div className="left">
          <img src={prod.image} alt="prod.image" />
        </div>
        <div className="right">
          <div className="product-details">
            <p className='product-name'> {prod.name} </p>
            <div className="product-price">
              <p className='product-new-price-line'> 
                Price : <span className='product-new-price'> {prod.new_price} </span> 
                <span className='product-discount'> 
                  { Math.floor((prod.old_price - prod.new_price) / prod.old_price * 100)}% off 
                </span></p>
              <p className='product-old-price-line'> Old price : <span> {prod.old_price} </span> </p>
            </div>
          </div>

          <button className='add-to-cart-btn' onClick={()=>updateCartItems(productId, 1)}>
            Add to Cart
            <span className="current-item-added-to-cart-count"> {cartItems[productId] ?? 0} </span>
          </button>
          {localStorage.getItem("isAdmin") &&
            <button className='product-delete-btn' onClick={()=> confirm("Delete the product ?") && deleteProduct(productId) }>
              Delete Item
            </button>
          }
        </div>
      </div>
    </div>
  )
}
