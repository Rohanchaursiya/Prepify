import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './StudyOptionsPage.css';
import Header from '../components/Header';

function StudyOptionsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject } = location.state || {};

  const studyOptions = [
    { id: 1, name: "Syllabus", icon: "📚", color: "#4b6cb7", description: "View complete subject syllabus" },
    { id: 2, name: "One Day Marathon", icon: "🏃‍♂️", color: "#6a3093", description: "Intensive one-day revision" },
    { id: 3, name: "Flash Cards", icon: "🔖", color: "#1d976c", description: "Practice with flashcards" },
    { id: 4, name: "Doubt Box", icon: "❓", color: "#eb5757", description: "Get your doubts solved" }
  ];

  const handleOptionClick = (option) => {
    switch(option.name) {
      case "Syllabus": navigate("/syllabus", { state: { subject } }); break;
      case "One Day Marathon": navigate("/marathon", { state: { subject } }); break;
      case "Flash Cards": navigate("/flashcards", { state: { subject } }); break;
      case "Doubt Box": navigate("/doubtbox", { state: { subject } }); break;
      default: break;
    }
  };

  return (
    <div className="study-options-container">
      <Header subject={subject} />

      <motion.button
        className="page-back-button"
        onClick={() => navigate('/home')}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.1 }}
      >
        ←
      </motion.button>

      <div className="study-options-header">
        <h1>Study Options for {subject}</h1>
        <p>Choose your preferred study method</p>
      </div>

      <div className="options-row-container">
        <div className="options-row">
          {studyOptions.map((option) => (
            <motion.div key={option.id} className="option-card" style={{ backgroundColor: option.color }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: option.id * 0.1 }} whileHover={{ scale: 1.05, boxShadow: "0 15px 25px rgba(0, 0, 0, 0.1)" }} whileTap={{ scale: 0.95 }} onClick={() => handleOptionClick(option)}>
              <div className="option-icon">{option.icon}</div>
              <h3>{option.name}</h3>
              <p className="option-description">{option.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudyOptionsPage;