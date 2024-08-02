import React from 'react'
import {Link} from 'react-router-dom';

import './Item.css';

export const Item = (props) => {
  return (
    <div className='item'>
      <Link to={'/product/' + props.id}>
        <img src={props.image} alt={props.image} className='photo'/>
        <div className="details">
          <p className='name'> {props.name} </p>
          <div className="price">
            <p className='new-price-line'> 
              Price : <span className='new-price'> {props.new_price} </span> 
              <span className='discount'> 
                { Math.floor((props.old_price - props.new_price) / props.old_price * 100)}% off 
              </span></p>
            <p className='old-price-line'> Old price : <span> {props.old_price} </span> </p>
          </div>
        </div>
      </Link>
    </div>
  )
}
