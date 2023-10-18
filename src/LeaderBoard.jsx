import React from 'react'
import { useLocation } from "react-router-dom";

const LeaderBoard = () => {
    const location = useLocation();
    const { state } = location;

    if (!state || !state.userInputsArray) {
        return <div>Error: Data not found.</div>;
    }

    const { carPositionArray, userInputsArray } = state;
  return (
    <div>
      <h1>Hurray, U won here comes your NFT</h1>

      <div>
        <h2>User Inputs</h2>
        <ul>
            {userInputsArray.map((input, index) => (
            <li key={index}>{input.key}</li>
            ))}
        </ul>
    </div>
      
    </div>
  )
}

export default LeaderBoard
