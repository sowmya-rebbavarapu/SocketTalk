import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import ProfileUpdate from './pages/ProfileUpdate';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <>
      <div className="bg-[url('./src/assets/bgImage.svg')] bg-cover min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfileUpdate />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
