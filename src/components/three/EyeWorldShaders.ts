export const irisVertexShader = `
  varying vec2 vUv;
  varying vec3 vLocalNormal;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vLocalNormal = normalize(normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const irisFragmentShader = `
  uniform float uTime;
  uniform float uDarkMode;
  uniform float uTextureUOffset;
  uniform float uTextureVOffset;
  uniform sampler2D uTopographyMap;
  uniform sampler2D uLandMaskMap;
  uniform sampler2D uNightMap;
  uniform vec3 uAccent;
  uniform vec3 uAccentGlow;
  uniform vec3 uBg;
  uniform vec2 uGaze;

  varying vec2 vUv;
  varying vec3 vLocalNormal;
  varying vec3 vViewDir;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float sampleLand(vec2 uv) {
    return texture2D(uLandMaskMap, uv).r;
  }

  void main() {
    vec3 normal = normalize(vLocalNormal);
    vec3 viewDir = normalize(vViewDir);
    float frontHemisphere = smoothstep(0.05, 0.9, normal.z);
    vec2 refractionOffset = (viewDir.xy - normal.xy) * 0.01 * frontHemisphere;
    vec2 shiftedUv = vec2(
      fract(vUv.x + uTextureUOffset + refractionOffset.x),
      clamp(vUv.y + uTextureVOffset + refractionOffset.y, 0.001, 0.999)
    );
    vec2 texel = vec2(1.0 / 2048.0, 1.0 / 1024.0);
    vec3 topoSample = texture2D(uTopographyMap, shiftedUv).rgb;
    float topo = dot(topoSample, vec3(0.299, 0.587, 0.114));
    float landMask = 1.0 - sampleLand(shiftedUv);
    float night = texture2D(uNightMap, shiftedUv).r;

    float coastDiff =
      abs((1.0 - sampleLand(vec2(fract(shiftedUv.x + texel.x), shiftedUv.y))) - (1.0 - sampleLand(vec2(fract(shiftedUv.x - texel.x), shiftedUv.y)))) +
      abs((1.0 - sampleLand(vec2(shiftedUv.x, clamp(shiftedUv.y + texel.y, 0.001, 0.999)))) - (1.0 - sampleLand(vec2(shiftedUv.x, clamp(shiftedUv.y - texel.y, 0.001, 0.999)))));
    float coast = smoothstep(0.04, 0.20, coastDiff);

    vec3 dayColor = topoSample;
    dayColor = mix(dayColor, mix(uBg, vec3(0.58, 0.62, 0.68), 0.45), 0.12);
    dayColor += vec3(0.08, 0.10, 0.12) * coast * landMask * 0.4;

    vec3 oceanDark = mix(vec3(0.01, 0.02, 0.05), uBg, 0.40);
    vec3 landDark = mix(dayColor * 0.20, dayColor * 0.34 + uAccent * 0.08, 0.55);
    vec3 darkPalette = mix(oceanDark, landDark, landMask);
    float nightDetail = smoothstep(0.02, 0.62, night);
    vec3 oceanLight = mix(vec3(0.11, 0.15, 0.20), uBg + vec3(0.16, 0.18, 0.20), 0.55);
    vec3 landLight = mix(vec3(0.20, 0.24, 0.30), vec3(0.28, 0.33, 0.40), nightDetail);
    vec3 lightPalette = mix(oceanLight, landLight, landMask);
    lightPalette += vec3(0.06, 0.07, 0.08) * coast * landMask;

    float radial = clamp(length(vLocalNormal.xy), 0.0, 1.0);
    float angle = atan(vLocalNormal.y, vLocalNormal.x);
    float fiberWave = sin(angle * 110.0 + radial * 28.0 - uTime * 0.7) * 0.5 + 0.5;
    float microNoise = (sin(shiftedUv.x * 6.2831853 * 64.0 + shiftedUv.y * 33.0 + uTime * 0.05) * 0.5 + 0.5) * 0.05;
    float fibers = smoothstep(0.28, 0.95, fiberWave) * (1.0 - radial * 0.65) + microNoise;
    float fiberMask = fibers * landMask;

    vec3 baseColor = mix(lightPalette, darkPalette, uDarkMode);
    baseColor += vec3(0.035) * fiberMask * (1.0 - uDarkMode);
    baseColor += uAccent * fiberMask * uDarkMode * 0.20;
    baseColor += vec3(0.04, 0.05, 0.06) * coast * (1.0 - uDarkMode) * landMask;
    baseColor += uAccent * coast * uDarkMode * 0.16;
    float centerReadabilityMask =
      (1.0 - smoothstep(0.22, 0.92, length(normal.xy))) *
      frontHemisphere *
      (1.0 - uDarkMode);
    vec3 lightReadabilityTone = vec3(0.14, 0.17, 0.22);
    baseColor = mix(baseColor, lightReadabilityTone, centerReadabilityMask * 0.34);
    baseColor *= 1.0 - centerReadabilityMask * 0.22;
    // Theme adaptation via shadow tinting (not global brightening).
    float elevationShadeDark = (1.0 - topo) * landMask;
    float elevationShadeLight = (1.0 - nightDetail) * landMask;
    float shadeMaskDark = clamp(elevationShadeDark * 0.80 + coast * 0.35, 0.0, 1.0);
    float shadeMaskLight = clamp(elevationShadeLight * 0.65 + coast * 0.28, 0.0, 1.0);
    float shadeMask = mix(shadeMaskLight, shadeMaskDark, uDarkMode);
    vec3 shadeTintLight = mix(vec3(0.56, 0.60, 0.66), uAccent, 0.12);
    vec3 shadeTintDark = mix(uBg + vec3(0.04, 0.04, 0.05), uAccent, 0.38);
    vec3 shadeTint = mix(shadeTintLight, shadeTintDark, uDarkMode);
    baseColor = mix(baseColor, baseColor * shadeTint, shadeMask * (0.22 + 0.30 * uDarkMode));

    vec3 emissive = uAccentGlow * (night * landMask) * uDarkMode * 2.05;
    baseColor += emissive;

    float edgeGlow = pow(smoothstep(0.56, 0.97, 1.0 - normal.z), 1.25);
    float edgeGlowStrength = mix(0.008, 0.50, uDarkMode);
    baseColor += uAccentGlow * edgeGlow * edgeGlowStrength;
    vec2 gazeCenter = vec2(0.0, 0.0);
    float pupilRadial = length(normal.xy - gazeCenter);
    float pupilCore = 1.0 - smoothstep(0.105, 0.155, pupilRadial);
    float pupilFalloff = 1.0 - smoothstep(0.155, 0.22, pupilRadial);
    float pupilMask = clamp(pupilCore + pupilFalloff * 0.34, 0.0, 1.0) * frontHemisphere;
    float pupilInnerShadow = smoothstep(0.07, 0.20, pupilRadial) * pupilFalloff * frontHemisphere;
    float limbalRing =
      smoothstep(0.155, 0.19, pupilRadial) *
      (1.0 - smoothstep(0.24, 0.285, pupilRadial)) *
      frontHemisphere;
    float irisPocket = (1.0 - smoothstep(0.23, 0.40, pupilRadial)) * frontHemisphere;
    baseColor *= mix(1.0, mix(0.93, 0.86, uDarkMode), irisPocket * mix(0.16, 0.24, uDarkMode));
    vec3 pupilColor = vec3(0.001, 0.001, 0.002);
    pupilColor = mix(pupilColor, vec3(0.0), pupilInnerShadow * mix(0.58, 0.46, uDarkMode));
    vec3 ringColor = mix(
      vec3(0.07, 0.09, 0.12),
      uAccentGlow * 0.45 + vec3(0.05),
      0.20 + 0.62 * uDarkMode
    );
    baseColor = mix(baseColor, ringColor, limbalRing * mix(0.22, 0.54, uDarkMode));

    float catch = 1.0 - smoothstep(0.0, 0.03, length((normal.xy - gazeCenter) - vec2(-0.055, 0.06)));
    catch *= frontHemisphere * mix(0.12, 0.26, uDarkMode);
    baseColor += vec3(catch);

    float pulseBase = 0.5 + 0.5 * sin(uTime * 1.6);
    float emissivePulse = mix(
      mix(0.92, 1.06, pulseBase),
      mix(0.8, 1.2, pulseBase),
      uDarkMode
    );
    vec3 finalColor = mix(baseColor, pupilColor, pupilMask);
    finalColor += emissive * (emissivePulse - 1.0);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
