import{d as e,u as he,j as s,C as De,f as le}from"./three-drei-RT7BESrq.js";import{m as we}from"./index-D9o0S0Co.js";import{i as k,M as j,j as Ae,k as Me,d as X,h as Ce,l as pe,m as je,n as Ie,E as Ue,Q as _e,o as Ge,p as Fe,q as Ne,r as Be,s as Pe,t as Oe}from"./three-core-B21wAXIv.js";import"./react-vendor-lPGtvZ8U.js";const He=`
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
`,ze=`
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
`,ne=r=>{const n="./".endsWith("/")?"./":".//",c=r.startsWith("/")?r.slice(1):r;return`${n}${c}`},We={"2k":{landMask:ne("textures/earth/land-mask-2k.png"),topography:ne("textures/earth/topography-gray-2k.jpg"),nightLights:ne("textures/earth/night-lights-2k.jpg")},"4k":{landMask:ne("textures/earth/land-mask-4k.png"),topography:ne("textures/earth/topography-gray-4k.jpg"),nightLights:ne("textures/earth/night-lights-4k.jpg")}},Ve=(r="4k",t)=>({...We[r],...t}),Ye=({mapPipeline:r="raster",textureQuality:t="4k",textureSet:n,vectorAdapter:c})=>({pipeline:r,textureSet:Ve(t,n),vectorAdapter:c}),Xe=r=>{const t=r.trim().toLowerCase();if(!t.startsWith("hsl("))return null;const n=t.replace(/[(),/]/g," ").match(/[+-]?\d*\.?\d+/g);if(!n||n.length<3)return null;const c=(Number(n[0])%360+360)%360,o=j.clamp(Number(n[1])/100,0,1),i=j.clamp(Number(n[2])/100,0,1);return new k().setHSL(c/360,o,i)},q=(r,t)=>{const n=r.trim().length>0?r.trim():t,c=Xe(n);if(c)return c;const o=new k;try{return o.setStyle(n),o}catch{return new k().setStyle(t)}};let ie=null;const Le=()=>{if(ie!==null)return ie;if(typeof navigator>"u"||typeof window>"u")return ie=!1,!1;const r=navigator.userAgent,t=/Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(r),n=navigator.maxTouchPoints>0&&window.innerWidth<1024;return ie=t||n,ie},qe=()=>typeof window>"u"?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches,Se=Le(),Ze=qe(),re=Se?2500:4e3,ve=.12,Ke=25,$e=Se?3:2,Qe=()=>{if(typeof document>"u")return new Ce;const r=128,t=document.createElement("canvas");t.width=r,t.height=r;const n=t.getContext("2d");if(!n)return new Ce;const c=r/2,o=n.createRadialGradient(c,c,0,c,c,c);o.addColorStop(0,"rgba(255, 255, 255, 1)"),o.addColorStop(.2,"rgba(255, 255, 255, 0.8)"),o.addColorStop(.5,"rgba(255, 255, 255, 0.2)"),o.addColorStop(1,"rgba(255, 255, 255, 0)"),n.fillStyle=o,n.fillRect(0,0,r,r);const i=new pe(t);return i.needsUpdate=!0,i},Je=({pointerRef:r,isDarkMode:t,accentColorRef:n})=>{const c=e.useRef(null),o=e.useRef(null),[i,f]=e.useMemo(()=>{const g=new Float32Array(re*3),w=new Float32Array(re);for(let v=0;v<re;v++){const I=Ke*Math.cbrt(Math.random()),M=Math.random()*Math.PI*2,d=Math.acos(2*Math.random()-1),a=I*Math.sin(d)*Math.cos(M),u=I*Math.sin(d)*Math.sin(M),m=I*Math.cos(d)-5;g[v*3]=a,g[v*3+1]=u,g[v*3+2]=m,w[v]=Math.random()}return[g,w]},[]),C=e.useMemo(()=>{const g=[];for(let w=0;w<re;w++)f[w]>.5&&g.push(w);return g},[f]),p=e.useMemo(()=>{const g=new Ae;g.setAttribute("position",new Me(i,3));const w=new Float32Array(re*3);return g.setAttribute("color",new Me(w,3)),g},[i]),_=e.useMemo(()=>Qe(),[]),l=e.useRef({r:-1,g:-1,b:-1});e.useEffect(()=>{if(!c.current)return;const g=p.attributes.color,w=g.array,v=n.current,I=t?v.r:v.r*.65,M=t?v.g:v.g*.65,d=t?v.b:v.b*.65;for(let a=0;a<re;a++){if(f[a]>.5)continue;const u=a*3,m=t?1:.75;w[u]=I*m,w[u+1]=M*m,w[u+2]=d*m}g.needsUpdate=!0},[t,p,f,n]);const E=e.useRef(new X(0,0)),A=e.useRef(0);return he(g=>{if(!c.current)return;const w=g.clock.elapsedTime,v=c.current.material,I=p.attributes.color,M=I.array,d=n.current;if(l.current.r!==d.r||l.current.g!==d.g||l.current.b!==d.b){l.current.r=d.r,l.current.g=d.g,l.current.b=d.b;const y=t?d.r:d.r*.65,L=t?d.g:d.g*.65,h=t?d.b:d.b*.65;for(let G=0;G<re;G++){if(f[G]>.5)continue;const U=G*3,R=t?1:.75;M[U]=y*R,M[U+1]=L*R,M[U+2]=h*R}}const a=t?d.r:d.r*.65,u=t?d.g:d.g*.65,m=t?d.b:d.b*.65;if(!Ze)for(let y=0;y<C.length;y++){const L=C[y],h=f[L]*100,G=Math.sin(w*2+h);let U=j.mapLinear(G,-1,1,.4,1);const R=t?U:U*.75,P=L*3;M[P]=a*R,M[P+1]=u*R,M[P+2]=m*R}A.current++,A.current%$e===0&&(I.needsUpdate=!0),o.current!==t&&(o.current=t,t?(v.blending=je,v.opacity=.8,v.size=ve):(v.blending=Ie,v.opacity=.6,v.size=ve*.9));const b=-r.current.x*.5,T=-r.current.y*.5;E.current.x+=(b-E.current.x)*.05,E.current.y+=(T-E.current.y)*.05,c.current.position.x=E.current.x,c.current.position.y=E.current.y,c.current.rotation.y=w*.02,c.current.rotation.z=w*.01}),s.jsx("points",{ref:c,geometry:p,children:s.jsx("pointsMaterial",{map:_,size:ve,sizeAttenuation:!0,transparent:!0,vertexColors:!0,alphaTest:.05,depthWrite:!1})})},Q=Le(),me=.98,et=1,xe=1.84,$=Q?48:128,Re=.95,tt=35,fe="hsl(220, 80%, 50%)",ye="hsl(240, 10%, 5%)",Ee="hsl(220, 85%, 58%)",rt="#F8FAFC",nt="#E2E8F0",ot=1,ke=.18,at=.08,st=.06,ct=.42,oe=.15,ae=.1,it=.34,Te=r=>{const t=(r.getAttribute("data-mode")||"").trim().toLowerCase();if(t==="light")return!1;if(t==="dark")return!0;const n=(r.getAttribute("data-theme")||"").trim().toLowerCase();return n.includes("light")?!1:(n.includes("dark"),!0)},lt=(r,t)=>{if(t)return{base:new k("#F8FAFC"),land:new k("#E2E8F0"),pupil:new k(.11,.12,.135),ring:new k(.19,.205,.225)};const n=r.s<.2,c=n?.04:.15,o=new k().setHSL(r.h,c,.94),i=n?.05:.65,f=n?.88:.76,C=new k().setHSL(r.h,i,f),p=n?0:.65,_=n?.32:.38,l=new k().setHSL(r.h,p,_),E=n?0:.55,A=n?.42:.48,g=new k().setHSL(r.h,E,A);return{base:o,land:C,pupil:l,ring:g}},ut=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,dt=`
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
`,mt=(r,t)=>{if(typeof document>"u")return null;const n=r.image,c=t.image;if(!(n!=null&&n.width)||!(n!=null&&n.height)||!(c!=null&&c.width)||!(c!=null&&c.height))return null;const o=1024,i=512,f=document.createElement("canvas"),C=document.createElement("canvas");f.width=o,f.height=i,C.width=o,C.height=i;const p=f.getContext("2d"),_=C.getContext("2d");if(!p||!_)return null;p.drawImage(n,0,0,o,i),_.drawImage(c,0,0,o,i);const l=p.getImageData(0,0,o,i).data,E=_.getImageData(0,0,o,i).data,A=new Float32Array(o*i);for(let a=0;a<i;a+=1)for(let u=0;u<o;u+=1){const m=a*o+u,b=m*4,T=(l[b]*.299+l[b+1]*.587+l[b+2]*.114)/255,y=(E[b]*.299+E[b+1]*.587+E[b+2]*.114)/255,L=1-T;A[m]=j.clamp(L*.72+y*.18,0,1)}const g=document.createElement("canvas");g.width=o,g.height=i;const w=g.getContext("2d");if(!w)return null;const v=w.createImageData(o,i),I=v.data,M=2.2;for(let a=0;a<i;a+=1)for(let u=0;u<o;u+=1){const m=u>0?u-1:u,b=u<o-1?u+1:u,T=a>0?a-1:a,y=a<i-1?a+1:a,L=A[a*o+m],h=A[a*o+b],G=A[T*o+u],U=A[y*o+u],R=(h-L)*M,P=(U-G)*M,S=-R,W=-P,B=1,Y=Math.sqrt(S*S+W*W+B*B)||1,V=(a*o+u)*4;I[V]=(S/Y*.5+.5)*255,I[V+1]=(W/Y*.5+.5)*255,I[V+2]=(B/Y*.5+.5)*255,I[V+3]=255}w.putImageData(v,0,0);const d=new pe(g);return ee(d,!1),d.offset.set(oe,ae),d.needsUpdate=!0,d},ee=(r,t)=>{r.wrapS=Ge,r.wrapT=Fe,r.anisotropy=Q?2:8,r.minFilter=Ne,r.magFilter=Be,r.colorSpace=t?Pe:Oe,r.needsUpdate=!0},ft=({textureSet:r,gazeRef:t,materialRef:n})=>{const c=le(r.topography),o=le(r.landMask),i=le(r.nightLights),f=e.useMemo(()=>q("",fe),[]),C=e.useMemo(()=>q("",Ee),[]),p=e.useMemo(()=>q("",ye),[]);e.useEffect(()=>{ee(c,!0),ee(o,!1),ee(i,!0)},[c,o,i]);const _=e.useMemo(()=>({uTime:{value:0},uDarkMode:{value:1},uTextureUOffset:{value:.15},uTextureVOffset:{value:.1},uTopographyMap:{value:c},uLandMaskMap:{value:o},uNightMap:{value:i},uAccent:{value:f.clone()},uAccentGlow:{value:C.clone()},uBg:{value:p.clone()},uGaze:{value:new X(0,0)}}),[f,p,C,o,i,c]);return he(l=>{n.current&&(n.current.uniforms.uTime.value=l.clock.elapsedTime,n.current.uniforms.uGaze.value.lerp(t.current,.2))}),s.jsxs("mesh",{children:[s.jsx("sphereGeometry",{args:[me,$,$]}),s.jsx("shaderMaterial",{ref:n,vertexShader:He,fragmentShader:ze,uniforms:_})]})},pt=({textureSet:r,baseMaterialRef:t,overlayMaterialRef:n,pupilMaterialRef:c})=>{const o=le(r.topography),i=le(r.landMask),[f,C]=e.useState(null);e.useEffect(()=>{let a=!1;const u=setTimeout(()=>{if(a)return;const m=mt(i,o);a||C(m)},0);return()=>{a=!0,clearTimeout(u)}},[i,o]);const[p,_]=e.useState(null);e.useEffect(()=>{let a=!1;const u=setTimeout(()=>{if(a||typeof document>"u")return;const m=i.image,b=o.image;if(!(m!=null&&m.width)||!(m!=null&&m.height)||!(b!=null&&b.width)||!(b!=null&&b.height))return;const T=Q?1024:2048,y=T/2,L=document.createElement("canvas"),h=document.createElement("canvas");L.width=T,L.height=y,h.width=T,h.height=y;const G=L.getContext("2d"),U=h.getContext("2d");if(!G||!U)return;G.drawImage(m,0,0,T,y),U.drawImage(b,0,0,T,y);const R=G.getImageData(0,0,T,y).data,P=U.getImageData(0,0,T,y).data,S=document.createElement("canvas");S.width=T,S.height=y;const W=S.getContext("2d");if(!W)return;const B=W.createImageData(T,y),Y=B.data;for(let V=0;V<T*y;V++){const F=V*4,ue=(R[F]*.299+R[F+1]*.587+R[F+2]*.114)/255,se=(P[F]*.299+P[F+1]*.587+P[F+2]*.114)/255,ce=j.clamp(1-ue,0,1),O=j.clamp((se-.18)/(.88-.18),0,1),H=O*O*(3-2*O),D=.76+(.96-.76)*H,N=.985,z=N+(D-N)*ce,Z=Math.round(z*255);Y[F]=Z,Y[F+1]=Z,Y[F+2]=Z,Y[F+3]=255}W.putImageData(B,0,0);const J=new pe(S);ee(J,!1),J.offset.set(oe,ae),J.needsUpdate=!0,a||_(J)},0);return()=>{a=!0,clearTimeout(u)}},[i,o]);const[l,E]=e.useState(null);e.useEffect(()=>{let a=!1;const u=setTimeout(()=>{if(a||typeof document>"u")return;const m=i.image;if(!(m!=null&&m.width)||!(m!=null&&m.height))return;const b=Q?1024:2048,T=b/2,y=document.createElement("canvas");y.width=b,y.height=T;const L=y.getContext("2d");if(!L)return;L.drawImage(m,0,0,b,T);const h=L.getImageData(0,0,b,T).data,G=L.createImageData(b,T),U=G.data;for(let P=0;P<b*T;P++){const S=P*4,W=(h[S]*.299+h[S+1]*.587+h[S+2]*.114)/255,B=Math.round((1-W)*255);U[S]=B,U[S+1]=B,U[S+2]=B,U[S+3]=255}L.putImageData(G,0,0);const R=new pe(y);ee(R,!1),R.offset.set(oe,ae),R.needsUpdate=!0,a||E(R)},0);return()=>{a=!0,clearTimeout(u)}},[i]);const A=e.useMemo(()=>q("",rt),[]),g=e.useMemo(()=>new X(ke,ke),[]),w=e.useMemo(()=>q("",nt),[]),v=e.useCallback((a,u)=>{a.uniforms.uCenterDimStrength={value:u},a.uniforms.uCenterDimRadius={value:.76},a.uniforms.uCenterDimFeather={value:.34},a.fragmentShader=a.fragmentShader.replace("void main() {",`
uniform float uCenterDimStrength;
uniform float uCenterDimRadius;
uniform float uCenterDimFeather;
void main() {
`),a.fragmentShader=a.fragmentShader.replace("#include <output_fragment>",`
float centerDistance = distance(vUv, vec2(0.5));
float centerMask = 1.0 - smoothstep(uCenterDimRadius - uCenterDimFeather, uCenterDimRadius, centerDistance);
outgoingLight *= (1.0 - centerMask * uCenterDimStrength);
#include <output_fragment>
`)},[]),I=e.useCallback(a=>{v(a,at)},[v]),M=e.useCallback(a=>{v(a,st)},[v]);e.useEffect(()=>{ee(o,!0),ee(i,!1),o.offset.set(oe,ae),o.needsUpdate=!0,i.offset.set(oe,ae),i.needsUpdate=!0,f&&(f.offset.set(oe,ae),f.needsUpdate=!0)},[i,f,o]),e.useEffect(()=>()=>{f==null||f.dispose(),p==null||p.dispose(),l==null||l.dispose()},[f,p,l]);const d=e.useMemo(()=>({uColor:{value:new k(1,1,1)}}),[]);return s.jsxs("group",{children:[s.jsxs("mesh",{children:[s.jsx("sphereGeometry",{args:[me,$,$]}),s.jsx("meshPhysicalMaterial",{ref:t,color:A,metalness:0,roughness:.2,normalMap:f??void 0,normalScale:g,clearcoat:.8,clearcoatRoughness:.03,envMapIntensity:.32,onBeforeCompile:I})]}),s.jsxs("mesh",{visible:!!p&&!!l,children:[s.jsx("sphereGeometry",{args:[me+.001,$,$]}),s.jsx("meshStandardMaterial",{ref:n,color:w,map:p??void 0,alphaMap:l??void 0,transparent:!1,alphaTest:ct,opacity:ot,depthWrite:!0,metalness:0,roughness:.3,onBeforeCompile:M})]}),s.jsxs("mesh",{position:[0,0,me+.001],children:[s.jsx("circleGeometry",{args:[it,$]}),s.jsx("shaderMaterial",{ref:c,vertexShader:ut,fragmentShader:dt,uniforms:d,transparent:!0,depthWrite:!1,toneMapped:!1})]})]})},ht=({materialRef:r})=>{const t=e.useMemo(()=>new k(1,1,1),[]);return s.jsxs("mesh",{children:[s.jsx("sphereGeometry",{args:[et,$,$]}),Q?s.jsx("meshStandardMaterial",{ref:r,color:t,emissive:new k(0,0,0),emissiveIntensity:0,metalness:.05,roughness:.08,transparent:!0,opacity:.1,depthWrite:!1,envMapIntensity:.22}):s.jsx("meshPhysicalMaterial",{ref:r,color:t,emissive:new k(0,0,0),emissiveIntensity:0,metalness:0,roughness:.05,transmission:1,thickness:.5,ior:1.33,clearcoat:1,clearcoatRoughness:.05,transparent:!0,opacity:.1,depthWrite:!1,envMapIntensity:.28,attenuationDistance:.75,attenuationColor:t})]})},gt=({gazeSmoothing:r,gazeRef:t,children:n})=>{const c=e.useRef(null),o=e.useMemo(()=>new Ue(0,0,0,"YXZ"),[]),i=e.useMemo(()=>new _e,[]),f=e.useRef(new X(0,0)),C=e.useMemo(()=>j.degToRad(tt),[]);return he(()=>{const p=c.current;if(!p)return;const _=j.clamp(t.current.x*Re,-.8,.8),l=j.clamp(-t.current.y*Re,-.8,.8),E=f.current.distanceTo(t.current),A=j.clamp(r+E*.55,.05,.24);f.current.copy(t.current);const g=j.clamp(_*C,-C,C),w=j.clamp(l*C,-C,C);o.set(w,g,0,"YXZ"),i.setFromEuler(o),p.quaternion.slerp(i,A)}),s.jsx("group",{ref:c,children:s.jsx("group",{scale:[xe,xe,xe],children:n})})},vt=({textureSet:r,gazeSmoothing:t,onReady:n})=>{const[c,o]=e.useState(()=>typeof document>"u"?!0:Te(document.documentElement)),[i,f]=e.useState(!1);e.useEffect(()=>{let O=0,H;const D=()=>{O++,O>=5?f(!0):H=requestAnimationFrame(D)};return H=requestAnimationFrame(D),()=>cancelAnimationFrame(H)},[]),e.useEffect(()=>{i&&n&&n()},[i,n]);const C=e.useRef(new X(0,0)),p=e.useRef(new X(0,0)),_=e.useRef(q("",fe)),l=e.useRef(q("",fe)),E=e.useRef(q("",ye)),A=e.useRef(c),g=e.useRef(null),w=e.useRef(null),v=e.useRef(null),I=e.useRef(null),M=e.useRef(null),d=e.useRef(null),a=e.useRef(null),u=e.useRef(null),m=e.useRef(null),b=e.useRef(null),T=e.useRef(null),y=e.useRef(null),L=e.useRef({accent:"",glow:"",bg:"",mode:""}),h=e.useRef({lightBase:new k,lightLand:new k,corneaA:new k,corneaB:new k,ambient:new k,hemiSky:new k,hemiGround:new k,dirColor:new k,lightPupil:new k}),G=e.useRef(new k),U=e.useRef(new k),R=e.useRef(new k(1,1,1)),P=e.useRef(new k(.72,.75,.8)),S=e.useRef({startTime:0,duration:.08,offset:new X(0,0),nextTime:1.2}),W=e.useRef(Math.random()*100),B=e.useRef(new X(0,0)),Y=e.useRef(new X(0,0)),J=e.useRef(new X(0,0)),V=e.useRef(new X(0,0)),F=e.useCallback((O=!1)=>{const H=document.documentElement,D=window.getComputedStyle(H),N=D.getPropertyValue("--accent").trim(),z=D.getPropertyValue("--glow-color").trim(),Z=D.getPropertyValue("--bg-main").trim(),x=Te(H),K=x?"dark":"light",ge=z.length>0?z:N;if(!O&&N===L.current.accent&&ge===L.current.glow&&Z===L.current.bg&&K===L.current.mode)return;L.current.accent=N,L.current.glow=ge,L.current.bg=Z,L.current.mode=K,_.current.copy(q(N,fe)),l.current.copy(q(ge,Ee)),E.current.copy(q(Z,ye)),A.current=x,o(te=>te===x?te:x);const be={h:0,s:0,l:0};_.current.getHSL(be);const de=lt(be,x);if(h.current.lightBase.copy(de.base),h.current.lightLand.copy(de.land),h.current.lightPupil.copy(de.pupil),x||h.current.ambient.lerp(de.base,.55),g.current){const te=g.current.uniforms;te.uAccent.value.copy(_.current),te.uAccentGlow.value.copy(l.current),te.uBg.value.copy(E.current),te.uDarkMode.value=x?1:0}h.current.corneaA.copy(l.current).lerp(R.current,x?.8:.96),h.current.corneaB.copy(l.current).lerp(E.current,x?.56:.76),h.current.ambient.copy(E.current).lerp(R.current,x?.08:.35),x||h.current.ambient.copy(E.current).lerp(R.current,.2),h.current.hemiSky.copy(R.current).lerp(l.current,.04),h.current.hemiGround.copy(E.current).lerp(P.current,.45),h.current.dirColor.copy(R.current).lerp(l.current,x?.02:.04),a.current&&(a.current.intensity=x?0:1.28),u.current&&(u.current.intensity=x?.85:.82),m.current&&(m.current.color.copy(R.current),m.current.intensity=x?0:.9),b.current&&(b.current.color.copy(l.current),b.current.intensity=x?.62:0),T.current&&(T.current.color.copy(l.current),T.current.intensity=x?.3:0),y.current&&(y.current.color.copy(l.current),y.current.intensity=x?.38:0),M.current&&(M.current.emissive.copy(l.current),M.current.emissiveIntensity=x?.32:0,M.current.opacity=x?.1:.018,M.current.envMapIntensity=x?.28:.09,M.current.roughness=.05,Q||(M.current.clearcoat=x?1:.9,M.current.clearcoatRoughness=x?.05:.06)),I.current&&(I.current.opacity=x?0:.98)},[]);e.useEffect(()=>{F(!0);const O=window.requestAnimationFrame(()=>{F(!0)}),H=document.documentElement,D=new MutationObserver(N=>{for(const z of N)z.type==="attributes"&&(z.attributeName==="class"||z.attributeName==="data-mode"||z.attributeName==="data-theme")&&F()});return D.observe(H,{attributes:!0,attributeFilter:["class","data-mode","data-theme","style"]}),()=>{D.disconnect(),window.cancelAnimationFrame(O)}},[F]),e.useEffect(()=>{F(!0)},[c,F]);const ue=e.useRef(0);he((O,H)=>{ue.current<30&&(ue.current++,g.current&&F(!0));const D=j.clamp(H*2,0,1);w.current&&w.current.color.lerp(h.current.lightBase,D),v.current&&v.current.color.lerp(h.current.lightLand,D),M.current&&(G.current.lerp(h.current.corneaA,D),U.current.lerp(h.current.corneaB,D),M.current.color.copy(G.current),Q||M.current.attenuationColor.copy(U.current)),d.current&&d.current.color.lerp(h.current.ambient,D),a.current&&(a.current.color.lerp(h.current.hemiSky,D),a.current.groundColor.lerp(h.current.hemiGround,D)),u.current&&u.current.color.lerp(h.current.dirColor,D),I.current&&I.current.uniforms.uColor.value.lerp(h.current.lightPupil,D);const N=O.clock.elapsedTime;if(Y.current.set(Math.sin(N*.6+W.current)*.007,Math.cos(N*.46+W.current*1.7)*.005),J.current.set(Math.sin(N*11.2)*.0012,Math.cos(N*9.6)*.0012),N>=S.current.nextTime){const x=Math.random()*Math.PI*2,K=j.randFloat(.006,.018);S.current.offset.set(Math.cos(x)*K,Math.sin(x)*K),S.current.duration=j.randFloat(.045,.11),S.current.startTime=N,S.current.nextTime=N+j.randFloat(.9,2.3)}V.current.set(0,0);const z=N-S.current.startTime;if(z>0&&z<S.current.duration){const x=z/S.current.duration,K=Math.sin(Math.PI*x);V.current.copy(S.current.offset).multiplyScalar(K)}B.current.copy(C.current).add(Y.current).add(J.current).add(V.current),B.current.x=j.clamp(B.current.x,-1,1),B.current.y=j.clamp(B.current.y,-1,1);const Z=C.current.distanceTo(p.current)>.18?.26:.12;if(p.current.lerp(B.current,Z),y.current){const x=j.clamp(p.current.x,-1,1),K=j.clamp(-p.current.y,-1,1);y.current.position.set(x*1.9,K*1.9,2.1)}});const se=e.useCallback(O=>{if(window.innerWidth===0||window.innerHeight===0)return;const H=O.clientX/window.innerWidth*2-1,D=-(O.clientY/window.innerHeight)*2+1;C.current.set(j.clamp(H,-1,1),j.clamp(D,-1,1))},[]),ce=e.useCallback(()=>{C.current.set(0,0)},[]);return e.useEffect(()=>(window.addEventListener("pointermove",se,{passive:!0}),window.addEventListener("mouseleave",ce),()=>{window.removeEventListener("pointermove",se),window.removeEventListener("mouseleave",ce)}),[se,ce]),s.jsxs(s.Fragment,{children:[s.jsx("ambientLight",{ref:d,intensity:.46,color:E.current}),s.jsx("hemisphereLight",{ref:a,intensity:A.current?0:1.28,color:R.current,groundColor:E.current}),s.jsx("directionalLight",{ref:u,position:[2.8,2.4,3.6],intensity:A.current?.85:.82,color:R.current}),s.jsx("pointLight",{ref:m,position:[.46,.54,3.15],intensity:A.current?0:.9,distance:5,decay:2,color:R.current}),s.jsx("pointLight",{ref:b,position:[-2.8,-1.4,2.2],intensity:A.current?.62:0,distance:7,color:l.current}),s.jsx("pointLight",{ref:T,position:[2.2,1.4,-2.6],intensity:A.current?.3:0,distance:6,color:l.current}),s.jsx("pointLight",{ref:y,position:[0,0,2.1],intensity:A.current?.38:0,distance:6.4,color:l.current}),s.jsxs(gt,{gazeSmoothing:t,gazeRef:p,children:[s.jsx("group",{visible:!i||c,children:s.jsx(ft,{textureSet:r,gazeRef:p,materialRef:g})}),s.jsx("group",{visible:!i||!c,children:s.jsx(pt,{textureSet:r,baseMaterialRef:w,overlayMaterialRef:v,pupilMaterialRef:I})}),s.jsx(ht,{materialRef:M})]}),s.jsx(Je,{pointerRef:C,isDarkMode:c,accentColorRef:_})]})},xt=({className:r,mapPipeline:t="raster",textureQuality:n=Q?"2k":"4k",gazeSmoothing:c=.14,textureSet:o,vectorAdapter:i})=>{const f=e.useMemo(()=>Ye({mapPipeline:t,textureQuality:n,textureSet:o,vectorAdapter:i}),[t,n,o,i]),C=e.useCallback(()=>{const p=setTimeout(()=>{window.dispatchEvent(new Event("app-ready"))},120);return()=>clearTimeout(p)},[]);return s.jsx("div",{className:r,style:{width:"100%",height:"100%"},children:s.jsx(De,{camera:{position:[0,0,4.5],fov:50},gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},onCreated:({gl:p})=>{p.setClearColor(0,0)},dpr:Q?[1,1]:[1,2],children:s.jsx(e.Suspense,{fallback:null,children:s.jsx(vt,{textureSet:f.textureSet,mapPipeline:f.pipeline,vectorAdapter:f.vectorAdapter,gazeSmoothing:c,onReady:C})})})})},Ct=()=>s.jsxs("section",{id:"home",className:"min-h-screen flex items-center justify-center relative overflow-hidden theme-bg-main theme-text-primary",children:[s.jsx("div",{className:"absolute inset-0 z-0",children:s.jsx(xt,{className:"w-full h-full"})}),s.jsxs("div",{className:"z-10 text-center px-6 max-w-4xl mx-auto py-20 hero-copy-shell",children:[s.jsx("div",{className:"mb-6 inline-block",children:s.jsx("span",{className:"px-4 py-1 rounded-full text-sm theme-accent-bg-light theme-accent",style:{backgroundColor:"var(--accent-light)",color:"var(--accent)"},children:"Ph.D. in Computer Vision"})}),s.jsx("h1",{className:"hero-heading text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent theme-accent",children:"Welcome to My World of Computer Vision"}),s.jsxs("p",{className:"hero-subtext text-xl md:text-2xl mb-8 theme-text-secondary",children:["I'm ",s.jsx("span",{className:"font-semibold theme-text-primary",children:"Rauf Fatali"}),", building AI-driven solutions to solve real-world problems through computer vision and deep learning."]}),s.jsxs("div",{className:"space-x-4",children:[s.jsx(we.Link,{to:"projects",spy:!0,smooth:!0,className:"hero-btn-primary inline-block px-6 py-3 font-bold rounded-lg transition transform hover:scale-105 cursor-pointer",style:{backgroundColor:"var(--accent)",color:"var(--text-on-accent)"},children:"Explore My Work"}),s.jsx(we.Link,{to:"contact",spy:!0,smooth:!0,className:"hero-btn-secondary inline-block px-6 py-3 font-bold rounded-lg transition border transform hover:scale-105 cursor-pointer",style:{backgroundColor:"var(--bg-surface)",color:"var(--text-primary)",borderColor:"var(--border-color)"},children:"Get in Touch"})]})]})]});export{Ct as default};
