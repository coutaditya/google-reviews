import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from 'react'
import ButtonAppBar from './components/AppBar'
import { Homepage } from './pages/Homepage'
import { Search } from './pages/Search'
import { Wishlist } from './pages/Wishlist'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <BrowserRouter>
      <ButtonAppBar />
      <div style={{ marginTop: '140px', flexGrow: 1, overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
