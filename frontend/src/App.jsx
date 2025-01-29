import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Links from './pages/Links'; 
import Analytics from './pages/Analytics'; 
import Settings from './pages/Settings';

function App() {
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
  };
  return (

  <div>
    <ToastContainer />
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/links" element={<ProtectedRoute><Links /></ProtectedRoute>} /> 
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} /> 
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
