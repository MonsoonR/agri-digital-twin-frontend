import { useEffect, useMemo } from "react";
import { Color, Vector3 } from "three";
import { useFieldStore } from "../../store/fieldStore";
import type { FieldStatus } from "../../types/field";

const CELL_SIZE = 3;
const CELL_GAP = 0.3;

// 更偏荧光绿的配色：低长势略偏黄绿，高长势亮黄绿
const BAD = new Color("#4ade80");   // 较差 - 绿色偏暗
const GOOD = new Color("#bef264");  // 良好 - 明亮黄绿色

function healthToColor(health: number): Color {
  const h = Math.min(1, Math.max(0, health));
  const c = new Color();
  c.lerpColors(BAD, GOOD, h);
  return c;
}

function getCellPosition(
  row: number,
  col: number,
  rows: number,
  cols: number
): Vector3 {
  const totalWidth = cols * CELL_SIZE + (cols - 1) * CELL_GAP;
  const totalHeight = rows * CELL_SIZE + (rows - 1) * CELL_GAP;

  const x0 = -totalWidth / 2 + CELL_SIZE / 2;
  const z0 = -totalHeight / 2 + CELL_SIZE / 2;

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
  } = useFieldStore();

  useEffect(() => {
    if (fields.length === 0 && !loading && !error) {
      loadFields();
    }
  }, [fields.length, loading, error, loadFields]);

  const { rows, cols } = useMemo(() => {
    if (fields.length === 0) return { rows: 0, cols: 0 };
    const maxRow = Math.max(...fields.map((f) => f.row));
    const maxCol = Math.max(...fields.map((f) => f.col));
    return { rows: maxRow + 1, cols: maxCol + 1 };
  }, [fields]);

  if (error) {
    console.error("加载田块数据失败：", error);
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
          <meshStandardMaterial color={"#020617"} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      {/* 地基：略带绿色的暗色地面 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <planeGeometry
          args={[
            cols * CELL_SIZE + (cols - 1) * CELL_GAP + 2,
            rows * CELL_SIZE + (rows - 1) * CELL_GAP + 2,
          ]}
        />
        <meshStandardMaterial color={"#022c22"} />
      </mesh>

      {/* 田块网格 */}
      {fields.map((field: FieldStatus) => {
        const pos = getCellPosition(field.row, field.col, rows, cols);
        const baseColor = healthToColor(field.healthScore);

        const isHovered = hoveredFieldId === field.id;
        const isSelected = selectedFieldId === field.id;

        const scale = isSelected ? 1.12 : isHovered ? 1.05 : 1;

        return (
          <mesh
            key={field.id}
            position={pos}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
            castShadow
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
              setSelectedField(
                isSelected ? undefined : field.id
              );
              console.log("点击田块:", field);
            }}
          >
            <planeGeometry args={[CELL_SIZE, CELL_SIZE]} />
            <meshStandardMaterial
              color={baseColor}
              emissive={baseColor.clone().multiplyScalar(isSelected ? 0.6 : 0.25)}
              emissiveIntensity={1.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}
