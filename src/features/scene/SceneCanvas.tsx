// src/features/scene/SceneCanvas.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FieldGrid from "./FieldGrid";

export default function SceneCanvas() {
  return (
    <div className="relative h-full rounded-2xl border border-lime-400/40 bg-gradient-to-br from-sky-900/30 via-slate-950 to-slate-950 overflow-hidden shadow-[0_0_50px_rgba(190,242,100,0.25)]">
      {/* 左上角标签 */}
      <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-slate-950/80 px-3 py-1 text-[10px] md:text-xs text-lime-200 border border-lime-400/50">
        数字孪生 · 水稻大田
      </div>

      {/* 右上角图例 + 日照说明 */}
      <div className="pointer-events-none absolute right-3 top-3 z-10 hidden md:flex items-center gap-3 text-[10px] text-lime-200/90">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#bef264]" />
          <span>长势良好</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#facc15]" />
          <span>补光开启</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-base">☀️</span>
          <span>日照模拟</span>
        </div>
      </div>

      <Canvas camera={{ position: [13, 15, 24], fov: 45 }} shadows>
        {/* 背景色 */}
        <color attach="background" args={["#020617"]} />

        {/* 天空光 + 地面反射光 */}
        <hemisphereLight
          intensity={0.45}
          groundColor={"#022c22"}
          color={"#e0f2fe"}
        />

        {/* 主方向光：太阳 */}
        <directionalLight
          position={[30, 35, 15]}
          intensity={1.4}
          color={"#fde68a"}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* 冷色补光，让阴影柔和一点 */}
        <directionalLight
          position={[-20, 15, -10]}
          intensity={0.4}
          color={"#38bdf8"}
        />

        {/* 轻微雾效 */}
        {/* @ts-ignore */}
        <fog attach="fog" args={["#020617", 25, 80]} />

        <FieldGrid />

        <OrbitControls
          makeDefault
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={18}
          maxDistance={40}
        />
      </Canvas>
    </div>
  );
}
