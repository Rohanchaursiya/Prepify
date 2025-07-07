import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import './FlashCardPage.css';
import Header from '../components/Header';

function FlashCardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject } = location.state || {};

  const [view, setView] = useState('topic_input');
  const [topicInput, setTopicInput] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false); // Renamed from isFlipped

  const generateCardsFromAPI = async (topic, existing = []) => {
    // This is the REAL function to call your backend.
    const existing_questions = existing.map(card => card.question);
    const response = await fetch('http://localhost:8000/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, existing_questions }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch flashcards from API.");
    }
    const data = await response.json();
    return data.flashcards; // The backend returns an object with a "flashcards" key
  };

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    setCurrentTopic(topicInput);
    setCards([]);
    setView('loading');

    try {
      const newCards = await generateCardsFromAPI(topicInput);
      setCards(newCards);
      setCurrentCardIndex(0);
      setIsAnswerVisible(false);
      setView('display_cards');
    } catch (error) {
      console.error(error);
      alert("Error generating cards. Please try again.");
      setView('topic_input');
    }
  };

  const handleGenerateNext = async () => {
    setView('loading');
    try {
      const newCards = await generateCardsFromAPI(currentTopic, cards);
      setCards(prev => [...prev, ...newCards]);
      setCurrentCardIndex(cards.length);
      setIsAnswerVisible(false);
      setView('display_cards');
    } catch (error) {
      console.error(error);
      alert("Error generating more cards. Please try again.");
      setView('display_cards');
    }
  };

  const handleNewTopic = () => {
    setTopicInput('');
    setCurrentTopic('');
    setCards([]);
    setView('topic_input');
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsAnswerVisible(false);
    }
  };
  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsAnswerVisible(false);
    }
  };

  return (
    <div className="flashcard-page-container">
      <Header subject={subject} />
      <motion.button className="page-back-button" onClick={() => navigate('/study-options', { state: { subject } })} whileHover={{ scale: 1.1 }}>
        ←
      </motion.button>
      <div className="flashcard-content-area">
        <AnimatePresence mode="wait">
          {view === 'topic_input' && (
            <motion.div key="input" className="topic-input-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2>Flashcard Generator</h2>
              <p>Enter a topic from {subject || 'your subject'} to create a new set of flashcards.</p>
              <form onSubmit={handleTopicSubmit} className="topic-form">
                <input
                  type="text"
                  className="topic-input"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="e.g., Process Scheduling, Deadlocks"
                  autoFocus
                />
                <motion.button type="submit" className="generate-button" disabled={!topicInput.trim()} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Generate Cards
                </motion.button>
              </form>
            </motion.div>
          )}
          {view === 'loading' && (
            <motion.div key="loading" className="loading-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="loading-spinner"></div>
              <p>Crafting flashcards for <strong>{currentTopic}</strong>...</p>
            </motion.div>
          )}
          {view === 'display_cards' && cards.length > 0 && (
            <motion.div key="cards" className="flex flex-col items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flashcard-viewer">
                <button className="nav-arrow" onClick={handlePrevCard} disabled={currentCardIndex === 0}>←</button>

                {/* --- NEW CARD STRUCTURE --- */}
                <div className="flashcard-card" onClick={() => setIsAnswerVisible(!isAnswerVisible)}>
                  <div className="card-question-section">
                    <div className="card-topic">{currentTopic}</div>
                    <div className="card-content">
                      <ReactMarkdown>{cards[currentCardIndex].question}</ReactMarkdown>
                    </div>
                  </div>
                  <AnimatePresence>
                    {isAnswerVisible && (
                      <motion.div
                        className="card-answer-section"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: '2rem' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                      >
                        <hr className="answer-divider" />
                        <div className="card-content">
                          <ReactMarkdown>{cards[currentCardIndex].answer}</ReactMarkdown>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {!isAnswerVisible && (
                    <div className="show-answer-prompt">
                      Click card to reveal answer
                    </div>
                  )}
                </div>

                <button className="nav-arrow" onClick={handleNextCard} disabled={currentCardIndex === cards.length - 1}>→</button>
              </div>
              <p className="card-counter">{currentCardIndex + 1} of {cards.length}</p>
              <div className="flashcard-actions">
                <button className="action-button next-batch-button" onClick={handleGenerateNext}>Generate More</button>
                <button className="action-button new-topic-button" onClick={handleNewTopic}>New Topic</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
export default FlashCardPage;