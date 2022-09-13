import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import './index.css';
import Product_List from './Product_List';
import Product_Add from './Product_Add';


export default function App() {
    return (
        <HashRouter hashType="noslash">
            <Routes>
                <Route path="/" element={<Product_List />} />
                <Route path="/add-product" element={<Product_Add />} />
            </Routes>
        </HashRouter>
    );

}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


