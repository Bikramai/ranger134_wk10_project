import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@mui/material/styles";
import { FirebaseAppProvider } from 'reactfire';
import 'firebase/auth';


// internal imports
import { Home, Shop, Cart, Auth } from './components';
import './index.css';
import { theme } from './Theme/themes';
import { firebaseConfig } from './firebaseConfig';
// import { Auth } from './components/Auth';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>

      <ThemeProvider theme = { theme }>
        <Router>
          <Routes>
            <Route path='/' element={<Home title = {"My Shopping Cart"}/>} />
            <Route path='/auth' element={<Auth title = {"My Shopping Cart"}/>} /> 
            <Route path='/shop' element={<Shop />} />
            <Route path='/cart' element={<Cart />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </FirebaseAppProvider>
  </React.StrictMode>,
)

