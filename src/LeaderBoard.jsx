import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './leaderBoard.css';

function getLeaderboardData() {
  return JSON.parse(localStorage.getItem('leaderboard')) || [];
}

const LeaderBoard = () => {
  const location = useLocation();
  const { state } = location;
  const [isDataAdded, setDataAdded] = useState(false); // Track if data has been added

  useEffect(() => {
    if (isDataAdded) {
      return; // Data has already been added, do not proceed
    }

    if (state && state.points && state.finishLineFrame) {
      const { points, finishLineFrame } = state;
      const seconds = (finishLineFrame + 259) / 30;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      const newEntry = {
        walletAddress: '', // Set the wallet address if available
        points: points,
        time: `${minutes > 0 ? `${minutes} min ` : ''}${remainingSeconds.toFixed(2)} sec`,
        finishLineFrame: finishLineFrame,
      };

      const leaderboardData = getLeaderboardData();

      // Check for duplicates based on a unique identifier
      const isDuplicate = leaderboardData.some((entry) => {
        return (
          entry.points === newEntry.points &&
          entry.finishLineFrame === newEntry.finishLineFrame
        );
      });

      if (!isDuplicate) {
        leaderboardData.push(newEntry);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
        setDataAdded(true); // Mark data as added
      }
    }
  }, [isDataAdded, state]);

  const storedLeaderboardData = getLeaderboardData().sort(
    (a, b) => a.finishLineFrame - b.finishLineFrame
  );

  storedLeaderboardData.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return (
    <div className='leaderBoard-container' >
      <h1>Leaderboard</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Wallet Address</th>
            <th>Points</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {storedLeaderboardData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.rank}</td>
              <td>{entry.walletAddress}</td>
              <td>{entry.points}</td>
              <td>{entry.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderBoard;
