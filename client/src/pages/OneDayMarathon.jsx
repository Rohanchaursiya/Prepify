import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import './OneDayMarathon.css';
import marathonData from '../data/marathon_cache.json';
import Header from '../components/Header';

function OneDayMarathon() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject } = location.state || { subject: "Operating Systems" };

  const [activeTab, setActiveTab] = useState('topics');
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);

  const { top_topics, top_questions } = marathonData;

  const handleToggleQuestion = (index) => setOpenQuestionIndex(prev => prev === index ? null : index);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const margin = 15;
    const pageHeight = doc.internal.pageSize.height;
    let y = margin;
    doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text(`Marathon Q&A: ${subject}`, margin, y);
    y += 15;
    top_questions.forEach((q, index) => {
      if (y > pageHeight - 40) { doc.addPage(); y = margin; }
      doc.setFontSize(12); doc.setFont('helvetica', 'bold');
      const questionLines = doc.splitTextToSize(`${index + 1}. ${q.question}`, doc.internal.pageSize.width - margin * 2);
      doc.text(questionLines, margin, y);
      y += (questionLines.length * 7);
      doc.setFontSize(11); doc.setFont('helvetica', 'normal');
      const answerLines = doc.splitTextToSize(q.answer, doc.internal.pageSize.width - margin * 2);
      answerLines.forEach(line => {
        if (y > pageHeight - margin) { doc.addPage(); y = margin; }
        doc.text(line, margin, y); y += 7;
      });
      y += 10;
    });
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i); doc.setFontSize(10);
        doc.text(`Page ${i} of ${totalPages}`, doc.internal.pageSize.width - margin, pageHeight - 10, { align: 'right' });
    }
    doc.save(`Prepify_${subject}_Marathon_Q&A.pdf`);
  };

  const renderAnswer = (answer) => answer.split('\n').map((paragraph, index) => {
    if (paragraph.trim() === '') return null;
    if (paragraph.startsWith('###')) return <h4 key={index}>{paragraph.replace(/#/g, '').trim()}</h4>;
    if (paragraph.startsWith('*')) return <li key={index}>{paragraph.substring(1).trim()}</li>;
    return <p key={index}>{paragraph}</p>;
  });

  return (
    <div className="marathon-container">
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

      <div className="marathon-header-section">
        <h1 className="marathon-title">One Day Marathon: {subject}</h1>
        <p className="marathon-subtitle">Key topics and practice questions for rapid revision</p>
      </div>

      <div className="marathon-tabs">
        <div className={`tab ${activeTab === 'topics' ? 'active' : ''}`} onClick={() => setActiveTab('topics')}>
          Important Topics
          {/* THE ANIMATED DIV IS NOW REMOVED FROM HERE */}
        </div>
        <div className={`tab ${activeTab === 'questions' ? 'active' : ''}`} onClick={() => setActiveTab('questions')}>
          Practice Questions
          {/* THE ANIMATED DIV IS NOW REMOVED FROM HERE */}
        </div>
      </div>
      <div className="marathon-content-area">
        <AnimatePresence mode="wait">
          {activeTab === 'topics' && (
            <motion.div key="topics" className="topics-list-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h3>Frequently Asked Topics</h3>
              <ul className="topics-list">
                {top_topics.map((item, index) => (
                  <li key={index}>
                    <span className="topic-name">{item.topic}</span>
                    <span className="topic-frequency">Appeared {item.frequency} times</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          {activeTab === 'questions' && (
            <motion.div key="questions" className="questions-list-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="questions-header-container">
                <h3>Frequently Asked Questions</h3>
                <motion.button className="download-pdf-button" onClick={handleDownloadPDF} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Download as PDF
                </motion.button>
              </div>
              <div className="questions-accordion">
                {top_questions.map((q, index) => (
                  <div key={index} className="question-item">
                    <motion.div className="question-header" onClick={() => handleToggleQuestion(index)}>
                      <div className="question-title-group">
                        <span className="question-text">{q.question}</span>
                        <span className="question-appearances">{q.appearances} {q.appearances === 1 ? 'appearance' : 'appearances'}</span>
                      </div>
                      <motion.span className="question-toggle-icon" animate={{ rotate: openQuestionIndex === index ? 180 : 0 }}>▼</motion.span>
                    </motion.div>
                    <AnimatePresence>
                      {openQuestionIndex === index && (
                        <motion.div className="answer-content" initial={{ height: 0, opacity: 0, marginTop: 0 }} animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }} exit={{ height: 0, opacity: 0, marginTop: 0 }}>
                          {renderAnswer(q.answer)}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default OneDayMarathon;