import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import PostSkill from './pages/PostSkill';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Dashboard from './pages/Dashboard';
import LearningWorkspace from './pages/LearningWorkspace';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/learning/:requestId" element={<ProtectedRoute><LearningWorkspace /></ProtectedRoute>} />
        <Route path="/post" element={<ProtectedRoute><PostSkill /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/messages/:userId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

        <Route path="/" element={<Navigate to="/browse" replace />} />
        <Route path="*" element={<Navigate to="/browse" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
