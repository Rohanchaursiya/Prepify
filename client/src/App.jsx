import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Intro from './pages/IntroPage'
import HomePage from './pages/HomePage';
import StudyOptionsPage from './pages/StudyOptionsPage';
import SyllabusPage from './pages/SyllabusPage';
import FlashCardPage from './pages/FlashCardPage';
import DoubtBoxPage from './pages/DoubtBoxPage';
import OneDayMarathon from './pages/OneDayMarathon';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro/>} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/study-options" element={<StudyOptionsPage />} />
        <Route path="/syllabus" element={<SyllabusPage />} />
        <Route path="/marathon" element={<OneDayMarathon />} />
        <Route path="/flashcards" element={<FlashCardPage />} />
        <Route path="/doubtbox" element={<DoubtBoxPage />} />

      </Routes>
    </Router>
    
  )
}

export default App
