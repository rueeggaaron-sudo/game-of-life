import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { Grid } from '../game/types';

interface SphereGridProps {
  grid: Grid;
  setCell: (x: number, y: number, value: boolean) => void;
  velocity?: { x: number; y: number };
}

const Sphere = ({ grid, setCell, velocity }: SphereGridProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;
  const count = rows * cols;

  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  const radius = 2.5;

  // Initial Position & Scale Setup (Memoized calculation to avoid flickering)
  useEffect(() => {
    if (!meshRef.current || rows === 0 || cols === 0) return;

    let idx = 0;

    // We want to calculate positions so that cells are roughly square.
    // The width of a cell depends on the circumference at its latitude (phi).
    // The height of a cell depends on the arc length of the latitude step.

    const heightPerCell = (Math.PI * radius) / rows; // Arc length per row step

    for (let y = 0; y < rows; y++) {
        // Calculate Latitude (Phi): 0 (North Pole) to PI (South Pole)
        const phi = (y / rows) * Math.PI;

        // Calculate Circumference at this latitude: 2 * PI * r * sin(phi)
        const circumference = 2 * Math.PI * radius * Math.sin(phi);

        // Available width per cell at this latitude
        const widthPerCell = circumference / cols;

        // Scale to make it a square-ish shape
        // Apply a small gap factor (0.9) to make individual cells visible
        const scaleX = Math.max(0.001, widthPerCell * 0.9);
        const scaleY = Math.max(0.001, heightPerCell * 0.9);

        // For rows very close to poles, widthPerCell -> 0.
        // This naturally makes them "smaller and fewer" (visually smaller).

        for (let x = 0; x < cols; x++) {
            const theta = (x / cols) * 2 * Math.PI;

            // Position on Sphere Surface
            tempObject.position.setFromSphericalCoords(radius, phi, theta);

            // Rotation: Look away from center so the "top" of the box faces out
            tempObject.lookAt(0, 0, 0);

            // Scale
            tempObject.scale.set(scaleX, scaleY, 0.05); // Thin boxes

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
           // Vibrant Neon Colors based on position or random to give "figures" look?
           // The user asked for "figures in other colors like 2D grid".
           // In 2D grid (CanvasGrid), we often use recognition or simple gradients.
           // Let's use a gradient based on Y (Latitude) to give some variety,
           // but keep it bright/neon.

           // Hue based on latitude (0 to 1) -> 0.3 to 0.6 (Green to Blue)
           const hue = 0.3 + (y / rows) * 0.4;
           tempColor.setHSL(hue, 1.0, 0.6); // H, S, L - High Saturation, Bright Lightness

        } else {
           // Dark "Dead" Cells
           // Make them very dark gray/blue to contrast with the black background
           // so the grid structure is faintly visible (user said "rectangles... contrast too weak")
           tempColor.set('#1e293b'); // Slate-800
           // Reduce intensity for dead cells by darkening
           tempColor.multiplyScalar(0.2);
        }

        meshRef.current.setColorAt(idx, tempColor);
        idx++;
      }
    }
    if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [grid, rows, cols, tempColor]);

  // Rotation Animation
  useFrame((_state, delta) => {
     if (groupRef.current && velocity && cols > 0) {
         const speedLevelX = Math.abs(velocity.x);
         const directionX = Math.sign(velocity.x);

         const speedLevelY = Math.abs(velocity.y);
         const directionY = Math.sign(velocity.y);

         // Target: ~1 cell per second at speed level 1
         const radiansPerCell = (2 * Math.PI) / cols;

         const rotationSpeedY = -directionX * radiansPerCell * speedLevelX * delta;
         const rotationSpeedX = -directionY * radiansPerCell * speedLevelY * delta;

         groupRef.current.rotation.y += rotationSpeedY;
         groupRef.current.rotation.x += rotationSpeedX;
     }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
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
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                roughness={0.2}
                metalness={0.6}
                emissive="#ffffff"
                emissiveIntensity={0.2} // Base emissive for everything
            />
        </instancedMesh>
    </group>
  );
};

export const SphereGrid = ({ grid, setCell, velocity }: SphereGridProps) => {
  return (
    <div className="w-full h-full bg-gray-950 relative">
        <Canvas camera={{ position: [0, 0, 7.5], fov: 50 }}>
            {/* Darker background for higher contrast */}
            <color attach="background" args={['#000000']} />

            <ambientLight intensity={0.1} />

            {/* Key Light - Bright White/Blue */}
            <directionalLight position={[10, 10, 5]} intensity={2.5} color="#e0f2fe" />

            {/* Rim Light - Bright Green/Cyan for edges */}
            <pointLight position={[-10, 0, -5]} intensity={2} color="#2dd4bf" />

            {/* Fill Light - Purple/Blue from bottom */}
            <pointLight position={[0, -10, 0]} intensity={1.0} color="#8b5cf6" />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={0.5} />

            <Sphere grid={grid} setCell={setCell} velocity={velocity} />

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
