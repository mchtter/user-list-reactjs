import React from 'react'
import { Route, Routes } from 'react-router'
import User from './components/User/User'
import Users from './components/Users/Users'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Users/>} />
      <Route path="/user/:id" element={<User/>} />
    </Routes>
  )
}
