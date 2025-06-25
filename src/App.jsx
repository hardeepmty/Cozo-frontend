import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'
import OrgDashboard from './pages/OrgDashboard'
import MyTasksPage from './pages/MyTasksPage';
import Sidebar from './components/Sidebar';
import ProjectUtilityPage from './pages/ProjectUtilityPage'; // <--- NEW IMPORT
import ProjectsPage from './pages/ProjectsPage'; // <--- NEW IMPORT
import ProjectOverviewPage from './pages/ProjectOverviewPage'; // <--- NEW IMPORT
import ProjectCalendarPage from './pages/ProjectCalendarPage';



function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<MyTasksPage/>}/>
        <Route path="/org/:orgId" element={<OrgDashboard />} />
                <Route path="/org/:orgId/projects" element={<ProjectsPage />} /> {/* <--- NEW ROUTE */}
        <Route path="/org/:orgId/project/:projectId" element={<ProjectOverviewPage />} />
        <Route path="/org/:orgId/project/:projectId/calendar" element={<ProjectCalendarPage />} />

                  <Route path="/org/:orgId/project/:projectId/utility" element={<ProjectUtilityPage />} />

        </Routes>

      </div>
    </Router>
  );
}

export default App;