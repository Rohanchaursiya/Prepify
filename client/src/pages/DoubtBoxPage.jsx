import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './FeatureComingSoon.css';
import Header from '../components/Header';

function DoubtBoxPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject } = location.state || {};

  return (
    <div className="feature-coming-container">
      <Header subject={subject} />

      <motion.button
        className="page-back-button"
        onClick={() => navigate('/study-options', { state: { subject } })}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.1 }}
      >
        ←
      </motion.button>

      <div className="coming-soon-content">
        <motion.div className="coming-soon-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="icon-container" style={{ backgroundColor: '#eb575720' }}>
            <span className="feature-icon">❓</span>
          </div>
          <h2>Doubt Box for {subject}</h2>
          <p className="coming-soon-text">This helpful feature is coming soon!</p>
          <p className="feature-description">
            Get your questions answered by experts and see solutions to common problems.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default DoubtBoxPage;