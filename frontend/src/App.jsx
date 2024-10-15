import {lazy, Suspense} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Navbar from './Components/Navbar/Navbar';
import ShopCategory from './Pages/ShopCategory';

// Lazy load the components
const Shop = lazy(() => import('./Pages/Shop'));
// const ShopCategory = lazy(() => import('./Pages/ShopCategory'));
const Product = lazy(() => import('./Pages/Product'));
const Cart = lazy(() => import('./Pages/Cart'));
const Login = lazy(() => import('./Pages/Login'));
const Admin = lazy(() => import('./Pages/Admin'));

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar/>
        <Suspense fallback={<div style={{width: '100%', padding: '10px', textAlign: 'center'}}>Loading...</div>}>
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
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
