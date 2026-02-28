
import { useRef, useMemo, FC, MutableRefObject, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';


// Configuration
const STAR_COUNT = 4000;
const STAR_SIZE_BASE = 0.12;
const STAR_DEPTH_RADIUS = 25; // Large sphere radius

interface StarfieldProps {
    pointerRef: MutableRefObject<THREE.Vector2>;
    isDarkMode: boolean;
    accentColorRef: MutableRefObject<THREE.Color>;
}

const createCircleTexture = (): THREE.Texture => {
    if (typeof document === 'undefined') return new THREE.Texture();

    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) return new THREE.Texture();

    // Draw a soft circle
    const center = size / 2;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
};

const Starfield: FC<StarfieldProps> = ({ pointerRef, isDarkMode, accentColorRef }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const prevDarkModeRef = useRef<boolean | null>(null);

    // Create stars geometry
    const [positions, randomness] = useMemo(() => {
        const pos = new Float32Array(STAR_COUNT * 3);
        const rand = new Float32Array(STAR_COUNT);

        for (let i = 0; i < STAR_COUNT; i++) {
            // Create a spherical distribution with depth
            const r = STAR_DEPTH_RADIUS * Math.cbrt(Math.random());
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi) - 5; // Push back behind globe (typically at z=0)

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            rand[i] = Math.random();
        }

        return [pos, rand];
    }, []);

    // Pre-compute which stars twinkle (randomness > 0.5) so we only iterate those per-frame
    const twinklingIndices = useMemo(() => {
        const indices: number[] = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            if (randomness[i] > 0.5) {
                indices.push(i);
            }
        }
        return indices;
    }, [randomness]);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        // Color attribute is needed if we use vertexColors
        const colors = new Float32Array(STAR_COUNT * 3);
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [positions]);

    const texture = useMemo(() => createCircleTexture(), []);

    // Track the last accent color to update static stars only when it changes
    const prevAccentRef = useRef({ r: -1, g: -1, b: -1 });

    // Set static (non-twinkling) star colors once when accent/mode changes
    useEffect(() => {
        if (!pointsRef.current) return;
        const colors = geometry.attributes.color;
        const colorArray = colors.array as Float32Array;
        const accentColor = accentColorRef.current;
        const baseR = isDarkMode ? accentColor.r : accentColor.r * 0.65;
        const baseG = isDarkMode ? accentColor.g : accentColor.g * 0.65;
        const baseB = isDarkMode ? accentColor.b : accentColor.b * 0.65;

        for (let i = 0; i < STAR_COUNT; i++) {
            if (randomness[i] > 0.5) continue; // Twinkling stars are handled per-frame
            const idx = i * 3;
            const brightness = isDarkMode ? 1.0 : 0.75;
            colorArray[idx] = baseR * brightness;
            colorArray[idx + 1] = baseG * brightness;
            colorArray[idx + 2] = baseB * brightness;
        }
        colors.needsUpdate = true;
    }, [isDarkMode, geometry, randomness, accentColorRef]);

    // Parallax smoothing state
    const currentParallax = useRef(new THREE.Vector2(0, 0));
    // Frame counter for throttling color buffer uploads
    const frameCountRef = useRef(0);

    useFrame((state) => {
        if (!pointsRef.current) return;

        const time = state.clock.elapsedTime;
        const material = pointsRef.current.material as THREE.PointsMaterial;

        // --- 1. Animation Logic (Twinkle) — only twinkling stars ---
        const colors = geometry.attributes.color;
        const colorArray = colors.array as Float32Array;

        // Check if accent color changed (for static stars refresh)
        const accentColor = accentColorRef.current;
        if (
            prevAccentRef.current.r !== accentColor.r ||
            prevAccentRef.current.g !== accentColor.g ||
            prevAccentRef.current.b !== accentColor.b
        ) {
            prevAccentRef.current.r = accentColor.r;
            prevAccentRef.current.g = accentColor.g;
            prevAccentRef.current.b = accentColor.b;
            // Update static stars
            const baseR = isDarkMode ? accentColor.r : accentColor.r * 0.65;
            const baseG = isDarkMode ? accentColor.g : accentColor.g * 0.65;
            const baseB = isDarkMode ? accentColor.b : accentColor.b * 0.65;
            for (let i = 0; i < STAR_COUNT; i++) {
                if (randomness[i] > 0.5) continue;
                const idx = i * 3;
                const brightness = isDarkMode ? 1.0 : 0.75;
                colorArray[idx] = baseR * brightness;
                colorArray[idx + 1] = baseG * brightness;
                colorArray[idx + 2] = baseB * brightness;
            }
        }

        // Determine base color based on mode
        const baseR = isDarkMode ? accentColor.r : accentColor.r * 0.65;
        const baseG = isDarkMode ? accentColor.g : accentColor.g * 0.65;
        const baseB = isDarkMode ? accentColor.b : accentColor.b * 0.65;

        // Only iterate twinkling stars (~50% of total)
        for (let j = 0; j < twinklingIndices.length; j++) {
            const i = twinklingIndices[j];
            const offset = randomness[i] * 100;
            const wave = Math.sin(time * 2 + offset);
            let brightness = THREE.MathUtils.mapLinear(wave, -1, 1, 0.4, 1.0);
            const finalBrightness = isDarkMode ? brightness : brightness * 0.75;

            const idx = i * 3;
            colorArray[idx] = baseR * finalBrightness;
            colorArray[idx + 1] = baseG * finalBrightness;
            colorArray[idx + 2] = baseB * finalBrightness;
        }

        // Throttle GPU buffer upload to every 2nd frame
        frameCountRef.current++;
        if (frameCountRef.current % 2 === 0) {
            colors.needsUpdate = true;
        }

        // --- 2. Material Updates (only when mode changes) ---
        if (prevDarkModeRef.current !== isDarkMode) {
            prevDarkModeRef.current = isDarkMode;
            if (isDarkMode) {
                material.blending = THREE.AdditiveBlending;
                material.opacity = 0.8;
                material.size = STAR_SIZE_BASE;
            } else {
                material.blending = THREE.NormalBlending;
                material.opacity = 0.6;
                material.size = STAR_SIZE_BASE * 0.9;
            }
        }

        // --- 3. Parallax Motion ---
        const targetX = -pointerRef.current.x * 0.5;
        const targetY = -pointerRef.current.y * 0.5;

        currentParallax.current.x += (targetX - currentParallax.current.x) * 0.05;
        currentParallax.current.y += (targetY - currentParallax.current.y) * 0.05;

        pointsRef.current.position.x = currentParallax.current.x;
        pointsRef.current.position.y = currentParallax.current.y;

        // Add subtle slow rotation for "infinite space" feeling
        pointsRef.current.rotation.y = time * 0.02;
        pointsRef.current.rotation.z = time * 0.01;

    });

    return (
        <points ref={pointsRef} geometry={geometry}>
            <pointsMaterial
                map={texture}
                size={STAR_SIZE_BASE}
                sizeAttenuation={true}
                transparent={true}
                vertexColors={true}
                alphaTest={0.05}
                depthWrite={false}
            />
        </points>
    );
};

export default Starfield;

