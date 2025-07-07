import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import './DoubtBoxPage.css';
import Header from '../components/Header';

function DoubtBoxPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subject } = location.state || { subject: "General" };
  const storageKey = `chatHistory_${subject.replace(/\s+/g, '_')}`;

  const getInitialMessages = () => {
    try {
      // CHANGE 1: Switched from localStorage to sessionStorage
      const savedMessages = sessionStorage.getItem(storageKey);
      if (savedMessages) {
        return JSON.parse(savedMessages);
      }
    } catch (error) {
      console.error("Failed to parse chat history from sessionStorage", error);
    }
    return [{ id: 1, text: `Hello! I'm Professor StudyBuddy, your AI assistant for ${subject}. Ask me any question.`, sender: 'bot' }];
  };

  const [messages, setMessages] = useState(getInitialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    try {
      if (messages.length > 1) {
        // CHANGE 2: Switched from localStorage to sessionStorage
        sessionStorage.setItem(storageKey, JSON.stringify(messages));
      }
    } catch (error) {
      console.error("Failed to save chat history to sessionStorage", error);
    }
  }, [messages, storageKey]);


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };

    setMessages(prev => [...prev, newUserMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: currentInput }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      const botResponse = {
        id: Date.now() + 1,
        text: data.response,
        sender: 'bot',
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Failed to fetch chat response:", error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting. Please check my server or try again in a moment.",
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="doubtbox-page-container">
      <Header subject={subject} />
      <motion.button
        className="page-back-button"
        onClick={() => navigate('/study-options', { state: { subject } })}
        whileHover={{ scale: 1.1 }}
      >
        ←
      </motion.button>
      <div className="chat-interface">
        <div className="messages-container">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div key={msg.id} className={`message-bubble ${msg.sender}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} layout>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
             <motion.div className="message-bubble bot typing-indicator" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>Typing...</motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="chat-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ask about ${subject}...`}
            autoFocus
          />
          <motion.button type="submit" className="send-button" disabled={!inputValue.trim() || isTyping} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>Send</motion.button>
        </form>
      </div>
    </div>
  );
}

export default DoubtBoxPage;