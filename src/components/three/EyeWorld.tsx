import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { irisFragmentShader, irisVertexShader } from './EyeWorldShaders';
import {
  EyeMapPipeline,
  EyeTextureQuality,
  EyeTextureSet,
  EyeVectorAdapter,
  resolveEyeMapConfig,
} from './eyeMapConfig';
import { parseCssColorToThree } from './eyeThemeBridge';
import Starfield from './Starfield';

const IRIS_RADIUS = 0.98;
const CORNEA_RADIUS = 1.0;
const DISPLAY_SCALE = 1.84;
const EYE_SEGMENTS = 128;
const GAZE_INTENSITY = 0.95;
const MAX_GAZE_DEGREES = 35;
const FALLBACK_ACCENT = 'hsl(220, 80%, 50%)';
const FALLBACK_BG = 'hsl(240, 10%, 5%)';
const FALLBACK_GLOW = 'hsl(220, 85%, 58%)';
const LIGHT_GLOBE_BASE = '#F8FAFC';
const LIGHT_CONTINENT_BASE = '#E2E8F0';
const LIGHT_CONTINENT_OPACITY = 1;
const LIGHT_NORMAL_SCALE = 0.18;
const LIGHT_CENTER_DIM_STRENGTH = 0.08;
const LIGHT_CENTER_DIM_LAND_STRENGTH = 0.06;
const LIGHT_LAND_ALPHA_TEST = 0.42;
const LIGHT_TEXTURE_U_OFFSET = 0.15;
const LIGHT_TEXTURE_V_OFFSET = 0.1;
const LIGHT_PUPIL_OUTER_RADIUS = 0.34;

const resolveDarkMode = (root: HTMLElement): boolean => {
  const mode = (root.getAttribute('data-mode') || '').trim().toLowerCase();
  if (mode === 'light') {
    return false;
  }
  if (mode === 'dark') {
    return true;
  }

  const dataTheme = (root.getAttribute('data-theme') || '').trim().toLowerCase();
  if (dataTheme.includes('light')) {
    return false;
  }
  if (dataTheme.includes('dark')) {
    return true;
  }

  return true;
};



const getThemeGlobalTints = (themeHsl: { h: number; s: number; l: number }, isDark: boolean) => {
  if (isDark) {
    return {
      base: new THREE.Color('#F8FAFC'),
      land: new THREE.Color('#E2E8F0'),
      pupil: new THREE.Color(0.11, 0.12, 0.135),
      ring: new THREE.Color(0.19, 0.205, 0.225)
    };
  }

  // Light Mode: Chromatic Tinting

  // Detect Neutral Theme: If saturation is very low (< 20%), force greyscale behavior
  const isNeutral = themeHsl.s < 0.20;

  // Globe Base
  // Neutral: nearly pure white/grey (4% saturation)
  // Colored: "Mint-Ice" look (15% saturation)
  const baseSat = isNeutral ? 0.04 : 0.15;
  const base = new THREE.Color().setHSL(themeHsl.h, baseSat, 0.94);

  // Land: The continents
  // Neutral: nearly pure grey (5% saturation), slightly darker for visibility
  // Colored: Richly saturated (65%) to match the theme, darker (76%) for "sharper" contrast against the pale ocean
  const landSat = isNeutral ? 0.05 : 0.65;
  const landLight = isNeutral ? 0.88 : 0.76;
  const land = new THREE.Color().setHSL(themeHsl.h, landSat, landLight);

  // Pupil: Theme-tinted, visible center
  // Neutral: Medium Grey
  // Colored: Rich saturated color, light enough to be visible
  const pupilSat = isNeutral ? 0.0 : 0.65;
  const pupilLight = isNeutral ? 0.32 : 0.38;
  const pupil = new THREE.Color().setHSL(themeHsl.h, pupilSat, pupilLight);

  // Ring: Slightly lighter version of pupil
  const ringSat = isNeutral ? 0.0 : 0.55;
  const ringLight = isNeutral ? 0.42 : 0.48;
  const ring = new THREE.Color().setHSL(themeHsl.h, ringSat, ringLight);

  return { base, land, pupil, ring };
};

// Shader Logic for Light Mode Pupil
const lightPupilVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const lightPupilFragmentShader = `
uniform vec3 uColor;
varying vec2 vUv;

float smoothstep_custom(float edge0, float edge1, float x) {
  float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

void main() {
  vec2 center = vec2(0.5);
  // Distance from center (0.0 to 0.5)
  float dist = distance(vUv, center);
  // Doubled to match 0.0 to 1.0 range used in texture logic
  float radial = dist * 2.0; 

  // Shader logic ported from createLightPupilTexture
  // All constants divided by 0.42 (radius) to normalize
  float pupilCoreInner = 0.16 / 0.42;  // ~0.38
  float pupilCoreOuter = 0.22 / 0.42;  // ~0.52
  float pupilFalloffEnd = 0.28 / 0.42;  // ~0.67
  float limbalInner = 0.155 / 0.42;     // ~0.37
  float limbalOuter = 0.285 / 0.42;     // ~0.68
  // float irisPocketEnd = 0.40 / 0.42;    // ~0.95 (Unused in alpha)

  // Pupil core
  float pupilCore = 1.0 - smoothstep_custom(pupilCoreInner, pupilCoreOuter, radial);
  // Pupil falloff
  float pupilFalloff = 1.0 - smoothstep_custom(pupilCoreOuter, pupilFalloffEnd, radial);
  float pupilMask = clamp(pupilCore + pupilFalloff * 0.34, 0.0, 1.0);

  // Limbal ring
  float limbalRing =
    smoothstep_custom(limbalInner, (limbalInner + limbalOuter) * 0.5, radial) *
    (1.0 - smoothstep_custom((limbalInner + limbalOuter) * 0.7, limbalOuter, radial));

  // Outer fade
  float outerFade = 1.0 - smoothstep_custom(0.85, 1.0, radial);
  
  float alpha = clamp(
    (pupilMask * 0.98 + limbalRing * 0.28) * outerFade,
    0.0, 1.0
  );

  gl_FragColor = vec4(uColor, alpha);
}
`;

