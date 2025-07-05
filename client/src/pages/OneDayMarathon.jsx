import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './OneDayMarathon.css';

function OneDayMarathon() {
  const location = useLocation();
  const { subject } = location.state || {};
  const [activeQuestion, setActiveQuestion] = useState(null);

  // Sample data structure - replace with your actual content
  const marathonData = {
    Mathematics: [
      {
        chapter: "Algebra",
        importantTopics: ["Polynomials", "Linear Equations", "Quadratic Equations"],
        questions: [
          {
            id: 1,
            question: "What is the quadratic formula?",
            answer: "The quadratic formula is x = [-b ± √(b²-4ac)]/2a"
          }
        ]
      },
      {
        chapter: "Calculus",
        importantTopics: ["Derivatives", "Integrals", "Limits"],
        questions: [
          {
            id: 1,
            question: "What is the power rule for derivatives?",
            answer: "d/dx(xⁿ) = nxⁿ⁻¹"
          }
        ]
      }
    ],
    Physics: [
      {
        chapter: "Mechanics",
        importantTopics: ["Newton's Laws", "Kinematics", "Work-Energy"],
        questions: [
          {
            id: 1,
            question: "State Newton's First Law",
            answer: "An object at rest stays at rest unless acted upon by an external force."
          }
        ]
      }
    ]
  };

  const subjectData = marathonData[subject] || [
    {
      chapter: "Sample Chapter",
      importantTopics: ["Topic 1", "Topic 2"],
      questions: [
        {
          id: 1,
          question: "Sample question?",
          answer: "Sample answer"
        }
      ]
    }
  ];

  return (
    <div className="intro-container">
      {/* Header matching all other pages */}
      <div className='app-name'>
        <div className='brand-box'>
          <h3>Prepify</h3>
        </div>
      </div>

      <div className="marathon-content-wrapper">
        {/* Hero section matching your style */}
        <div className="hero-section">
          <h1 className="hero-title">One Day Marathon: {subject}</h1>
          <p className="hero-subtitle">Key topics and practice questions for rapid revision</p>
        </div>

        {/* Chapters list */}
        <div className="marathon-content">
          {subjectData.map((chapter, chapIndex) => (
            <div key={chapIndex} className="flash-card">
              <div className="card-content">
                <h2>{chapter.chapter}</h2>
                
                <div className="important-topics">
                  <h3>Essential Topics:</h3>
                  <ul className="features-list">
                    {chapter.importantTopics.map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>
                </div>

                <div className="summary-questions">
                  <h3>Practice Questions:</h3>
                  <div className="questions-list">
                    {chapter.questions.map((q) => (
                      <div 
                        key={q.id} 
                        className="question-item"
                        onClick={() => setActiveQuestion(q)}
                      >
                        {q.question}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button section matching your style */}
        <div className='button-section'>
          <p className="cta-text">Complete your marathon in one sitting!</p>
        </div>
      </div>

      {/* Answer Popup - matches your modal style */}
      {activeQuestion && (
        <div className="answer-popup">
          <div className="flash-card popup-content">
            <div className="card-content">
              <h3>Question:</h3>
              <p>{activeQuestion.question}</p>
              
              <h3>Answer:</h3>
              <div className="answer-text">{activeQuestion.answer}</div>
              
              <button 
                className="start-button"
                onClick={() => setActiveQuestion(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OneDayMarathon;