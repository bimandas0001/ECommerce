import React from 'react'
import {Link} from 'react-router-dom';

import './Item.css';

export const Item = (props) => {
  return (
    <div className='item'>
      <Link to={'/product/' + props.id}>
        <img src={props.image} alt={props.image} className='photo'/>
        <p className='name'> {props.name} </p>
        <div className="price">
          <p> Old price : <span> {props.old_price} </span> </p>
          <p> New price : <span> {props.new_price} </span></p>
        </div>
      </Link>
    </div>
  )
}
