import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/clerk-react";
import styles from "../../styles/HomePage.module.scss";

// HomePage component is the main landing page for the LanguageGo platform
const HomePage = () => {
  const [userTag, setUserTag] = useState<string>("");
  const [showLevelMenu, setShowLevelMenu] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [numSessions, setNumsessions] = useState(0);
  const user = useUser().user;


  // useEffect hook to fetch user stats (score and session count) when user data changes
  useEffect(() => {
    const fetchUserStats = async () => {
      if (user?.id) {
        // Fetch score
        const scoreResponse = await fetch(`http://localhost:3232/getScore?userid=${user.id}`);
        const scoreResult = await scoreResponse.json();
        if (scoreResult.score && scoreResult.score[0]) {
          setUserScore(scoreResult.score[0].score || 0);
        }
        // Fetch session
        if (scoreResult.score && scoreResult.score[0]) {
          setNumsessions(scoreResult.score[0].sessions || 0);
        }
      }
    };

    fetchUserStats();
  }, [user?.id]);

  return (
 
    <div>
      <div className={styles.flagBar}>
        <img
          src="/logo.png"
          alt="Logo"
          aria-label="Platform logo"
          className={styles.logo}
        />
        <img
          src="/korea.png"
          alt="Flag 1"
          aria-label="Korean flag"
          className={styles.flag}
        />
        <img
          src="/japan.png"
          alt="Flag 2"
          aria-label="Japanese flag"
          className={styles.flag}
        />
        <img
          src="/mongolia.png"
          alt="Flag 3"
          aria-label="Mongolian flag"
          className={styles.flag}
        />
        <img
          src="/china.png"
          alt="Flag 4"
          aria-label="Chinese flag"
          className={styles.flag}
        />
      </div>

      <h1 className={styles.header} aria-label="Welcome to LanguageGo!">
          Welcome to LanguageGo!
      </h1>

      <SignedOut>
        {/* Only show these sections when the user is signed out */}
        <h3 className={styles.slogan} aria-label="Platform Slogan">
          The Best Way to Practice Typing in a New Language
        </h3>
        <p className={styles.description} aria-label="Platform description">
          Our platform helps you learn how to type in new languages quickly and
          effectively. By providing interactive lessons and practice exercises,
          we focus on building muscle memory for typing different alphabets.
          Whether you're learning Hangul, Arabic, or any other script, you'll be
          able to practice typing in a new language and improve your speed and
          accuracy over time.
        </p>
        <div className="videoandstats">
          <video
            width="600"
            loop
            autoPlay
            muted
            aria-label="Demo Video"
            className={styles.video}
          >
            <source src="/demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </SignedOut>

      <SignedIn>
        {/* Only show this input section when the user is signed in */}
        <div className={styles.inputSection}>
          <p className={styles.description}>
            If you want your score to be displayed on the Leaderboard, enter or
            update your User Tag!
          </p>
          <input
            className={styles.inputBox}
            aria-label="Input Space"
            type="text"
            value={userTag}
            onChange={(e) => setUserTag(e.target.value)}
            placeholder="Enter Here!"
            onKeyPress={async (e) => {
              if (e.key === "Enter") {
                setUserTag("");
                await fetch(
                  `http://localhost:3232/updateTag?tag=${userTag}&userid=${user?.id}`
                );
              }
            }}
          />
        </div>
        {/* <Dashboard accuracy={accuracy} numSessions={numSessions} /> */}
        <div className={styles.table}>
      <table>
        <thead>
          <tr>
            <th colspan="2">Dashboard</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td aria-label="Number of Sessions">Number of Sessions</td>
            <td>{numSessions}</td>
          </tr>
          <tr>
            <td aria-label="Score">Score</td>
            <td>{userScore}</td>
          </tr>
        </tbody>
      </table>
      </div>
      </SignedIn>

      <div className={styles.buttonContainer}>
        <SignedOut>
          <SignInButton>
            <Link to="/">
              <button aria-label="Sign In Button" className={styles.button}>
                Sign In
              </button>
            </Link>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <SignOutButton>
            <Link to="/">
              <button aria-label="Sign Out Button" className={styles.button}>
                Sign Out
              </button>
            </Link>
          </SignOutButton>
        </SignedIn>
        <Link to="/leaderBoard">
          <button
            className={styles.button}
            aria-label="Leaderboard Button"
          >
            LeaderBoard
          </button>
        </Link>
        <Link to="/learnPage">
          <button
            className={styles.button}
            aria-label="Learning Mode Button"
          >
            Learning Mode
          </button>
        </Link>
        <div className={styles.levelDropdown}>
          <button
            className={styles.button}
            onClick={() => setShowLevelMenu(!showLevelMenu)}
            aria-label="Select Practice Level"
          >
            Practice Mode
          </button>
          {showLevelMenu && (
            <div className={styles.dropdownMenu}>
              <Link to="/practicePage/beginner">
                <button aria-label="Beginner level practice option" className={styles.levelButton}>Beginner</button>
              </Link>
              <Link to="/practicePage/intermediate">
                <button aria-label="Intermediate level practice option" className={styles.levelButton}>Intermediate</button>
              </Link>
              <Link to="/practicePage/advanced">
                <button aria-label="Advanced level practice option" className={styles.levelButton}>Advanced</button>
              </Link>
            </div>
          )}
        </div>
      </div>
     
    </div>
  );
};

export default HomePage;
