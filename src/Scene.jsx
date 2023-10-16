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
    [-4.5, 0.01, 2],
    [-5.5, 0.01, 3],
    [-2.5, 0.01, -4],
    [2.5, 0.01, -4],
    [-1, 0.7,0]

  ]);




  // // Function to generate coin positions in a circular pattern
  // const generateCircularCoinPositions = () => {
  //   const numCoins = 10; // Adjust the number of coins as needed
  //   const circleRadius = 5; // Radius of the circular pattern

  //   const coinPositions = [];

  //   for (let i = 0; i < numCoins; i++) {
  //     const angle = (i / numCoins) * Math.PI * 2; // Distribute coins evenly around the circle
  //     const x = circleRadius * Math.cos(angle);
  //     const z = circleRadius * Math.sin(angle);
  //     const y = 0.01; // Adjust the height of the coins as needed

  //     coinPositions.push([x, y, z]);
  //   }

  //   return coinPositions;
  // };

  // // Generate coin positions in a circular pattern when the component mounts
  // useMemo(() => {
  //   const newCoins = generateCircularCoinPositions();
  //   setCoins(newCoins);
  // }, []);

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
