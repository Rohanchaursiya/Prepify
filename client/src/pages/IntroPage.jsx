import { useNavigate } from "react-router-dom";
import "./IntroPage.css";
import { motion } from "framer-motion";
import logoImage from '/logo.png'; // Import the logo image

function Intro() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/home");
  };

  return (
    <div className="intro-container">
      <div className="app-name">
        <motion.div
          className="brand-box"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Add the image and styled text here */ }
          <img src={logoImage} alt="Prepify Logo" className="logo-image" />
          <h3 className="logo-text">Prepify</h3>
        </motion.div>
      </div>

      <motion.div
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h1 className="hero-title">Master Your Exams with Prepify</h1>
        <p className="hero-subtitle">The smart way to prepare for your Exams</p>
      </motion.div>

      <motion.div
        className="flash-card"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <div className="card-content">
          <h3>Why Choose Prepify?</h3>
          <ul className="features-list">
            <li>📚 Syllabus</li>
            <li>🏃‍♂️ One Day Marathon</li>
            <li>🔖 Smart Flash Card for quick revision</li>
            <li>❓ Doubt Box</li>
            <li>📱 Study anywhere, anytime</li>
          </ul>
        </div>
      </motion.div>

      <motion.div
        className="button-section"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <motion.button
          className="start-button"
          onClick={handleStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started Now
        </motion.button>
        <p className="cta-text">Join thousands of students acing their exams</p>
      </motion.div>
    </div>
  );
}

export default Intro;