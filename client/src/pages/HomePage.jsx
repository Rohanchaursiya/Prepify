import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Geography",
    "Computer Science",
    "Literature",
    "Economics"
  ];

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setIsDropdownOpen(false);
  };

  const handleStartStudying = () => {
    navigate("/study-options", { state: { subject: selectedSubject } });
  };

  return (
    <div className='home-container'>
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

      <motion.div 
        className="content-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h1 className="welcome-title">Welcome to Prepify</h1>
        <p className="instruction-text">Select a subject to begin your learning journey</p>

        <div className="input-container">
          <motion.div 
            className="subject-select"
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className="selected-subject"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {selectedSubject || "Choose a subject"}
              <motion.span
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ▼
              </motion.span>
            </div>
            
            {isDropdownOpen && (
              <motion.div 
                className="subject-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="subject-option"
                    onClick={() => handleSubjectSelect(subject)}
                  >
                    {subject}
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {selectedSubject && (
          <motion.div
            className="selected-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>You've selected: <span className="subject-highlight">{selectedSubject}</span></p>
            <motion.button
              className="study-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartStudying}
            >
              Start Studying {selectedSubject}
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default HomePage;