const createMarbleNormalMap = (
  landMask: THREE.Texture,
  topography: THREE.Texture
): THREE.Texture | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const landImage = landMask.image as CanvasImageSource & { width?: number; height?: number };
  const topoImage = topography.image as CanvasImageSource & { width?: number; height?: number };
  if (!landImage?.width || !landImage?.height || !topoImage?.width || !topoImage?.height) {
    return null;
  }

  const width = 1024;
  const height = 512;
  const landCanvas = document.createElement('canvas');
  const topoCanvas = document.createElement('canvas');
  landCanvas.width = width;
  landCanvas.height = height;
  topoCanvas.width = width;
  topoCanvas.height = height;
  const landContext = landCanvas.getContext('2d');
  const topoContext = topoCanvas.getContext('2d');
  if (!landContext || !topoContext) {
    return null;
  }

  landContext.drawImage(landImage, 0, 0, width, height);
  topoContext.drawImage(topoImage, 0, 0, width, height);
  const landData = landContext.getImageData(0, 0, width, height).data;
  const topoData = topoContext.getImageData(0, 0, width, height).data;
  const heights = new Float32Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = y * width + x;
      const offset = idx * 4;
      const landLum =
        (landData[offset] * 0.299 + landData[offset + 1] * 0.587 + landData[offset + 2] * 0.114) /
        255;
      const topoLum =
        (topoData[offset] * 0.299 + topoData[offset + 1] * 0.587 + topoData[offset + 2] * 0.114) /
        255;
      const landHeight = 1 - landLum;
      heights[idx] = THREE.MathUtils.clamp(landHeight * 0.72 + topoLum * 0.18, 0, 1);
    }
  }

  const normalCanvas = document.createElement('canvas');
  normalCanvas.width = width;
  normalCanvas.height = height;
  const normalContext = normalCanvas.getContext('2d');
  if (!normalContext) {
    return null;
  }

  const normalImage = normalContext.createImageData(width, height);
  const normalData = normalImage.data;
  const normalStrength = 2.2;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const xLeft = x > 0 ? x - 1 : x;
      const xRight = x < width - 1 ? x + 1 : x;
      const yDown = y > 0 ? y - 1 : y;
      const yUp = y < height - 1 ? y + 1 : y;

      const hL = heights[y * width + xLeft];
      const hR = heights[y * width + xRight];
      const hD = heights[yDown * width + x];
      const hU = heights[yUp * width + x];

      const dx = (hR - hL) * normalStrength;
      const dy = (hU - hD) * normalStrength;
      const nx = -dx;
      const ny = -dy;
      const nz = 1;
      const length = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;

      const idx = y * width + x;
      const offset = idx * 4;
      normalData[offset] = ((nx / length) * 0.5 + 0.5) * 255;
      normalData[offset + 1] = ((ny / length) * 0.5 + 0.5) * 255;
      normalData[offset + 2] = ((nz / length) * 0.5 + 0.5) * 255;
      normalData[offset + 3] = 255;
    }
  }

  normalContext.putImageData(normalImage, 0, 0);
  const normalMap = new THREE.CanvasTexture(normalCanvas);
  configureTexture(normalMap, false);
  normalMap.offset.set(LIGHT_TEXTURE_U_OFFSET, LIGHT_TEXTURE_V_OFFSET);
  normalMap.needsUpdate = true;
  return normalMap;
};

interface EyeIrisMeshProps {
  textureSet: EyeTextureSet;
  gazeRef: MutableRefObject<THREE.Vector2>;
  materialRef: MutableRefObject<THREE.ShaderMaterial | null>;
}

const configureTexture = (texture: THREE.Texture, asColor: boolean): void => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 8;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = asColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  texture.needsUpdate = true;
};

