import * as THREE from 'three';

export type EyeMapPipeline = 'raster' | 'vector';
export type EyeTextureQuality = '2k' | '4k';

export interface EyeTextureSet {
  landMask: string;
  topography: string;
  nightLights: string;
}

// Vector pipeline is scaffolded in this phase.
export interface EyeVectorAdapter {
  id: string;
  createLandMaskTexture?: () => THREE.DataTexture;
}

export interface EyeMapConfig {
  pipeline: EyeMapPipeline;
  textureSet: EyeTextureSet;
  vectorAdapter?: EyeVectorAdapter;
}

interface ResolveEyeMapConfigInput {
  mapPipeline?: EyeMapPipeline;
  textureQuality?: EyeTextureQuality;
  textureSet?: Partial<EyeTextureSet>;
  vectorAdapter?: EyeVectorAdapter;
}

const joinBasePath = (path: string): string => {
  const baseUrl = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
};

const TEXTURE_LIBRARY: Record<EyeTextureQuality, EyeTextureSet> = {
  '2k': {
    landMask: joinBasePath('textures/earth/land-mask-2k.png'),
    topography: joinBasePath('textures/earth/topography-gray-2k.jpg'),
    nightLights: joinBasePath('textures/earth/night-lights-2k.jpg'),
  },
  '4k': {
    landMask: joinBasePath('textures/earth/land-mask-4k.png'),
    topography: joinBasePath('textures/earth/topography-gray-4k.jpg'),
    nightLights: joinBasePath('textures/earth/night-lights-4k.jpg'),
  },
};

export const resolveEyeTextureSet = (
  quality: EyeTextureQuality = '4k',
  overrides?: Partial<EyeTextureSet>
): EyeTextureSet => ({
  ...TEXTURE_LIBRARY[quality],
  ...overrides,
});

export const resolveEyeMapConfig = ({
  mapPipeline = 'raster',
  textureQuality = '4k',
  textureSet,
  vectorAdapter,
}: ResolveEyeMapConfigInput): EyeMapConfig => ({
  pipeline: mapPipeline,
  textureSet: resolveEyeTextureSet(textureQuality, textureSet),
  vectorAdapter,
});
