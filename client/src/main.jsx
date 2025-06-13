import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import './index.css';
import App from './App.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import { ChatProvider } from '../context/ChatContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthProvider>
    <ChatProvider>
    <App />
    </ChatProvider>
  </AuthProvider>
  </BrowserRouter>
);
