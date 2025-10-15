import { Link } from "react-router-dom";
import styles from "../../styles/LeaderBoard.module.scss";
import { useEffect, useState } from "react";
import LeaderBoardInfo from "../LeaderboardInfo";

/**
 * LeaderBoard component - The display area for users rankings 
 */

const LeaderBoard = () => {

  const [items, setItems] = useState<Map<string, Object>[]>([]);
  async function getPeople(){
    const response = await fetch("http://localhost:3232/getScore?userid=all");
    const result = await response.json();
    let users: Map<string, Object>[] = [];
    for (const item of result.score) {
      const userData = await fetch("http://localhost:3232/getScore?userid=" + item.userid);
      const userScore = await userData.json();
      console.log(userScore.score[0].tag);
      if(userScore.score[0].tag != null){
        let map = new Map<string, Object>(Object.entries(userScore.score[0]))
        users.push(map);
      }
    }
    

    // Sort the users list based on the score 
    users.sort((a, b) => { 
      const aScore = Number(a.get('score')) || 0; 
      const bScore = Number(b.get('score')) || 0;

      return aScore - bScore; });
    users.reverse();
    setItems(users);
  }

  useEffect(() => {
    getPeople();
  }, []);
  
  return (
    <div className={styles["leaderBoard-page"]}>
      <Link to="/">
        <button
          style={{
            padding: "10px 15px",
            marginTop: "0px",
            marginLeft: "350%",
            backgroundColor: "rgba(160, 222, 68, 0.271)",
            font: "Apple SD Gothic Neo",
            borderRadius: "30px",
            fontSize: "1rem",
            whiteSpace: "nowrap",
          }}
          aria-label="Home page button"
        >
          Back to Homepage
        </button>
      </Link>
      <h1 className={styles["header"]}>Leaderboard <LeaderBoardInfo/></h1>
      <div className="leaderBoard">
      <ul>
        {items.map((item, index) => {
          let className = '';
          const key = item.get('userid');

          switch(index){
            case 0:
              className = "first";
              break;
            case 1:
              className = "second";
              break;
            case 2:
              className = "third";
              break;
            default:
              className = "entry";
              break;
          }
          return(
           <li
            key={index} className={styles[className]}> {String(item.get('tag'))} - {String(item.get('score'))} 
           </li> );
        })}
      </ul>
      </div>
    </div>
  );
};

export default LeaderBoard;
