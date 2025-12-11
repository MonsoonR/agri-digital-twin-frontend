// src/features/scene/FieldGrid.tsx
import { useEffect, useMemo, useRef } from "react";
import { Color, Vector3, Group } from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useFieldStore } from "../../store/fieldStore";
import { useTheme } from "../../store/themeStore";
import type { FieldStatus, GrowthStage } from "../../types/field";

const CELL_SIZE = 3;
const CELL_GAP = 0.4;
const FIELD_THICKNESS = 0.9;

// 暗色主题颜色
const DARK_BAD = new Color("#4ade80");
const DARK_GOOD = new Color("#bef264");
const DARK_SOIL = new Color("#3a2105ff");
const DARK_GRID_LINE = new Color("#bbf7d0");

// 亮色主题颜色
const LIGHT_BAD = new Color("#84cc16");
const LIGHT_GOOD = new Color("#bef264");
const LIGHT_SOIL = new Color("#92400e");
const LIGHT_GRID_LINE = new Color("#65a30d");

type StressType = "healthy" | "lowLight" | "dry" | "soilPH";

const STAGE_FACTOR: Record<GrowthStage, number> = {
  分蘖期: 0.4,
  拔节期: 0.55,
  孕穗期: 0.7,
  抽穗期: 0.8,
  灌浆期: 0.9,
  成熟期: 1.0,
};

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function healthToColor(health: number, isDark: boolean): Color {
  const h = clamp(health, 0, 1);
  const c = new Color();
  if (isDark) {
    c.lerpColors(DARK_BAD, DARK_GOOD, h);
  } else {
    c.lerpColors(LIGHT_BAD, LIGHT_GOOD, h);
  }
  return c;
}

function getStressType(field: FieldStatus, supplementOn: boolean): StressType {
  const m = field.latestMetric || {};
  const badPH =
    m.soilPH !== undefined ? m.soilPH < 5.5 || m.soilPH > 7.2 : false;
  const highSalt = m.salinity !== undefined ? m.salinity > 8 : false;
  const lowLight = false; // 新数据无光照字段，保持默认

  if (highSalt) return "dry";
  if (badPH) return "soilPH";
  if (lowLight && !supplementOn) return "lowLight";
  return "healthy";
}

function getGrowthFactor(field: FieldStatus): number {
  const stageBase = STAGE_FACTOR[field.growthStage] ?? 0.6;
  const health = clamp(field.healthScore, 0.2, 1);
  const raw = 0.25 + stageBase * 0.6;
  const withHealth = raw * (0.6 + health * 0.4);
  return clamp(withHealth, 0.3, 1.3);
}

