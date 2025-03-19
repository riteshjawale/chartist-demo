import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Home from './pages/Home';
import Learning from './pages/Learning';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProTraders from './pages/ProTraders';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import './App.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [applications, setApplications] = useState([]); // State for applications

  // State for league data
  const [leagueData, setLeagueData] = useState({
    currentLeague: {
      traders: [
        { rank: 1, name: 'John Doe', trades: 156, roi: 85.5 },
        { rank: 2, name: 'Jane Smith', trades: 142, roi: 78.3 },
        { rank: 3, name: 'Mike Johnson', trades: 128, roi: 72.1 },
        { rank: 4, name: 'Sarah Williams', trades: 115, roi: 65.8 },
        { rank: 5, name: 'David Brown', trades: 98, roi: 58.4 },
      ],
      startDate: '2024-03-01',
      nextLeagueStart: '2024-04-01',
      participants: 250,
    },
    previousLeague: {
      traders: [
        { rank: 1, name: 'Alice Cooper', trades: 168, roi: 92.7 },
        { rank: 2, name: 'Bob Wilson', trades: 155, roi: 87.4 },
        { rank: 3, name: 'Carol Martinez', trades: 134, roi: 79.2 },
        { rank: 4, name: 'Dan Taylor', trades: 122, roi: 71.5 },
        { rank: 5, name: 'Eve Anderson', trades: 107, roi: 65.9 },
      ],
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      participants: 220,
    },
  });

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className={`app ${theme}`}>
        <Header theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/pro-traders"
            element={
              <ProTraders
                leagueData={leagueData}
                setLeagueData={setLeagueData}
                applications={applications}
                setApplications={setApplications}
              />
            }
          />
          <Route
            path="/admin"
            element={
              <AdminPanel
                leagueData={leagueData}
                setLeagueData={setLeagueData}
                applications={applications}
                setApplications={setApplications}
              />
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: theme === 'dark' ? '#1F2A37' : '#FFFFFF',
              color: theme === 'dark' ? '#EAEAEA' : '#2C2C2C',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;