import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/PracticePage.module.scss';
import sentencesData from '../../data/Korean_sentences.json';
import KoreanKeyboard from '../keyboard';
import ProgressBar from '../ProgressBar';
import shuffleArray from '../../util/shuffle';
import GameInstructions from '../GameInfo';
import { useUser } from '@clerk/clerk-react';

/**
 * PracticePage Component
 * Provides an interactive interface for practicing Korean sentences.
 * Includes features like progress tracking, timer, and statistics.
 */

const PracticePage = () => {
  // Router-related hooks for navigation and parameter handling
  const { level } = useParams(); // Get difficulty level from URL parameters
  const navigate = useNavigate();
  const location = useLocation(); 

  const [progress, setProgress] = useState(0); // Overall lesson progress (0-100)
  const [sentenceIndex, setSentenceIndex] = useState(0); // Current sentence being practiced
  const [wordIndex, setWordIndex] = useState(0);  // Current word within the sentence
  const [userInput, setUserInput] = useState('');  // Current user input text
  const [sentences, setSentences] = useState([]); // Array of all sentences for practice
  const [translations, setTranslations] = useState([]); // Translations for all sentences
  const [currSentence, setCurrSentence] = useState([]);  // Words in current sentence
  const [currTranslation, setCurrTranslation] = useState([]); // Translations for current sentence
  const [correctInput, setCorrectInput] = useState(''); // Expected input for current word
  const [correctStates, setCorrectStates] = useState([]); // Tracks correct/incorrect state for each word
  const [isLessonComplete, setIsLessonComplete] = useState(false); // Lesson completion flag
  const [isIncorrect, setIsIncorrect] = useState(false); // Current input correctness flag
  
  // Timer-related states
  const [timeSpent, setTimeSpent] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);
  const accumulatedTimeRef = useRef(0);
  const inputRef = useRef(null);

  // Statistics tracking
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const user = useUser().user;

  /**
   * Starts or restarts the timer for tracking practice time
   * Handles both new sessions and resumed sessions after pauses
   */
  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Set the start time for this session
    startTimeRef.current = Date.now();
    // Start a new timer interval
    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      // Calculate elapsed time for current session
      const elapsedSeconds = Math.floor((currentTime - startTimeRef.current) / 1000);
      // Add accumulated time from previous sessions
      const totalSeconds = accumulatedTimeRef.current + elapsedSeconds;
      // Update both current session and total time states
      setTimeSpent(elapsedSeconds);
      setTotalTimeSpent(totalSeconds);
    }, 1000);
  };

  // Stop timer
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;

      // Add the current session time to accumulated time
      if (startTimeRef.current) {
        const currentTime = Date.now();
        const additionalSeconds = Math.floor((currentTime - startTimeRef.current) / 1000);
        accumulatedTimeRef.current += additionalSeconds;
      }
    }
    startTimeRef.current = null;
  };

  // Pause lesson
  const pauseLesson = () => {
    if (isLessonComplete) return;

    setIsPaused(!isPaused);
    if (!isPaused) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  // Continue lesson from pause screen
  const continueLesson = () => {
    setIsPaused(false);
    startTimer();
  };

  // Navigate back to previous screen or home
  const returnToMenu = () => {
    navigate('/');
  };

  // Reset function to initialize or reinitialize the lesson state
  const resetLesson = () => {
    // Filter sentences based on selected difficulty level and format them
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    startTimeRef.current = null;
    accumulatedTimeRef.current = 0; // Reset accumulated time
    setTimeSpent(0);
    setTotalTimeSpent(0);
  
    // Reset all other game state
    const filteredSentences = sentencesData.sentences
      .filter(sentence => sentence.level.toLowerCase() === level?.toLowerCase())
      .map(item => ({
        korean: item.sentence.split(' '),
        translations: item.word_translation
      }));
    
    // Randomly select 5 sentences for the lesson
    const shuffledSentences = shuffleArray(filteredSentences).slice(0, 5);
    // Set up the core sentence data
    setSentences(shuffledSentences.map(item => item.korean));
    setTranslations(shuffledSentences.map(item => item.translations));
    // Initialize the first sentence if sentences are available
    if (shuffledSentences.length > 0) {
      setCurrSentence(shuffledSentences[0].korean);  // Set first sentence
      setCurrTranslation(shuffledSentences[0].translations); // Set its translations
      setCorrectInput(shuffledSentences[0].korean[0]); // Set first word as target
      // Initialize correctness tracking array (all false initially)
      setCorrectStates(shuffledSentences.map(sentence =>
        sentence.korean.map(() => false)
      ));
    }

    // Reset all game progress indicators
    setSentenceIndex(0); // Start with first sentence
    setWordIndex(0);  // Start with first word
    setProgress(0);  // Reset progress to 0%
    setIsLessonComplete(false); // Reset completion state
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setIncorrectAttempts(0);
    setAccuracy(0);
    // Start timer after state updates are complete
    setTimeout(() => {
      startTimer();
    }, 0);
  };

  // Initial setup and timer management
  useEffect(() => {
    // Check if there's existing state from navigation
    if (location.state) {
      const { timeSpent, previousTimeSpent } = location.state;
      // Restore timer state if available
      if (previousTimeSpent !== undefined) {
        accumulatedTimeRef.current = previousTimeSpent; // Restore accumulated time
        setTotalTimeSpent(previousTimeSpent); // Update total time display
      }

      // Restore lesson state
      if (timeSpent !== undefined) setTimeSpent(timeSpent);
      if (progress !== undefined) setProgress(progress);
      if (sentenceIndex !== undefined) setSentenceIndex(sentenceIndex);
      if (wordIndex !== undefined) setWordIndex(wordIndex);
      if (currSentence) setCurrSentence(currSentence);
      if (sentences) setSentences(sentences);
      if (translations) setTranslations(translations);

      // Clear navigation state to prevent reuse
      window.history.replaceState({}, document.title);
    } else {
      // Normal initial setup
      const filteredSentences = sentencesData.sentences
      // Filter sentences by current difficulty level
        .filter(sentence => sentence.level.toLowerCase() === level?.toLowerCase())
        // Transform data structure for use in the game
        .map(item => ({
          korean: item.sentence.split(' '),
          translations: item.word_translation
        }));
      
      // Randomly select 5 sentences
      const shuffledSentences = shuffleArray(filteredSentences).slice(0, 5);
      // Initialize game state with selected sentences
      setSentences(shuffledSentences.map(item => item.korean));
      setTranslations(shuffledSentences.map(item => item.translations));
      // Set up first sentence if available
      if (shuffledSentences.length > 0) {
        setCurrSentence(shuffledSentences[0].korean);
        setCurrTranslation(shuffledSentences[0].translations);
        setCorrectInput(shuffledSentences[0].korean[0]);
        // Initialize all words as not completed (false)
        setCorrectStates(shuffledSentences.map(sentence =>
          sentence.korean.map(() => false)
        ));
      }
    }

    // Start timer
    startTimer();
    // Cleanup: stop timer when component unmounts
    return () => {
      stopTimer();
    };
  }, [level, location.state]); // Re-run if level or location state changes
  

  /**
   * Stop timer when lesson is completed
   * Ensures timer stops accurately when user finishes all sentences
   */
  useEffect(() => {
    if (isLessonComplete) {
      stopTimer();
    }
  }, [isLessonComplete]);
  /**
   * Handles input from the Korean keyboard
   * @param {string} key - The key pressed on the Korean keyboard
   */
  const handleKeyPress = (key) => {
    // Prevent input if lesson is complete or paused
    if (isLessonComplete || isPaused) return;
  
    if (key === ' ') {
      // Increment total attempts when space is pressed
      setTotalAttempts(prev => prev + 1);
      checkInput();
    } else {
      setUserInput(prev => prev + key);
      setIsIncorrect(false);
    }
  };

  /**
   * Handles changes to the text input field
   * @param {Event} e - The input change event
   */
  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
    setIsIncorrect(false);
  
    if (value.endsWith(' ')) {
      // Increment total attempts when space is pressed in input
      setTotalAttempts(prev => prev + 1);
      
      checkInput();
    }
  };
  /**
   * Validates user input against expected Korean word
   */
  const checkInput = () => {
    const trimmedInput = userInput.trim();
    if (trimmedInput === correctInput) {
      handleCorrectInput();
    } else {
      handleIncorrectInput();
    }
  };

  /**
   * Processes correct user input
   * Updates progress, moves to next word/sentence, and updates statistics
   */
  const handleCorrectInput = () => {
    // Mark current word as correct
    const updatedStates = [...correctStates];
    updatedStates[sentenceIndex][wordIndex] = true;
    setCorrectStates(updatedStates);

    // Update attempts and accuracy
    setCorrectAttempts(prev => prev + 1);
    
    // Calculate accuracy
    const newTotalAttempts = totalAttempts + 1;
    const newCorrectAttempts = correctAttempts + 1;
    const newAccuracy = Math.round((newCorrectAttempts / newTotalAttempts) * 100);
    setAccuracy(newAccuracy);
    // Move to next word or sentence
    if (wordIndex + 1 < currSentence.length) {
      setWordIndex(prev => prev + 1);
      setCorrectInput(currSentence[wordIndex + 1]);
    } else {
      // Move to next sentence or complete lesson
      const nextIndex = sentenceIndex + 1;
      if (nextIndex < sentences.length) {
        // Set up next sentence
        setSentenceIndex(nextIndex);
        setCurrSentence(sentences[nextIndex]);
        setCurrTranslation(translations[nextIndex]);
        setWordIndex(0);
        setCorrectInput(sentences[nextIndex][0]);
        setProgress((nextIndex / sentences.length) * 100);
      } else {
        // Complete the lesson
        storeScore();
        setIsLessonComplete(true);
        setProgress(100);
      }
    }
    setUserInput('');
  };

  /**
   * Processes incorrect user input
   * Updates error state and statistics
   */
  const handleIncorrectInput = () => {
    setIsIncorrect(true);
    setUserInput('');
    // Update statistics
    setIncorrectAttempts(prev => prev + 1);
    
    const newTotalAttempts = totalAttempts + 1;
    const newIncorrectAttempts = incorrectAttempts + 1;
    const newAccuracy = Math.round((correctAttempts / newTotalAttempts) * 100);
    setAccuracy(newAccuracy);
  };

  /**
   * Handles backspace key press
   * Removes last character from input and clears error state
   */
  const handleBackspace = () => {
    setUserInput(prev => prev.slice(0, -1));
    setIsIncorrect(false);
  };

  /**
  * Gets translation for a specific word in the current sentence
  * @param {number} idx - Index of the word in the current sentence
  * @returns {string} Translation of the word
  */
  const getWordTranslation = (idx) => {
    const word = currSentence[idx];
    return currTranslation[word] || "No translation available";
  };

  if (sentences.length === 0) {
    return <div className={styles['page-alignment']}>Loading sentences...</div>;
  }

  /**
   * Stores user's score in the database
   * Calculates points based on accuracy, time spent, and difficulty level
   */
  // New function to store score
  async function storeScore() {
    // Calculate user points based on accuracy, time spent and level
    let userPoints = (accuracy / (totalTimeSpent * 0.1));
    
    if(location.pathname === '/practicePage/beginner'){
      userPoints = userPoints*1.5;
      
    }
    if(location.pathname === '/practicePage/intermediate'){
      userPoints = userPoints*2.5;
    }
    if(location.pathname === '/practicePage/advanced'){
      userPoints = userPoints*3.5;
    }
    userPoints = Math.trunc(userPoints);
    if (user?.id !== undefined) {
      try {
        await fetch(`http://localhost:3232/storeScore?userid=${user.id}&score=${userPoints}`);
      } catch (error) {
        console.error('Failed to store score:', error);
      }
    }
  }

  return (
    <div className={styles['practice-page']}>
      <div className="flex items-center gap-4">
        <h1>Practice Korean ({level})</h1>
      </div>
      <GameInstructions />
      <ProgressBar progress={progress} />

      

      {/* Pause Overlay */}
      {isPaused && !isLessonComplete && (
        <div className={styles['pause-overlay']}>
          <div className={styles['pause-modal']}>
            <h2>Lesson Paused</h2>
            <p>Your lesson is currently on hold.</p>
            <div className={styles['pause-actions']}>
              <button 
                onClick={continueLesson} 
                className={styles['continue-btn']}
              >
                Continue Lesson
              </button>
              <button 
                onClick={returnToMenu} 
                className={styles['return-btn']}
              >
                Return to Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rest of the existing render logic */}
      <div className={styles['sentence-container']}>
        {currSentence.map((word, idx) => (
          <span
            key={idx}
            className={`${styles.word} ${
              correctStates[sentenceIndex][idx] 
                ? styles.correct
                : idx === wordIndex
                  ? isIncorrect 
                    ? styles.incorrect
                    : ''
                  : ''
            }`}
            style={{
              color: idx < wordIndex || correctStates[sentenceIndex][idx] ? '#2f7b2f' : 'inherit',
              position: 'relative',
              opacity: isPaused ? 0.5 : 1
            }}
            data-tooltip={getWordTranslation(idx)}
          >
            {word}
            <span className={styles.tooltip}>
              {getWordTranslation(idx)}
            </span>
          </span>
        ))}
      </div>


      <div className={styles.container}>
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className={`${styles.textbox} ${isIncorrect ? styles.incorrect : ''}`}
          placeholder={correctInput}
          autoFocus
          disabled={isPaused || isLessonComplete}
        />
        {isIncorrect && (
          <span className={styles['clear-input']} onClick={() => setUserInput('')}>
            x
          </span>
        )}
      </div>

      {/* Add timer display with pause button */}
      <div className={styles['timer-container']}>
        <img 
          src={"/pause.png"} 
          alt="Pause"
          onClick={pauseLesson}
          style={{
            width: "20px",
            height: "20px",
            cursor: "pointer",
            marginRight: "10px",
            verticalAlign: "middle"
          }}
        />
        <p className={styles['timer-text']}>
          Time: {Math.floor(totalTimeSpent / 60)}:{("0" + (totalTimeSpent % 60)).slice(-2)}
        </p>
      </div>

      <KoreanKeyboard 
        onClick={handleKeyPress} 
        onBackspace={handleBackspace}
        disabled={isPaused || isLessonComplete}
      />

      {isLessonComplete && (
        <div className={styles['completion-overlay']}>
          <div className={styles['completion-modal']}>
            <h2>Lesson Completed</h2>
            <div className={styles['stats-container']}>
              <div className={styles['stat-item']}>
                <span className={styles['stat-label']}>Total Time:</span>
                <span className={styles['stat-value']}>
                  {Math.floor(totalTimeSpent / 60)}:{("0" + (totalTimeSpent % 60)).slice(-2)}
                </span>
              </div>
              <div className={styles['stat-item']}>
                <span className={styles['stat-label']}>Total Attempts:</span>
                <span className={styles['stat-value']}>{totalAttempts}</span>
              </div>
              <div className={styles['stat-item']}>
                <span className={styles['stat-label']}>Correct Attempts:</span>
                <span className={styles['stat-value']}>{correctAttempts}</span>
              </div>
              <div className={styles['stat-item']}>
                <span className={styles['stat-label']}>Incorrect Attempts:</span>
                <span className={styles['stat-value']}>{incorrectAttempts}</span>
              </div>
              <div className={styles['stat-item']}>
                <span className={styles['stat-label']}>Accuracy:</span>
                <span className={styles['stat-value']}>{accuracy}%</span>
              </div>
            </div>
            <div className={styles['completion-actions']}>
              <button 
                onClick={resetLesson} 
                className={styles['reset-btn']}
              >
                Try Again
              </button>
              <button 
                onClick={() => navigate('/')} 
                className={styles['return-btn']}
              >
                Return to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticePage;
