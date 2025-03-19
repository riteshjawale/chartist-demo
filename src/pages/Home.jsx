import { useState } from 'react';
import { motion } from 'framer-motion';
import './Home.css';

function Home() {
  const [selectedBot, setSelectedBot] = useState('price-line');
  
  const bots = [
    { id: 'price-line', name: 'Price Line Bot' },
    { id: 'stock-swing', name: 'Stock Swing Bot' },
    { id: 'smc', name: 'SMC Bot' },
    { id: 'liquidity', name: 'Liquidity Bot' }
  ];

  const tickers = [
    { symbol: 'BTC', price: '45,123.45', change: '+2.5%' },
    { symbol: 'ETH', price: '2,890.12', change: '+1.8%' },
    { symbol: 'SPY', price: '456.78', change: '-0.5%' }
  ];

  const videos = [
    {
      id: 1,
      title: 'Smart Money Concept Strategy',
      description: 'How to trade bot Bitcoin, Bank Nifty trade using Price line bot',
      thumbnail: 'https://placehold.co/600x400/333/white?text=Smart+Money+Concept'
    },
    {
      id: 2,
      title: "Stock's Swing Bot Strategy",
      description: 'Stock swing bot: Use this bot to trade swing & stocks',
      thumbnail: 'https://placehold.co/600x400/333/white?text=Stock+Swing+Bot'
    },
    {
      id: 3,
      title: 'Price Line Bot Strategy',
      description: 'This bot presents and makes all kinds of levels of SMC',
      thumbnail: 'https://placehold.co/600x400/333/white?text=Price+Line+Bot'
    },
    {
      id: 4,
      title: 'Liquidity Bot Strategy',
      description: 'Learn how to identify and trade liquidity zones with this bot',
      thumbnail: 'https://placehold.co/600x400/333/white?text=Liquidity+Bot'
    }
  ];

  return (
    <div className="home">
      {/* Bot Selection */}
      <section className="bot-selection">
        {bots.map(bot => (
          <button
            key={bot.id}
            className={`bot-btn ${selectedBot === bot.id ? 'active' : ''}`}
            onClick={() => setSelectedBot(bot.id)}
          >
            {bot.name}
          </button>
        ))}
      </section>

      {/* Stock Ticker */}
      <div className="ticker-tape">
        {tickers.map(ticker => (
          <div key={ticker.symbol} className="ticker-item">
            <span className="symbol">{ticker.symbol}</span>
            <span className="price">{ticker.price}</span>
            <span className={`change ${ticker.change.startsWith('+') ? 'positive' : 'negative'}`}>
              {ticker.change}
            </span>
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Pro Chartist
          </motion.h1>
          <h2>Master the stock market</h2>
          <p>Welcome to Pro Chartist. From beginner courses to advanced trading strategies, our institute offers comprehensive learning experiences tailored to every level of investor.</p>
          <div className="cta-buttons">
            <button className="btn btn-primary">About Us</button>
            <button className="btn btn-secondary">Services</button>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://placehold.co/600x400/2563eb/white?text=Trading+Chart" 
            alt="Trading chart"
            className="hero-img"
          />
        </div>
      </section>

      {/* Videos Section */}
      <section className="videos-section">
        <h2>📹 Videos</h2>
        <div className="video-grid">
          {videos.map(video => (
            <div key={video.id} className="video-card">
              <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
              <div className="video-content">
                <h3>{video.title}</h3>
                <p>{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card">
          <h3>14K</h3>
          <p>Active Traders</p>
        </div>
        <div className="stat-card">
          <h3>#No.1</h3>
          <p>AI Charting Platform</p>
        </div>
        <div className="stat-card">
          <h3>20K</h3>
          <p>Downloads</p>
        </div>
        <div className="stat-card">
          <h3>20+</h3>
          <p>Markets Covered</p>
        </div>
      </section>

      {/* Community Section */}
      <section className="community-section">
        <h2>Community</h2>
        <div className="trading-views">
          <img 
            src="https://placehold.co/300x200/333/white?text=Trading+View+1" 
            alt="Trading view 1"
            className="trading-view-img"
          />
          <img 
            src="https://placehold.co/300x200/333/white?text=Trading+View+2" 
            alt="Trading view 2"
            className="trading-view-img"
          />
          <img 
            src="https://placehold.co/300x200/333/white?text=Trading+View+3" 
            alt="Trading view 3"
            className="trading-view-img"
          />
          <img 
            src="https://placehold.co/300x200/333/white?text=Trading+View+4" 
            alt="Trading view 4"
            className="trading-view-img"
          />
        </div>
      </section>
    </div>
  );
}

export default Home;