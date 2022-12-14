import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/pages/Home';
import AddEdit from './components/pages/AddEdit';
import View from './components/pages/View';
import About from './components/pages/About';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Header />
        <ToastContainer position='top-center' />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/add' element={<AddEdit />} />
          <Route exact path='/update/:id' element={<AddEdit />} />
          <Route exact path='/view/:id' element={<View />} />
          <Route exact path='/about' element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;