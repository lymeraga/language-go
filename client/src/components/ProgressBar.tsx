import React from "react";
import styles from "../styles/ProgressBar.module.scss";

interface ProgressBarProps {
  progress: number; // Progress percentage
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className={styles["progress-bar"]} data-testid="progress-bar">
    <div
      className={styles.progress}
      data-testid="progress-bar-inner"
      style={{
        width: `${progress}%`, // Dynamically set the width
      }}
    ></div>
  </div>
)};

export default ProgressBar;
