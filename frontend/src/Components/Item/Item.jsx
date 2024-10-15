import React from 'react'
import {Link} from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import './Item.css';

export const Item = (props) => {
  return (
    <div className='item'>
      <Link to={'/product/' + props.id}>
        <div className='item-photo shimmer-background' >
          <img src={props.image} className='photo' />
        </div>
        <div className="details">
          <p className='name'> {props.name} </p>
          <div className="price">
            <p className='new-price-line'> 
              Price : <span className='new-price'> {props.new_price} </span> 
              <span className='discount'> 
                {Math.floor((props.old_price - props.new_price) / props.old_price * 100)}% off 
              </span></p>
            <p className='old-price-line'> Old price : <span> {props.old_price} </span> </p>
          </div>
        </div>
      </Link>
    </div>
  )
}
