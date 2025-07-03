// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecruiterExcelUpload from './pages/RecruiterExcelUpload';
import Login from './pages/Login';
import Register from './pages/Register';
import RecruiterPage from './pages/RecruitersPage';
import LeadsPage from './pages/LeadsPage';
import SalesPage from './pages/salesPage';
import LeadsDashboard from './pages/LeadsDashboard';
import SalesDashboard from './pages/SalesDashboard';// Fixed casing (was salesPage)
import RecruiterSubmit from './pages/RecruiterSubmit'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Role-based Routes */}
        <Route path="/recruiter" element={<RecruiterPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/leads-dashboard" element={<LeadsDashboard />} />
        <Route path="/sales-dashboard" element={<SalesDashboard />} />
        <Route path="/recruiter-submit" element={<RecruiterSubmit />} />
        <Route path="/recruiter-excel-upload" element={<RecruiterExcelUpload />} />


        {/* Fallback Route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
