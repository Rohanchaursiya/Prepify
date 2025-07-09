import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import './FlashCardPage.css';
import Header from '../components/Header'; // Assuming you have this component

function FlashCardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject } = location.state || {};

  const [view, setView] = useState('topic_input');
  const [topicInput, setTopicInput] = useState('');
  const [currentTopic, setCurrentTopic] = useState('');
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState(null);

  const generateCardsFromAPI = async (topic, existing = []) => {
    const existing_questions = existing.map(card => card.question);
    const response = await fetch('http://localhost:8000/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, existing_questions }),
    });

    if (!response.ok) {
      // Try to parse the error message from the backend, otherwise use a default
      const errorData = await response.json().catch(() => ({ detail: "An unknown API error occurred." }));
      throw new Error(errorData.detail || "Failed to fetch flashcards from API.");
    }
    const data = await response.json();
    return data.flashcards;
  };

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    if (!topicInput.trim()) return;
    setCurrentTopic(topicInput);
    setCards([]);
    setView('loading');
    setError(null); // Clear previous errors on new submission

    try {
      const newCards = await generateCardsFromAPI(topicInput);

      // Handle the case where the API returns an empty array
      if (newCards.length === 0) {
        setError(`Could not generate flashcards for "${topicInput}". Please try a valid Operating Systems topic.`);
        setView('topic_input');
        return;
      }

      setCards(newCards);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setView('display_cards');
    } catch (error) {
      // Handle API fetch failures and display the error
      console.error(error);
      setError(error.message || `An unexpected error occurred. Please try again.`);
      setView('topic_input');
    }
  };

  const handleGenerateNext = async () => {
    setView('loading');
    setError(null);
    try {
      const newCards = await generateCardsFromAPI(currentTopic, cards);

      if (newCards.length === 0) {
        // For this specific action, an alert is less disruptive than resetting the view
        alert(`No more unique flashcards could be generated for "${currentTopic}".`);
        setView('display_cards');
        return;
      }

      setCards(prev => [...prev, ...newCards]);
      setCurrentCardIndex(cards.length);
      setIsFlipped(false);
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
    setError(null); // Clear errors when starting over
    setView('topic_input');
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="flashcard-page-container">
      <Header subject={subject} />
      <motion.button
        className="page-back-button" // Assuming this class exists elsewhere
        onClick={() => navigate('/study-options', { state: { subject } })}
        whileHover={{ scale: 1.1 }}
      >
        ←
      </motion.button>
      <div className="flashcard-content-area">
        <AnimatePresence mode="wait">
          {view === 'topic_input' && (
            <motion.div key="input" className="topic-input-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2>Flashcard Generator</h2>
              <p>Enter a topic from {subject || 'your subject'} to create a new set of flashcards.</p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleTopicSubmit} className="topic-form">
                <input
                  type="text"
                  className="topic-input"
                  value={topicInput}
                  onChange={(e) => {
                    setTopicInput(e.target.value);
                    if (error) setError(null); // Clear error when user starts typing
                  }}
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
            <motion.div key="cards" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',width:'100%' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flashcard-viewer">
                <button className="nav-arrow" onClick={handlePrevCard} disabled={currentCardIndex === 0}>←</button>

                <div className="flashcard-container" onClick={() => setIsFlipped(!isFlipped)}>
                  <div className={`flashcard-card ${isFlipped ? 'is-flipped' : ''}`}>
                    {/* Front Face (Question) */}
                    <div className="card-face card-face-front">
                      <div className="card-topic">{currentTopic}</div>
                      <div className="card-content">
                        <ReactMarkdown>{cards[currentCardIndex].question}</ReactMarkdown>
                      </div>
                      <div className="show-answer-prompt">
                        Click card to flip for answer
                      </div>
                    </div>
                    {/* Back Face (Answer) */}
                    <div className="card-face card-face-back">
                      <div className="card-topic">Answer</div>
                       <div className="card-content">
                        <ReactMarkdown>{cards[currentCardIndex].answer}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
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