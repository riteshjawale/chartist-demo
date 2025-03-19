import { useState } from 'react';
import { motion } from 'framer-motion';
import './ProTraders.css';

function ProTraders() {
  const [activeLeague, setActiveLeague] = useState('current');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    image: null
  });

  const currentLeagueData = {
    traders: [
      { rank: 1, name: "John Doe", trades: 156, roi: 85.5 },
      { rank: 2, name: "Jane Smith", trades: 142, roi: 78.3 },
      { rank: 3, name: "Mike Johnson", trades: 128, roi: 72.1 },
      { rank: 4, name: "Sarah Williams", trades: 115, roi: 65.8 },
      { rank: 5, name: "David Brown", trades: 98, roi: 58.4 }
    ],
    startDate: "2024-03-01",
    nextLeagueStart: "2024-04-01",
    participants: 250
  };

  const previousLeagueData = {
    traders: [
      { rank: 1, name: "Alice Cooper", trades: 168, roi: 92.7 },
      { rank: 2, name: "Bob Wilson", trades: 155, roi: 87.4 },
      { rank: 3, name: "Carol Martinez", trades: 134, roi: 79.2 },
      { rank: 4, name: "Dan Taylor", trades: 122, roi: 71.5 },
      { rank: 5, name: "Eve Anderson", trades: 107, roi: 65.9 }
    ],
    startDate: "2024-02-01",
    endDate: "2024-02-29",
    participants: 220
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  return (
    <div className="pro-traders-page">
      <motion.h1 
        className="page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Top Traders
      </motion.h1>

      <div className="league-buttons">
        <button 
          className={`league-btn ${activeLeague === 'current' ? 'active' : ''}`}
          onClick={() => setActiveLeague('current')}
        >
          Current League
        </button>
        <button 
          className={`league-btn ${activeLeague === 'previous' ? 'active' : ''}`}
          onClick={() => setActiveLeague('previous')}
        >
          Previous Week
        </button>
      </div>

      <div className="leaderboard">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th className="rank-col">Rank</th>
                <th className="name-col">Trader</th>
                <th className="trades-col">Trades</th>
                <th className="roi-col">ROI</th>
              </tr>
            </thead>
            <tbody>
              {(activeLeague === 'current' ? currentLeagueData.traders : previousLeagueData.traders).map((trader) => (
                <motion.tr 
                  key={trader.rank}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: trader.rank * 0.1 }}
                  className={trader.rank === 1 ? 'top-trader' : ''}
                >
                  <td className="rank-col">{trader.rank}</td>
                  <td className="name-col">{trader.name}</td>
                  <td className="trades-col">{trader.trades}</td>
                  <td className="roi-col">
                    <span className="roi">{trader.roi}%</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="league-info">
        <div className="next-league">
          <h2>Apply Next League</h2>
          <div className="dates">
            <p>Current League Start: {currentLeagueData.startDate}</p>
            <p>Next League Start: {currentLeagueData.nextLeagueStart}</p>
            <p>Current Participants: {currentLeagueData.participants}</p>
          </div>
          <form onSubmit={handleSubmit} className="application-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="image">Upload Trading Screenshot</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
            <button type="submit" className="join-btn">Join Next League</button>
          </form>
        </div>

        <div className="rules">
          <h2>Rules</h2>
          <ul>
            <li>Register using your platform credentials</li>
            <li>Trading data will be reset before new league begins</li>
            <li>Rankings are based on trading performance and ROI</li>
            <li>Minimum 50 trades required per week</li>
            <li>Maximum leverage allowed: 20x</li>
            <li>Weekly performance updates every Sunday</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProTraders;