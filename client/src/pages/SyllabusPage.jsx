import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './SyllabusPage.css';
import { operatingSystemsSyllabus } from '../data/syllabusData';
import Header from '../components/Header';

function SyllabusPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const syllabus = operatingSystemsSyllabus;
  const subject = syllabus.subject;

  const [openUnits, setOpenUnits] = useState({});
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const savedProgress = localStorage.getItem(`progress_${syllabus.subject}`);
      return savedProgress ? new Set(JSON.parse(savedProgress)) : new Set();
    } catch (error) { return new Set(); }
  });

  useEffect(() => {
    localStorage.setItem( `progress_${syllabus.subject}`, JSON.stringify(Array.from(completedTopics)));
  }, [completedTopics, syllabus.subject]);

  const handleToggleUnit = (unitId) => setOpenUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));

  const handleToggleSubTopic = (subTopic) => {
    setCompletedTopics(prev => {
      const newCompleted = new Set(prev);
      if (newCompleted.has(subTopic)) newCompleted.delete(subTopic);
      else newCompleted.add(subTopic);
      return newCompleted;
    });
  };

  const totalSubTopics = useMemo(() => syllabus.units.reduce((total, unit) => total + unit.topics.reduce((subTotal, topic) => subTotal + topic.subTopics.length, 0), 0), [syllabus]);
  const progressPercentage = totalSubTopics > 0 ? (completedTopics.size / totalSubTopics) * 100 : 0;

  return (
    <div className="syllabus-container">
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

      <div className="syllabus-header">
        <h1>{syllabus.subject} Syllabus</h1>
        <p>Track your progress chapter by chapter</p>
      </div>

      <div className="syllabus-main-content">
        <div className="syllabus-chapters">
          {syllabus.units.map((unit) => (
            <div key={unit.id} className="unit-card">
              <motion.div className="unit-header" onClick={() => handleToggleUnit(unit.id)} whileHover={{ backgroundColor: '#f0f4ff' }}>
                <h3>{unit.id}: {unit.title}</h3>
                <motion.span animate={{ rotate: openUnits[unit.id] ? 180 : 0 }}>▼</motion.span>
              </motion.div>
              <AnimatePresence>
                {openUnits[unit.id] && (
                  <motion.div className="unit-content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    {unit.topics.map((topic, index) => (
                      <div key={index} className="topic-group">
                        <h4>{topic.name}</h4>
                        <ul>
                          {topic.subTopics.map((subTopic, subIndex) => (
                            <li key={subIndex} className="subtopic-item">
                              <label>
                                <input type="checkbox" checked={completedTopics.has(subTopic)} onChange={() => handleToggleSubTopic(subTopic)} />
                                {subTopic}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div className="syllabus-progress">
          <h2>Your Progress</h2>
          <div className="progress-bar">
            <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1, ease: "easeInOut" }} />
          </div>
          <p><strong>{Math.round(progressPercentage)}%</strong> completed</p>
          <p className='progress-details'>{completedTopics.size} / {totalSubTopics} topics</p>
        </div>
      </div>
    </div>
  );
}

export default SyllabusPage;