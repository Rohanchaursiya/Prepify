import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Header.css';
import logoImage from '/logo.png'; // Make sure this path is correct

function Header({ subject }) {
  const navigate = useNavigate();

  const handleSubjectClick = () => {
    if (subject) {
      navigate('/study-options', { state: { subject } });
    }
  };

  return (
    <div className='app-name'>
      <motion.div
        className='brand-box'
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate('/home')}
        style={{ cursor: 'pointer' }}
      >
        <img src={logoImage} alt="Prepify Logo" className="logo-image" />
        <h3 className="logo-text">Prepify</h3>
      </motion.div>

      {subject && (
        <motion.div
          className="subject-chip"
          onClick={handleSubjectClick}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, backgroundColor: '#d6e2ff' }}
          whileTap={{ scale: 0.95 }}
        >
          <span>{subject}</span>
        </motion.div>
      )}
    </div>
  );
}

export default Header;