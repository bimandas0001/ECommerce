import all_product from './../Components/Assets/all_product';
import React, {createContext, useState, useEffect} from 'react';
export const ShopContext = createContext(null);

// Cart items
export const ShopContextProvider = (props) => {
  // const [all_product, setAllProduct] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [totalItemsInCart, setTotalItemsInCart] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch All products.
  // useEffect(() => {
  //   fetch("http://localhost:4000/allproducts")
  //   .then(response => response.json())
  //   .then(data => {
  //     // Set the image path.
  //     data.forEach(item => {
  //       item.image = "http://localhost:4000/images/" + item.image;
  //     })
  //     setAllProduct(data)
  //   })
  //   .catch((err)=> {alert(`${err} \nReload the page`)})
  // }, [])

  // Fetch Cart items (of logged in user).
  useEffect( async () => {
    if(localStorage.getItem("auth-token") !== null) {
      await fetch("http://localhost:4000/getcartitems", {
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
          alert(data.error)
        }
      })
      .catch(err => alert(`${err} \nReload the page.`))
    }
  }, [])

  useEffect(()=> {
    let totalItems = 0, amount = 0;
    Object.entries(cartItems).forEach(([itemId, count]) => {
      totalItems += count ?? 0;
      amount += all_product[itemId].new_price * (count !== undefined ? count : 0);
    })
    setTotalItemsInCart(Math.max(0, totalItems))
    setTotalAmount(Math.max(0, amount))
  }, [cartItems])
  
  async function updateCartItems(itemId, change) { // countChange = +1/-1
    fetch("http://localhost:4000/updatecart", {
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
      else   alert(data.error)
    })
    .catch(err => alert("Unable to update cart items. Please try again."))
  }
  
  const contextValue = {all_product, cartItems, updateCartItems, totalItemsInCart, totalAmount};
  
  return (
    <ShopContext.Provider value={contextValue}>
        {props.children}
    </ShopContext.Provider>
  )
}