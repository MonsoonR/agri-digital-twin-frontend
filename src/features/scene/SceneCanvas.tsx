// src/features/scene/SceneCanvas.tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import FieldGrid from "./FieldGrid";
import { useTheme } from "../../store/themeStore";

export default function SceneCanvas() {
  const { isDark } = useTheme();
  
  return (
    <div className={`relative h-full rounded-2xl border overflow-hidden shadow-lg transition-all duration-300 ${
      isDark 
        ? 'border-lime-400/40 bg-gradient-to-br from-sky-900/30 via-slate-950 to-slate-950 shadow-[0_0_50px_rgba(190,242,100,0.25)]'
        : 'border-lime-500/30 bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-50 shadow-xl'
    }`}>
      {/* 左上角标签 */}
      <div className={`pointer-events-none absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[10px] md:text-xs border backdrop-blur-sm transition-all duration-300 ${
        isDark 
          ? 'bg-slate-950/80 text-lime-200 border-lime-400/50'
          : 'bg-white/80 text-gray-700 border-lime-500/40 shadow-md'
      }`}>
        数字孪生 · 水稻大田
      </div>

      {/* 右上角图例 + 日照说明 */}
      <div className={`pointer-events-none absolute right-3 top-3 z-10 hidden md:flex items-center gap-3 text-[10px] transition-colors ${
        isDark ? 'text-lime-200/90' : 'text-gray-700'
      }`}>
        <div className="flex items-center gap-1">
          <span className={`h-2 w-2 rounded-full ${isDark ? 'bg-[#bef264]' : 'bg-lime-500'}`} />
          <span>长势良好</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`h-2 w-2 rounded-full ${isDark ? 'bg-[#facc15]' : 'bg-amber-500'}`} />
          <span>补光开启</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-base">☀️</span>
          <span>日照模拟</span>
        </div>
      </div>

      <Canvas 
        camera={{ position: [13, 15, 24], fov: 45 }} 
        shadows
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        {/* 背景色 - 根据主题调整 */}
        <color attach="background" args={[isDark ? "#020617" : "#e0f2fe"]} />

        {/* 环境光照 - 根据主题调整强度和颜色 */}
        <ambientLight intensity={isDark ? 0.3 : 0.6} />
        
        {/* 天空光 + 地面反射光 */}
        <hemisphereLight
          intensity={isDark ? 0.45 : 0.7}
          groundColor={isDark ? "#022c22" : "#86efac"}
          color={isDark ? "#e0f2fe" : "#fef3c7"}
        />

        {/* 主方向光：太阳 - 根据主题调整 */}
        <directionalLight
          position={[30, 35, 15]}
          intensity={isDark ? 1.4 : 2.0}
          color={isDark ? "#fde68a" : "#fbbf24"}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        {/* 冷色补光 */}
        <directionalLight
          position={[-20, 15, -10]}
          intensity={isDark ? 0.4 : 0.6}
          color={isDark ? "#38bdf8" : "#7dd3fc"}
        />

        {/* 填充光 - 亮色模式下增加柔和度 */}
        {!isDark && (
          <pointLight
            position={[0, 10, 0]}
            intensity={0.3}
            color="#fef3c7"
            distance={50}
          />
        )}

        {/* 环境贴图 - 增加真实感（亮色模式下更明显） */}
        {!isDark && <Environment preset="park" />}

        {/* 轻微雾效 - 根据主题调整 */}
        <fog 
          attach="fog" 
          args={[
            isDark ? "#020617" : "#e0f2fe", 
            25, 
            isDark ? 80 : 100
          ]} 
        />

        <FieldGrid />

        <OrbitControls
          makeDefault
          enablePan={false}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={18}
          maxDistance={40}
          dampingFactor={0.05}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}