import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FieldGrid from "./FieldGrid";

export default function SceneCanvas() {
  return (
    <div className="w-full h-full bg-slate-950 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [15, 20, 25], fov: 45 }} shadows>
        <ambientLight intensity={0.6} />
        <directionalLight position={[20, 30, 10]} intensity={1} castShadow />

        {/* 网格辅助线（可以留着调试用） */}
        {/* @ts-ignore */}
        <gridHelper args={[40, 40]} />

        <FieldGrid />

        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}
