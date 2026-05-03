

import React from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';

import Register from './pages/Register';

import Dashboard from './pages/Dashboard';

import MoodTracker from './pages/MoodTracker';

import Chatbot from './pages/Chatbot';

import Assessment from './pages/Assessment';

import BookAppointment from './pages/BookAppointment';

import MyReports from './pages/MyReports';

import AdminDashboard from './pages/AdminDashboard';

import CounsellorDashboard from './pages/CounsellorDashboard';

import Profile from './pages/Profile';

import LandingPage from './pages/LandingPage';




const PrivateRoute = ({ children }) => {

  const token = localStorage.getItem('token');

  return token ? children : <Navigate to="/login" />;

};



function App() {

  return (

    <Router>

      <Routes>
        

        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={

          <PrivateRoute>

            <Dashboard />

          </PrivateRoute>

        } />

        <Route path="/mood-tracker" element={

          <PrivateRoute>

            <MoodTracker />

          </PrivateRoute>

        } />

        <Route path="/chatbot" element={

          <PrivateRoute>

            <Chatbot />

          </PrivateRoute>

        } />

        <Route path="/assessment" element={

          <PrivateRoute>

            <Assessment />

          </PrivateRoute>

        } />

        <Route path="/book-appointment" element={

          <PrivateRoute>

            <BookAppointment />

          </PrivateRoute>

        } />

        <Route path="/my-reports" element={

          <PrivateRoute>

            <MyReports />

          </PrivateRoute>

        } />

        <Route path="/admin" element={

          <PrivateRoute>

            <AdminDashboard />

          </PrivateRoute>

        } />

        <Route path="/counsellor" element={

          <PrivateRoute>

            <CounsellorDashboard />

          </PrivateRoute>

        } />

        <Route path="/profile" element={

          <PrivateRoute>

            <Profile />

          </PrivateRoute>

        } />

        

      </Routes>

    </Router>

  );

}



export default App;