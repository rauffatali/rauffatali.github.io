import{d as e,u as pe,j as s,C as Ee,f as le}from"./three-drei-h8KqwSb2.js";import{m as be}from"./index-BwLSaSx4.js";import{i as k,M as j,j as De,k as we,d as X,h as Me,l as fe,m as Ae,n as je,E as Ie,Q as Ue,o as _e,p as Ge,q as Fe,r as Ne,s as Be,t as Pe}from"./three-core-B21wAXIv.js";import"./react-vendor-CUCvcJsG.js";const Oe=`
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
`,He=`
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
`,ne=r=>{const n="./".endsWith("/")?"./":".//",c=r.startsWith("/")?r.slice(1):r;return`${n}${c}`},ze={"2k":{landMask:ne("textures/earth/land-mask-2k.png"),topography:ne("textures/earth/topography-gray-2k.jpg"),nightLights:ne("textures/earth/night-lights-2k.jpg")},"4k":{landMask:ne("textures/earth/land-mask-4k.png"),topography:ne("textures/earth/topography-gray-4k.jpg"),nightLights:ne("textures/earth/night-lights-4k.jpg")}},We=(r="4k",t)=>({...ze[r],...t}),Ve=({mapPipeline:r="raster",textureQuality:t="4k",textureSet:n,vectorAdapter:c})=>({pipeline:r,textureSet:We(t,n),vectorAdapter:c}),Ye=r=>{const t=r.trim().toLowerCase();if(!t.startsWith("hsl("))return null;const n=t.replace(/[(),/]/g," ").match(/[+-]?\d*\.?\d+/g);if(!n||n.length<3)return null;const c=(Number(n[0])%360+360)%360,o=j.clamp(Number(n[1])/100,0,1),i=j.clamp(Number(n[2])/100,0,1);return new k().setHSL(c/360,o,i)},q=(r,t)=>{const n=r.trim().length>0?r.trim():t,c=Ye(n);if(c)return c;const o=new k;try{return o.setStyle(n),o}catch{return new k().setStyle(t)}};let ie=null;const Te=()=>{if(ie!==null)return ie;if(typeof navigator>"u"||typeof window>"u")return ie=!1,!1;const r=navigator.userAgent,t=/Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(r),n=navigator.maxTouchPoints>0&&window.innerWidth<1024;return ie=t||n,ie},Xe=()=>typeof window>"u"?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches,Le=Te(),qe=Xe(),re=Le?1500:4e3,ge=.12,Ze=25,Ke=Le?3:2,$e=()=>{if(typeof document>"u")return new Me;const r=128,t=document.createElement("canvas");t.width=r,t.height=r;const n=t.getContext("2d");if(!n)return new Me;const c=r/2,o=n.createRadialGradient(c,c,0,c,c,c);o.addColorStop(0,"rgba(255, 255, 255, 1)"),o.addColorStop(.2,"rgba(255, 255, 255, 0.8)"),o.addColorStop(.5,"rgba(255, 255, 255, 0.2)"),o.addColorStop(1,"rgba(255, 255, 255, 0)"),n.fillStyle=o,n.fillRect(0,0,r,r);const i=new fe(t);return i.needsUpdate=!0,i},Qe=({pointerRef:r,isDarkMode:t,accentColorRef:n})=>{const c=e.useRef(null),o=e.useRef(null),[i,p]=e.useMemo(()=>{const x=new Float32Array(re*3),w=new Float32Array(re);for(let v=0;v<re;v++){const I=Ze*Math.cbrt(Math.random()),M=Math.random()*Math.PI*2,m=Math.acos(2*Math.random()-1),a=I*Math.sin(m)*Math.cos(M),u=I*Math.sin(m)*Math.sin(M),f=I*Math.cos(m)-5;x[v*3]=a,x[v*3+1]=u,x[v*3+2]=f,w[v]=Math.random()}return[x,w]},[]),C=e.useMemo(()=>{const x=[];for(let w=0;w<re;w++)p[w]>.5&&x.push(w);return x},[p]),h=e.useMemo(()=>{const x=new De;x.setAttribute("position",new we(i,3));const w=new Float32Array(re*3);return x.setAttribute("color",new we(w,3)),x},[i]),_=e.useMemo(()=>$e(),[]),l=e.useRef({r:-1,g:-1,b:-1});e.useEffect(()=>{if(!c.current)return;const x=h.attributes.color,w=x.array,v=n.current,I=t?v.r:v.r*.65,M=t?v.g:v.g*.65,m=t?v.b:v.b*.65;for(let a=0;a<re;a++){if(p[a]>.5)continue;const u=a*3,f=t?1:.75;w[u]=I*f,w[u+1]=M*f,w[u+2]=m*f}x.needsUpdate=!0},[t,h,p,n]);const E=e.useRef(new X(0,0)),A=e.useRef(0);return pe(x=>{if(!c.current)return;const w=x.clock.elapsedTime,v=c.current.material,I=h.attributes.color,M=I.array,m=n.current;if(l.current.r!==m.r||l.current.g!==m.g||l.current.b!==m.b){l.current.r=m.r,l.current.g=m.g,l.current.b=m.b;const y=t?m.r:m.r*.65,L=t?m.g:m.g*.65,g=t?m.b:m.b*.65;for(let G=0;G<re;G++){if(p[G]>.5)continue;const U=G*3,R=t?1:.75;M[U]=y*R,M[U+1]=L*R,M[U+2]=g*R}}const a=t?m.r:m.r*.65,u=t?m.g:m.g*.65,f=t?m.b:m.b*.65;if(!qe)for(let y=0;y<C.length;y++){const L=C[y],g=p[L]*100,G=Math.sin(w*2+g);let U=j.mapLinear(G,-1,1,.4,1);const R=t?U:U*.75,O=L*3;M[O]=a*R,M[O+1]=u*R,M[O+2]=f*R}A.current++,A.current%Ke===0&&(I.needsUpdate=!0),o.current!==t&&(o.current=t,t?(v.blending=Ae,v.opacity=.8,v.size=ge):(v.blending=je,v.opacity=.6,v.size=ge*.9));const b=-r.current.x*.5,T=-r.current.y*.5;E.current.x+=(b-E.current.x)*.05,E.current.y+=(T-E.current.y)*.05,c.current.position.x=E.current.x,c.current.position.y=E.current.y,c.current.rotation.y=w*.02,c.current.rotation.z=w*.01}),s.jsx("points",{ref:c,geometry:h,children:s.jsx("pointsMaterial",{map:_,size:ge,sizeAttenuation:!0,transparent:!0,vertexColors:!0,alphaTest:.05,depthWrite:!1})})},$=Te(),de=.98,Je=1,ve=1.84,K=$?48:128,Ce=.95,et=35,me="hsl(220, 80%, 50%)",xe="hsl(240, 10%, 5%)",Se="hsl(220, 85%, 58%)",tt="#F8FAFC",rt="#E2E8F0",nt=1,Re=.18,ot=.08,at=.06,st=.42,oe=.15,ae=.1,ct=.34,ke=r=>{const t=(r.getAttribute("data-mode")||"").trim().toLowerCase();if(t==="light")return!1;if(t==="dark")return!0;const n=(r.getAttribute("data-theme")||"").trim().toLowerCase();return n.includes("light")?!1:(n.includes("dark"),!0)},it=(r,t)=>{if(t)return{base:new k("#F8FAFC"),land:new k("#E2E8F0"),pupil:new k(.11,.12,.135),ring:new k(.19,.205,.225)};const n=r.s<.2,c=n?.04:.15,o=new k().setHSL(r.h,c,.94),i=n?.05:.65,p=n?.88:.76,C=new k().setHSL(r.h,i,p),h=n?0:.65,_=n?.32:.38,l=new k().setHSL(r.h,h,_),E=n?0:.55,A=n?.42:.48,x=new k().setHSL(r.h,E,A);return{base:o,land:C,pupil:l,ring:x}},lt=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,ut=`
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
`,dt=(r,t)=>{if(typeof document>"u")return null;const n=r.image,c=t.image;if(!(n!=null&&n.width)||!(n!=null&&n.height)||!(c!=null&&c.width)||!(c!=null&&c.height))return null;const o=1024,i=512,p=document.createElement("canvas"),C=document.createElement("canvas");p.width=o,p.height=i,C.width=o,C.height=i;const h=p.getContext("2d"),_=C.getContext("2d");if(!h||!_)return null;h.drawImage(n,0,0,o,i),_.drawImage(c,0,0,o,i);const l=h.getImageData(0,0,o,i).data,E=_.getImageData(0,0,o,i).data,A=new Float32Array(o*i);for(let a=0;a<i;a+=1)for(let u=0;u<o;u+=1){const f=a*o+u,b=f*4,T=(l[b]*.299+l[b+1]*.587+l[b+2]*.114)/255,y=(E[b]*.299+E[b+1]*.587+E[b+2]*.114)/255,L=1-T;A[f]=j.clamp(L*.72+y*.18,0,1)}const x=document.createElement("canvas");x.width=o,x.height=i;const w=x.getContext("2d");if(!w)return null;const v=w.createImageData(o,i),I=v.data,M=2.2;for(let a=0;a<i;a+=1)for(let u=0;u<o;u+=1){const f=u>0?u-1:u,b=u<o-1?u+1:u,T=a>0?a-1:a,y=a<i-1?a+1:a,L=A[a*o+f],g=A[a*o+b],G=A[T*o+u],U=A[y*o+u],R=(g-L)*M,O=(U-G)*M,S=-R,W=-O,F=1,Y=Math.sqrt(S*S+W*W+F*F)||1,V=(a*o+u)*4;I[V]=(S/Y*.5+.5)*255,I[V+1]=(W/Y*.5+.5)*255,I[V+2]=(F/Y*.5+.5)*255,I[V+3]=255}w.putImageData(v,0,0);const m=new fe(x);return J(m,!1),m.offset.set(oe,ae),m.needsUpdate=!0,m},J=(r,t)=>{r.wrapS=_e,r.wrapT=Ge,r.anisotropy=$?2:8,r.minFilter=Fe,r.magFilter=Ne,r.colorSpace=t?Be:Pe,r.needsUpdate=!0},mt=({textureSet:r,gazeRef:t,materialRef:n})=>{const c=le(r.topography),o=le(r.landMask),i=le(r.nightLights),p=e.useMemo(()=>q("",me),[]),C=e.useMemo(()=>q("",Se),[]),h=e.useMemo(()=>q("",xe),[]);e.useEffect(()=>{J(c,!0),J(o,!1),J(i,!0)},[c,o,i]);const _=e.useMemo(()=>({uTime:{value:0},uDarkMode:{value:1},uTextureUOffset:{value:.15},uTextureVOffset:{value:.1},uTopographyMap:{value:c},uLandMaskMap:{value:o},uNightMap:{value:i},uAccent:{value:p.clone()},uAccentGlow:{value:C.clone()},uBg:{value:h.clone()},uGaze:{value:new X(0,0)}}),[p,h,C,o,i,c]);return pe(l=>{n.current&&(n.current.uniforms.uTime.value=l.clock.elapsedTime,n.current.uniforms.uGaze.value.lerp(t.current,.2))}),s.jsxs("mesh",{children:[s.jsx("sphereGeometry",{args:[de,K,K]}),s.jsx("shaderMaterial",{ref:n,vertexShader:Oe,fragmentShader:He,uniforms:_})]})},ft=({textureSet:r,baseMaterialRef:t,overlayMaterialRef:n,pupilMaterialRef:c})=>{const o=le(r.topography),i=le(r.landMask),[p,C]=e.useState(null);e.useEffect(()=>{let a=!1;const u=setTimeout(()=>{if(a)return;const f=dt(i,o);a||C(f)},0);return()=>{a=!0,clearTimeout(u)}},[i,o]);const[h,_]=e.useState(null);e.useEffect(()=>{let a=!1;const u=setTimeout(()=>{if(a||typeof document>"u")return;const f=i.image,b=o.image;if(!(f!=null&&f.width)||!(f!=null&&f.height)||!(b!=null&&b.width)||!(b!=null&&b.height))return;const T=$?1024:2048,y=T/2,L=document.createElement("canvas"),g=document.createElement("canvas");L.width=T,L.height=y,g.width=T,g.height=y;const G=L.getContext("2d"),U=g.getContext("2d");if(!G||!U)return;G.drawImage(f,0,0,T,y),U.drawImage(b,0,0,T,y);const R=G.getImageData(0,0,T,y).data,O=U.getImageData(0,0,T,y).data,S=document.createElement("canvas");S.width=T,S.height=y;const W=S.getContext("2d");if(!W)return;const F=W.createImageData(T,y),Y=F.data;for(let V=0;V<T*y;V++){const N=V*4,se=(R[N]*.299+R[N+1]*.587+R[N+2]*.114)/255,ce=(O[N]*.299+O[N+1]*.587+O[N+2]*.114)/255,z=j.clamp(1-se,0,1),P=j.clamp((ce-.18)/(.88-.18),0,1),D=P*P*(3-2*P),B=.76+(.96-.76)*D,H=.985,ee=H+(B-H)*z,d=Math.round(ee*255);Y[N]=d,Y[N+1]=d,Y[N+2]=d,Y[N+3]=255}W.putImageData(F,0,0);const Q=new fe(S);J(Q,!1),Q.offset.set(oe,ae),Q.needsUpdate=!0,a||_(Q)},0);return()=>{a=!0,clearTimeout(u)}},[i,o]);const[l,E]=e.useState(null);e.useEffect(()=>{let a=!1;const u=setTimeout(()=>{if(a||typeof document>"u")return;const f=i.image;if(!(f!=null&&f.width)||!(f!=null&&f.height))return;const b=$?1024:2048,T=b/2,y=document.createElement("canvas");y.width=b,y.height=T;const L=y.getContext("2d");if(!L)return;L.drawImage(f,0,0,b,T);const g=L.getImageData(0,0,b,T).data,G=L.createImageData(b,T),U=G.data;for(let O=0;O<b*T;O++){const S=O*4,W=(g[S]*.299+g[S+1]*.587+g[S+2]*.114)/255,F=Math.round((1-W)*255);U[S]=F,U[S+1]=F,U[S+2]=F,U[S+3]=255}L.putImageData(G,0,0);const R=new fe(y);J(R,!1),R.offset.set(oe,ae),R.needsUpdate=!0,a||E(R)},0);return()=>{a=!0,clearTimeout(u)}},[i]);const A=e.useMemo(()=>q("",tt),[]),x=e.useMemo(()=>new X(Re,Re),[]),w=e.useMemo(()=>q("",rt),[]),v=e.useCallback((a,u)=>{a.uniforms.uCenterDimStrength={value:u},a.uniforms.uCenterDimRadius={value:.76},a.uniforms.uCenterDimFeather={value:.34},a.fragmentShader=a.fragmentShader.replace("void main() {",`
uniform float uCenterDimStrength;
uniform float uCenterDimRadius;
uniform float uCenterDimFeather;
void main() {
`),a.fragmentShader=a.fragmentShader.replace("#include <output_fragment>",`
float centerDistance = distance(vUv, vec2(0.5));
float centerMask = 1.0 - smoothstep(uCenterDimRadius - uCenterDimFeather, uCenterDimRadius, centerDistance);
outgoingLight *= (1.0 - centerMask * uCenterDimStrength);
#include <output_fragment>
`)},[]),I=e.useCallback(a=>{v(a,ot)},[v]),M=e.useCallback(a=>{v(a,at)},[v]);e.useEffect(()=>{J(o,!0),J(i,!1),o.offset.set(oe,ae),o.needsUpdate=!0,i.offset.set(oe,ae),i.needsUpdate=!0,p&&(p.offset.set(oe,ae),p.needsUpdate=!0)},[i,p,o]),e.useEffect(()=>()=>{p==null||p.dispose(),h==null||h.dispose(),l==null||l.dispose()},[p,h,l]);const m=e.useMemo(()=>({uColor:{value:new k(1,1,1)}}),[]);return s.jsxs("group",{children:[s.jsxs("mesh",{children:[s.jsx("sphereGeometry",{args:[de,K,K]}),s.jsx("meshPhysicalMaterial",{ref:t,color:A,metalness:0,roughness:.2,normalMap:p??void 0,normalScale:x,clearcoat:.8,clearcoatRoughness:.03,envMapIntensity:.32,onBeforeCompile:I})]}),s.jsxs("mesh",{visible:!!h&&!!l,children:[s.jsx("sphereGeometry",{args:[de+.001,K,K]}),s.jsx("meshStandardMaterial",{ref:n,color:w,map:h??void 0,alphaMap:l??void 0,transparent:!1,alphaTest:st,opacity:nt,depthWrite:!0,metalness:0,roughness:.3,onBeforeCompile:M})]}),s.jsxs("mesh",{position:[0,0,de+.001],children:[s.jsx("circleGeometry",{args:[ct,K]}),s.jsx("shaderMaterial",{ref:c,vertexShader:lt,fragmentShader:ut,uniforms:m,transparent:!0,depthWrite:!1,toneMapped:!1})]})]})},pt=({materialRef:r})=>{const t=e.useMemo(()=>new k(1,1,1),[]);return s.jsxs("mesh",{children:[s.jsx("sphereGeometry",{args:[Je,K,K]}),$?s.jsx("meshStandardMaterial",{ref:r,color:t,emissive:new k(0,0,0),emissiveIntensity:0,metalness:.05,roughness:.08,transparent:!0,opacity:.1,depthWrite:!1,envMapIntensity:.22}):s.jsx("meshPhysicalMaterial",{ref:r,color:t,emissive:new k(0,0,0),emissiveIntensity:0,metalness:0,roughness:.05,transmission:1,thickness:.5,ior:1.33,clearcoat:1,clearcoatRoughness:.05,transparent:!0,opacity:.1,depthWrite:!1,envMapIntensity:.28,attenuationDistance:.75,attenuationColor:t})]})},ht=({gazeSmoothing:r,gazeRef:t,children:n})=>{const c=e.useRef(null),o=e.useMemo(()=>new Ie(0,0,0,"YXZ"),[]),i=e.useMemo(()=>new Ue,[]),p=e.useRef(new X(0,0)),C=e.useMemo(()=>j.degToRad(et),[]);return pe(()=>{const h=c.current;if(!h)return;const _=j.clamp(t.current.x*Ce,-.8,.8),l=j.clamp(-t.current.y*Ce,-.8,.8),E=p.current.distanceTo(t.current),A=j.clamp(r+E*.55,.05,.24);p.current.copy(t.current);const x=j.clamp(_*C,-C,C),w=j.clamp(l*C,-C,C);o.set(w,x,0,"YXZ"),i.setFromEuler(o),h.quaternion.slerp(i,A)}),s.jsx("group",{ref:c,children:s.jsx("group",{scale:[ve,ve,ve],children:n})})},gt=({textureSet:r,gazeSmoothing:t,onReady:n})=>{const[c,o]=e.useState(()=>typeof document>"u"?!0:ke(document.documentElement)),[i,p]=e.useState(!1);e.useEffect(()=>{let z=0,P;const D=()=>{z++,z>=5?p(!0):P=requestAnimationFrame(D)};return P=requestAnimationFrame(D),()=>cancelAnimationFrame(P)},[]),e.useEffect(()=>{i&&n&&n()},[i,n]);const C=e.useRef(new X(0,0)),h=e.useRef(new X(0,0)),_=e.useRef(q("",me)),l=e.useRef(q("",me)),E=e.useRef(q("",xe)),A=e.useRef(c),x=e.useRef(null),w=e.useRef(null),v=e.useRef(null),I=e.useRef(null),M=e.useRef(null),m=e.useRef(null),a=e.useRef(null),u=e.useRef(null),f=e.useRef(null),b=e.useRef(null),T=e.useRef(null),y=e.useRef(null),L=e.useRef({accent:"",glow:"",bg:"",mode:""}),g=e.useRef({lightBase:new k,lightLand:new k,corneaA:new k,corneaB:new k,ambient:new k,hemiSky:new k,hemiGround:new k,dirColor:new k,lightPupil:new k}),G=e.useRef(new k),U=e.useRef(new k),R=e.useRef(new k(1,1,1)),O=e.useRef(new k(.72,.75,.8)),S=e.useRef({startTime:0,duration:.08,offset:new X(0,0),nextTime:1.2}),W=e.useRef(Math.random()*100),F=e.useRef(new X(0,0)),Y=e.useRef(new X(0,0)),Q=e.useRef(new X(0,0)),V=e.useRef(new X(0,0)),N=e.useCallback((z=!1)=>{const P=document.documentElement,D=window.getComputedStyle(P),B=D.getPropertyValue("--accent").trim(),H=D.getPropertyValue("--glow-color").trim(),ee=D.getPropertyValue("--bg-main").trim(),d=ke(P),Z=d?"dark":"light",he=H.length>0?H:B;if(!z&&B===L.current.accent&&he===L.current.glow&&ee===L.current.bg&&Z===L.current.mode)return;L.current.accent=B,L.current.glow=he,L.current.bg=ee,L.current.mode=Z,_.current.copy(q(B,me)),l.current.copy(q(he,Se)),E.current.copy(q(ee,xe)),A.current=d,o(te=>te===d?te:d);const ye={h:0,s:0,l:0};_.current.getHSL(ye);const ue=it(ye,d);if(g.current.lightBase.copy(ue.base),g.current.lightLand.copy(ue.land),g.current.lightPupil.copy(ue.pupil),d||g.current.ambient.lerp(ue.base,.55),x.current){const te=x.current.uniforms;te.uAccent.value.copy(_.current),te.uAccentGlow.value.copy(l.current),te.uBg.value.copy(E.current),te.uDarkMode.value=d?1:0}g.current.corneaA.copy(l.current).lerp(R.current,d?.8:.96),g.current.corneaB.copy(l.current).lerp(E.current,d?.56:.76),g.current.ambient.copy(E.current).lerp(R.current,d?.08:.35),d||g.current.ambient.copy(E.current).lerp(R.current,.2),g.current.hemiSky.copy(R.current).lerp(l.current,.04),g.current.hemiGround.copy(E.current).lerp(O.current,.45),g.current.dirColor.copy(R.current).lerp(l.current,d?.02:.04),a.current&&(a.current.intensity=d?0:1.28),u.current&&(u.current.intensity=d?.85:.82),f.current&&(f.current.color.copy(R.current),f.current.intensity=d?0:.9),b.current&&(b.current.color.copy(l.current),b.current.intensity=d?.62:0),T.current&&(T.current.color.copy(l.current),T.current.intensity=d?.3:0),y.current&&(y.current.color.copy(l.current),y.current.intensity=d?.38:0),M.current&&(M.current.emissive.copy(l.current),M.current.emissiveIntensity=d?.32:0,M.current.opacity=d?.1:.018,M.current.envMapIntensity=d?.28:.09,M.current.roughness=.05,$||(M.current.clearcoat=d?1:.9,M.current.clearcoatRoughness=d?.05:.06)),I.current&&(I.current.opacity=d?0:.98)},[]);e.useEffect(()=>{N(!0);const z=window.requestAnimationFrame(()=>{N(!0)}),P=document.documentElement,D=new MutationObserver(B=>{for(const H of B)H.type==="attributes"&&(H.attributeName==="class"||H.attributeName==="data-mode"||H.attributeName==="data-theme")&&N()});return D.observe(P,{attributes:!0,attributeFilter:["class","data-mode","data-theme","style"]}),()=>{D.disconnect(),window.cancelAnimationFrame(z)}},[N]),e.useEffect(()=>{N(!0)},[c,N]),pe((z,P)=>{const D=j.clamp(P*2,0,1);w.current&&w.current.color.lerp(g.current.lightBase,D),v.current&&v.current.color.lerp(g.current.lightLand,D),M.current&&(G.current.lerp(g.current.corneaA,D),U.current.lerp(g.current.corneaB,D),M.current.color.copy(G.current),$||M.current.attenuationColor.copy(U.current)),m.current&&m.current.color.lerp(g.current.ambient,D),a.current&&(a.current.color.lerp(g.current.hemiSky,D),a.current.groundColor.lerp(g.current.hemiGround,D)),u.current&&u.current.color.lerp(g.current.dirColor,D),I.current&&I.current.uniforms.uColor.value.lerp(g.current.lightPupil,D);const B=z.clock.elapsedTime;if(Y.current.set(Math.sin(B*.6+W.current)*.007,Math.cos(B*.46+W.current*1.7)*.005),Q.current.set(Math.sin(B*11.2)*.0012,Math.cos(B*9.6)*.0012),B>=S.current.nextTime){const d=Math.random()*Math.PI*2,Z=j.randFloat(.006,.018);S.current.offset.set(Math.cos(d)*Z,Math.sin(d)*Z),S.current.duration=j.randFloat(.045,.11),S.current.startTime=B,S.current.nextTime=B+j.randFloat(.9,2.3)}V.current.set(0,0);const H=B-S.current.startTime;if(H>0&&H<S.current.duration){const d=H/S.current.duration,Z=Math.sin(Math.PI*d);V.current.copy(S.current.offset).multiplyScalar(Z)}F.current.copy(C.current).add(Y.current).add(Q.current).add(V.current),F.current.x=j.clamp(F.current.x,-1,1),F.current.y=j.clamp(F.current.y,-1,1);const ee=C.current.distanceTo(h.current)>.18?.26:.12;if(h.current.lerp(F.current,ee),y.current){const d=j.clamp(h.current.x,-1,1),Z=j.clamp(-h.current.y,-1,1);y.current.position.set(d*1.9,Z*1.9,2.1)}});const se=e.useCallback(z=>{if(window.innerWidth===0||window.innerHeight===0)return;const P=z.clientX/window.innerWidth*2-1,D=-(z.clientY/window.innerHeight)*2+1;C.current.set(j.clamp(P,-1,1),j.clamp(D,-1,1))},[]),ce=e.useCallback(()=>{C.current.set(0,0)},[]);return e.useEffect(()=>(window.addEventListener("pointermove",se,{passive:!0}),window.addEventListener("mouseleave",ce),()=>{window.removeEventListener("pointermove",se),window.removeEventListener("mouseleave",ce)}),[se,ce]),s.jsxs(s.Fragment,{children:[s.jsx("ambientLight",{ref:m,intensity:.46,color:E.current}),s.jsx("hemisphereLight",{ref:a,intensity:A.current?0:1.28,color:R.current,groundColor:E.current}),s.jsx("directionalLight",{ref:u,position:[2.8,2.4,3.6],intensity:A.current?.85:.82,color:R.current}),s.jsx("pointLight",{ref:f,position:[.46,.54,3.15],intensity:A.current?0:.9,distance:5,decay:2,color:R.current}),s.jsx("pointLight",{ref:b,position:[-2.8,-1.4,2.2],intensity:A.current?.62:0,distance:7,color:l.current}),s.jsx("pointLight",{ref:T,position:[2.2,1.4,-2.6],intensity:A.current?.3:0,distance:6,color:l.current}),s.jsx("pointLight",{ref:y,position:[0,0,2.1],intensity:A.current?.38:0,distance:6.4,color:l.current}),s.jsxs(ht,{gazeSmoothing:t,gazeRef:h,children:[s.jsx("group",{visible:!i||c,children:s.jsx(mt,{textureSet:r,gazeRef:h,materialRef:x})}),s.jsx("group",{visible:!i||!c,children:s.jsx(ft,{textureSet:r,baseMaterialRef:w,overlayMaterialRef:v,pupilMaterialRef:I})}),s.jsx(pt,{materialRef:M})]}),s.jsx(Qe,{pointerRef:C,isDarkMode:c,accentColorRef:_})]})},vt=({className:r,mapPipeline:t="raster",textureQuality:n=$?"2k":"4k",gazeSmoothing:c=.14,textureSet:o,vectorAdapter:i})=>{const p=e.useMemo(()=>Ve({mapPipeline:t,textureQuality:n,textureSet:o,vectorAdapter:i}),[t,n,o,i]),C=e.useCallback(()=>{const h=setTimeout(()=>{window.dispatchEvent(new Event("app-ready"))},120);return()=>clearTimeout(h)},[]);return s.jsx("div",{className:r,style:{width:"100%",height:"100%"},children:s.jsx(Ee,{camera:{position:[0,0,4.5],fov:50},gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},onCreated:({gl:h})=>{h.setClearColor(0,0)},dpr:$?[1,1]:[1,2],children:s.jsx(e.Suspense,{fallback:null,children:s.jsx(gt,{textureSet:p.textureSet,mapPipeline:p.pipeline,vectorAdapter:p.vectorAdapter,gazeSmoothing:c,onReady:C})})})})},Mt=()=>s.jsxs("section",{id:"home",className:"min-h-screen flex items-center justify-center relative overflow-hidden theme-bg-main theme-text-primary",children:[s.jsx("div",{className:"absolute inset-0 z-0",children:s.jsx(vt,{className:"w-full h-full"})}),s.jsxs("div",{className:"z-10 text-center px-6 max-w-4xl mx-auto py-20 hero-copy-shell",children:[s.jsx("div",{className:"mb-6 inline-block",children:s.jsx("span",{className:"px-4 py-1 rounded-full text-sm theme-accent-bg-light theme-accent",style:{backgroundColor:"var(--accent-light)",color:"var(--accent)"},children:"Ph.D. in Computer Vision"})}),s.jsx("h1",{className:"hero-heading text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent theme-accent",children:"Welcome to My World of Computer Vision"}),s.jsxs("p",{className:"hero-subtext text-xl md:text-2xl mb-8 theme-text-secondary",children:["I'm ",s.jsx("span",{className:"font-semibold theme-text-primary",children:"Rauf Fatali"}),", building AI-driven solutions to solve real-world problems through computer vision and deep learning."]}),s.jsxs("div",{className:"space-x-4",children:[s.jsx(be.Link,{to:"projects",spy:!0,smooth:!0,className:"hero-btn-primary inline-block px-6 py-3 font-bold rounded-lg transition transform hover:scale-105 cursor-pointer",style:{backgroundColor:"var(--accent)",color:"var(--text-on-accent)"},children:"Explore My Work"}),s.jsx(be.Link,{to:"contact",spy:!0,smooth:!0,className:"hero-btn-secondary inline-block px-6 py-3 font-bold rounded-lg transition border transform hover:scale-105 cursor-pointer",style:{backgroundColor:"var(--bg-surface)",color:"var(--text-primary)",borderColor:"var(--border-color)"},children:"Get in Touch"})]})]})]});export{Mt as default};
