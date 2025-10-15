import React, { useState, useEffect, useRef } from "react";
import { charactersToLearn } from "../../data/characters";
import KoreanKeyboard from "../keyboard";
import ProgressBar from "../ProgressBar";
import Card from "../Card";
import styles from "../../styles/LearnPage.module.scss";

import {
  SignedIn,
  SignOutButton,
  useUser,
} from "@clerk/clerk-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

/**
 * LearnPage Component
 * A comprehensive interface for learning Korean characters through interactive exercises
 */

export const LearnPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);  // Current character index
  const [progress, setProgress] = useState(0); // Overall progress (0-100)
  const [isCorrect, setIsCorrect] = useState(null); // Current input correctness
  const [shuffledCharacters, setShuffledCharacters] = useState( // Randomized character set
    [...charactersToLearn].sort(() => Math.random() - 0.5)
  );
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const currentCharacter = shuffledCharacters[currentIndex];

  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);
  const accumulatedTimeRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [storedScore, setStoredScore] = useState(false);

  let user = useUser().user;

  /**
   * Handles keyboard input for character practice
   * @param {string} key - The pressed key
   */
  const handleKeyPress = (key) => {
    if (isLessonComplete || isPaused) return;
    
    const expectedKey = currentCharacter.roman_representation;
    const requiresShift = expectedKey === expectedKey.toUpperCase();

    setTotalAttempts(prev => prev + 1);
    // Check if input matches expected character
    if (
      (requiresShift && isShiftPressed && key === expectedKey) || 
      (!requiresShift && key === expectedKey.toLowerCase())
    ) {
      setIsCorrect(true);
      setCorrectAttempts(prev => prev + 1);
      
      const newTotalAttempts = totalAttempts + 1;
      const newCorrectAttempts = correctAttempts + 1;
      setAccuracy(Math.round((newCorrectAttempts / newTotalAttempts) * 100));
      
      setTimeout(() => {
        if (currentIndex < shuffledCharacters.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setProgress(((currentIndex + 1) / shuffledCharacters.length) * 100);
        } else {
          if(storedScore){
            storeScore();
            setStoredScore(false);
          }
          setIsLessonComplete(true);
        }
        setIsCorrect(null);
      }, 500);
    } else if (key !== "Shift") {
       // Handle incorrect input
      setIsCorrect(false);
      setIncorrectAttempts(prev => prev + 1);
      
      const newTotalAttempts = totalAttempts + 1;
      const newIncorrectAttempts = incorrectAttempts + 1;
      setAccuracy(Math.round((correctAttempts / newTotalAttempts) * 100));
      
      setTimeout(() => setIsCorrect(null), 500);
    }
  };

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - startTimeRef.current) / 1000);
      const totalSeconds = accumulatedTimeRef.current + elapsedSeconds;
      
      setTimeSpent(elapsedSeconds);
      setTotalTimeSpent(totalSeconds);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;

      if (startTimeRef.current) {
        const currentTime = Date.now();
        const additionalSeconds = Math.floor((currentTime - startTimeRef.current) / 1000);
        accumulatedTimeRef.current += additionalSeconds;
      }
    }
    startTimeRef.current = null;
  };

  /**
   * Toggles lesson pause state
   */
  const pauseLesson = () => {
    if (isLessonComplete) return;
    
    setIsPaused(!isPaused);
    if (!isPaused) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  /**
   * Resumes lesson from paused state
   */
  const continueLesson = () => {
    setIsPaused(false);
    startTimer();
  };

  /**
   * Returns to main menu
   */
  const returnToMenu = () => {
    navigate('/');
  };

  /**
   * Resets lesson state for a new attempt
   */
  const resetLesson = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    startTimeRef.current = null;
    accumulatedTimeRef.current = 0;
    setTimeSpent(0);
    setTotalTimeSpent(0);
    // Reset lesson state
    setShuffledCharacters([...charactersToLearn].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setProgress(0);
    setIsCorrect(null);
    setIsLessonComplete(false);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setIncorrectAttempts(0);
    setAccuracy(0);
    
    setTimeout(() => {
      startTimer();
    }, 0);
  };

  // Effect for initializing timer and handling navigation state
  useEffect(() => {
    if (location.state) {
      const { timeSpent, previousTimeSpent } = location.state;
      
      if (previousTimeSpent !== undefined) {
        accumulatedTimeRef.current = previousTimeSpent;
        setTotalTimeSpent(previousTimeSpent);
      }
      if (timeSpent !== undefined) setTimeSpent(timeSpent);

      window.history.replaceState({}, document.title);
    }

    setStoredScore(true);
    startTimer();
    return () => stopTimer();
  }, [location.state]);
  // Effect for stopping timer on lesson completion
  useEffect(() => {
    if (isLessonComplete) {
      stopTimer();
    }
  }, [isLessonComplete]);

  // Effect for handling keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Shift") {
        setIsShiftPressed(true);
      } else {
        handleKeyPress(event.key);
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === "Shift") {
        setIsShiftPressed(false);
      }
    };

    if (!isLessonComplete && !isPaused) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [currentCharacter, isShiftPressed, isLessonComplete, isPaused]);

  /**
  * Stores the user's score in the database
  */
  async function storeScore() {  
    let userPoints = Math.trunc(accuracy / (totalTimeSpent * 0.1));

    if(user?.id != undefined){
      await fetch("http://localhost:3232/storeScore?userid="+user?.id+"&score="+userPoints);
    }
  }

  return (
    <div>
      <div className={styles["learn-page"]}>
        <div className={styles["linkButtons"]}> 
          <Link to="/">
            <button
              style={{
                padding: "10px 15px",
                marginTop: "0px",
                marginLeft: "70em",
                backgroundColor: "rgba(160, 222, 68, 0.271)",
                font: "Apple SD Gothic Neo",
                borderRadius: "30px",
                fontSize: "1rem",
                whiteSpace: "nowrap",
              }}
              aria-label="Back to Homepage"
            >
              Back to Homepage
            </button>
          </Link>
          <SignedIn>
            <SignOutButton>
              <Link to="/">
                <button
                  style={{
                    padding: "10px 15px",
                    marginTop: "0px",
                    marginLeft: "0.5em",
                    backgroundColor: "rgba(160, 222, 68, 0.271)",
                    font: "Apple SD Gothic Neo",
                    borderRadius: "30px",
                    fontSize: "1rem",
                    whiteSpace: "nowrap",
                  }}
                  aria-label="Sign Out"
                >
                  Sign Out
                </button>
              </Link>
            </SignOutButton>
          </SignedIn>
        </div>
        <h1>Learn Korean</h1>
        <ProgressBar data-testid="progress-bar" progress={progress} />
        <div data-testid="card-container" className={styles["card-container"]}>
          <Card
            data-testid="card"
            character={currentCharacter.character}
            romanization={currentCharacter.roman_representation}
            highlight={isCorrect}
            showHint={showHints}
          />
          <div className={styles["toggle-container"]} data-testid="toggle-container">
            <div
              className={`${styles["slider"]} ${
                showHints ? styles["slider-on"] : styles["slider-off"]
              }`}
              data-testid="toggle-slider"
              onClick={() => setShowHints(!showHints)}
            >
              <div className={styles["slider-thumb"]} data-testid="toggle-thumb"></div>
            </div>
            <span className={styles["toggle-label"]} data-testid="toggle-label">
              {showHints ? "Hints On" : "Hints Off"}
            </span>
          </div>
        </div>

        <div className={styles["timer-container"]}>
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
          <p data-testid="timer-text" className={styles["timer-text"]}>
            Time: {Math.floor(totalTimeSpent / 60)}:{("0" + (totalTimeSpent % 60)).slice(-2)}
          </p>
        </div>
      </div>
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
      
      <KoreanKeyboard onClick={handleKeyPress} disabled={isPaused || isLessonComplete} />
    </div>
  );
};

export default LearnPage;
