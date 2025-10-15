import React, { useState } from 'react';
import { Info, X, Gamepad2 } from 'lucide-react';
import styles from '../styles/GameInstructions.module.scss';

const LeaderBoardInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={styles['instructions-button']}
        style={{
                borderRadius: "15px",
                backgroundColor: "white",
                border: "white",
                height: "35px",
        }}
        aria-label="Show game instructions"
      >

        <Info  />
      </button>

      {isOpen && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            {/* Header Section */}
            <div className={styles.header}>
              <div className={styles['header-content']}>
                <h3>How Scoring is Calculated</h3>
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
              <div className={styles.section}>
                
                <h3 style={{
                        font: "Apple SD Gothic Neo",
                        textAlign: "left",
                    }}>
                  Scoring is calculated for each lesson by your accuracy and speed. Additionally,
                  the harder a lesson is the more points you will get for each lesson. After each 
                  lesson your points will be added to your total, and displayed here if you choose
                  to enter a user tag!
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaderBoardInfo;