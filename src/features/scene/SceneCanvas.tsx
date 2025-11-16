import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FieldGrid from "./FieldGrid";

export default function SceneCanvas() {
  return (
    <div className="relative h-full rounded-2xl border border-lime-400/40 bg-gradient-to-br from-lime-400/10 via-slate-950 to-slate-950 overflow-hidden shadow-[0_0_50px_rgba(190,242,100,0.25)]">
      {/* 左上角标签 */}
      <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-slate-950/80 px-3 py-1 text-[10px] md:text-xs text-lime-200 border border-lime-400/50">
        数字孪生 · 水稻大田
      </div>

      {/* 右上角图例 */}
      <div className="pointer-events-none absolute right-3 top-3 z-10 hidden md:flex items-center gap-2 text-[10px] text-lime-200/90">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#bef264]" />
          <span>长势良好</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#4ade80]" />
          <span>需关注区块</span>
        </div>
      </div>

      <Canvas camera={{ position: [15, 20, 25], fov: 45 }} shadows>
        <ambientLight intensity={0.65} />
        <directionalLight position={[20, 30, 10]} intensity={1.1} castShadow />

        {/* 辅助网格线 */}
        {/* @ts-ignore */}
        <gridHelper args={[40, 40, "#22c55e", "#16a34a"]} />

        <FieldGrid />

        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}