const EyeIrisMesh: FC<EyeIrisMeshProps> = ({ textureSet, gazeRef, materialRef }) => {
  const topographyMap = useTexture(textureSet.topography);
  const landMaskMap = useTexture(textureSet.landMask);
  const nightMap = useTexture(textureSet.nightLights);
  const fallbackAccent = useMemo(() => parseCssColorToThree('', FALLBACK_ACCENT), []);
  const fallbackGlow = useMemo(() => parseCssColorToThree('', FALLBACK_GLOW), []);
  const fallbackBg = useMemo(() => parseCssColorToThree('', FALLBACK_BG), []);

  useEffect(() => {
    configureTexture(topographyMap, true);
    configureTexture(landMaskMap, false);
    configureTexture(nightMap, true);
  }, [topographyMap, landMaskMap, nightMap]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDarkMode: { value: 1 },
      uTextureUOffset: { value: 0.15 },
      uTextureVOffset: { value: 0.1 },
      uTopographyMap: { value: topographyMap },
      uLandMaskMap: { value: landMaskMap },
      uNightMap: { value: nightMap },
      uAccent: { value: fallbackAccent.clone() },
      uAccentGlow: { value: fallbackGlow.clone() },
      uBg: { value: fallbackBg.clone() },
      uGaze: { value: new THREE.Vector2(0, 0) },
    }),
    [fallbackAccent, fallbackBg, fallbackGlow, landMaskMap, nightMap, topographyMap]
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uGaze.value.lerp(gazeRef.current, 0.2);
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[IRIS_RADIUS, EYE_SEGMENTS, EYE_SEGMENTS]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={irisVertexShader}
        fragmentShader={irisFragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

interface EyeIrisLightMeshProps {
  textureSet: EyeTextureSet;
  baseMaterialRef: MutableRefObject<THREE.MeshPhysicalMaterial | null>;
  overlayMaterialRef: MutableRefObject<THREE.MeshStandardMaterial | null>;
  pupilMaterialRef: MutableRefObject<THREE.ShaderMaterial | null>;
}

const EyeIrisLightMesh: FC<EyeIrisLightMeshProps> = ({
  textureSet,
  baseMaterialRef,
  overlayMaterialRef,
  pupilMaterialRef,
}) => {
  const topographyMap = useTexture(textureSet.topography);
  const landMaskMap = useTexture(textureSet.landMask);

  // Async normal map generation — deferred to avoid blocking main thread on mount
  const [marbleNormalMap, setMarbleNormalMap] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(() => {
      if (cancelled) return;
      const result = createMarbleNormalMap(landMaskMap, topographyMap);
      if (!cancelled) setMarbleNormalMap(result);
    }, 0);
    return () => { cancelled = true; clearTimeout(id); };
  }, [landMaskMap, topographyMap]);

  // Async land detail texture (greyscale shading for continents)
  const [landDetailMap, setLandDetailMap] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(() => {
      if (cancelled) return;
      if (typeof document === 'undefined') return;
      const landImage = landMaskMap.image as CanvasImageSource & { width?: number; height?: number };
      const topoImage = topographyMap.image as CanvasImageSource & { width?: number; height?: number };
      if (!landImage?.width || !landImage?.height || !topoImage?.width || !topoImage?.height) return;

      const size = 2048;
      const half = size / 2;
      const landCanvas = document.createElement('canvas');
      const topoCanvas = document.createElement('canvas');
      landCanvas.width = size; landCanvas.height = half;
      topoCanvas.width = size; topoCanvas.height = half;
      const landCtx = landCanvas.getContext('2d');
      const topoCtx = topoCanvas.getContext('2d');
      if (!landCtx || !topoCtx) return;

      landCtx.drawImage(landImage, 0, 0, size, half);
      topoCtx.drawImage(topoImage, 0, 0, size, half);
      const landData = landCtx.getImageData(0, 0, size, half).data;
      const topoData = topoCtx.getImageData(0, 0, size, half).data;

      const outCanvas = document.createElement('canvas');
      outCanvas.width = size;
      outCanvas.height = half;
      const outCtx = outCanvas.getContext('2d');
      if (!outCtx) return;
      const outImg = outCtx.createImageData(size, half);
      const out = outImg.data;

      for (let i = 0; i < size * half; i++) {
        const off = i * 4;
        const landLum = (landData[off] * 0.299 + landData[off + 1] * 0.587 + landData[off + 2] * 0.114) / 255;
        const topoLum = (topoData[off] * 0.299 + topoData[off + 1] * 0.587 + topoData[off + 2] * 0.114) / 255;
        const landMask = THREE.MathUtils.clamp(1 - landLum, 0, 1);
        const tc = THREE.MathUtils.clamp((topoLum - 0.18) / (0.88 - 0.18), 0, 1);
        const topoContrast = tc * tc * (3 - 2 * tc);
        const landShade = 0.76 + (0.96 - 0.76) * topoContrast;
        const oceanShade = 0.985;
        const shade = oceanShade + (landShade - oceanShade) * landMask;
        const v = Math.round(shade * 255);
        out[off] = v;
        out[off + 1] = v;
        out[off + 2] = v;
        out[off + 3] = 255;
      }

      outCtx.putImageData(outImg, 0, 0);
      const tex = new THREE.CanvasTexture(outCanvas);
      configureTexture(tex, false);
      tex.offset.set(LIGHT_TEXTURE_U_OFFSET, LIGHT_TEXTURE_V_OFFSET);
      tex.needsUpdate = true;
      if (!cancelled) setLandDetailMap(tex);
    }, 0);
    return () => { cancelled = true; clearTimeout(id); };
  }, [landMaskMap, topographyMap]);

  // Async inverted alpha mask
  const [invertedAlphaMap, setInvertedAlphaMap] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let cancelled = false;
    const id = setTimeout(() => {
      if (cancelled) return;
      if (typeof document === 'undefined') return;
      const landImage = landMaskMap.image as CanvasImageSource & { width?: number; height?: number };
      if (!landImage?.width || !landImage?.height) return;

      const size = 2048;
      const half = size / 2;
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = half;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(landImage, 0, 0, size, half);
      const srcData = ctx.getImageData(0, 0, size, half).data;
      const outImg = ctx.createImageData(size, half);
      const out = outImg.data;

      for (let i = 0; i < size * half; i++) {
        const off = i * 4;
        const lum = (srcData[off] * 0.299 + srcData[off + 1] * 0.587 + srcData[off + 2] * 0.114) / 255;
        const inv = Math.round((1 - lum) * 255);
        out[off] = inv;
        out[off + 1] = inv;
        out[off + 2] = inv;
        out[off + 3] = 255;
      }

      ctx.putImageData(outImg, 0, 0);
      const tex = new THREE.CanvasTexture(canvas);
      configureTexture(tex, false);
      tex.offset.set(LIGHT_TEXTURE_U_OFFSET, LIGHT_TEXTURE_V_OFFSET);
      tex.needsUpdate = true;
      if (!cancelled) setInvertedAlphaMap(tex);
    }, 0);
    return () => { cancelled = true; clearTimeout(id); };
  }, [landMaskMap]);

  const fallbackBase = useMemo(() => parseCssColorToThree('', LIGHT_GLOBE_BASE), []);
  const normalScale = useMemo(() => new THREE.Vector2(LIGHT_NORMAL_SCALE, LIGHT_NORMAL_SCALE), []);
  const lightContinentBase = useMemo(
    () => parseCssColorToThree('', LIGHT_CONTINENT_BASE),
    []
  );
  const injectCenterDim = useCallback(
    (
      shader: { uniforms: Record<string, { value: unknown }>; fragmentShader: string },
      strength: number
    ): void => {
      shader.uniforms.uCenterDimStrength = { value: strength };
      shader.uniforms.uCenterDimRadius = { value: 0.76 };
      shader.uniforms.uCenterDimFeather = { value: 0.34 };
      shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        `
uniform float uCenterDimStrength;
uniform float uCenterDimRadius;
uniform float uCenterDimFeather;
void main() {
`
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <output_fragment>',
        `
float centerDistance = distance(vUv, vec2(0.5));
float centerMask = 1.0 - smoothstep(uCenterDimRadius - uCenterDimFeather, uCenterDimRadius, centerDistance);
outgoingLight *= (1.0 - centerMask * uCenterDimStrength);
#include <output_fragment>
`
      );
    },
    []
  );
  const onBeforeCompileBase = useCallback(
    (shader: { uniforms: Record<string, { value: unknown }>; fragmentShader: string }): void => {
      injectCenterDim(shader, LIGHT_CENTER_DIM_STRENGTH);
    },
    [injectCenterDim]
  );

  const onBeforeCompileOverlay = useCallback(
    (shader: { uniforms: Record<string, { value: unknown }>; fragmentShader: string }): void => {
      injectCenterDim(shader, LIGHT_CENTER_DIM_LAND_STRENGTH);
    },
    [injectCenterDim]
  );

  useEffect(() => {
    configureTexture(topographyMap, true);
    configureTexture(landMaskMap, false);
    topographyMap.offset.set(LIGHT_TEXTURE_U_OFFSET, LIGHT_TEXTURE_V_OFFSET);
    topographyMap.needsUpdate = true;
    landMaskMap.offset.set(LIGHT_TEXTURE_U_OFFSET, LIGHT_TEXTURE_V_OFFSET);
    landMaskMap.needsUpdate = true;
    if (marbleNormalMap) {
      marbleNormalMap.offset.set(LIGHT_TEXTURE_U_OFFSET, LIGHT_TEXTURE_V_OFFSET);
      marbleNormalMap.needsUpdate = true;
    }
  }, [landMaskMap, marbleNormalMap, topographyMap]);

  useEffect(
    () => () => {
      marbleNormalMap?.dispose();
      landDetailMap?.dispose();
      invertedAlphaMap?.dispose();
    },
    [marbleNormalMap, landDetailMap, invertedAlphaMap]
  );

  const pupilUniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(1, 1, 1) }
  }), []);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[IRIS_RADIUS, EYE_SEGMENTS, EYE_SEGMENTS]} />
        <meshPhysicalMaterial
          ref={baseMaterialRef}
          color={fallbackBase}
          metalness={0}
          roughness={0.2}
          normalMap={marbleNormalMap ?? undefined}
          normalScale={normalScale}
          clearcoat={0.8}
          clearcoatRoughness={0.03}
          envMapIntensity={0.32}
          onBeforeCompile={onBeforeCompileBase}
        />
      </mesh>

      <mesh visible={!!landDetailMap && !!invertedAlphaMap}>
        <sphereGeometry args={[IRIS_RADIUS + 0.001, EYE_SEGMENTS, EYE_SEGMENTS]} />
        <meshStandardMaterial
          ref={overlayMaterialRef}
          color={lightContinentBase}
          map={landDetailMap ?? undefined}
          alphaMap={invertedAlphaMap ?? undefined}
          transparent={false}
          alphaTest={LIGHT_LAND_ALPHA_TEST}
          opacity={LIGHT_CONTINENT_OPACITY}
          depthWrite
          metalness={0}
          roughness={0.3}
          onBeforeCompile={onBeforeCompileOverlay}
        />
      </mesh>

      <mesh position={[0, 0, IRIS_RADIUS + 0.001]}>
        <circleGeometry args={[LIGHT_PUPIL_OUTER_RADIUS, EYE_SEGMENTS]} />
        <shaderMaterial
          ref={pupilMaterialRef}
          vertexShader={lightPupilVertexShader}
          fragmentShader={lightPupilFragmentShader}
          uniforms={pupilUniforms}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

