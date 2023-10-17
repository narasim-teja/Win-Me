// import {
//   Environment,
//   Html,
//   OrbitControls,
//   PerspectiveCamera,
// } from "@react-three/drei";
// import { Suspense, useEffect, useState, useRef } from "react";
// import { Car } from "./Car";
// import { Ground } from "./Ground";
// import { Track } from "./Track";
// import { useMemo } from "react";
// import { Coin } from "./Coin";
// import "./index.css";
// import { Perf } from "r3f-perf";


// export function Scene() {

//   const [thirdPerson, setThirdPerson] = useState(false);
//   const [cameraPosition, setCameraPosition] = useState([-6, 3.9, 6.21]);
//   const [points, setPoints] = useState(0); // Initialize points state
//   const [coins, setCoins] = useState([
//     [-4.5, 0.09, 2],
//     [-4.5, 0.09, 0],
//     [0.5, 0.09, -0.1],
//     [-5.5, 0.09, 3],
//     [-2.5, 0.09, -4],
//     [2.5, 0.09, -4],
//     [1.5, 0.09, 2],
//     [-6.5, 0.09, -4],
//     [-1, 0.6,0],
//     [-1.5, 0.09, 1.9],
//     [-5.3, 0.09, 1],

//   ]);

//   // Function to handle picking up a coin
//   const handlePickup = (index) => {
//     // Update the points and remove the picked-up coin
//     setPoints(points + 1);
//     const updatedCoins = [...coins];
//     updatedCoins.splice(index, 1);
//     setCoins(updatedCoins);
//     // console.log("inside function")
//     // Check if the player has collected enough coins
    
//   };

  

//   useEffect(() => {
//     function keydownHandler(e) {
//       if (e.key === "k") {
//         // random is necessary to trigger a state change
//         if (thirdPerson)
//           setCameraPosition([-6, 4.9, 6.21 + Math.random() * 0.01]);
//         setThirdPerson(!thirdPerson);
//       }
//     }

//     window.addEventListener("keydown", keydownHandler);
//     return () => window.removeEventListener("keydown", keydownHandler);
//   }, [thirdPerson]);



//   return (
//     <Suspense fallback={null}>
//       <Perf />
//       <Environment
//         files={process.env.PUBLIC_URL + "/textures/envmap.hdr"}
//         background={"both"}
//       />

//       <PerspectiveCamera makeDefault position={cameraPosition} fov={40} />
//       {!thirdPerson && <OrbitControls target={[-2.64, -0.71, 0.03]} />}

//       <Ground />
//       <Track />
 
//       <Car thirdPerson={thirdPerson} />

//       <Html>
//         <div className="points-display">Coins: {points}</div>
//       </Html>


//       {coins.map((position, index) => (
//         <Coin
//           key={index}
//           position={position}
//           onPickup={() => handlePickup(index)}
//           // Pass the car ref to the Coin component
//         />
//       ))}
//     </Suspense>
//   );
// }


import {
  Environment,
  Html,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense, useEffect, useState, useRef,useReducer } from "react";
import { Car } from "./Car";
import { Ground } from "./Ground";
import { Track } from "./Track";
import { useMemo } from "react";
import { Coin } from "./Coin";
import "./index.css";
import { Perf } from "r3f-perf";
import { useFrame } from "@react-three/fiber";
import { FinishLine } from "./FinishLine";
import { StartLine } from "./StartLine";

// Reducer function to handle user inputs
const userInputReducer = (state, action) => {
  switch (action.type) {
    case "KEY_DOWN":
    case "KEY_UP":
      return [...state, action.input];
    default:
      return state;
  }
};


export function Scene() {

  const [thirdPerson, setThirdPerson] = useState(false);
  const [cameraPosition, setCameraPosition] = useState([-6, 3.9, 6.21]);
  const [points, setPoints] = useState(0); // Initialize points state
  const [coins, setCoins] = useState([
    [-4.5, 0.09, 2],
    [-4.5, 0.09, 0],
    [0.5, 0.09, -0.1],
    [-5.5, 0.09, 3],
    [-2.5, 0.09, -4],
    [2.5, 0.09, -4],
    [1.5, 0.09, 2],
    [-6.5, 0.09, -4],
    [-1, 0.6,0],
    [-1.5, 0.09, 1.9],
    [-5.3, 0.09, 1],

  ]);
  const [userInputs, dispatch] = useReducer(userInputReducer, []);
  const [frameCount, setFrameCount] = useState(0);
  const [startLineVisible, setStartLineVisible] = useState(true);

  // Function to handle picking up a coin
  const handlePickup = (index) => {
    // Update the points and remove the picked-up coin
    setPoints(points + 1);
    const updatedCoins = [...coins];
    updatedCoins.splice(index, 1);
    setCoins(updatedCoins);
    // console.log("inside function")
    // Check if the player has collected enough coins
    
  };

  // Function to handle the start line pickup
  const handleStartLinePickup = () => {
    // Update the visibility of the start line when it's picked up
    setStartLineVisible(false);
  };

  const handleKeyDown = (e) => {
    dispatch({
      type: "KEY_DOWN",
      input: { key: e.key, type: "keydown", frame: frameCount },
    });
  };

  const handleKeyUp = (e) => {
    dispatch({
      type: "KEY_UP",
      input: { key: e.key, type: "keyup", frame: frameCount },
    });
  };

  useEffect(() => {
    function keydownHandler(e) {
      if (e.key === "k") {
        if (thirdPerson) {
          setCameraPosition([-6, 4.9, 6.21 + Math.random() * 0.01]);
        }
        setThirdPerson(!thirdPerson);
      }
      if (e.key === "u") {
        const json = JSON.stringify(userInputs);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "user_inputs.json";
        a.click();
        URL.revokeObjectURL(url);
      }
    }

    window.addEventListener("keydown", keydownHandler);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", keydownHandler);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [thirdPerson, userInputs]);

  

  useFrame(() => {
  
    setFrameCount((prevFrameCount) => prevFrameCount + 1);
    
  });
 



  return (
    <Suspense fallback={null}>
      <Perf/>
      <Environment
        files={process.env.PUBLIC_URL + "/textures/envmap.hdr"}
        background={"both"}
      />

      <PerspectiveCamera makeDefault position={cameraPosition} fov={40} />
      {!thirdPerson && <OrbitControls target={[-2.64, -0.71, 0.03]} />}

      <Ground />
      <Track />
      { (points >=3 ) && <FinishLine scale={0.1} position={[-1,0.7,0]} rotation-y={Math.PI} />}
      <StartLine scale={0.003} position={[-1,0,-1]} onPickup={handleStartLinePickup} />
 
      <Car thirdPerson={thirdPerson} />

      <Html>
        <div className="points-display">Coins: {points}</div>
      </Html>


      {coins.map((position, index) => (
        <Coin
          key={index}
          position={position}
          onPickup={() => handlePickup(index)}
          // Pass the car ref to the Coin component
        />
      ))}
    </Suspense>
  );
}


