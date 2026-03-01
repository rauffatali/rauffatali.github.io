import{d as e,u as me,j as s,C as ke,f as ce}from"./three-drei-h8KqwSb2.js";import{m as xe}from"./index-7W8ZDosi.js";import{i as L,M as j,j as Te,k as ye,d as X,h as be,l as de,m as Le,n as Se,E as Ee,Q as De,o as Ae,p as je,q as Ie,r as Ue,s as Ge,t as _e}from"./three-core-B21wAXIv.js";import"./react-vendor-CUCvcJsG.js";const Fe=`
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
`,re=r=>{const n="./".endsWith("/")?"./":".//",c=r.startsWith("/")?r.slice(1):r;return`${n}${c}`},Be={"2k":{landMask:re("textures/earth/land-mask-2k.png"),topography:re("textures/earth/topography-gray-2k.jpg"),nightLights:re("textures/earth/night-lights-2k.jpg")},"4k":{landMask:re("textures/earth/land-mask-4k.png"),topography:re("textures/earth/topography-gray-4k.jpg"),nightLights:re("textures/earth/night-lights-4k.jpg")}},Pe=(r="4k",t)=>({...Be[r],...t}),He=({mapPipeline:r="raster",textureQuality:t="4k",textureSet:n,vectorAdapter:c})=>({pipeline:r,textureSet:Pe(t,n),vectorAdapter:c}),Oe=r=>{const t=r.trim().toLowerCase();if(!t.startsWith("hsl("))return null;const n=t.replace(/[(),/]/g," ").match(/[+-]?\d*\.?\d+/g);if(!n||n.length<3)return null;const c=(Number(n[0])%360+360)%360,o=j.clamp(Number(n[1])/100,0,1),i=j.clamp(Number(n[2])/100,0,1);return new L().setHSL(c/360,o,i)},q=(r,t)=>{const n=r.trim().length>0?r.trim():t,c=Oe(n);if(c)return c;const o=new L;try{return o.setStyle(n),o}catch{return new L().setStyle(t)}},te=4e3,pe=.12,ze=25,We=()=>{if(typeof document>"u")return new be;const r=128,t=document.createElement("canvas");t.width=r,t.height=r;const n=t.getContext("2d");if(!n)return new be;const c=r/2,o=n.createRadialGradient(c,c,0,c,c,c);o.addColorStop(0,"rgba(255, 255, 255, 1)"),o.addColorStop(.2,"rgba(255, 255, 255, 0.8)"),o.addColorStop(.5,"rgba(255, 255, 255, 0.2)"),o.addColorStop(1,"rgba(255, 255, 255, 0)"),n.fillStyle=o,n.fillRect(0,0,r,r);const i=new de(t);return i.needsUpdate=!0,i},Ve=({pointerRef:r,isDarkMode:t,accentColorRef:n})=>{const c=e.useRef(null),o=e.useRef(null),[i,p]=e.useMemo(()=>{const x=new Float32Array(te*3),w=new Float32Array(te);for(let v=0;v<te;v++){const I=ze*Math.cbrt(Math.random()),C=Math.random()*Math.PI*2,m=Math.acos(2*Math.random()-1),a=I*Math.sin(m)*Math.cos(C),u=I*Math.sin(m)*Math.sin(C),f=I*Math.cos(m)-5;x[v*3]=a,x[v*3+1]=u,x[v*3+2]=f,w[v]=Math.random()}return[x,w]},[]),M=e.useMemo(()=>{const x=[];for(let w=0;w<te;w++)p[w]>.5&&x.push(w);return x},[p]),h=e.useMemo(()=>{const x=new Te;x.setAttribute("position",new ye(i,3));const w=new Float32Array(te*3);return x.setAttribute("color",new ye(w,3)),x},[i]),G=e.useMemo(()=>We(),[]),l=e.useRef({r:-1,g:-1,b:-1});e.useEffect(()=>{if(!c.current)return;const x=h.attributes.color,w=x.array,v=n.current,I=t?v.r:v.r*.65,C=t?v.g:v.g*.65,m=t?v.b:v.b*.65;for(let a=0;a<te;a++){if(p[a]>.5)continue;const u=a*3,f=t?1:.75;w[u]=I*f,w[u+1]=C*f,w[u+2]=m*f}x.needsUpdate=!0},[t,h,p,n]);const E=e.useRef(new X(0,0)),A=e.useRef(0);return me(x=>{if(!c.current)return;const w=x.clock.elapsedTime,v=c.current.material,I=h.attributes.color,C=I.array,m=n.current;if(l.current.r!==m.r||l.current.g!==m.g||l.current.b!==m.b){l.current.r=m.r,l.current.g=m.g,l.current.b=m.b;const y=t?m.r:m.r*.65,T=t?m.g:m.g*.65,g=t?m.b:m.b*.65;for(let _=0;_<te;_++){if(p[_]>.5)continue;const U=_*3,R=t?1:.75;C[U]=y*R,C[U+1]=T*R,C[U+2]=g*R}}const a=t?m.r:m.r*.65,u=t?m.g:m.g*.65,f=t?m.b:m.b*.65;for(let y=0;y<M.length;y++){const T=M[y],g=p[T]*100,_=Math.sin(w*2+g);let U=j.mapLinear(_,-1,1,.4,1);const R=t?U:U*.75,H=T*3;C[H]=a*R,C[H+1]=u*R,C[H+2]=f*R}A.current++,A.current%2===0&&(I.needsUpdate=!0),o.current!==t&&(o.current=t,t?(v.blending=Le,v.opacity=.8,v.size=pe):(v.blending=Se,v.opacity=.6,v.size=pe*.9));const b=-r.current.x*.5,k=-r.current.y*.5;E.current.x+=(b-E.current.x)*.05,E.current.y+=(k-E.current.y)*.05,c.current.position.x=E.current.x,c.current.position.y=E.current.y,c.current.rotation.y=w*.02,c.current.rotation.z=w*.01}),s.jsx("points",{ref:c,geometry:h,children:s.jsx("pointsMaterial",{map:G,size:pe,sizeAttenuation:!0,transparent:!0,vertexColors:!0,alphaTest:.05,depthWrite:!1})})},le=.98,Ye=1,he=1.84,K=128,we=.95,Xe=35,ue="hsl(220, 80%, 50%)",ge="hsl(240, 10%, 5%)",Re="hsl(220, 85%, 58%)",qe="#F8FAFC",Ze="#E2E8F0",Ke=1,Ce=.18,$e=.08,Qe=.06,Je=.42,ne=.15,oe=.1,et=.34,Me=r=>{const t=(r.getAttribute("data-mode")||"").trim().toLowerCase();if(t==="light")return!1;if(t==="dark")return!0;const n=(r.getAttribute("data-theme")||"").trim().toLowerCase();return n.includes("light")?!1:(n.includes("dark"),!0)},tt=(r,t)=>{if(t)return{base:new L("#F8FAFC"),land:new L("#E2E8F0"),pupil:new L(.11,.12,.135),ring:new L(.19,.205,.225)};const n=r.s<.2,c=n?.04:.15,o=new L().setHSL(r.h,c,.94),i=n?.05:.65,p=n?.88:.76,M=new L().setHSL(r.h,i,p),h=n?0:.65,G=n?.32:.38,l=new L().setHSL(r.h,h,G),E=n?0:.55,A=n?.42:.48,x=new L().setHSL(r.h,E,A);return{base:o,land:M,pupil:l,ring:x}},rt=`
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
`,ot=(r,t)=>{if(typeof document>"u")return null;const n=r.image,c=t.image;if(!(n!=null&&n.width)||!(n!=null&&n.height)||!(c!=null&&c.width)||!(c!=null&&c.height))return null;const o=1024,i=512,p=document.createElement("canvas"),M=document.createElement("canvas");p.width=o,p.height=i,M.width=o,M.height=i;const h=p.getContext("2d"),G=M.getContext("2d");if(!h||!G)return null;h.drawImage(n,0,0,o,i),G.drawImage(c,0,0,o,i);const l=h.getImageData(0,0,o,i).data,E=G.getImageData(0,0,o,i).data,A=new Float32Array(o*i);for(let a=0;a<i;a+=1)for(let u=0;u<o;u+=1){const f=a*o+u,b=f*4,k=(l[b]*.299+l[b+1]*.587+l[b+2]*.114)/255,y=(E[b]*.299+E[b+1]*.587+E[b+2]*.114)/255,T=1-k;A[f]=j.clamp(T*.72+y*.18,0,1)}const x=document.createElement("canvas");x.width=o,x.height=i;const w=x.getContext("2d");if(!w)return null;const v=w.createImageData(o,i),I=v.data,C=2.2;for(let a=0;a<i;a+=1)for(let u=0;u<o;u+=1){const f=u>0?u-1:u,b=u<o-1?u+1:u,k=a>0?a-1:a,y=a<i-1?a+1:a,T=A[a*o+f],g=A[a*o+b],_=A[k*o+u],U=A[y*o+u],R=(g-T)*C,H=(U-_)*C,S=-R,W=-H,F=1,Y=Math.sqrt(S*S+W*W+F*F)||1,V=(a*o+u)*4;I[V]=(S/Y*.5+.5)*255,I[V+1]=(W/Y*.5+.5)*255,I[V+2]=(F/Y*.5+.5)*255,I[V+3]=255}w.putImageData(v,0,0);const m=new de(x);return Q(m,!1),m.offset.set(ne,oe),m.needsUpdate=!0,m},Q=(r,t)=>{r.wrapS=Ae,r.wrapT=je,r.anisotropy=8,r.minFilter=Ie,r.magFilter=Ue,r.colorSpace=t?Ge:_e,r.needsUpdate=!0},at=({textureSet:r,gazeRef:t,materialRef:n})=>{const c=ce(r.topography),o=ce(r.landMask),i=ce(r.nightLights),p=e.useMemo(()=>q("",ue),[]),M=e.useMemo(()=>q("",Re),[]),h=e.useMemo(()=>q("",ge),[]);e.useEffect(()=>{Q(c,!0),Q(o,!1),Q(i,!0)},[c,o,i]);const G=e.useMemo(()=>({uTime:{value:0},uDarkMode:{value:1},uTextureUOffset:{value:.15},uTextureVOffset:{value:.1},uTopographyMap:{value:c},uLandMaskMap:{value:o},uNightMap:{value:i},uAccent:{value:p.clone()},uAccentGlow:{value:M.clone()},uBg:{value:h.clone()},uGaze:{value:new X(0,0)}}),[p,h,M,o,i,c]);return me(l=>{n.current&&(n.current.uniforms.uTime.value=l.clock.elapsedTime,n.current.uniforms.uGaze.value.lerp(t.current,.2))}),s.jsxs("mesh",{children:[s.jsx("sphereGeometry",{args:[le,K,K]}),s.jsx("shaderMaterial",{ref:n,vertexShader:Fe,fragmentShader:Ne,uniforms:G})]})},st=({textureSet:r,baseMaterialRef:t,overlayMaterialRef:n,pupilMaterialRef:c})=>{const o=ce(r.topography),i=ce(r.landMask),[p,M]=e.useState(null);e.useEffect(()=>{let a=!1;const u=setTimeout(()=>{if(a)return;const f=ot(i,o);a||M(f)},0);return()=>{a=!0,clearTimeout(u)}},[i,o]);const[h,G]=e.useState(null);e.useEffect(()=>{let a=!1;const u=setTimeout(()=>{if(a||typeof document>"u")return;const f=i.image,b=o.image;if(!(f!=null&&f.width)||!(f!=null&&f.height)||!(b!=null&&b.width)||!(b!=null&&b.height))return;const k=2048,y=k/2,T=document.createElement("canvas"),g=document.createElement("canvas");T.width=k,T.height=y,g.width=k,g.height=y;const _=T.getContext("2d"),U=g.getContext("2d");if(!_||!U)return;_.drawImage(f,0,0,k,y),U.drawImage(b,0,0,k,y);const R=_.getImageData(0,0,k,y).data,H=U.getImageData(0,0,k,y).data,S=document.createElement("canvas");S.width=k,S.height=y;const W=S.getContext("2d");if(!W)return;const F=W.createImageData(k,y),Y=F.data;for(let V=0;V<k*y;V++){const N=V*4,ae=(R[N]*.299+R[N+1]*.587+R[N+2]*.114)/255,se=(H[N]*.299+H[N+1]*.587+H[N+2]*.114)/255,z=j.clamp(1-ae,0,1),P=j.clamp((se-.18)/(.88-.18),0,1),D=P*P*(3-2*P),B=.76+(.96-.76)*D,O=.985,J=O+(B-O)*z,d=Math.round(J*255);Y[N]=d,Y[N+1]=d,Y[N+2]=d,Y[N+3]=255}W.putImageData(F,0,0);const $=new de(S);Q($,!1),$.offset.set(ne,oe),$.needsUpdate=!0,a||G($)},0);return()=>{a=!0,clearTimeout(u)}},[i,o]);const[l,E]=e.useState(null);e.useEffect(()=>{let a=!1;const u=setTimeout(()=>{if(a||typeof document>"u")return;const f=i.image;if(!(f!=null&&f.width)||!(f!=null&&f.height))return;const b=2048,k=b/2,y=document.createElement("canvas");y.width=b,y.height=k;const T=y.getContext("2d");if(!T)return;T.drawImage(f,0,0,b,k);const g=T.getImageData(0,0,b,k).data,_=T.createImageData(b,k),U=_.data;for(let H=0;H<b*k;H++){const S=H*4,W=(g[S]*.299+g[S+1]*.587+g[S+2]*.114)/255,F=Math.round((1-W)*255);U[S]=F,U[S+1]=F,U[S+2]=F,U[S+3]=255}T.putImageData(_,0,0);const R=new de(y);Q(R,!1),R.offset.set(ne,oe),R.needsUpdate=!0,a||E(R)},0);return()=>{a=!0,clearTimeout(u)}},[i]);const A=e.useMemo(()=>q("",qe),[]),x=e.useMemo(()=>new X(Ce,Ce),[]),w=e.useMemo(()=>q("",Ze),[]),v=e.useCallback((a,u)=>{a.uniforms.uCenterDimStrength={value:u},a.uniforms.uCenterDimRadius={value:.76},a.uniforms.uCenterDimFeather={value:.34},a.fragmentShader=a.fragmentShader.replace("void main() {",`
uniform float uCenterDimStrength;
uniform float uCenterDimRadius;
uniform float uCenterDimFeather;
void main() {
`),a.fragmentShader=a.fragmentShader.replace("#include <output_fragment>",`
float centerDistance = distance(vUv, vec2(0.5));
float centerMask = 1.0 - smoothstep(uCenterDimRadius - uCenterDimFeather, uCenterDimRadius, centerDistance);
outgoingLight *= (1.0 - centerMask * uCenterDimStrength);
#include <output_fragment>
`)},[]),I=e.useCallback(a=>{v(a,$e)},[v]),C=e.useCallback(a=>{v(a,Qe)},[v]);e.useEffect(()=>{Q(o,!0),Q(i,!1),o.offset.set(ne,oe),o.needsUpdate=!0,i.offset.set(ne,oe),i.needsUpdate=!0,p&&(p.offset.set(ne,oe),p.needsUpdate=!0)},[i,p,o]),e.useEffect(()=>()=>{p==null||p.dispose(),h==null||h.dispose(),l==null||l.dispose()},[p,h,l]);const m=e.useMemo(()=>({uColor:{value:new L(1,1,1)}}),[]);return s.jsxs("group",{children:[s.jsxs("mesh",{children:[s.jsx("sphereGeometry",{args:[le,K,K]}),s.jsx("meshPhysicalMaterial",{ref:t,color:A,metalness:0,roughness:.2,normalMap:p??void 0,normalScale:x,clearcoat:.8,clearcoatRoughness:.03,envMapIntensity:.32,onBeforeCompile:I})]}),s.jsxs("mesh",{visible:!!h&&!!l,children:[s.jsx("sphereGeometry",{args:[le+.001,K,K]}),s.jsx("meshStandardMaterial",{ref:n,color:w,map:h??void 0,alphaMap:l??void 0,transparent:!1,alphaTest:Je,opacity:Ke,depthWrite:!0,metalness:0,roughness:.3,onBeforeCompile:C})]}),s.jsxs("mesh",{position:[0,0,le+.001],children:[s.jsx("circleGeometry",{args:[et,K]}),s.jsx("shaderMaterial",{ref:c,vertexShader:rt,fragmentShader:nt,uniforms:m,transparent:!0,depthWrite:!1,toneMapped:!1})]})]})},ct=({materialRef:r})=>{const t=e.useMemo(()=>new L(1,1,1),[]);return s.jsxs("mesh",{children:[s.jsx("sphereGeometry",{args:[Ye,K,K]}),s.jsx("meshPhysicalMaterial",{ref:r,color:t,emissive:new L(0,0,0),emissiveIntensity:0,metalness:0,roughness:.05,transmission:1,thickness:.5,ior:1.33,clearcoat:1,clearcoatRoughness:.05,transparent:!0,opacity:.1,depthWrite:!1,envMapIntensity:.28,attenuationDistance:.75,attenuationColor:t})]})},it=({gazeSmoothing:r,gazeRef:t,children:n})=>{const c=e.useRef(null),o=e.useMemo(()=>new Ee(0,0,0,"YXZ"),[]),i=e.useMemo(()=>new De,[]),p=e.useRef(new X(0,0)),M=e.useMemo(()=>j.degToRad(Xe),[]);return me(()=>{const h=c.current;if(!h)return;const G=j.clamp(t.current.x*we,-.8,.8),l=j.clamp(-t.current.y*we,-.8,.8),E=p.current.distanceTo(t.current),A=j.clamp(r+E*.55,.05,.24);p.current.copy(t.current);const x=j.clamp(G*M,-M,M),w=j.clamp(l*M,-M,M);o.set(w,x,0,"YXZ"),i.setFromEuler(o),h.quaternion.slerp(i,A)}),s.jsx("group",{ref:c,children:s.jsx("group",{scale:[he,he,he],children:n})})},lt=({textureSet:r,gazeSmoothing:t,onReady:n})=>{const[c,o]=e.useState(()=>typeof document>"u"?!0:Me(document.documentElement)),[i,p]=e.useState(!1);e.useEffect(()=>{let z=0,P;const D=()=>{z++,z>=5?p(!0):P=requestAnimationFrame(D)};return P=requestAnimationFrame(D),()=>cancelAnimationFrame(P)},[]),e.useEffect(()=>{i&&n&&n()},[i,n]);const M=e.useRef(new X(0,0)),h=e.useRef(new X(0,0)),G=e.useRef(q("",ue)),l=e.useRef(q("",ue)),E=e.useRef(q("",ge)),A=e.useRef(c),x=e.useRef(null),w=e.useRef(null),v=e.useRef(null),I=e.useRef(null),C=e.useRef(null),m=e.useRef(null),a=e.useRef(null),u=e.useRef(null),f=e.useRef(null),b=e.useRef(null),k=e.useRef(null),y=e.useRef(null),T=e.useRef({accent:"",glow:"",bg:"",mode:""}),g=e.useRef({lightBase:new L,lightLand:new L,corneaA:new L,corneaB:new L,ambient:new L,hemiSky:new L,hemiGround:new L,dirColor:new L,lightPupil:new L}),_=e.useRef(new L),U=e.useRef(new L),R=e.useRef(new L(1,1,1)),H=e.useRef(new L(.72,.75,.8)),S=e.useRef({startTime:0,duration:.08,offset:new X(0,0),nextTime:1.2}),W=e.useRef(Math.random()*100),F=e.useRef(new X(0,0)),Y=e.useRef(new X(0,0)),$=e.useRef(new X(0,0)),V=e.useRef(new X(0,0)),N=e.useCallback((z=!1)=>{const P=document.documentElement,D=window.getComputedStyle(P),B=D.getPropertyValue("--accent").trim(),O=D.getPropertyValue("--glow-color").trim(),J=D.getPropertyValue("--bg-main").trim(),d=Me(P),Z=d?"dark":"light",fe=O.length>0?O:B;if(!z&&B===T.current.accent&&fe===T.current.glow&&J===T.current.bg&&Z===T.current.mode)return;T.current.accent=B,T.current.glow=fe,T.current.bg=J,T.current.mode=Z,G.current.copy(q(B,ue)),l.current.copy(q(fe,Re)),E.current.copy(q(J,ge)),A.current=d,o(ee=>ee===d?ee:d);const ve={h:0,s:0,l:0};G.current.getHSL(ve);const ie=tt(ve,d);if(g.current.lightBase.copy(ie.base),g.current.lightLand.copy(ie.land),g.current.lightPupil.copy(ie.pupil),d||g.current.ambient.lerp(ie.base,.55),x.current){const ee=x.current.uniforms;ee.uAccent.value.copy(G.current),ee.uAccentGlow.value.copy(l.current),ee.uBg.value.copy(E.current),ee.uDarkMode.value=d?1:0}g.current.corneaA.copy(l.current).lerp(R.current,d?.8:.96),g.current.corneaB.copy(l.current).lerp(E.current,d?.56:.76),g.current.ambient.copy(E.current).lerp(R.current,d?.08:.35),d||g.current.ambient.copy(E.current).lerp(R.current,.2),g.current.hemiSky.copy(R.current).lerp(l.current,.04),g.current.hemiGround.copy(E.current).lerp(H.current,.45),g.current.dirColor.copy(R.current).lerp(l.current,d?.02:.04),a.current&&(a.current.intensity=d?0:1.28),u.current&&(u.current.intensity=d?.85:.82),f.current&&(f.current.color.copy(R.current),f.current.intensity=d?0:.9),b.current&&(b.current.color.copy(l.current),b.current.intensity=d?.62:0),k.current&&(k.current.color.copy(l.current),k.current.intensity=d?.3:0),y.current&&(y.current.color.copy(l.current),y.current.intensity=d?.38:0),C.current&&(C.current.emissive.copy(l.current),C.current.emissiveIntensity=d?.32:0,C.current.opacity=d?.1:.018,C.current.envMapIntensity=d?.28:.09,C.current.clearcoat=d?1:.9,C.current.clearcoatRoughness=d?.05:.06,C.current.roughness=.05),I.current&&(I.current.opacity=d?0:.98)},[]);e.useEffect(()=>{N(!0);const z=window.requestAnimationFrame(()=>{N(!0)}),P=document.documentElement,D=new MutationObserver(B=>{for(const O of B)O.type==="attributes"&&(O.attributeName==="class"||O.attributeName==="data-mode"||O.attributeName==="data-theme")&&N()});return D.observe(P,{attributes:!0,attributeFilter:["class","data-mode","data-theme","style"]}),()=>{D.disconnect(),window.cancelAnimationFrame(z)}},[N]),e.useEffect(()=>{N(!0)},[c,N]),me((z,P)=>{const D=j.clamp(P*2,0,1);w.current&&w.current.color.lerp(g.current.lightBase,D),v.current&&v.current.color.lerp(g.current.lightLand,D),C.current&&(_.current.lerp(g.current.corneaA,D),U.current.lerp(g.current.corneaB,D),C.current.color.copy(_.current),C.current.attenuationColor.copy(U.current)),m.current&&m.current.color.lerp(g.current.ambient,D),a.current&&(a.current.color.lerp(g.current.hemiSky,D),a.current.groundColor.lerp(g.current.hemiGround,D)),u.current&&u.current.color.lerp(g.current.dirColor,D),I.current&&I.current.uniforms.uColor.value.lerp(g.current.lightPupil,D);const B=z.clock.elapsedTime;if(Y.current.set(Math.sin(B*.6+W.current)*.007,Math.cos(B*.46+W.current*1.7)*.005),$.current.set(Math.sin(B*11.2)*.0012,Math.cos(B*9.6)*.0012),B>=S.current.nextTime){const d=Math.random()*Math.PI*2,Z=j.randFloat(.006,.018);S.current.offset.set(Math.cos(d)*Z,Math.sin(d)*Z),S.current.duration=j.randFloat(.045,.11),S.current.startTime=B,S.current.nextTime=B+j.randFloat(.9,2.3)}V.current.set(0,0);const O=B-S.current.startTime;if(O>0&&O<S.current.duration){const d=O/S.current.duration,Z=Math.sin(Math.PI*d);V.current.copy(S.current.offset).multiplyScalar(Z)}F.current.copy(M.current).add(Y.current).add($.current).add(V.current),F.current.x=j.clamp(F.current.x,-1,1),F.current.y=j.clamp(F.current.y,-1,1);const J=M.current.distanceTo(h.current)>.18?.26:.12;if(h.current.lerp(F.current,J),y.current){const d=j.clamp(h.current.x,-1,1),Z=j.clamp(-h.current.y,-1,1);y.current.position.set(d*1.9,Z*1.9,2.1)}});const ae=e.useCallback(z=>{if(window.innerWidth===0||window.innerHeight===0)return;const P=z.clientX/window.innerWidth*2-1,D=-(z.clientY/window.innerHeight)*2+1;M.current.set(j.clamp(P,-1,1),j.clamp(D,-1,1))},[]),se=e.useCallback(()=>{M.current.set(0,0)},[]);return e.useEffect(()=>(window.addEventListener("pointermove",ae,{passive:!0}),window.addEventListener("mouseleave",se),()=>{window.removeEventListener("pointermove",ae),window.removeEventListener("mouseleave",se)}),[ae,se]),s.jsxs(s.Fragment,{children:[s.jsx("ambientLight",{ref:m,intensity:.46,color:E.current}),s.jsx("hemisphereLight",{ref:a,intensity:A.current?0:1.28,color:R.current,groundColor:E.current}),s.jsx("directionalLight",{ref:u,position:[2.8,2.4,3.6],intensity:A.current?.85:.82,color:R.current}),s.jsx("pointLight",{ref:f,position:[.46,.54,3.15],intensity:A.current?0:.9,distance:5,decay:2,color:R.current}),s.jsx("pointLight",{ref:b,position:[-2.8,-1.4,2.2],intensity:A.current?.62:0,distance:7,color:l.current}),s.jsx("pointLight",{ref:k,position:[2.2,1.4,-2.6],intensity:A.current?.3:0,distance:6,color:l.current}),s.jsx("pointLight",{ref:y,position:[0,0,2.1],intensity:A.current?.38:0,distance:6.4,color:l.current}),s.jsxs(it,{gazeSmoothing:t,gazeRef:h,children:[s.jsx("group",{visible:!i||c,children:s.jsx(at,{textureSet:r,gazeRef:h,materialRef:x})}),s.jsx("group",{visible:!i||!c,children:s.jsx(st,{textureSet:r,baseMaterialRef:w,overlayMaterialRef:v,pupilMaterialRef:I})}),s.jsx(ct,{materialRef:C})]}),s.jsx(Ve,{pointerRef:M,isDarkMode:c,accentColorRef:G})]})},ut=({className:r,mapPipeline:t="raster",textureQuality:n="4k",gazeSmoothing:c=.14,textureSet:o,vectorAdapter:i})=>{const p=e.useMemo(()=>He({mapPipeline:t,textureQuality:n,textureSet:o,vectorAdapter:i}),[t,n,o,i]),M=e.useCallback(()=>{const h=setTimeout(()=>{window.dispatchEvent(new Event("app-ready"))},120);return()=>clearTimeout(h)},[]);return s.jsx("div",{className:r,style:{width:"100%",height:"100%"},children:s.jsx(ke,{camera:{position:[0,0,4.5],fov:50},gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},onCreated:({gl:h})=>{h.setClearColor(0,0)},dpr:[1,2],children:s.jsx(e.Suspense,{fallback:null,children:s.jsx(lt,{textureSet:p.textureSet,mapPipeline:p.pipeline,vectorAdapter:p.vectorAdapter,gazeSmoothing:c,onReady:M})})})})},ht=()=>s.jsxs("section",{id:"home",className:"min-h-screen flex items-center justify-center relative overflow-hidden theme-bg-main theme-text-primary",children:[s.jsx("div",{className:"absolute inset-0 z-0",children:s.jsx(ut,{className:"w-full h-full"})}),s.jsxs("div",{className:"z-10 text-center px-6 max-w-4xl mx-auto py-20 hero-copy-shell",children:[s.jsx("div",{className:"mb-6 inline-block",children:s.jsx("span",{className:"px-4 py-1 rounded-full text-sm theme-accent-bg-light theme-accent",style:{backgroundColor:"var(--accent-light)",color:"var(--accent)"},children:"Ph.D. in Computer Vision"})}),s.jsx("h1",{className:"hero-heading text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent theme-accent",children:"Welcome to My World of Computer Vision"}),s.jsxs("p",{className:"hero-subtext text-xl md:text-2xl mb-8 theme-text-secondary",children:["I'm ",s.jsx("span",{className:"font-semibold theme-text-primary",children:"Rauf Fatali"}),", building AI-driven solutions to solve real-world problems through computer vision and deep learning."]}),s.jsxs("div",{className:"space-x-4",children:[s.jsx(xe.Link,{to:"projects",spy:!0,smooth:!0,className:"hero-btn-primary inline-block px-6 py-3 font-bold rounded-lg transition transform hover:scale-105 cursor-pointer",style:{backgroundColor:"var(--accent)",color:"var(--text-on-accent)"},children:"Explore My Work"}),s.jsx(xe.Link,{to:"contact",spy:!0,smooth:!0,className:"hero-btn-secondary inline-block px-6 py-3 font-bold rounded-lg transition border transform hover:scale-105 cursor-pointer",style:{backgroundColor:"var(--bg-surface)",color:"var(--text-primary)",borderColor:"var(--border-color)"},children:"Get in Touch"})]})]})]});export{ht as default};
