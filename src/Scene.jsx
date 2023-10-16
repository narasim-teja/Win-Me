import {
  Environment,
  Html,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Suspense, useEffect, useState, useRef } from "react";
import { Car } from "./Car";
import { Ground } from "./Ground";
import { Track } from "./Track";
import { useMemo } from "react";
import { Coin } from "./Coin";
import "./index.css";
import { Perf } from "r3f-perf";


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

  

  useEffect(() => {
    function keydownHandler(e) {
      if (e.key === "k") {
        // random is necessary to trigger a state change
        if (thirdPerson)
          setCameraPosition([-6, 4.9, 6.21 + Math.random() * 0.01]);
        setThirdPerson(!thirdPerson);
      }
    }

    window.addEventListener("keydown", keydownHandler);
    return () => window.removeEventListener("keydown", keydownHandler);
  }, [thirdPerson]);



  return (
    <Suspense fallback={null}>
      <Perf />
      <Environment
        files={process.env.PUBLIC_URL + "/textures/envmap.hdr"}
        background={"both"}
      />

      <PerspectiveCamera makeDefault position={cameraPosition} fov={40} />
      {!thirdPerson && <OrbitControls target={[-2.64, -0.71, 0.03]} />}

      <Ground />
      <Track />
 
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
