import React, {useState, useContext} from 'react'
import { ShopContext } from '../Context/ShopContext.jsx';
import { toast } from 'react-toastify';
import './CSS/Admin.css';

const Admin = () => {
  const {all_product} = useContext(ShopContext);
  const [formData, setFormData] = useState({})

  function handleFormData(e) {
    let {name, value, type, files} = e.target;
    setFormData({...formData, [name]: type==='file' ? files[0] : value})
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let fd = new FormData();
    fd.append('product-image', formData.productimage)
    Object.entries(formData).forEach(([name, val]) => {
      fd.append(name, val)
    })

    await fetch(`${import.meta.env.VITE_BE_URL}/addproduct`, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem('auth-token')
      },
      body: fd
    })
    .then(response => response.json())
    .then(data => {
      if(data.success)    toast.success("Product added")
      else    toast.error(data.error)
    })
    .catch(() => toast.error("Error from server. Try again"))
  }

  return (
    <div className="admin">
      <h1>Welcome Admin</h1>
      <h3>If you are not an admin then you can't perform any operation here.</h3>
      {/* Add product form */}
      <div className="add-product">
        <form>
          <label>Name</label>
          <input type="text" name='name' placeholder='Name' required onChange={handleFormData}/>

          <label>Category</label>
          <select name="category" onChange={handleFormData}>
            <option value="" disabled selected>Select a category</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>

          <label>New Price</label>
          <input type="number" name='new_price' placeholder='New price' onChange={handleFormData}/>
          
          <label>Old price</label>
          <input type="number" name='old_price' placeholder='Old price' onChange={handleFormData}/>

          <label>Photo of the product</label>
          <input type="file" name='product-image' onChange={handleFormData} required />

          <button onClick={handleSubmit}>Add product</button>
        </form>

        {/* All products */}

      </div>

      <div className="all-products">
        
      </div>
    </div>
  )
}

export default Admin;