// src/features/scene/FieldGrid.tsx
import { useEffect, useMemo } from "react";
import { Color, Vector3 } from "three";
import { useFieldStore } from "../../store/fieldStore";
import type { FieldStatus } from "../../types/field";

const CELL_SIZE = 3; // 每个田块宽高
const CELL_GAP = 0.3; // 田块间间距

const RED = new Color("#991b1b");
const GREEN = new Color("#15803d");

// 0~1 的 healthScore 映射到红绿之间
function healthToColor(health: number): Color {
  const h = Math.min(1, Math.max(0, health));
  const c = new Color();
  c.lerpColors(RED, GREEN, h);
  return c;
}

// 计算田块在场景中的位置，让整个网格居中
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

  // 组件挂载时加载一次数据
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

  // 空数据时，先只渲染一个底板
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
      {/* 地基 */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry
          args={[
            cols * CELL_SIZE + (cols - 1) * CELL_GAP + 1,
            rows * CELL_SIZE + (rows - 1) * CELL_GAP + 1,
          ]}
        />
        <meshStandardMaterial color={"#020617"} />
      </mesh>

      {/* 田块网格 */}
      {fields.map((field: FieldStatus) => {
        const pos = getCellPosition(field.row, field.col, rows, cols);
        const baseColor = healthToColor(field.healthScore);

        const isHovered = hoveredFieldId === field.id;
        const isSelected = selectedFieldId === field.id;

        const scale = isSelected ? 1.1 : isHovered ? 1.04 : 1;

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
                isSelected ? undefined : field.id // 再次点击取消选中
              );
              console.log("点击田块:", field);
            }}
          >
            <planeGeometry args={[CELL_SIZE, CELL_SIZE]} />
            <meshStandardMaterial
              color={baseColor}
              emissive={
                isSelected
                  ? baseColor.clone().multiplyScalar(0.4)
                  : new Color("#000000")
              }
            />
          </mesh>
        );
      })}
    </group>
  );
}