interface EyeCorneaMeshProps {
  materialRef: MutableRefObject<THREE.MeshPhysicalMaterial | null>;
}

const EyeCorneaMesh: FC<EyeCorneaMeshProps> = ({ materialRef }) => {
  const white = useMemo(() => new THREE.Color(1, 1, 1), []);

  return (
    <mesh>
      <sphereGeometry args={[CORNEA_RADIUS, EYE_SEGMENTS, EYE_SEGMENTS]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color={white}
        emissive={new THREE.Color(0, 0, 0)}
        emissiveIntensity={0}
        metalness={0}
        roughness={0.05}
        transmission={1.0}
        thickness={0.5}
        ior={1.33}
        clearcoat={1}
        clearcoatRoughness={0.05}
        transparent
        opacity={0.1}
        depthWrite={false}
        envMapIntensity={0.28}
        attenuationDistance={0.75}
        attenuationColor={white}
      />
    </mesh>
  );
};

interface EyeRigProps {
  gazeSmoothing: number;
  gazeRef: MutableRefObject<THREE.Vector2>;
  children: ReactNode;
}

const EyeRig: FC<EyeRigProps> = ({ gazeSmoothing, gazeRef, children }) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetEuler = useMemo(() => new THREE.Euler(0, 0, 0, 'YXZ'), []);
  const targetQuat = useMemo(() => new THREE.Quaternion(), []);
  const previousGaze = useRef(new THREE.Vector2(0, 0));
  const maxTilt = useMemo(() => THREE.MathUtils.degToRad(MAX_GAZE_DEGREES), []);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const pointerX = THREE.MathUtils.clamp(gazeRef.current.x * GAZE_INTENSITY, -0.8, 0.8);
    const pointerY = THREE.MathUtils.clamp(-gazeRef.current.y * GAZE_INTENSITY, -0.8, 0.8);
    const gazeDelta = previousGaze.current.distanceTo(gazeRef.current);
    const adaptiveSmoothing = THREE.MathUtils.clamp(
      gazeSmoothing + gazeDelta * 0.55,
      0.05,
      0.24
    );
    previousGaze.current.copy(gazeRef.current);

    const yaw = THREE.MathUtils.clamp(pointerX * maxTilt, -maxTilt, maxTilt);
    const pitch = THREE.MathUtils.clamp(pointerY * maxTilt, -maxTilt, maxTilt);
    targetEuler.set(pitch, yaw, 0, 'YXZ');
    targetQuat.setFromEuler(targetEuler);
    group.quaternion.slerp(targetQuat, adaptiveSmoothing);
  });

  return (
    <group ref={groupRef}>
      <group scale={[DISPLAY_SCALE, DISPLAY_SCALE, DISPLAY_SCALE]}>{children}</group>
    </group>
  );
};

