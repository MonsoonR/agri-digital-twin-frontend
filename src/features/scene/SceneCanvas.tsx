import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FieldPlane from "./FieldPlane";

export default function SceneCanvas() {
  return (
    <div className="w-full h-full bg-slate-950 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [20, 20, 20], fov: 45 }}
        shadows
      >
        {/* 环境光 & 平行光 */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[20, 30, 10]}
          intensity={1}
          castShadow
        />

        {/* 地面网格 */}
        {/* @ts-ignore（gridHelper 是内置 primitive） */}
        <gridHelper args={[50, 50]} />

        {/* 田块平面（后面可以分割成很多块，每块代表一块地） */}
        <FieldPlane />

        {/* 轨道控制器，可以拖动旋转缩放查看 */}
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}
