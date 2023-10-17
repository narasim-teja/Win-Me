import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function FinishLine(props) {
  const { nodes, materials } = useGLTF(
    "/models/finishLine.glb"
  );
  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.GPL_goal_02_Material006_0.geometry}
          material={materials["Material.006"]}
          scale={100}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/finishLine.glb");
