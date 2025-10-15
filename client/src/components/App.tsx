import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LearnPage from "../components/pages/LearnPage";
import HomePage from "../components/pages/HomePage";
import PracticePage from "../components/pages/PracticePage";
import LeaderBoard from "../components/pages/LeaderBoard";


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home page route */}
        <Route path="/" element={<HomePage />} />
        {/* LearnPage route */}
        <Route path="/learnPage" element={<LearnPage />} />
        {/* LeaderBoard route */}
        <Route path="/leaderBoard" element={<LeaderBoard />} />
        {/* PracticePage route */}
        <Route path="/practicePage/:level" Component={PracticePage} />
      </Routes>
    </Router>
  );
};

export default App;
