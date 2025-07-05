import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './FeatureComingSoon.css';

function FlashCardPage() {
  const location = useLocation();
  const { subject } = location.state || {};

  return (
    <div className="feature-coming-container">
      <div className='app-name'>
        <motion.div 
          className='brand-box'
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Prepify</h3>
        </motion.div>
      </div>

      <div className="coming-soon-content">
        <motion.div
          className="coming-soon-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="icon-container" style={{ backgroundColor: '#1d976c20' }}>
            <span className="feature-icon">🔖</span>
          </div>
          <h2>Flash Cards for {subject}</h2>
          <p className="coming-soon-text">This exciting feature is coming soon!</p>
          <p className="feature-description">
            Interactive flash cards to help you memorize key concepts and test your knowledge.
          </p>
          <motion.button
            className="back-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
          >
            ← Back to Options
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default FlashCardPage;