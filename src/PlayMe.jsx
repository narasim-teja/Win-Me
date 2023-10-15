
import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { Physics } from "@react-three/cannon";
import Draw from "./Draw";
import { CarPositionProvider } from "./CarPositionContext";




const PlayMe = ({ importedData }) => {
    console.log("imported data", importedData);
   
    return (
      <CarPositionProvider>
        <>
          <Canvas>
            
            <Physics broadphase="SAP" gravity={[0, -2.6, 0]}>
              <Scene />
              
            </Physics>
          </Canvas>
  
          <div className="controls">
            <p>press w a s d to move</p>
           <p>press k to swap camera</p>
          <p>press r to reset</p>
          <p>press p to export</p>
          </div>
  
          {/* Pass importedData to Draw component */}
          <Draw carArray={importedData} />
        </>
      </CarPositionProvider>
    );
  };

export default PlayMe;
