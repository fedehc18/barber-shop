import React from 'react'
import { Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Products from './pages/Products';

function AppRouter() {
    return (
        <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/products' element={<Products />}></Route>
        </Routes>
    )
}

export default AppRouter