interface EyeWorldSceneProps {
  textureSet: EyeTextureSet;
  mapPipeline: EyeMapPipeline;
  vectorAdapter?: EyeVectorAdapter;
  gazeSmoothing: number;
  onReady?: () => void;
}

const EyeWorldScene: FC<EyeWorldSceneProps> = ({
  textureSet,
  gazeSmoothing,
  onReady,
}) => {
  const [isDarkModeState, setIsDarkModeState] = useState<boolean>(() => {
    if (typeof document === 'undefined') {
      return true;
    }
    return resolveDarkMode(document.documentElement);
  });
  // GPU warm-up: both dark & light meshes render visible behind the loader
  // so shaders are compiled and textures uploaded for both modes
  const [gpuWarmed, setGpuWarmed] = useState(false);
  useEffect(() => {
    // Wait several frames so Three.js renders both meshes at least once
    let frame = 0;
    let rafId: number;
    const tick = () => {
      frame++;
      if (frame >= 5) {
        setGpuWarmed(true);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Signal readiness once GPU warm-up is complete
  // (textures are already loaded via Suspense, canvas ops have had time to compute)
  useEffect(() => {
    if (gpuWarmed && onReady) {
      onReady();
    }
  }, [gpuWarmed, onReady]);
  // No need to create pupil texture for Light Mode anymore
  // if (!isDarkMode) ...

  const rawPointerRef = useRef(new THREE.Vector2(0, 0));
  const gazeRef = useRef(new THREE.Vector2(0, 0));

  const liveAccentRef = useRef(parseCssColorToThree('', FALLBACK_ACCENT));
  const liveGlowRef = useRef(parseCssColorToThree('', FALLBACK_ACCENT));
  const liveBgRef = useRef(parseCssColorToThree('', FALLBACK_BG));
  const liveIsDarkModeRef = useRef(isDarkModeState);

  const irisMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const lightBaseMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const lightOverlayMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const pupilMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const corneaMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const hemisphereLightRef = useRef<THREE.HemisphereLight>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const catchLightRef = useRef<THREE.PointLight>(null);
  const glowLightARef = useRef<THREE.PointLight>(null);
  const glowLightBRef = useRef<THREE.PointLight>(null);
  const glowLightFollowRef = useRef<THREE.PointLight>(null);

  const themeCacheRef = useRef({
    accent: '',
    glow: '',
    bg: '',
    mode: '',
  });

  const targetColors = useRef({
    lightBase: new THREE.Color(),
    lightLand: new THREE.Color(),
    corneaA: new THREE.Color(),
    corneaB: new THREE.Color(),
    ambient: new THREE.Color(),
    hemiSky: new THREE.Color(),
    hemiGround: new THREE.Color(),
    dirColor: new THREE.Color(),
    lightPupil: new THREE.Color(),
  });

  const corneaTintA = useRef(new THREE.Color());
  const corneaTintB = useRef(new THREE.Color());
  const white = useRef(new THREE.Color(1, 1, 1));
  const hemiGroundBlendRef = useRef(new THREE.Color(0.72, 0.75, 0.8));

  const microSaccade = useRef({
    startTime: 0,
    duration: 0.08,
    offset: new THREE.Vector2(0, 0),
    nextTime: 1.2,
  });
  const driftSeed = useRef(Math.random() * 100);
  const tmpGazeTarget = useRef(new THREE.Vector2(0, 0));
  const driftRef = useRef(new THREE.Vector2(0, 0));
  const tremorRef = useRef(new THREE.Vector2(0, 0));
  const saccadeRef = useRef(new THREE.Vector2(0, 0));

  const updateThreeTheme = useCallback((force = false): void => {
    const root = document.documentElement;
    const style = window.getComputedStyle(root);
    const accentRaw = style.getPropertyValue('--accent').trim();
    const glowRaw = style.getPropertyValue('--glow-color').trim();
    const bgRaw = style.getPropertyValue('--bg-main').trim();
    const isDarkMode = resolveDarkMode(root);
    const modeKey = isDarkMode ? 'dark' : 'light';
    const effectiveGlowRaw = glowRaw.length > 0 ? glowRaw : accentRaw;

    if (
      !force &&
      accentRaw === themeCacheRef.current.accent &&
      effectiveGlowRaw === themeCacheRef.current.glow &&
      bgRaw === themeCacheRef.current.bg &&
      modeKey === themeCacheRef.current.mode
    ) {
      return;
    }

    themeCacheRef.current.accent = accentRaw;
    themeCacheRef.current.glow = effectiveGlowRaw;
    themeCacheRef.current.bg = bgRaw;
    themeCacheRef.current.mode = modeKey;

    liveAccentRef.current.copy(parseCssColorToThree(accentRaw, FALLBACK_ACCENT));
    liveGlowRef.current.copy(parseCssColorToThree(effectiveGlowRaw, FALLBACK_GLOW));
    liveBgRef.current.copy(parseCssColorToThree(bgRaw, FALLBACK_BG));
    liveIsDarkModeRef.current = isDarkMode;
    setIsDarkModeState((previous: boolean) => (previous === isDarkMode ? previous : isDarkMode));

    const accentHsl = { h: 0, s: 0, l: 0 };
    liveAccentRef.current.getHSL(accentHsl);
    const themeTints = getThemeGlobalTints(accentHsl, isDarkMode);

    targetColors.current.lightBase.copy(themeTints.base);
    targetColors.current.lightLand.copy(themeTints.land);
    targetColors.current.lightPupil.copy(themeTints.pupil);

    if (!isDarkMode) {
      // Enhance ambient fill with theme color for better chromatic integration
      targetColors.current.ambient.lerp(themeTints.base, 0.55);
    }

    if (irisMaterialRef.current) {
      const uniforms = irisMaterialRef.current.uniforms;
      uniforms.uAccent.value.copy(liveAccentRef.current);
      uniforms.uAccentGlow.value.copy(liveGlowRef.current);
      uniforms.uBg.value.copy(liveBgRef.current);
      uniforms.uDarkMode.value = isDarkMode ? 1 : 0;
    }

    // Lights Targets
    targetColors.current.corneaA.copy(liveGlowRef.current).lerp(white.current, isDarkMode ? 0.8 : 0.96);
    targetColors.current.corneaB.copy(liveGlowRef.current).lerp(liveBgRef.current, isDarkMode ? 0.56 : 0.76);
    targetColors.current.ambient.copy(liveBgRef.current).lerp(white.current, isDarkMode ? 0.08 : 0.35);

    if (!isDarkMode) {
      // Ambient Lighting: Matches theme background to "fill" shadows with theme hue
      // Using liveBgRef (background color) directly, but ensuring it's not too dark
      targetColors.current.ambient.copy(liveBgRef.current).lerp(white.current, 0.2);
    }

    targetColors.current.hemiSky.copy(white.current).lerp(liveGlowRef.current, 0.04);
    targetColors.current.hemiGround.copy(liveBgRef.current).lerp(hemiGroundBlendRef.current, 0.45);
    targetColors.current.dirColor.copy(white.current).lerp(liveGlowRef.current, isDarkMode ? 0.02 : 0.04);

    // Immediate Intensity/Property Updates
    if (hemisphereLightRef.current) {
      hemisphereLightRef.current.intensity = isDarkMode ? 0 : 1.28;
    }
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = isDarkMode ? 0.85 : 0.82;
    }
    if (catchLightRef.current) {
      catchLightRef.current.color.copy(white.current);
      catchLightRef.current.intensity = isDarkMode ? 0 : 0.9;
    }
    if (glowLightARef.current) {
      glowLightARef.current.color.copy(liveGlowRef.current);
      glowLightARef.current.intensity = isDarkMode ? 0.62 : 0;
    }
    if (glowLightBRef.current) {
      glowLightBRef.current.color.copy(liveGlowRef.current);
      glowLightBRef.current.intensity = isDarkMode ? 0.30 : 0;
    }
    if (glowLightFollowRef.current) {
      glowLightFollowRef.current.color.copy(liveGlowRef.current);
      glowLightFollowRef.current.intensity = isDarkMode ? 0.38 : 0;
    }
    if (corneaMaterialRef.current) {
      corneaMaterialRef.current.emissive.copy(liveGlowRef.current);
      corneaMaterialRef.current.emissiveIntensity = isDarkMode ? 0.32 : 0;
      corneaMaterialRef.current.opacity = isDarkMode ? 0.1 : 0.018;
      corneaMaterialRef.current.envMapIntensity = isDarkMode ? 0.28 : 0.09;
      corneaMaterialRef.current.clearcoat = isDarkMode ? 1 : 0.9;
      corneaMaterialRef.current.clearcoatRoughness = isDarkMode ? 0.05 : 0.06;
      corneaMaterialRef.current.roughness = isDarkMode ? 0.05 : 0.05;
    }
    if (pupilMaterialRef.current) {
      pupilMaterialRef.current.opacity = isDarkMode ? 0 : 0.98;
    }

  }, []);

  useEffect(() => {
    updateThreeTheme(true);
    const rafId = window.requestAnimationFrame(() => {
      updateThreeTheme(true);
    });
    const root = document.documentElement;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          (mutation.attributeName === 'class' ||
            mutation.attributeName === 'data-mode' ||
            mutation.attributeName === 'data-theme')
        ) {
          updateThreeTheme();
        }
      }
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class', 'data-mode', 'data-theme', 'style'],
    });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(rafId);
    };
  }, [updateThreeTheme]);

  // Fix: Force theme update when Dark Mode state changes (so new Mesh gets colors)
  useEffect(() => {
    updateThreeTheme(true);
  }, [isDarkModeState, updateThreeTheme]);

  useFrame((state, delta) => {
    // Color Smoothing (Lerp)
    const lerpFactor = THREE.MathUtils.clamp(delta * 2.0, 0, 1);

    if (lightBaseMaterialRef.current) {
      lightBaseMaterialRef.current.color.lerp(targetColors.current.lightBase, lerpFactor);
    }
    if (lightOverlayMaterialRef.current) {
      lightOverlayMaterialRef.current.color.lerp(targetColors.current.lightLand, lerpFactor);
    }
    if (corneaMaterialRef.current) {
      corneaTintA.current.lerp(targetColors.current.corneaA, lerpFactor);
      corneaTintB.current.lerp(targetColors.current.corneaB, lerpFactor);
      corneaMaterialRef.current.color.copy(corneaTintA.current);
      corneaMaterialRef.current.attenuationColor.copy(corneaTintB.current);
    }
    if (ambientLightRef.current) {
      ambientLightRef.current.color.lerp(targetColors.current.ambient, lerpFactor);
    }
    if (hemisphereLightRef.current) {
      hemisphereLightRef.current.color.lerp(targetColors.current.hemiSky, lerpFactor);
      hemisphereLightRef.current.groundColor.lerp(targetColors.current.hemiGround, lerpFactor);
    }
    if (directionalLightRef.current) {
      directionalLightRef.current.color.lerp(targetColors.current.dirColor, lerpFactor);
    }
    if (pupilMaterialRef.current) {
      pupilMaterialRef.current.uniforms.uColor.value.lerp(targetColors.current.lightPupil, lerpFactor);
    }

    // Gaze Logic
    const time = state.clock.elapsedTime;

    // ... Saccade/Drift/Tremor logic ...
    driftRef.current.set(
      Math.sin(time * 0.6 + driftSeed.current) * 0.007,
      Math.cos(time * 0.46 + driftSeed.current * 1.7) * 0.005
    );
    tremorRef.current.set(
      Math.sin(time * 11.2) * 0.0012,
      Math.cos(time * 9.6) * 0.0012
    );

    if (time >= microSaccade.current.nextTime) {
      const angle = Math.random() * Math.PI * 2;
      const mag = THREE.MathUtils.randFloat(0.006, 0.018);
      microSaccade.current.offset.set(Math.cos(angle) * mag, Math.sin(angle) * mag);
      microSaccade.current.duration = THREE.MathUtils.randFloat(0.045, 0.11);
      microSaccade.current.startTime = time;
      microSaccade.current.nextTime = time + THREE.MathUtils.randFloat(0.9, 2.3);
    }

    saccadeRef.current.set(0, 0);
    const saccadeElapsed = time - microSaccade.current.startTime;
    if (saccadeElapsed > 0 && saccadeElapsed < microSaccade.current.duration) {
      const p = saccadeElapsed / microSaccade.current.duration;
      const bell = Math.sin(Math.PI * p);
      saccadeRef.current.copy(microSaccade.current.offset).multiplyScalar(bell);
    }

    tmpGazeTarget.current
      .copy(rawPointerRef.current)
      .add(driftRef.current)
      .add(tremorRef.current)
      .add(saccadeRef.current);

    tmpGazeTarget.current.x = THREE.MathUtils.clamp(tmpGazeTarget.current.x, -1, 1);
    tmpGazeTarget.current.y = THREE.MathUtils.clamp(tmpGazeTarget.current.y, -1, 1);

    const speed = rawPointerRef.current.distanceTo(gazeRef.current) > 0.18 ? 0.26 : 0.12;
    gazeRef.current.lerp(tmpGazeTarget.current, speed);

    if (glowLightFollowRef.current) {
      const gx = THREE.MathUtils.clamp(gazeRef.current.x, -1, 1);
      const gy = THREE.MathUtils.clamp(-gazeRef.current.y, -1, 1);
      glowLightFollowRef.current.position.set(gx * 1.9, gy * 1.9, 2.1);
    }
  });

  const handlePointerMove = useCallback((event: PointerEvent) => {
    if (window.innerWidth === 0 || window.innerHeight === 0) return;
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    rawPointerRef.current.set(
      THREE.MathUtils.clamp(x, -1, 1),
      THREE.MathUtils.clamp(y, -1, 1)
    );
  }, []);

  const handlePointerLeave = useCallback(() => {
    rawPointerRef.current.set(0, 0);
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [handlePointerMove, handlePointerLeave]);

  return (
    <>
      <ambientLight ref={ambientLightRef} intensity={0.46} color={liveBgRef.current} />
      <hemisphereLight
        ref={hemisphereLightRef}
        intensity={liveIsDarkModeRef.current ? 0 : 1.28}
        color={white.current}
        groundColor={liveBgRef.current}
      />
      <directionalLight
        ref={directionalLightRef}
        position={[2.8, 2.4, 3.6]}
        intensity={liveIsDarkModeRef.current ? 0.85 : 0.82}
        color={white.current}
      />
      <pointLight
        ref={catchLightRef}
        position={[0.46, 0.54, 3.15]}
        intensity={liveIsDarkModeRef.current ? 0 : 0.9}
        distance={5}
        decay={2}
        color={white.current}
      />
      <pointLight
        ref={glowLightARef}
        position={[-2.8, -1.4, 2.2]}
        intensity={liveIsDarkModeRef.current ? 0.62 : 0}
        distance={7}
        color={liveGlowRef.current}
      />
      <pointLight
        ref={glowLightBRef}
        position={[2.2, 1.4, -2.6]}
        intensity={liveIsDarkModeRef.current ? 0.30 : 0}
        distance={6}
        color={liveGlowRef.current}
      />
      <pointLight
        ref={glowLightFollowRef}
        position={[0, 0, 2.1]}
        intensity={liveIsDarkModeRef.current ? 0.38 : 0}
        distance={6.4}
        color={liveGlowRef.current}
      />

      <EyeRig gazeSmoothing={gazeSmoothing} gazeRef={gazeRef}>
        <group visible={!gpuWarmed || isDarkModeState}>
          <EyeIrisMesh
            textureSet={textureSet}
            gazeRef={gazeRef}
            materialRef={irisMaterialRef}
          />
        </group>
        <group visible={!gpuWarmed || !isDarkModeState}>
          <EyeIrisLightMesh
            textureSet={textureSet}
            baseMaterialRef={lightBaseMaterialRef}
            overlayMaterialRef={lightOverlayMaterialRef}
            pupilMaterialRef={pupilMaterialRef}
          />
        </group>
        <EyeCorneaMesh materialRef={corneaMaterialRef} />
      </EyeRig>

      <Starfield
        pointerRef={rawPointerRef}
        isDarkMode={isDarkModeState}
        accentColorRef={liveAccentRef}
      />


    </>
  );
};

export interface EyeWorldProps {
  className?: string;
  mapPipeline?: EyeMapPipeline;
  textureQuality?: EyeTextureQuality;
  gazeSmoothing?: number;
  textureSet?: Partial<EyeTextureSet>;
  vectorAdapter?: EyeVectorAdapter;
}

const EyeWorld: FC<EyeWorldProps> = ({
  className,
  mapPipeline = 'raster',
  textureQuality = '4k',
  gazeSmoothing = 0.14,
  textureSet,
  vectorAdapter,
}) => {
  const mapConfig = useMemo(
    () =>
      resolveEyeMapConfig({
        mapPipeline,
        textureQuality,
        textureSet,
        vectorAdapter,
      }),
    [mapPipeline, textureQuality, textureSet, vectorAdapter]
  );

  // Signal the global loader to fade out once the scene is actually ready
  const handleSceneReady = useCallback(() => {
    // Small extra delay to let the last canvas textures settle
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('app-ready'));
    }, 120);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <EyeWorldScene
            textureSet={mapConfig.textureSet}
            mapPipeline={mapConfig.pipeline}
            vectorAdapter={mapConfig.vectorAdapter}
            gazeSmoothing={gazeSmoothing}
            onReady={handleSceneReady}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default EyeWorld;
