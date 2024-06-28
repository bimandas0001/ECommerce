import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { ShopContextProvider } from './Context/ShopContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
  // </React.StrictMode>
);