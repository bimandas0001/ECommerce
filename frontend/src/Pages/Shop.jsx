import React, {useContext} from 'react';
import {Link} from 'react-router-dom';

import {Item} from '../Components/Item/Item';
import { ShopContext } from '../Context/ShopContext';

import './CSS/Shop.css';

export const Shop = () => {
  const {all_product} = useContext(ShopContext);

  const categories = ['men', 'women', 'kids']
  // Filter the latest items.
  const latestProducts = {men: [], women: [], kids: []}
  const count = {men: 8, women: 8, kids: 8}
  all_product.slice().reverse().forEach(item => {
    if(count[item.category]-- > 0) {
      latestProducts[item.category].push(item)
    }
  })

  return (
    <div className="shop-main">
      {
        categories.map(category => {
          return (
            <div className="latest-section">
              <div className="latest-header">
                <div className="latest-title">
                  Latest in {category}
                </div>
                <div className="latest-view-more">
                  <Link to={category}>
                  <button className='latest-view-more-btn'>View All</button>
                  </Link>
                </div>
              </div>
              <div className="latest-display-items">
                {
                  latestProducts[category].map((item, i) => {
                    return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
                  })
                }
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
