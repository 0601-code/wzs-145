import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import WorkRequirement from './pages/WorkRequirement';
import WorkSchedule from './pages/WorkSchedule';
import WorkRecord from './pages/WorkRecord';
import Machine from './pages/Machine';
import Driver from './pages/Driver';
import WorkItem from './pages/WorkItem';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="requirement" element={<WorkRequirement />} />
        <Route path="schedule" element={<WorkSchedule />} />
        <Route path="record" element={<WorkRecord />} />
        <Route path="machine" element={<Machine />} />
        <Route path="driver" element={<Driver />} />
        <Route path="work-item" element={<WorkItem />} />
      </Route>
    </Routes>
  );
}

export default App;
