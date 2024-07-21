import {HashRouter, BrowserRouter, Routes, Route } from 'react-router-dom';

import {Navbar} from './Components/Navbar/Navbar';
import {Shop} from './Pages/Shop';
import {ShopCategory} from './Pages/ShopCategory';
import {Product} from './Pages/Product';
import {Cart} from './Pages/Cart';
import {Login} from './Pages/Login';
import {Admin} from './Pages/Admin';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Shop/>} />
          <Route path='/men' element={<ShopCategory category="men"/>} />
          <Route path='/women' element={<ShopCategory category="women"/>} />
          <Route path='/kids' element={<ShopCategory category="kids"/>} />
          <Route path='/product/:productId' element={<Product/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/login' element={<Login/>} />
          <Route path='/admin' element={<Admin/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
