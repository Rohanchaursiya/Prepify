import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './SyllabusPage.css';

function SyllabusPage() {
  const location = useLocation();
  const { subject } = location.state || {};

  // Sample syllabus data - replace with your actual data
  const syllabusData = {
    Mathematics: [
      "Algebra",
      "Calculus",
      "Geometry",
      "Trigonometry",
      "Statistics"
    ],
    Physics: [
      "Mechanics",
      "Thermodynamics",
      "Electromagnetism",
      "Optics",
      "Quantum Physics"
    ],
    // Add other subjects...
  };

  const chapters = syllabusData[subject] || [
    "Chapter 1: Fundamentals",
    "Chapter 2: Advanced Concepts",
    "Chapter 3: Practical Applications",
    "Chapter 4: Problem Solving",
    "Chapter 5: Final Review"
  ];

  return (
    <div className="syllabus-container">
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

      <div className="syllabus-header">
        <h1>{subject} Syllabus</h1>
        <p>Complete study plan for {subject}</p>
      </div>

      <div className="syllabus-content">
        <div className="syllabus-chapters">
          <h2>Chapters</h2>
          <ul>
            {chapters.map((chapter, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {chapter}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="syllabus-progress">
          <h2>Your Progress</h2>
          <div className="progress-bar">
            <motion.div 
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 1 }}
            />
          </div>
          <p>65% completed</p>
        </div>
      </div>

      <motion.button
        className="back-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.history.back()}
      >
        ← Back to Options
      </motion.button>
    </div>
  );
}

export default SyllabusPage;