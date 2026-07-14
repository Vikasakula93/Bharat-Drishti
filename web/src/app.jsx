import React from 'react';
import { Route, Routes, Navigate, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import { HomeDashboard, DigitalTwin, Predictions, Recommendations, Agents, NGODashboard, AccessibilityPage, Forecast } from './pages/AppPages';

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/app" element={<Protected><Layout /></Protected>}>
            <Route index element={<HomeDashboard />} />
            <Route path="twin" element={<DigitalTwin />} />
            <Route path="predictions" element={<Predictions />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="agents" element={<Agents />} />
            <Route path="ngo" element={<NGODashboard />} />
            <Route path="accessibility" element={<AccessibilityPage />} />
            <Route path="forecast" element={<Forecast />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
