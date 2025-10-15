import { ResponseState } from "./responseState";
/**
 * Advances to the next word or sentence in the learning sequence
 * 
 * @param responseState - The current state object containing:
 *   - wordIndex: Current position within the sentence
 *   - currSentence: Array of words in the current sentence
 *   - sentences: Array of all sentences in the lesson
 *   - sentenceIndex: Current sentence position
 *   - setWordIndex: Function to update word position
 *   - setCorrectInput: Function to set the expected input
 *   - setSentenceIndex: Function to update sentence position
 *   - setCurrSentence: Function to set the current sentence
 *   - setProgress: Function to update overall progress
 */
export const toNext = (responseState: ResponseState) => {
    const { wordIndex, currSentence, sentences, sentenceIndex, setWordIndex, setCorrectInput } =
      responseState;
    // Check if there are more words in the current sentence
    if (wordIndex + 1 < currSentence.length) {
      setWordIndex(wordIndex + 1);
      setCorrectInput(currSentence[wordIndex + 1]);
    } else {
      // Check if there are more sentences
      if (sentenceIndex + 1 < sentences.length) {
        responseState.setSentenceIndex(sentenceIndex + 1);
        responseState.setCurrSentence(sentences[sentenceIndex + 1]);
        responseState.setWordIndex(0);
        responseState.setCorrectInput(sentences[sentenceIndex + 1][0]);
      } else {
        // All sentences completed
        responseState.setProgress(sentences.length);
      }
    }
  };
  /**
   * Resets the user's input field
   * Used after processing each word input, whether correct or incorrect
   * 
   * @param responseState - The current state object containing:
   *   - setUserInput: Function to update the user's input field
   */
  export const resetResponse = (responseState: ResponseState) => {
    responseState.setUserInput("");
  };
  