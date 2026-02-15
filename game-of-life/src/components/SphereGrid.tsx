import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { Grid, Rule } from '../game/types';
import { detectPatterns } from '../game/recognition';

interface SphereGridProps {
  grid: Grid;
  setCell: (x: number, y: number, value: boolean) => void;
  velocity?: { x: number; y: number };
  rule?: Rule;
}

const Sphere = ({ grid, setCell, velocity, rule }: SphereGridProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;
  const count = rows * cols;

  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const radius = 2.5;

  // Box size calculation to approximate a continuous surface at the equator
  // Circumference = 2 * PI * radius
  // Cell width at equator = Circumference / cols
  const cellWidth = cols > 0 ? (2 * Math.PI * radius) / cols : 0.1;
  // Cell height = Latitude arc / rows (Assuming PI coverage for full sphere N to S)
  const cellHeight = rows > 0 ? (Math.PI * radius) / rows : 0.1;

  // Pattern detection logic
  const patternGrid = useMemo(() => {
    if (!rule || rule.name !== 'Conway') return [];
    if (rows * cols > 50000) return [];
    return detectPatterns(grid);
  }, [grid, rows, cols, rule]);

  // Initial Position & Scale Setup
  useEffect(() => {
    if (!meshRef.current || rows === 0 || cols === 0) return;

    let idx = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Map Grid to Sphere
        // phi: 0 to PI (North to South)
        // theta: 0 to 2PI (Around)

        const phi = (y / rows) * Math.PI;
        const theta = (x / cols) * 2 * Math.PI;

        // Position
        tempObject.position.setFromSphericalCoords(radius, phi, theta);

        // Rotation: Look away from center
        tempObject.lookAt(0, 0, 0);

        // Scale
        // Scale down width based on latitude to fit longitude lines (sin(phi)).
        // Keep height constant (scale=1) as latitude rings are parallel-ish in this mapping logic.
        // Clamp min scale to avoid rendering issues at poles.
        const scaleX = Math.max(0.01, Math.sin(phi));
        tempObject.scale.set(scaleX, 1, 1);

        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(idx, tempObject.matrix);
        idx++;
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [rows, cols, tempObject, radius]);

  // Update Colors based on Grid State
  useEffect(() => {
    if (!meshRef.current || rows === 0 || cols === 0) return;

    let idx = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const isAlive = grid[y][x];
        if (isAlive) {
           const pattern = patternGrid[idx];
           if (pattern && pattern.hex) {
             tempColor.set(pattern.hex);
           } else {
             // Tailwind Green-500: #22c55e
             tempColor.set('#22c55e');
           }
        } else {
           // Dark Gray (Slate-900 equivalent)
           tempColor.set('#0f172a');
        }
        meshRef.current.setColorAt(idx, tempColor);
        idx++;
      }
    }
    if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [grid, rows, cols, tempColor, patternGrid]);

  // Rotation Animation
  useFrame((_state, delta) => {
     if (groupRef.current && velocity && cols > 0) {
         const speedLevelX = Math.abs(velocity.x);
         const directionX = Math.sign(velocity.x);

         const speedLevelY = Math.abs(velocity.y);
         const directionY = Math.sign(velocity.y);

         // Target: ~1 cell per second at speed level 1
         const radiansPerCell = (2 * Math.PI) / cols;

         // X-Axis Velocity (Left/Right Arrows) -> Y-Axis Rotation
         // If velocity > 0 (Right Arrow), we want the view to shift such that items move Left.
         // Rotating the world -Y (Clockwise looking from top) makes front items move Left.
         const rotationSpeedY = -directionX * radiansPerCell * speedLevelX * delta;

         // Y-Axis Velocity (Up/Down Arrows) -> X-Axis Rotation
         const rotationSpeedX = -directionY * radiansPerCell * speedLevelY * delta;

         groupRef.current.rotation.y += rotationSpeedY;
         groupRef.current.rotation.x += rotationSpeedX;
     }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    // Only left click
    if (e.button === 0 && e.instanceId !== undefined) {
        const idx = e.instanceId;
        const y = Math.floor(idx / cols);
        const x = idx % cols;
        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            setCell(x, y, !grid[y][x]);
        }
    }
  };

  return (
    <group ref={groupRef}>
        <instancedMesh
            ref={meshRef}
            args={[undefined, undefined, count]}
            onPointerDown={handlePointerDown}
        >
            <boxGeometry args={[cellWidth * 0.95, cellHeight * 0.95, 0.1]} />
            <meshStandardMaterial roughness={0.2} metalness={0.5} />
        </instancedMesh>
    </group>
  );
};

export const SphereGrid = ({ grid, setCell, velocity, rule }: SphereGridProps) => {
  return (
    <div className="w-full h-full bg-gray-950 relative">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
            <color attach="background" args={['#020617']} />

            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, -5, -10]} intensity={0.5} color="#4ade80" />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Sphere grid={grid} setCell={setCell} velocity={velocity} rule={rule} />

            <OrbitControls enablePan={false} minDistance={3.5} maxDistance={12} />
        </Canvas>

        <div className="absolute bottom-4 right-4 pointer-events-none bg-black/50 backdrop-blur text-[10px] md:text-xs text-gray-400 p-2 rounded border border-gray-800 z-10 hidden md:block">
            <div>Linke Maustaste: Zelle umschalten</div>
            <div>Rechte Maustaste / Ziehen: Ansicht drehen</div>
            <div>Mausrad: Zoom</div>
            <div>Pfeiltasten: Automatische Rotation</div>
        </div>
    </div>
  );
};
