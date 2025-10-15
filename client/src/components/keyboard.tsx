import React, { useEffect, useState } from "react";
import styles from "../styles/keyboard.module.scss";

const keyboardLayout = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Delete"],
  [
    "Tab",
    "ㅂ",
    "ㅈ",
    "ㄷ",
    "ㄱ",
    "ㅅ",
    "ㅛ",
    "ㅕ",
    "ㅑ",
    "ㅐ",
    "ㅔ",
    "[",
    "]",
    "\\",
  ],
  [
    "CapsLock",
    "ㅁ",
    "ㄴ",
    "ㅇ",
    "ㄹ",
    "ㅎ",
    "ㅗ",
    "ㅓ",
    "ㅏ",
    "ㅣ",
    ";",
    "'",
    "Enter",
  ],
  ["Shift", "ㅋ", "ㅌ", "ㅊ", "ㅍ", "ㅠ", "ㅜ", "ㅡ", ",", ".", "/", "Shift"],
  ["Fn", "Control", "Alt", "Cmd", "Space", "Cmd", "Alt", "Control"],
];

const shiftKeyboardLayout = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Delete"],
  [
    "Tab",
    "ㅃ",
    "ㅉ",
    "ㄸ",
    "ㄲ",
    "ㅆ",
    "ㅛ",
    "ㅕ",
    "ㅑ",
    "ㅐ",
    "ㅔ",
    "[",
    "]",
    "\\",
  ],
  [
    "CapsLock",
    "ㅁ",
    "ㄴ",
    "ㅇ",
    "ㄹ",
    "ㅎ",
    "ㅗ",
    "ㅓ",
    "ㅏ",
    "ㅣ",
    ";",
    "'",
    "Enter",
  ],
  ["Shift", "ㅋ", "ㅌ", "ㅊ", "ㅍ", "ㅠ", "ㅜ", "ㅡ", ",", ".", "/", "Shift"],
  ["Fn", "Control", "Alt", "Cmd", "Space", "Cmd", "Alt", "Control"],
];

const koreanToKey: { [key: string]: string } = {
  ㅂ: "q",
  ㅃ: "Q",
  ㅈ: "w",
  ㅉ: "W",
  ㄷ: "e",
  ㄸ: "E",
  ㄱ: "r",
  ㄲ: "R",
  ㅅ: "t",
  ㅆ: "T",
  ㅛ: "y",
  ㅕ: "u",
  ㅑ: "i",
  ㅐ: "o",
  ㅔ: "p",
  ㅁ: "a",
  ㄴ: "s",
  ㅇ: "d",
  ㄹ: "f",
  ㅎ: "g",
  ㅗ: "h",
  ㅓ: "j",
  ㅏ: "k",
  ㅣ: "l",
  ㅋ: "z",
  ㅌ: "x",
  ㅊ: "c",
  ㅍ: "v",
  ㅠ: "b",
  ㅜ: "n",
  ㅡ: "m",
};

const KoreanKeyboard = ({ onClick }: { onClick?: (key: string) => void }) => {
  const [_, setValue] = useState("");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isShiftOrCapsLock, setIsShiftOrCapsLock] = useState(false); // New state variable
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // To set error messajes when the user clicks on the keyboard on the screen

  const handleMouseClick = (key: string) => {
    setErrorMessage("Please use your physical keyboard keys.");
    setTimeout(() => setErrorMessage(null), 2000); // Clear the error message after 2 seconds
  };

  const handleKeyPress = (key: string) => {
    if (onClick) {
      onClick(key);
    }
    const keyboardKey = koreanToKey[key] || key;
    setActiveKey(keyboardKey);
    if (key === "Delete") {
      setValue(prevInput => prevInput.slice(0, -1));
    } else if (key === "Shift" || key === "CapsLock") {
      setIsShiftOrCapsLock(prevState => !prevState); // Toggle the state when Shift or Caps Lock is pressed
    } else {
      setValue(prevInput => prevInput + key);
    }
  };

  const getKeyClassName = (key: string) => {
    let className = styles.key;
    if (key === activeKey) {
      className += ` ${styles.active}`;
    }
    if (key === "Space") return `${styles.key} ${styles.space}`;
    if (key === "Shift") return `${styles.key} ${styles.shift}`;
    if (key === "CapsLock") return `${styles.key} ${styles.caps}`;
    if (key === "Enter") return `${styles.key} ${styles.enter}`;
    if (key === "Control") return `${styles.key} ${styles.control}`;
    if (key === "Cmd") return `${styles.key} ${styles.cmd}`;
    if (key === "Tab") return `${styles.key} ${styles.tab}`;

    if (["Fn", "Alt"].includes(key)) {
      return `${styles.key} ${styles.special}`;
    }
    return className;
  };

  return (
    <div className={styles["keyboard-container"]}>
      {/* Render the error message */}
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
  
      {/* Render the keyboard layout */}
      {(isShiftOrCapsLock ? shiftKeyboardLayout : keyboardLayout).map(
        (row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((key, keyIndex) => (
              <button
                key={keyIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setErrorMessage("Please use your physical keyboard keys."); // Virtual keyboard only for reference, redirect user to use physical keyboard
                  setTimeout(() => setErrorMessage(null), 2000); // Clear the message after 2 seconds
                }}
                onClick={() => handleKeyPress(key)}
                className={getKeyClassName(key)}
                id={`keyboard-btn-${key}`}
              >
                {key}
              </button>
            ))}
          </div>
        )
      )}
    </div>
  );  
};

export const useAnimateClick = (key: string, responseState: ResponseState) => {
  useEffect(() => {
    if (responseState.keyClicked) {
      const button = document.getElementById(`keyboard-btn-${key}`);
      if (button) {
        button.classList.add(styles["key-active"]);
        setTimeout(() => {
          button.classList.remove(styles["key-active"]);
          responseState.setKeyClicked(false);
        }, 100);
      }
    }
  }, [key, responseState.keyClicked]);
};

export default KoreanKeyboard;