function RicePlant({
  height,
  color,
}: {
  height: number;
  color: string;
}) {
  const stemHeight = height;
  const leafHeight = height * 0.8;
  const stemRadius = 0.04;
  const leafWidth = 0.12;
  const leafThickness = 0.02;

  return (
    <group>
      {/* 茎 */}
      <mesh position={[0, stemHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry
          args={[stemRadius * 0.7, stemRadius, stemHeight, 8]}
        />
        <meshStandardMaterial 
          color="#16a34a"
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* 三片叶子 */}
      {Array.from({ length: 3 }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / 3;
        const r = 0.14;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;

        return (
          <mesh
            key={i}
            position={[x, stemHeight * 0.65, z]}
            rotation={[-0.7, angle, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[leafWidth, leafHeight, leafThickness]} />
            <meshStandardMaterial
              color={color}
              roughness={0.75}
              metalness={0.05}
              emissive={new Color(color)}
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function RicePatch({
  growth,
  stress,
  supplementOn,
  baseHeight,
  fieldId,
}: {
  growth: number;
  stress: StressType;
  supplementOn: boolean;
  baseHeight: number;
  fieldId: string;
}) {
  const groupRef = useRef<Group | null>(null);

  const swayBase = stress === "healthy" ? 0.02 : 0.035;
  const swaySpeed = stress === "healthy" ? 0.45 : 0.7;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const hash =
      fieldId
        .split("")
        .map((c) => c.charCodeAt(0))
        .reduce((a, b) => a + b, 0) / 80;

    const amp = swayBase * (0.6 + growth * 0.4);
    groupRef.current.rotation.z = amp * Math.sin(t * swaySpeed + hash);
    groupRef.current.rotation.x =
      amp * 0.5 * Math.cos(t * swaySpeed * 0.8 + 1.1 + hash * 0.7);
  });

  let plantColor =
    stress === "healthy"
      ? "#bef264"
      : stress === "lowLight"
      ? "#22c55e"
      : stress === "dry"
      ? "#facc15"
      : "#fb923c";

  if (supplementOn && stress === "lowLight") {
    plantColor = "#bef264";
  }

  const plantHeight = 0.7 + growth * 0.8;
  const span = CELL_SIZE * 0.35;
  const positions: [number, number][] = [
    [0, 0],
    [-span, -span],
    [span, -span],
    [-span, span],
    [span, span],
  ];

  return (
    <group ref={groupRef} position={[0, baseHeight + 0.03, 0]}>
      {positions.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <RicePlant
            height={plantHeight * (0.95 + i * 0.02)}
            color={plantColor}
          />
        </group>
      ))}
    </group>
  );
}

function getCellPosition(
  row: number,
  col: number,
  rows: number,
  cols: number
): Vector3 {
  const gridWidth = cols * CELL_SIZE + (cols - 1) * CELL_GAP;
  const gridHeight = rows * CELL_SIZE + (rows - 1) * CELL_GAP;

  const x0 = -gridWidth / 2 + CELL_SIZE / 2;
  const z0 = -gridHeight / 2 + CELL_SIZE / 2;

  const x = x0 + col * (CELL_SIZE + CELL_GAP);
  const z = z0 + row * (CELL_SIZE + CELL_GAP);

  return new Vector3(x, 0, z);
}

export default function FieldGrid() {
  const {
    fields,
    loading,
    error,
    selectedFieldId,
    hoveredFieldId,
    loadFields,
    setSelectedField,
    setHoveredField,
    lightingMode,
    manualLightOn,
  } = useFieldStore();
  
  const { isDark } = useTheme();

  useEffect(() => {
    if (fields.length === 0 && !loading && !error) {
      loadFields();
    }
  }, [fields.length, loading, error, loadFields]);

  const { rows, cols, gridWidth, gridHeight } = useMemo(() => {
    if (fields.length === 0) {
      return { rows: 0, cols: 0, gridWidth: 0, gridHeight: 0 };
    }
    const maxRow = Math.max(...fields.map((f) => f.row));
    const maxCol = Math.max(...fields.map((f) => f.col));
    const r = maxRow + 1;
    const c = maxCol + 1;
    const gw = c * CELL_SIZE + (c - 1) * CELL_GAP;
    const gh = r * CELL_SIZE + (r - 1) * CELL_GAP;
    return { rows: r, cols: c, gridWidth: gw, gridHeight: gh };
  }, [fields]);

  if (error) {
    console.error("加载田块数据失败", error);
  }

  if (fields.length === 0) {
    return (
      <group>
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.01, 0]}
          receiveShadow
        >
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color={isDark ? "#020617" : "#e0f2fe"}
            roughness={0.9}
          />
        </mesh>
      </group>
    );
  }

  const baseWidth = gridWidth + 2;
  const baseHeight = gridHeight + 2;
  const autoMode = lightingMode === "auto";
  
  const soilColor = isDark ? DARK_SOIL : LIGHT_SOIL;
  const gridLineColor = isDark ? DARK_GRID_LINE : LIGHT_GRID_LINE;
  const groundColor = isDark ? "#020617" : "#e0f2fe";

  return (
    <group>
      {/* 大地基平面 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -FIELD_THICKNESS / 2 - 0.1, 0]}
        receiveShadow
      >
        <planeGeometry args={[baseWidth, baseHeight]} />
        <meshStandardMaterial 
          color={groundColor}
          roughness={0.95}
        />
      </mesh>

      {fields.map((field: FieldStatus) => {
        const pos = getCellPosition(field.row, field.col, rows, cols);
        const isHovered = hoveredFieldId === field.id;
        const isSelected = selectedFieldId === field.id;

        const supplementOn = autoMode
          ? false
          : manualLightOn && isSelected;

        let topColor = healthToColor(field.healthScore, isDark);
        if (supplementOn) {
          topColor = topColor.clone().lerp(new Color("#facc15"), 0.25);
        }

        const growth = getGrowthFactor(field);
        const stress = getStressType(field, supplementOn);

        const scale = isSelected ? 1.04 : isHovered ? 1.02 : 1.0;
        const emissiveStrength =
          (isSelected ? 0.8 : isHovered ? 0.45 : 0.3) +
          (supplementOn ? 0.2 : 0);

        return (
          <group
            key={field.id}
            position={[pos.x, 0, pos.z]}
            scale={scale}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredField(field.id);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHoveredField(undefined);
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedField(isSelected ? undefined : field.id);
            }}
          >
            {/* 厚土地块 */}
            <mesh
              castShadow
              receiveShadow
              position={[0, FIELD_THICKNESS / 2, 0]}
            >
              <boxGeometry args={[CELL_SIZE, FIELD_THICKNESS, CELL_SIZE]} />
              <meshStandardMaterial
                color={soilColor}
                roughness={0.9}
                metalness={0.1}
              />
            </mesh>

            {/* 稻田表面 */}
            <mesh
              castShadow
              receiveShadow
              position={[0, FIELD_THICKNESS + 0.01, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[CELL_SIZE * 0.96, CELL_SIZE * 0.96]} />
              <meshStandardMaterial
                color={topColor}
                emissive={topColor.clone().multiplyScalar(emissiveStrength)}
                emissiveIntensity={1.0}
                roughness={0.7}
                metalness={0.05}
              />
            </mesh>

            {/* 田埂网格 */}
            <mesh
              position={[0, FIELD_THICKNESS + 0.015, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry
                args={[CELL_SIZE * 0.96, CELL_SIZE * 0.96, 4, 4]}
              />
              <meshBasicMaterial
                color={gridLineColor}
                wireframe
                transparent
                opacity={isDark ? 0.35 : 0.25}
              />
            </mesh>

            {/* 水稻簇 */}
            <RicePatch
              growth={growth}
              stress={stress}
              supplementOn={supplementOn}
              baseHeight={FIELD_THICKNESS}
              fieldId={field.id}
            />

            {/* 选中光环 */}
            {isSelected && (
              <mesh
                position={[0, FIELD_THICKNESS + 0.02, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <circleGeometry args={[CELL_SIZE * 0.6, 32]} />
                <meshBasicMaterial
                  color={isDark ? "#bef264" : "#84cc16"}
                  transparent
                  opacity={isDark ? 0.25 : 0.35}
                />
              </mesh>
            )}

            {/* 标签 */}
            <Html
              center
              distanceFactor={12}
              position={[0, FIELD_THICKNESS + 0.9, 0]}
              style={{ pointerEvents: "none" }}
            >
              <div
                className={`px-2 py-[3px] rounded-full border text-[10px] whitespace-nowrap backdrop-blur-sm transition-all duration-300
                  ${
                    isSelected
                      ? (isDark 
                          ? "border-lime-300 bg-lime-400/10 text-lime-100 shadow-[0_0_10px_rgba(190,242,100,0.35)]"
                          : "border-lime-500 bg-white/90 text-lime-700 shadow-lg")
                      : (isDark
                          ? "border-lime-400/60 bg-slate-950/90 text-lime-100/90"
                          : "border-lime-500/50 bg-white/70 text-gray-700 shadow-md")
                  }`}
              >
                {field.name} · {Math.round(field.healthScore * 100)}%
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
