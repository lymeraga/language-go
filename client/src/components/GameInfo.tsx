import React, { useState } from 'react';
import { Info, X, Gamepad2 } from 'lucide-react';
import styles from '../styles/GameInstructions.module.scss';

const GameInstructions = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={styles['instructions-button']}
        aria-label="Show game instructions"
      >
        <Gamepad2 className="w-6 h-6 text-[#7fc7b0]" />
      </button>

      {isOpen && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            {/* Header Section */}
            <div className={styles.header}>
              <div className={styles['header-content']}>
                <h3>How to Practice</h3>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className={styles['close-button']}
              aria-label="Close instructions"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Content */}
            <div className={styles.content}>
              {/* Getting Started Section */}
              <div className={styles.section}>
                <h3>
                  <span className={styles.number}>1</span>
                  Getting Started
                </h3>
                <ul>
                  <li>
                    <span className={styles.bullet}>•</span>
                    Type the Korean word shown in the box
                  </li>
                  <li>
                    <span className={styles.bullet}>•</span>
                    Press space or spacebar to submit
                  </li>
                </ul>
              </div>

              {/* Game Progress Section */}
              <div className={styles.section}>
                <h3>
                  <span className={styles.number}>2</span>
                  Game Progress
                </h3>
                <ul>
                  <li>
                    <span className={styles.bullet}>•</span>
                    <span className="flex items-center">
                      <span className={`${styles.indicator} ${styles.green}`}></span>
                      Green words show correct answers
                    </span>
                  </li>
                  <li>
                    <span className={styles.bullet}>•</span>
                    <span className="flex items-center">
                      <span className={`${styles.indicator} ${styles.red}`}></span>
                      Red means try again!
                    </span>
                  </li>
                </ul>
              </div>

              {/* Pro Tips Section */}
              <div className={styles.section}>
                <h3>
                  <span className={styles.number}>3</span>
                  Pro Tips
                </h3>
                <ul>
                  <li>
                    <span className={styles.bullet}>•</span>
                    Hover over words to see translations!
                  </li>
                  <li>
                    <span className={styles.bullet}>•</span>
                    Use the on-screen keyboard as reference
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer with Start Button */}
            <div className={styles.footer}>
              <button
                onClick={() => setIsOpen(false)}
                className={styles['start-button']}
              >
                Start Typing! ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameInstructions;