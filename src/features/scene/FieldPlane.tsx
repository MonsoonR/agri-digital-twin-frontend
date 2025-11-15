import { useMemo } from "react";
import { Color } from "three";

export default function FieldPlane() {
  // 这里用 useMemo 只是示范，后面你可以用 props 传入“长势值”来动态改颜色
  const color = useMemo(
    () => new Color("#166534"), // 深一点的绿色
    []
  );

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.01, 0]}
      receiveShadow
    >
      {/* 20x20 的平面，可以理解为一整块农田 */}
      <planeGeometry args={[20, 20, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
