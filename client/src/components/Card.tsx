import React from "react";
import styles from "../styles/card.module.scss";

interface CardProps {
  character: string; // Korean character
  romanization: string; // Romanized hint
  highlight: boolean | null; // Feedback state
  showHint: boolean;
}

const Card: React.FC<CardProps> = ({ character, romanization, highlight, showHint }) => {
  const getHighlightClass = () => {
    if (highlight === true) return styles.correct; // Green for correct
    if (highlight === false) return styles.incorrect; // Red for incorrect
    return ""; // Default
  };

  // Add "Shift +" for double characters that need Shift
  const displayRomanization = romanization.startsWith("Shift +")
    ? romanization
    : romanization.toUpperCase() !== romanization
    ? romanization
    : `Shift + ${romanization}`;

    return (
      <div
      className={`${styles.card} ${highlight === true ? styles.correct : highlight === false ? styles.incorrect : ""}`}
      data-testid={highlight === false ? "feedback-incorrect" : highlight === true ? "feedback-correct" : "feedback-default"}
    >
      <div className={styles.character} data-testid="card-character">{character}</div>
      {showHint && (
        <div className={styles.romanization} data-testid="card-romanization">
          Press: {displayRomanization}
        </div>
      )}
    </div>
    )
  };

  export default Card;