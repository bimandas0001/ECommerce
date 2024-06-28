import React, {useContext} from 'react';

import './CSS/ShopCategory.css';
import {Item} from '../Components/Item/Item';
import { ShopContext } from '../Context/ShopContext';

export const ShopCategory = (props) => {
  const {all_product} = useContext(ShopContext);

  return (
    <div className="shop-category">
      <div className="display-items">
        {
          all_product.map((item, i) => {
            if(item.category === props.category) {
              return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
            }
          })
        }
      </div>
    </div>
  )
}
