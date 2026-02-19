import{C as w,M as T,d as e,B as Re,f as ve,V as H,u as me,j as a,T as xe,g as ue,A as ke,N as Le,h as Te,O as De,E as Se,Q as Ee,i as ae,k as Ae,l as je,L as Fe,m as Ue,S as Ie,n as _e}from"./three-vendor-BGbmoMng.js";import{m as ye}from"./index-DkBCXTHY.js";import"./react-vendor-iz5ZzlLu.js";const Ge=`
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
`,Ne=`
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
`,J=r=>{const n="./".endsWith("/")?"./":".//",c=r.startsWith("/")?r.slice(1):r;return`${n}${c}`},Be={"2k":{landMask:J("textures/earth/land-mask-2k.png"),topography:J("textures/earth/topography-gray-2k.jpg"),nightLights:J("textures/earth/night-lights-2k.jpg")},"4k":{landMask:J("textures/earth/land-mask-4k.png"),topography:J("textures/earth/topography-gray-4k.jpg"),nightLights:J("textures/earth/night-lights-4k.jpg")}},Pe=(r="4k",s)=>({...Be[r],...s}),Oe=({mapPipeline:r="raster",textureQuality:s="4k",textureSet:n,vectorAdapter:c})=>({pipeline:r,textureSet:Pe(s,n),vectorAdapter:c}),He=r=>{const s=r.trim().toLowerCase();if(!s.startsWith("hsl("))return null;const n=s.replace(/[(),/]/g," ").match(/[+-]?\d*\.?\d+/g);if(!n||n.length<3)return null;const c=(Number(n[0])%360+360)%360,t=T.clamp(Number(n[1])/100,0,1),i=T.clamp(Number(n[2])/100,0,1);return new w().setHSL(c/360,t,i)},z=(r,s)=>{const n=r.trim().length>0?r.trim():s,c=He(n);if(c)return c;const t=new w;try{return t.setStyle(n),t}catch{return new w().setStyle(s)}},ce=4e3,pe=.12,ze=25,We=()=>{if(typeof document>"u")return new xe;const r=128,s=document.createElement("canvas");s.width=r,s.height=r;const n=s.getContext("2d");if(!n)return new xe;const c=r/2,t=n.createRadialGradient(c,c,0,c,c,c);t.addColorStop(0,"rgba(255, 255, 255, 1)"),t.addColorStop(.2,"rgba(255, 255, 255, 0.8)"),t.addColorStop(.5,"rgba(255, 255, 255, 0.2)"),t.addColorStop(1,"rgba(255, 255, 255, 0)"),n.fillStyle=t,n.fillRect(0,0,r,r);const i=new ue(s);return i.needsUpdate=!0,i},Ve=({pointerRef:r,isDarkMode:s,accentColorRef:n})=>{const c=e.useRef(null),t=e.useRef(null),[i,p]=e.useMemo(()=>{const x=new Float32Array(ce*3),C=new Float32Array(ce);for(let f=0;f<ce;f++){const L=ze*Math.cbrt(Math.random()),j=Math.random()*Math.PI*2,U=Math.acos(2*Math.random()-1),o=L*Math.sin(U)*Math.cos(j),M=L*Math.sin(U)*Math.sin(j),h=L*Math.cos(U)-5;x[f*3]=o,x[f*3+1]=M,x[f*3+2]=h,C[f]=Math.random()}return[x,C]},[]),u=e.useMemo(()=>{const x=new Re;x.setAttribute("position",new ve(i,3));const C=new Float32Array(ce*3);return x.setAttribute("color",new ve(C,3)),x},[i]),y=e.useMemo(()=>We(),[]),d=e.useRef(new H(0,0));return me(x=>{if(!c.current)return;const C=x.clock.elapsedTime,f=c.current.material,L=u.attributes.color,j=L.array,U=L.count,o=n.current,M=s?o.r:o.r*.65,h=s?o.g:o.g*.65,l=s?o.b:o.b*.65;for(let b=0;b<U;b++){const D=p[b]*100;let R=1;if(p[b]>.5){const P=Math.sin(C*2+D);R=T.mapLinear(P,-1,1,.4,1)}const m=s?R:R*.75,S=b*3;j[S]=M*m,j[S+1]=h*m,j[S+2]=l*m}L.needsUpdate=!0,t.current!==s&&(t.current=s,s?(f.blending=ke,f.opacity=.8,f.size=pe):(f.blending=Le,f.opacity=.6,f.size=pe*.9));const g=-r.current.x*.5,A=-r.current.y*.5;d.current.x+=(g-d.current.x)*.05,d.current.y+=(A-d.current.y)*.05,c.current.position.x=d.current.x,c.current.position.y=d.current.y,c.current.rotation.y=C*.02,c.current.rotation.z=C*.01}),a.jsx("points",{ref:c,geometry:u,children:a.jsx("pointsMaterial",{map:y,size:pe,sizeAttenuation:!0,transparent:!0,vertexColors:!0,alphaTest:.05,depthWrite:!1})})},ie=.98,Ye=1,fe=1.84,Y=128,Me=.95,Xe=35,le="hsl(220, 80%, 50%)",he="hsl(240, 10%, 5%)",be="hsl(220, 85%, 58%)",qe="#F8FAFC",Ze="#E2E8F0",Ke=1,we=.18,$e=.08,Qe=.06,Je=.42,ee=.15,te=.1,et=.34,Ce=r=>{const s=(r.getAttribute("data-mode")||"").trim().toLowerCase();if(s==="light")return!1;if(s==="dark")return!0;const n=(r.getAttribute("data-theme")||"").trim().toLowerCase();return n.includes("light")?!1:(n.includes("dark"),!0)},tt=(r,s)=>{if(s)return{base:new w("#F8FAFC"),land:new w("#E2E8F0"),pupil:new w(.11,.12,.135),ring:new w(.19,.205,.225)};const n=r.s<.2,c=n?.04:.15,t=new w().setHSL(r.h,c,.94),i=n?.05:.65,p=n?.88:.76,u=new w().setHSL(r.h,i,p),y=n?0:.65,d=n?.32:.38,x=new w().setHSL(r.h,y,d),C=n?0:.55,f=n?.42:.48,L=new w().setHSL(r.h,C,f);return{base:t,land:u,pupil:x,ring:L}},rt=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,nt=`
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
`,ot=(r,s)=>{if(typeof document>"u")return null;const n=r.image,c=s.image;if(!(n!=null&&n.width)||!(n!=null&&n.height)||!(c!=null&&c.width)||!(c!=null&&c.height))return null;const t=1024,i=512,p=document.createElement("canvas"),u=document.createElement("canvas");p.width=t,p.height=i,u.width=t,u.height=i;const y=p.getContext("2d"),d=u.getContext("2d");if(!y||!d)return null;y.drawImage(n,0,0,t,i),d.drawImage(c,0,0,t,i);const x=y.getImageData(0,0,t,i).data,C=d.getImageData(0,0,t,i).data,f=new Float32Array(t*i);for(let l=0;l<i;l+=1)for(let g=0;g<t;g+=1){const A=l*t+g,b=A*4,D=(x[b]*.299+x[b+1]*.587+x[b+2]*.114)/255,R=(C[b]*.299+C[b+1]*.587+C[b+2]*.114)/255,m=1-D;f[A]=T.clamp(m*.72+R*.18,0,1)}const L=document.createElement("canvas");L.width=t,L.height=i;const j=L.getContext("2d");if(!j)return null;const U=j.createImageData(t,i),o=U.data,M=2.2;for(let l=0;l<i;l+=1)for(let g=0;g<t;g+=1){const A=g>0?g-1:g,b=g<t-1?g+1:g,D=l>0?l-1:l,R=l<i-1?l+1:l,m=f[l*t+A],S=f[l*t+b],P=f[D*t+g],F=f[R*t+g],X=(S-m)*M,I=(F-P)*M,W=-X,E=-I,q=1,Z=Math.sqrt(W*W+E*E+q*q)||1,_=(l*t+g)*4;o[_]=(W/Z*.5+.5)*255,o[_+1]=(E/Z*.5+.5)*255,o[_+2]=(q/Z*.5+.5)*255,o[_+3]=255}j.putImageData(U,0,0);const h=new ue(L);return K(h,!1),h.offset.set(ee,te),h.needsUpdate=!0,h},K=(r,s)=>{r.wrapS=Ae,r.wrapT=je,r.anisotropy=8,r.minFilter=Fe,r.magFilter=Ue,r.colorSpace=s?Ie:_e,r.needsUpdate=!0},at=({textureSet:r,gazeRef:s,materialRef:n})=>{const c=ae(r.topography),t=ae(r.landMask),i=ae(r.nightLights),p=e.useMemo(()=>z("",le),[]),u=e.useMemo(()=>z("",be),[]),y=e.useMemo(()=>z("",he),[]);e.useEffect(()=>{K(c,!0),K(t,!1),K(i,!0)},[c,t,i]);const d=e.useMemo(()=>({uTime:{value:0},uDarkMode:{value:1},uTextureUOffset:{value:.15},uTextureVOffset:{value:.1},uTopographyMap:{value:c},uLandMaskMap:{value:t},uNightMap:{value:i},uAccent:{value:p.clone()},uAccentGlow:{value:u.clone()},uBg:{value:y.clone()},uGaze:{value:new H(0,0)}}),[p,y,u,t,i,c]);return me(x=>{n.current&&(n.current.uniforms.uTime.value=x.clock.elapsedTime,n.current.uniforms.uGaze.value.lerp(s.current,.2))}),a.jsxs("mesh",{children:[a.jsx("sphereGeometry",{args:[ie,Y,Y]}),a.jsx("shaderMaterial",{ref:n,vertexShader:Ge,fragmentShader:Ne,uniforms:d})]})},st=({textureSet:r,baseMaterialRef:s,overlayMaterialRef:n,pupilMaterialRef:c})=>{const t=ae(r.topography),i=ae(r.landMask),p=e.useMemo(()=>ot(i,t),[i,t]),u=e.useMemo(()=>{if(typeof document>"u")return null;const o=i.image,M=t.image;if(!(o!=null&&o.width)||!(o!=null&&o.height)||!(M!=null&&M.width)||!(M!=null&&M.height))return null;const h=2048,l=h/2,g=document.createElement("canvas"),A=document.createElement("canvas");g.width=h,g.height=l,A.width=h,A.height=l;const b=g.getContext("2d"),D=A.getContext("2d");if(!b||!D)return null;b.drawImage(o,0,0,h,l),D.drawImage(M,0,0,h,l);const R=b.getImageData(0,0,h,l).data,m=D.getImageData(0,0,h,l).data,S=document.createElement("canvas");S.width=h,S.height=l;const P=S.getContext("2d");if(!P)return null;const F=P.createImageData(h,l),X=F.data;for(let W=0;W<h*l;W++){const E=W*4,q=(R[E]*.299+R[E+1]*.587+R[E+2]*.114)/255,Z=(m[E]*.299+m[E+1]*.587+m[E+2]*.114)/255,Q=T.clamp(1-q,0,1),_=T.clamp((Z-.18)/(.88-.18),0,1),re=_*_*(3-2*_),ne=.76+(.96-.76)*re,N=.985,B=N+(ne-N)*Q,k=Math.round(B*255);X[E]=k,X[E+1]=k,X[E+2]=k,X[E+3]=255}P.putImageData(F,0,0);const I=new ue(S);return K(I,!1),I.offset.set(ee,te),I.needsUpdate=!0,I},[i,t]),y=e.useMemo(()=>{if(typeof document>"u")return null;const o=i.image;if(!(o!=null&&o.width)||!(o!=null&&o.height))return null;const M=2048,h=M/2,l=document.createElement("canvas");l.width=M,l.height=h;const g=l.getContext("2d");if(!g)return null;g.drawImage(o,0,0,M,h);const A=g.getImageData(0,0,M,h).data,b=g.createImageData(M,h),D=b.data;for(let m=0;m<M*h;m++){const S=m*4,P=(A[S]*.299+A[S+1]*.587+A[S+2]*.114)/255,F=Math.round((1-P)*255);D[S]=F,D[S+1]=F,D[S+2]=F,D[S+3]=255}g.putImageData(b,0,0);const R=new ue(l);return K(R,!1),R.offset.set(ee,te),R.needsUpdate=!0,R},[i]),d=e.useMemo(()=>z("",qe),[]),x=e.useMemo(()=>new H(we,we),[]),C=e.useMemo(()=>z("",Ze),[]),f=e.useCallback((o,M)=>{o.uniforms.uCenterDimStrength={value:M},o.uniforms.uCenterDimRadius={value:.76},o.uniforms.uCenterDimFeather={value:.34},o.fragmentShader=o.fragmentShader.replace("void main() {",`
uniform float uCenterDimStrength;
uniform float uCenterDimRadius;
uniform float uCenterDimFeather;
void main() {
`),o.fragmentShader=o.fragmentShader.replace("#include <output_fragment>",`
float centerDistance = distance(vUv, vec2(0.5));
float centerMask = 1.0 - smoothstep(uCenterDimRadius - uCenterDimFeather, uCenterDimRadius, centerDistance);
outgoingLight *= (1.0 - centerMask * uCenterDimStrength);
#include <output_fragment>
`)},[]),L=e.useCallback(o=>{f(o,$e)},[f]),j=e.useCallback(o=>{f(o,Qe)},[f]);e.useEffect(()=>{K(t,!0),K(i,!1),t.offset.set(ee,te),t.needsUpdate=!0,i.offset.set(ee,te),i.needsUpdate=!0,p&&(p.offset.set(ee,te),p.needsUpdate=!0)},[i,p,t]),e.useEffect(()=>()=>{p==null||p.dispose(),u==null||u.dispose(),y==null||y.dispose()},[p,u,y]);const U=e.useMemo(()=>({uColor:{value:new w(1,1,1)}}),[]);return a.jsxs("group",{children:[a.jsxs("mesh",{children:[a.jsx("sphereGeometry",{args:[ie,Y,Y]}),a.jsx("meshPhysicalMaterial",{ref:s,color:d,metalness:0,roughness:.2,normalMap:p??void 0,normalScale:x,clearcoat:.8,clearcoatRoughness:.03,envMapIntensity:.32,onBeforeCompile:L})]}),a.jsxs("mesh",{visible:!!u&&!!y,children:[a.jsx("sphereGeometry",{args:[ie+.001,Y,Y]}),a.jsx("meshStandardMaterial",{ref:n,color:C,map:u??void 0,alphaMap:y??void 0,transparent:!1,alphaTest:Je,opacity:Ke,depthWrite:!0,metalness:0,roughness:.3,onBeforeCompile:j})]}),a.jsxs("mesh",{position:[0,0,ie+.001],children:[a.jsx("circleGeometry",{args:[et,Y]}),a.jsx("shaderMaterial",{ref:c,vertexShader:rt,fragmentShader:nt,uniforms:U,transparent:!0,depthWrite:!1,toneMapped:!1})]})]})},ct=({materialRef:r})=>{const s=e.useMemo(()=>new w(1,1,1),[]);return a.jsxs("mesh",{children:[a.jsx("sphereGeometry",{args:[Ye,Y,Y]}),a.jsx("meshPhysicalMaterial",{ref:r,color:s,emissive:new w(0,0,0),emissiveIntensity:0,metalness:0,roughness:.05,transmission:1,thickness:.5,ior:1.33,clearcoat:1,clearcoatRoughness:.05,transparent:!0,opacity:.1,depthWrite:!1,envMapIntensity:.28,attenuationDistance:.75,attenuationColor:s})]})},it=({gazeSmoothing:r,gazeRef:s,children:n})=>{const c=e.useRef(null),t=e.useMemo(()=>new Se(0,0,0,"YXZ"),[]),i=e.useMemo(()=>new Ee,[]),p=e.useRef(new H(0,0)),u=e.useMemo(()=>T.degToRad(Xe),[]);return me(()=>{const y=c.current;if(!y)return;const d=T.clamp(s.current.x*Me,-.8,.8),x=T.clamp(-s.current.y*Me,-.8,.8),C=p.current.distanceTo(s.current),f=T.clamp(r+C*.55,.05,.24);p.current.copy(s.current);const L=T.clamp(d*u,-u,u),j=T.clamp(x*u,-u,u);t.set(j,L,0,"YXZ"),i.setFromEuler(t),y.quaternion.slerp(i,f)}),a.jsx("group",{ref:c,children:a.jsx("group",{scale:[fe,fe,fe],children:n})})},lt=({textureSet:r,gazeSmoothing:s})=>{const[n,c]=e.useState(()=>typeof document>"u"?!0:Ce(document.documentElement)),[t,i]=e.useState(!1);e.useEffect(()=>{let N=0,B;const k=()=>{N++,N>=5?i(!0):B=requestAnimationFrame(k)};return B=requestAnimationFrame(k),()=>cancelAnimationFrame(B)},[]);const p=e.useRef(new H(0,0)),u=e.useRef(new H(0,0)),y=e.useRef(z("",le)),d=e.useRef(z("",le)),x=e.useRef(z("",he)),C=e.useRef(n),f=e.useRef(null),L=e.useRef(null),j=e.useRef(null),U=e.useRef(null),o=e.useRef(null),M=e.useRef(null),h=e.useRef(null),l=e.useRef(null),g=e.useRef(null),A=e.useRef(null),b=e.useRef(null),D=e.useRef(null),R=e.useRef({accent:"",glow:"",bg:"",mode:""}),m=e.useRef({lightBase:new w,lightLand:new w,corneaA:new w,corneaB:new w,ambient:new w,hemiSky:new w,hemiGround:new w,dirColor:new w,lightPupil:new w}),S=e.useRef(new w),P=e.useRef(new w),F=e.useRef(new w(1,1,1)),X=e.useRef(new w(.72,.75,.8)),I=e.useRef({startTime:0,duration:.08,offset:new H(0,0),nextTime:1.2}),W=e.useRef(Math.random()*100),E=e.useRef(new H(0,0)),q=e.useRef(new H(0,0)),Z=e.useRef(new H(0,0)),Q=e.useRef(new H(0,0)),_=e.useCallback((N=!1)=>{const B=document.documentElement,k=window.getComputedStyle(B),G=k.getPropertyValue("--accent").trim(),O=k.getPropertyValue("--glow-color").trim(),oe=k.getPropertyValue("--bg-main").trim(),v=Ce(B),V=v?"dark":"light",de=O.length>0?O:G;if(!N&&G===R.current.accent&&de===R.current.glow&&oe===R.current.bg&&V===R.current.mode)return;R.current.accent=G,R.current.glow=de,R.current.bg=oe,R.current.mode=V,y.current.copy(z(G,le)),d.current.copy(z(de,be)),x.current.copy(z(oe,he)),C.current=v,c($=>$===v?$:v);const ge={h:0,s:0,l:0};y.current.getHSL(ge);const se=tt(ge,v);if(m.current.lightBase.copy(se.base),m.current.lightLand.copy(se.land),m.current.lightPupil.copy(se.pupil),v||m.current.ambient.lerp(se.base,.55),f.current){const $=f.current.uniforms;$.uAccent.value.copy(y.current),$.uAccentGlow.value.copy(d.current),$.uBg.value.copy(x.current),$.uDarkMode.value=v?1:0}m.current.corneaA.copy(d.current).lerp(F.current,v?.8:.96),m.current.corneaB.copy(d.current).lerp(x.current,v?.56:.76),m.current.ambient.copy(x.current).lerp(F.current,v?.08:.35),v||m.current.ambient.copy(x.current).lerp(F.current,.2),m.current.hemiSky.copy(F.current).lerp(d.current,.04),m.current.hemiGround.copy(x.current).lerp(X.current,.45),m.current.dirColor.copy(F.current).lerp(d.current,v?.02:.04),h.current&&(h.current.intensity=v?0:1.28),l.current&&(l.current.intensity=v?.85:.82),g.current&&(g.current.color.copy(F.current),g.current.intensity=v?0:.9),A.current&&(A.current.color.copy(d.current),A.current.intensity=v?.62:0),b.current&&(b.current.color.copy(d.current),b.current.intensity=v?.3:0),D.current&&(D.current.color.copy(d.current),D.current.intensity=v?.38:0),o.current&&(o.current.emissive.copy(d.current),o.current.emissiveIntensity=v?.32:0,o.current.opacity=v?.1:.018,o.current.envMapIntensity=v?.28:.09,o.current.clearcoat=v?1:.9,o.current.clearcoatRoughness=v?.05:.06,o.current.roughness=.05),U.current&&(U.current.opacity=v?0:.98)},[]);e.useEffect(()=>{_(!0);const N=window.requestAnimationFrame(()=>{_(!0)}),B=document.documentElement,k=new MutationObserver(G=>{for(const O of G)O.type==="attributes"&&(O.attributeName==="class"||O.attributeName==="data-mode"||O.attributeName==="data-theme")&&_()});return k.observe(B,{attributes:!0,attributeFilter:["class","data-mode","data-theme","style"]}),()=>{k.disconnect(),window.cancelAnimationFrame(N)}},[_]),e.useEffect(()=>{_(!0)},[n,_]),me((N,B)=>{const k=T.clamp(B*2,0,1);L.current&&L.current.color.lerp(m.current.lightBase,k),j.current&&j.current.color.lerp(m.current.lightLand,k),o.current&&(S.current.lerp(m.current.corneaA,k),P.current.lerp(m.current.corneaB,k),o.current.color.copy(S.current),o.current.attenuationColor.copy(P.current)),M.current&&M.current.color.lerp(m.current.ambient,k),h.current&&(h.current.color.lerp(m.current.hemiSky,k),h.current.groundColor.lerp(m.current.hemiGround,k)),l.current&&l.current.color.lerp(m.current.dirColor,k),U.current&&U.current.uniforms.uColor.value.lerp(m.current.lightPupil,k);const G=N.clock.elapsedTime;if(q.current.set(Math.sin(G*.6+W.current)*.007,Math.cos(G*.46+W.current*1.7)*.005),Z.current.set(Math.sin(G*11.2)*.0012,Math.cos(G*9.6)*.0012),G>=I.current.nextTime){const v=Math.random()*Math.PI*2,V=T.randFloat(.006,.018);I.current.offset.set(Math.cos(v)*V,Math.sin(v)*V),I.current.duration=T.randFloat(.045,.11),I.current.startTime=G,I.current.nextTime=G+T.randFloat(.9,2.3)}Q.current.set(0,0);const O=G-I.current.startTime;if(O>0&&O<I.current.duration){const v=O/I.current.duration,V=Math.sin(Math.PI*v);Q.current.copy(I.current.offset).multiplyScalar(V)}E.current.copy(p.current).add(q.current).add(Z.current).add(Q.current),E.current.x=T.clamp(E.current.x,-1,1),E.current.y=T.clamp(E.current.y,-1,1);const oe=p.current.distanceTo(u.current)>.18?.26:.12;if(u.current.lerp(E.current,oe),D.current){const v=T.clamp(u.current.x,-1,1),V=T.clamp(-u.current.y,-1,1);D.current.position.set(v*1.9,V*1.9,2.1)}});const re=e.useCallback(N=>{if(window.innerWidth===0||window.innerHeight===0)return;const B=N.clientX/window.innerWidth*2-1,k=-(N.clientY/window.innerHeight)*2+1;p.current.set(T.clamp(B,-1,1),T.clamp(k,-1,1))},[]),ne=e.useCallback(()=>{p.current.set(0,0)},[]);return e.useEffect(()=>(window.addEventListener("pointermove",re,{passive:!0}),window.addEventListener("mouseleave",ne),()=>{window.removeEventListener("pointermove",re),window.removeEventListener("mouseleave",ne)}),[re,ne]),a.jsxs(a.Fragment,{children:[a.jsx("ambientLight",{ref:M,intensity:.46,color:x.current}),a.jsx("hemisphereLight",{ref:h,intensity:C.current?0:1.28,color:F.current,groundColor:x.current}),a.jsx("directionalLight",{ref:l,position:[2.8,2.4,3.6],intensity:C.current?.85:.82,color:F.current}),a.jsx("pointLight",{ref:g,position:[.46,.54,3.15],intensity:C.current?0:.9,distance:5,decay:2,color:F.current}),a.jsx("pointLight",{ref:A,position:[-2.8,-1.4,2.2],intensity:C.current?.62:0,distance:7,color:d.current}),a.jsx("pointLight",{ref:b,position:[2.2,1.4,-2.6],intensity:C.current?.3:0,distance:6,color:d.current}),a.jsx("pointLight",{ref:D,position:[0,0,2.1],intensity:C.current?.38:0,distance:6.4,color:d.current}),a.jsxs(it,{gazeSmoothing:s,gazeRef:u,children:[a.jsx("group",{visible:!t||n,children:a.jsx(at,{textureSet:r,gazeRef:u,materialRef:f})}),a.jsx("group",{visible:!t||!n,children:a.jsx(st,{textureSet:r,baseMaterialRef:L,overlayMaterialRef:j,pupilMaterialRef:U})}),a.jsx(ct,{materialRef:o})]}),a.jsx(Ve,{pointerRef:p,isDarkMode:n,accentColorRef:y}),a.jsx(De,{enableZoom:!1,enablePan:!1,enableRotate:!1})]})},ut=({className:r,mapPipeline:s="raster",textureQuality:n="4k",gazeSmoothing:c=.14,textureSet:t,vectorAdapter:i})=>{const p=e.useMemo(()=>Oe({mapPipeline:s,textureQuality:n,textureSet:t,vectorAdapter:i}),[s,n,t,i]);return e.useEffect(()=>{let u,y,d;return u=requestAnimationFrame(()=>{y=requestAnimationFrame(()=>{d=setTimeout(()=>{window.dispatchEvent(new Event("app-ready"))},300)})}),()=>{cancelAnimationFrame(u),cancelAnimationFrame(y),clearTimeout(d)}},[]),a.jsx("div",{className:r,style:{width:"100%",height:"100%"},children:a.jsx(Te,{camera:{position:[0,0,4.5],fov:50},gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},onCreated:({gl:u})=>{u.setClearColor(0,0)},dpr:[1,2],children:a.jsx(lt,{textureSet:p.textureSet,mapPipeline:p.pipeline,vectorAdapter:p.vectorAdapter,gazeSmoothing:c})})})},ft=()=>a.jsxs("section",{id:"home",className:"min-h-screen flex items-center justify-center relative overflow-hidden theme-bg-main theme-text-primary",children:[a.jsx("div",{className:"absolute inset-0 z-0",children:a.jsx(ut,{className:"w-full h-full"})}),a.jsxs("div",{className:"z-10 text-center px-6 max-w-4xl mx-auto py-20 hero-copy-shell",children:[a.jsx("div",{className:"mb-6 inline-block",children:a.jsx("span",{className:"px-4 py-1 rounded-full text-sm theme-accent-bg-light theme-accent",style:{backgroundColor:"var(--accent-light)",color:"var(--accent)"},children:"Ph.D. in Computer Vision"})}),a.jsx("h1",{className:"hero-heading text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent theme-accent",children:"Welcome to My World of Computer Vision"}),a.jsxs("p",{className:"hero-subtext text-xl md:text-2xl mb-8 theme-text-secondary",children:["I'm ",a.jsx("span",{className:"font-semibold theme-text-primary",children:"Rauf Fatali"}),", building AI-driven solutions to solve real-world problems through computer vision and deep learning."]}),a.jsxs("div",{className:"space-x-4",children:[a.jsx(ye.Link,{to:"projects",spy:!0,smooth:!0,className:"hero-btn-primary inline-block px-6 py-3 font-bold rounded-lg transition transform hover:scale-105 cursor-pointer",style:{backgroundColor:"var(--accent)",color:"var(--text-on-accent)"},children:"Explore My Work"}),a.jsx(ye.Link,{to:"contact",spy:!0,smooth:!0,className:"hero-btn-secondary inline-block px-6 py-3 font-bold rounded-lg transition border transform hover:scale-105 cursor-pointer",style:{backgroundColor:"var(--bg-surface)",color:"var(--text-primary)",borderColor:"var(--border-color)"},children:"Get in Touch"})]})]})]});export{ft as default};
