import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import BlogList from './components/blog/BlogList';
import BlogDetail from './components/blog/BlogDetail';
import BlogForm from './components/blog/BlogForm';
import PrivateRoute from './components/PrivateRoute';
import MyPosts from './components/blog/MyPosts';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<BlogList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/posts/:id" element={<BlogDetail />} />
              
              {/* Protected routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/create-post" element={<BlogForm isEditing={false} />} />
                <Route path="/edit-post/:id" element={<BlogForm isEditing={true} />} />
                <Route path="/my-posts" element={<MyPosts />} />
              </Route>
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;