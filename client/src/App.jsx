import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import ProfileUpdate from './pages/ProfileUpdate';
import HomePage from './pages/HomePage';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';

const App = () => {
  const { authUser } = useContext(AuthContext);

  return (
    <>
      <div className="bg-[url('./src/assets/bgImage.svg')] bg-cover min-h-screen">
        <Toaster />
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
          <Route path="/profile" element={authUser ? <ProfileUpdate /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
