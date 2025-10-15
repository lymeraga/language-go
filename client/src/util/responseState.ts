import { useState, useRef } from "react";
/**
 * Interface defining the state structure for handling responses
 */
export interface ResponseState {
  // Overall progress tracking
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  // Sentence management
  sentences: string[][]; // All sentences in the lesson as nested arrays of words
  sentenceIndex: number; // Current sentence position
  setSentenceIndex: React.Dispatch<React.SetStateAction<number>>;
  // Current sentence tracking
  currSentence: string[];
  setCurrSentence: React.Dispatch<React.SetStateAction<string[]>>;
  // Word tracking within current sentence
  wordIndex: number;
  setWordIndex: React.Dispatch<React.SetStateAction<number>>;
  // Input management
  correctInput: string;
  setCorrectInput: React.Dispatch<React.SetStateAction<string>>;
  userInput: string;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  // Correctness tracking for each word in each sentence
  correctStates: [boolean, React.Dispatch<React.SetStateAction<boolean>>][][];
}
/**
 * Initializes the response state with default values and state management functions
 * 
 * @param sentences - Array of sentences, where each sentence is an array of words
 * @returns ResponseState object containing all necessary state and setter functions
 * 
 * @example
 * const sentences = [["안녕", "하세요"], ["감사", "합니다"]];
 * const responseState = initializeResponseState(sentences);
 */
export const initializeResponseState = (sentences: string[][]): ResponseState => {
  const [progress, setProgress] = useState(0);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [correctInput, setCorrectInput] = useState(sentences[0][0]);
  const [currSentence, setCurrSentence] = useState(sentences[0]);
  // Initialize correctness tracking for each word in each sentence
  // Creates a 2D array of [boolean, setter] tuples
  const correctStates = sentences.map((sentence) =>
    sentence.map(() => {
      const [isCorrect, setIsCorrect] = useState(false);
      return [isCorrect, setIsCorrect];
    })
  );

  // Return complete state object with all properties and setters
  return {
    progress,
    setProgress,
    sentences,
    sentenceIndex,
    setSentenceIndex,
    currSentence,
    setCurrSentence,
    wordIndex,
    setWordIndex,
    correctInput,
    setCorrectInput,
    userInput,
    setUserInput,
    correctStates,
  };
};
