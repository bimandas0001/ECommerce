// import all_product from './../Components/Assets/all_product';
import React, {createContext, useState, useEffect} from 'react';
import { toast } from 'react-toastify';

export const ShopContext = createContext(null);

// Cart items
export const ShopContextProvider = (props) => {
  const [all_product, setAllProduct] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [totalItemsInCart, setTotalItemsInCart] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch All products.
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BE_URL}/allproducts`)
    .then(response => response.json())
    .then(data => setAllProduct(data))
    .catch((err)=> {toast.error(`Failed to fetch products data. \nPlease Reload the page.`)})
  }, [])

  // useEffect(()=> {
  //   console.log(all_product)
  // }, all_product)

  // Fetch Cart items (of logged in user).
  useEffect( async () => {
    if(localStorage.getItem("auth-token") !== null) {
      await fetch(`${import.meta.env.VITE_BE_URL}/getcartitems`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          'Content-type': "application/json",
          'auth-token': localStorage.getItem("auth-token")
        }
      })
      .then(response => response.json())
      .then(data => {
        if(data.success === true) {
          setCartItems(data.cartItems) 
        }
        else {
          toast.error(data.error)
        }
      })
      .catch(err => toast.error(`Failed to fetch your cart details. \nPlease Reload the page.`))
    }
  }, [])

  useEffect(()=> {
    let totalItems = 0, amount = 0;
    Object.entries(cartItems).forEach(([itemId, count]) => {
      if(all_product[itemId] !== undefined && all_product[itemId].new_price !== undefined) {
        totalItems += count ?? 0;
        amount += all_product[itemId].new_price * (count !== undefined ? count : 0);
      }
    })

    setTotalItemsInCart(Math.max(0, totalItems))
    setTotalAmount(Math.max(0, amount))
  }, [cartItems])
  
  async function updateCartItems(itemId, change) { // countChange = +1/-1
    fetch(`${import.meta.env.VITE_BE_URL}/updatecart`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "content-type": "application/json",
        "auth-token": localStorage.getItem("auth-token") 
      },
      body: JSON.stringify({itemId, change})
    })
    .then(response => response.json())
    .then(data => {
      if(data.success === true) {
        setCartItems(data.updatedCart)
      }
      else   toast.error(data.error)
    })
    .catch(err => toast.error("Unable to update cart items. Please try again."))
  }
  
  const contextValue = {all_product, cartItems, updateCartItems, totalItemsInCart, totalAmount};

  return (
    <ShopContext.Provider value={contextValue}>
        {props.children}
    </ShopContext.Provider>
  )
}