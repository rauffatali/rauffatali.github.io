import{d as h,P as R,g as Ee,j as p}from"./three-drei-RT7BESrq.js";import"./three-core-B21wAXIv.js";class D{constructor(t=0,r="Network Error"){this.status=t,this.text=r}}const Oe=()=>{if(!(typeof localStorage>"u"))return{get:e=>Promise.resolve(localStorage.getItem(e)),set:(e,t)=>Promise.resolve(localStorage.setItem(e,t)),remove:e=>Promise.resolve(localStorage.removeItem(e))}},j={origin:"https://api.emailjs.com",blockHeadless:!1,storageProvider:Oe()},ae=e=>e?typeof e=="string"?{publicKey:e}:e.toString()==="[object Object]"?e:{}:{},Pe=(e,t="https://api.emailjs.com")=>{if(!e)return;const r=ae(e);j.publicKey=r.publicKey,j.blockHeadless=r.blockHeadless,j.storageProvider=r.storageProvider,j.blockList=r.blockList,j.limitRate=r.limitRate,j.origin=r.origin||t},pe=async(e,t,r={})=>{const a=await fetch(j.origin+e,{method:"POST",headers:r,body:t}),o=await a.text(),n=new D(a.status,o);if(a.ok)return n;throw n},me=(e,t,r)=>{if(!e||typeof e!="string")throw"The public key is required. Visit https://dashboard.emailjs.com/admin/account";if(!t||typeof t!="string")throw"The service ID is required. Visit https://dashboard.emailjs.com/admin";if(!r||typeof r!="string")throw"The template ID is required. Visit https://dashboard.emailjs.com/admin/templates"},$e=e=>{if(e&&e.toString()!=="[object Object]")throw"The template params have to be the object. Visit https://www.emailjs.com/docs/sdk/send/"},fe=e=>e.webdriver||!e.languages||e.languages.length===0,he=()=>new D(451,"Unavailable For Headless Browser"),Te=(e,t)=>{if(!Array.isArray(e))throw"The BlockList list has to be an array";if(typeof t!="string")throw"The BlockList watchVariable has to be a string"},Ie=e=>{var t;return!((t=e.list)!=null&&t.length)||!e.watchVariable},Ae=(e,t)=>e instanceof FormData?e.get(t):e[t],ge=(e,t)=>{if(Ie(e))return!1;Te(e.list,e.watchVariable);const r=Ae(t,e.watchVariable);return typeof r!="string"?!1:e.list.includes(r)},ye=()=>new D(403,"Forbidden"),Fe=(e,t)=>{if(typeof e!="number"||e<0)throw"The LimitRate throttle has to be a positive number";if(t&&typeof t!="string")throw"The LimitRate ID has to be a non-empty string"},De=async(e,t,r)=>{const a=Number(await r.get(e)||0);return t-Date.now()+a},be=async(e,t,r)=>{if(!t.throttle||!r)return!1;Fe(t.throttle,t.id);const a=t.id||e;return await De(a,t.throttle,r)>0?!0:(await r.set(a,Date.now().toString()),!1)},ve=()=>new D(429,"Too Many Requests"),Me=async(e,t,r,a)=>{const o=ae(a),n=o.publicKey||j.publicKey,i=o.blockHeadless||j.blockHeadless,s=o.storageProvider||j.storageProvider,u={...j.blockList,...o.blockList},m={...j.limitRate,...o.limitRate};return i&&fe(navigator)?Promise.reject(he()):(me(n,e,t),$e(r),r&&ge(u,r)?Promise.reject(ye()):await be(location.pathname,m,s)?Promise.reject(ve()):pe("/api/v1.0/email/send",JSON.stringify({lib_version:"4.4.1",user_id:n,service_id:e,template_id:t,template_params:r}),{"Content-type":"application/json"}))},He=e=>{if(!e||e.nodeName!=="FORM")throw"The 3rd parameter is expected to be the HTML form element or the style selector of the form"},ze=e=>typeof e=="string"?document.querySelector(e):e,qe=async(e,t,r,a)=>{const o=ae(a),n=o.publicKey||j.publicKey,i=o.blockHeadless||j.blockHeadless,s=j.storageProvider||o.storageProvider,u={...j.blockList,...o.blockList},m={...j.limitRate,...o.limitRate};if(i&&fe(navigator))return Promise.reject(he());const f=ze(r);me(n,e,t),He(f);const l=new FormData(f);return ge(u,l)?Promise.reject(ye()):await be(location.pathname,m,s)?Promise.reject(ve()):(l.append("lib_version","4.4.1"),l.append("service_id",e),l.append("template_id",t),l.append("user_id",n),pe("/api/v1.0/email/send-form",l))},Ue={init:Pe,send:Me,sendForm:qe,EmailJSResponseStatus:D};let Be={data:""},Ve=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||Be},Ke=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,We=/\/\*[^]*?\*\/|  +/g,se=/\n+/g,T=(e,t)=>{let r="",a="",o="";for(let n in e){let i=e[n];n[0]=="@"?n[1]=="i"?r=n+" "+i+";":a+=n[1]=="f"?T(i,n):n+"{"+T(i,n[1]=="k"?"":t)+"}":typeof i=="object"?a+=T(i,t?t.replace(/([^,])+/g,s=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,u=>/&/.test(u)?u.replace(/&/g,s):s?s+" "+u:u)):n):i!=null&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=T.p?T.p(n,i):n+":"+i+";")}return r+(t&&o?t+"{"+o+"}":o)+a},P={},xe=e=>{if(typeof e=="object"){let t="";for(let r in e)t+=r+xe(e[r]);return t}return e},Ge=(e,t,r,a,o)=>{let n=xe(e),i=P[n]||(P[n]=(u=>{let m=0,f=11;for(;m<u.length;)f=101*f+u.charCodeAt(m++)>>>0;return"go"+f})(n));if(!P[i]){let u=n!==e?e:(m=>{let f,l,d=[{}];for(;f=Ke.exec(m.replace(We,""));)f[4]?d.shift():f[3]?(l=f[3].replace(se," ").trim(),d.unshift(d[0][l]=d[0][l]||{})):d[0][f[1]]=f[2].replace(se," ").trim();return d[0]})(e);P[i]=T(o?{["@keyframes "+i]:u}:u,r?"":"."+i)}let s=r&&P.g?P.g:null;return r&&(P.g=P[i]),((u,m,f,l)=>{l?m.data=m.data.replace(l,u):m.data.indexOf(u)===-1&&(m.data=f?u+m.data:m.data+u)})(P[i],t,a,s),i},Ze=(e,t,r)=>e.reduce((a,o,n)=>{let i=t[n];if(i&&i.call){let s=i(r),u=s&&s.props&&s.props.className||/^go/.test(s)&&s;i=u?"."+u:s&&typeof s=="object"?s.props?"":T(s,""):s===!1?"":s}return a+o+(i??"")},"");function V(e){let t=this||{},r=e.call?e(t.p):e;return Ge(r.unshift?r.raw?Ze(r,[].slice.call(arguments,1),t.p):r.reduce((a,o)=>Object.assign(a,o&&o.call?o(t.p):o),{}):r,Ve(t.target),t.g,t.o,t.k)}let we,J,Q;V.bind({g:1});let $=V.bind({k:1});function Ye(e,t,r,a){T.p=t,we=e,J=r,Q=a}function I(e,t){let r=this||{};return function(){let a=arguments;function o(n,i){let s=Object.assign({},n),u=s.className||o.className;r.p=Object.assign({theme:J&&J()},s),r.o=/ *go\d+/.test(u),s.className=V.apply(r,a)+(u?" "+u:"");let m=e;return e[0]&&(m=s.as||e,delete s.as),Q&&m[0]&&Q(s),we(m,s)}return t?t(o):o}}var Je=e=>typeof e=="function",B=(e,t)=>Je(e)?e(t):e,Qe=(()=>{let e=0;return()=>(++e).toString()})(),je=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),Xe=20,ne="default",_e=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(i=>i.id===t.toast.id?{...i,...t.toast}:i)};case 2:let{toast:a}=t;return _e(e,{type:e.toasts.find(i=>i.id===a.id)?1:0,toast:a});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(i=>i.id===o||o===void 0?{...i,dismissed:!0,visible:!1}:i)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(i=>i.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(i=>({...i,pauseDuration:i.pauseDuration+n}))}}},U=[],ke={toasts:[],pausedAt:void 0,settings:{toastLimit:Xe}},O={},Se=(e,t=ne)=>{O[t]=_e(O[t]||ke,e),U.forEach(([r,a])=>{r===t&&a(O[t])})},Re=e=>Object.keys(O).forEach(t=>Se(e,t)),et=e=>Object.keys(O).find(t=>O[t].toasts.some(r=>r.id===e)),K=(e=ne)=>t=>{Se(t,e)},tt={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},rt=(e={},t=ne)=>{let[r,a]=h.useState(O[t]||ke),o=h.useRef(O[t]);h.useEffect(()=>(o.current!==O[t]&&a(O[t]),U.push([t,a]),()=>{let i=U.findIndex(([s])=>s===t);i>-1&&U.splice(i,1)}),[t]);let n=r.toasts.map(i=>{var s,u,m;return{...e,...e[i.type],...i,removeDelay:i.removeDelay||((s=e[i.type])==null?void 0:s.removeDelay)||(e==null?void 0:e.removeDelay),duration:i.duration||((u=e[i.type])==null?void 0:u.duration)||(e==null?void 0:e.duration)||tt[i.type],style:{...e.style,...(m=e[i.type])==null?void 0:m.style,...i.style}}});return{...r,toasts:n}},ot=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(r==null?void 0:r.id)||Qe()}),M=e=>(t,r)=>{let a=ot(t,e,r);return K(a.toasterId||et(a.id))({type:2,toast:a}),a.id},x=(e,t)=>M("blank")(e,t);x.error=M("error");x.success=M("success");x.loading=M("loading");x.custom=M("custom");x.dismiss=(e,t)=>{let r={type:3,toastId:e};t?K(t)(r):Re(r)};x.dismissAll=e=>x.dismiss(void 0,e);x.remove=(e,t)=>{let r={type:4,toastId:e};t?K(t)(r):Re(r)};x.removeAll=e=>x.remove(void 0,e);x.promise=(e,t,r)=>{let a=x.loading(t.loading,{...r,...r==null?void 0:r.loading});return typeof e=="function"&&(e=e()),e.then(o=>{let n=t.success?B(t.success,o):void 0;return n?x.success(n,{id:a,...r,...r==null?void 0:r.success}):x.dismiss(a),o}).catch(o=>{let n=t.error?B(t.error,o):void 0;n?x.error(n,{id:a,...r,...r==null?void 0:r.error}):x.dismiss(a)}),e};var at=1e3,nt=(e,t="default")=>{let{toasts:r,pausedAt:a}=rt(e,t),o=h.useRef(new Map).current,n=h.useCallback((l,d=at)=>{if(o.has(l))return;let g=setTimeout(()=>{o.delete(l),i({type:4,toastId:l})},d);o.set(l,g)},[]);h.useEffect(()=>{if(a)return;let l=Date.now(),d=r.map(g=>{if(g.duration===1/0)return;let y=(g.duration||0)+g.pauseDuration-(l-g.createdAt);if(y<0){g.visible&&x.dismiss(g.id);return}return setTimeout(()=>x.dismiss(g.id,t),y)});return()=>{d.forEach(g=>g&&clearTimeout(g))}},[r,a,t]);let i=h.useCallback(K(t),[t]),s=h.useCallback(()=>{i({type:5,time:Date.now()})},[i]),u=h.useCallback((l,d)=>{i({type:1,toast:{id:l,height:d}})},[i]),m=h.useCallback(()=>{a&&i({type:6,time:Date.now()})},[a,i]),f=h.useCallback((l,d)=>{let{reverseOrder:g=!1,gutter:y=8,defaultPosition:k}=d||{},L=r.filter(b=>(b.position||k)===(l.position||k)&&b.height),E=L.findIndex(b=>b.id===l.id),_=L.filter((b,w)=>w<E&&b.visible).length;return L.filter(b=>b.visible).slice(...g?[_+1]:[0,_]).reduce((b,w)=>b+(w.height||0)+y,0)},[r]);return h.useEffect(()=>{r.forEach(l=>{if(l.dismissed)n(l.id,l.removeDelay);else{let d=o.get(l.id);d&&(clearTimeout(d),o.delete(l.id))}})},[r,n]),{toasts:r,handlers:{updateHeight:u,startPause:s,endPause:m,calculateOffset:f}}},it=$`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,st=$`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ct=$`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,lt=I("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${it} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${st} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${ct} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,dt=$`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,ut=I("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${dt} 1s linear infinite;
`,pt=$`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,mt=$`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,ft=I("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${pt} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${mt} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,ht=I("div")`
  position: absolute;
`,gt=I("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,yt=$`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,bt=I("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${yt} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,vt=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return t!==void 0?typeof t=="string"?h.createElement(bt,null,t):t:r==="blank"?null:h.createElement(gt,null,h.createElement(ut,{...a}),r!=="loading"&&h.createElement(ht,null,r==="error"?h.createElement(lt,{...a}):h.createElement(ft,{...a})))},xt=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,wt=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,jt="0%{opacity:0;} 100%{opacity:1;}",_t="0%{opacity:1;} 100%{opacity:0;}",kt=I("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,St=I("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Rt=(e,t)=>{let r=e.includes("top")?1:-1,[a,o]=je()?[jt,_t]:[xt(r),wt(r)];return{animation:t?`${$(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${$(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Lt=h.memo(({toast:e,position:t,style:r,children:a})=>{let o=e.height?Rt(e.position||t||"top-center",e.visible):{opacity:0},n=h.createElement(vt,{toast:e}),i=h.createElement(St,{...e.ariaProps},B(e.message,e));return h.createElement(kt,{className:e.className,style:{...o,...r,...e.style}},typeof a=="function"?a({icon:n,message:i}):h.createElement(h.Fragment,null,n,i))});Ye(h.createElement);var Ct=({id:e,className:t,style:r,onHeightUpdate:a,children:o})=>{let n=h.useCallback(i=>{if(i){let s=()=>{let u=i.getBoundingClientRect().height;a(e,u)};s(),new MutationObserver(s).observe(i,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return h.createElement("div",{ref:n,className:t,style:r},o)},Nt=(e,t)=>{let r=e.includes("top"),a=r?{top:0}:{bottom:0},o=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:je()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...a,...o}},Et=V`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,H=16,Ot=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:o,toasterId:n,containerStyle:i,containerClassName:s})=>{let{toasts:u,handlers:m}=nt(r,n);return h.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:H,left:H,right:H,bottom:H,pointerEvents:"none",...i},className:s,onMouseEnter:m.startPause,onMouseLeave:m.endPause},u.map(f=>{let l=f.position||t,d=m.calculateOffset(f,{reverseOrder:e,gutter:a,defaultPosition:t}),g=Nt(l,d);return h.createElement(Ct,{id:f.id,key:f.id,onHeightUpdate:m.updateHeight,className:f.visible?Et:"",style:g},f.type==="custom"?B(f.message,f):o?o(f):h.createElement(Lt,{toast:f,position:l}))}))},z=x,Pt=["sitekey","onChange","theme","type","tabindex","onExpired","onErrored","size","stoken","grecaptcha","badge","hl","isolated"];function X(){return X=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e},X.apply(this,arguments)}function $t(e,t){if(e==null)return{};var r={},a=Object.keys(e),o,n;for(n=0;n<a.length;n++)o=a[n],!(t.indexOf(o)>=0)&&(r[o]=e[o]);return r}function q(e){if(e===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function Tt(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,ee(e,t)}function ee(e,t){return ee=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(a,o){return a.__proto__=o,a},ee(e,t)}var W=(function(e){Tt(t,e);function t(){var a;return a=e.call(this)||this,a.handleExpired=a.handleExpired.bind(q(a)),a.handleErrored=a.handleErrored.bind(q(a)),a.handleChange=a.handleChange.bind(q(a)),a.handleRecaptchaRef=a.handleRecaptchaRef.bind(q(a)),a}var r=t.prototype;return r.getCaptchaFunction=function(o){return this.props.grecaptcha?this.props.grecaptcha.enterprise?this.props.grecaptcha.enterprise[o]:this.props.grecaptcha[o]:null},r.getValue=function(){var o=this.getCaptchaFunction("getResponse");return o&&this._widgetId!==void 0?o(this._widgetId):null},r.getWidgetId=function(){return this.props.grecaptcha&&this._widgetId!==void 0?this._widgetId:null},r.execute=function(){var o=this.getCaptchaFunction("execute");if(o&&this._widgetId!==void 0)return o(this._widgetId);this._executeRequested=!0},r.executeAsync=function(){var o=this;return new Promise(function(n,i){o.executionResolve=n,o.executionReject=i,o.execute()})},r.reset=function(){var o=this.getCaptchaFunction("reset");o&&this._widgetId!==void 0&&o(this._widgetId)},r.forceReset=function(){var o=this.getCaptchaFunction("reset");o&&o()},r.handleExpired=function(){this.props.onExpired?this.props.onExpired():this.handleChange(null)},r.handleErrored=function(){this.props.onErrored&&this.props.onErrored(),this.executionReject&&(this.executionReject(),delete this.executionResolve,delete this.executionReject)},r.handleChange=function(o){this.props.onChange&&this.props.onChange(o),this.executionResolve&&(this.executionResolve(o),delete this.executionReject,delete this.executionResolve)},r.explicitRender=function(){var o=this.getCaptchaFunction("render");if(o&&this._widgetId===void 0){var n=document.createElement("div");this._widgetId=o(n,{sitekey:this.props.sitekey,callback:this.handleChange,theme:this.props.theme,type:this.props.type,tabindex:this.props.tabindex,"expired-callback":this.handleExpired,"error-callback":this.handleErrored,size:this.props.size,stoken:this.props.stoken,hl:this.props.hl,badge:this.props.badge,isolated:this.props.isolated}),this.captcha.appendChild(n)}this._executeRequested&&this.props.grecaptcha&&this._widgetId!==void 0&&(this._executeRequested=!1,this.execute())},r.componentDidMount=function(){this.explicitRender()},r.componentDidUpdate=function(){this.explicitRender()},r.handleRecaptchaRef=function(o){this.captcha=o},r.render=function(){var o=this.props;o.sitekey,o.onChange,o.theme,o.type,o.tabindex,o.onExpired,o.onErrored,o.size,o.stoken,o.grecaptcha,o.badge,o.hl,o.isolated;var n=$t(o,Pt);return h.createElement("div",X({},n,{ref:this.handleRecaptchaRef}))},t})(h.Component);W.displayName="ReCAPTCHA";W.propTypes={sitekey:R.string.isRequired,onChange:R.func,grecaptcha:R.object,theme:R.oneOf(["dark","light"]),type:R.oneOf(["image","audio"]),tabindex:R.number,onExpired:R.func,onErrored:R.func,size:R.oneOf(["compact","normal","invisible"]),stoken:R.string,hl:R.string,badge:R.oneOf(["bottomright","bottomleft","inline"]),isolated:R.bool};W.defaultProps={onChange:function(){},theme:"light",type:"image",tabindex:0,size:"normal",badge:"bottomright"};var Z={exports:{}},v={};/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ce;function It(){if(ce)return v;ce=1;var e=typeof Symbol=="function"&&Symbol.for,t=e?Symbol.for("react.element"):60103,r=e?Symbol.for("react.portal"):60106,a=e?Symbol.for("react.fragment"):60107,o=e?Symbol.for("react.strict_mode"):60108,n=e?Symbol.for("react.profiler"):60114,i=e?Symbol.for("react.provider"):60109,s=e?Symbol.for("react.context"):60110,u=e?Symbol.for("react.async_mode"):60111,m=e?Symbol.for("react.concurrent_mode"):60111,f=e?Symbol.for("react.forward_ref"):60112,l=e?Symbol.for("react.suspense"):60113,d=e?Symbol.for("react.suspense_list"):60120,g=e?Symbol.for("react.memo"):60115,y=e?Symbol.for("react.lazy"):60116,k=e?Symbol.for("react.block"):60121,L=e?Symbol.for("react.fundamental"):60117,E=e?Symbol.for("react.responder"):60118,_=e?Symbol.for("react.scope"):60119;function b(c){if(typeof c=="object"&&c!==null){var C=c.$$typeof;switch(C){case t:switch(c=c.type,c){case u:case m:case a:case n:case o:case l:return c;default:switch(c=c&&c.$$typeof,c){case s:case f:case y:case g:case i:return c;default:return C}}case r:return C}}}function w(c){return b(c)===m}return v.AsyncMode=u,v.ConcurrentMode=m,v.ContextConsumer=s,v.ContextProvider=i,v.Element=t,v.ForwardRef=f,v.Fragment=a,v.Lazy=y,v.Memo=g,v.Portal=r,v.Profiler=n,v.StrictMode=o,v.Suspense=l,v.isAsyncMode=function(c){return w(c)||b(c)===u},v.isConcurrentMode=w,v.isContextConsumer=function(c){return b(c)===s},v.isContextProvider=function(c){return b(c)===i},v.isElement=function(c){return typeof c=="object"&&c!==null&&c.$$typeof===t},v.isForwardRef=function(c){return b(c)===f},v.isFragment=function(c){return b(c)===a},v.isLazy=function(c){return b(c)===y},v.isMemo=function(c){return b(c)===g},v.isPortal=function(c){return b(c)===r},v.isProfiler=function(c){return b(c)===n},v.isStrictMode=function(c){return b(c)===o},v.isSuspense=function(c){return b(c)===l},v.isValidElementType=function(c){return typeof c=="string"||typeof c=="function"||c===a||c===m||c===n||c===o||c===l||c===d||typeof c=="object"&&c!==null&&(c.$$typeof===y||c.$$typeof===g||c.$$typeof===i||c.$$typeof===s||c.$$typeof===f||c.$$typeof===L||c.$$typeof===E||c.$$typeof===_||c.$$typeof===k)},v.typeOf=b,v}var le;function At(){return le||(le=1,Z.exports=It()),Z.exports}var Y,de;function Ft(){if(de)return Y;de=1;var e=At(),t={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},r={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},a={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},o={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},n={};n[e.ForwardRef]=a,n[e.Memo]=o;function i(y){return e.isMemo(y)?o:n[y.$$typeof]||t}var s=Object.defineProperty,u=Object.getOwnPropertyNames,m=Object.getOwnPropertySymbols,f=Object.getOwnPropertyDescriptor,l=Object.getPrototypeOf,d=Object.prototype;function g(y,k,L){if(typeof k!="string"){if(d){var E=l(k);E&&E!==d&&g(y,E,L)}var _=u(k);m&&(_=_.concat(m(k)));for(var b=i(y),w=i(k),c=0;c<_.length;++c){var C=_[c];if(!r[C]&&!(L&&L[C])&&!(w&&w[C])&&!(b&&b[C])){var S=f(k,C);try{s(y,C,S)}catch{}}}}return y}return Y=g,Y}var Dt=Ft();const Mt=Ee(Dt);function te(){return te=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(e[a]=r[a])}return e},te.apply(this,arguments)}function Ht(e,t){if(e==null)return{};var r={},a=Object.keys(e),o,n;for(n=0;n<a.length;n++)o=a[n],!(t.indexOf(o)>=0)&&(r[o]=e[o]);return r}function zt(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}var N={},qt=0;function Ut(e,t){return t=t||{},function(a){var o=a.displayName||a.name||"Component",n=(function(s){zt(u,s);function u(f,l){var d;return d=s.call(this,f,l)||this,d.state={},d.__scriptURL="",d}var m=u.prototype;return m.asyncScriptLoaderGetScriptLoaderID=function(){return this.__scriptLoaderID||(this.__scriptLoaderID="async-script-loader-"+qt++),this.__scriptLoaderID},m.setupScriptURL=function(){return this.__scriptURL=typeof e=="function"?e():e,this.__scriptURL},m.asyncScriptLoaderHandleLoad=function(l){var d=this;this.setState(l,function(){return d.props.asyncScriptOnLoad&&d.props.asyncScriptOnLoad(d.state)})},m.asyncScriptLoaderTriggerOnScriptLoaded=function(){var l=N[this.__scriptURL];if(!l||!l.loaded)throw new Error("Script is not loaded.");for(var d in l.observers)l.observers[d](l);delete window[t.callbackName]},m.componentDidMount=function(){var l=this,d=this.setupScriptURL(),g=this.asyncScriptLoaderGetScriptLoaderID(),y=t,k=y.globalName,L=y.callbackName,E=y.scriptId;if(k&&typeof window[k]<"u"&&(N[d]={loaded:!0,observers:{}}),N[d]){var _=N[d];if(_&&(_.loaded||_.errored)){this.asyncScriptLoaderHandleLoad(_);return}_.observers[g]=function(S){return l.asyncScriptLoaderHandleLoad(S)};return}var b={};b[g]=function(S){return l.asyncScriptLoaderHandleLoad(S)},N[d]={loaded:!1,observers:b};var w=document.createElement("script");w.src=d,w.async=!0;for(var c in t.attributes)w.setAttribute(c,t.attributes[c]);E&&(w.id=E);var C=function(A){if(N[d]){var Ne=N[d],G=Ne.observers;for(var ie in G)A(G[ie])&&delete G[ie]}};L&&typeof window<"u"&&(window[L]=function(){return l.asyncScriptLoaderTriggerOnScriptLoaded()}),w.onload=function(){var S=N[d];S&&(S.loaded=!0,C(function(A){return L?!1:(A(S),!0)}))},w.onerror=function(){var S=N[d];S&&(S.errored=!0,C(function(A){return A(S),!0}))},document.body.appendChild(w)},m.componentWillUnmount=function(){var l=this.__scriptURL;if(t.removeOnUnmount===!0)for(var d=document.getElementsByTagName("script"),g=0;g<d.length;g+=1)d[g].src.indexOf(l)>-1&&d[g].parentNode&&d[g].parentNode.removeChild(d[g]);var y=N[l];y&&(delete y.observers[this.asyncScriptLoaderGetScriptLoaderID()],t.removeOnUnmount===!0&&delete N[l])},m.render=function(){var l=t.globalName,d=this.props;d.asyncScriptOnLoad;var g=d.forwardedRef,y=Ht(d,["asyncScriptOnLoad","forwardedRef"]);return l&&typeof window<"u"&&(y[l]=typeof window[l]<"u"?window[l]:void 0),y.ref=g,h.createElement(a,y)},u})(h.Component),i=h.forwardRef(function(s,u){return h.createElement(n,te({},s,{forwardedRef:u}))});return i.displayName="AsyncScriptLoader("+o+")",i.propTypes={asyncScriptOnLoad:R.func},Mt(i,a)}}var re="onloadcallback",Bt="grecaptcha";function oe(){return typeof window<"u"&&window.recaptchaOptions||{}}function Vt(){var e=oe(),t=e.useRecaptchaNet?"recaptcha.net":"www.google.com";return e.enterprise?"https://"+t+"/recaptcha/enterprise.js?onload="+re+"&render=explicit":"https://"+t+"/recaptcha/api.js?onload="+re+"&render=explicit"}const Kt=Ut(Vt,{callbackName:re,globalName:Bt,attributes:oe().nonce?{nonce:oe().nonce}:{}})(W);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Le=(...e)=>e.filter((t,r,a)=>!!t&&t.trim()!==""&&a.indexOf(t)===r).join(" ").trim();/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wt=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gt=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,r,a)=>a?a.toUpperCase():r.toLowerCase());/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=e=>{const t=Gt(e);return t.charAt(0).toUpperCase()+t.slice(1)};/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Zt={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yt=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1};/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jt=h.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:a,className:o="",children:n,iconNode:i,...s},u)=>h.createElement("svg",{ref:u,...Zt,width:t,height:t,stroke:e,strokeWidth:a?Number(r)*24/Number(t):r,className:Le("lucide",o),...!n&&!Yt(s)&&{"aria-hidden":"true"},...s},[...i.map(([m,f])=>h.createElement(m,f)),...Array.isArray(n)?n:[n]]));/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=(e,t)=>{const r=h.forwardRef(({className:a,...o},n)=>h.createElement(Jt,{ref:n,iconNode:t,className:Le(`lucide-${Wt(ue(e))}`,`lucide-${e}`,a),...o}));return r.displayName=ue(e),r};/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qt=[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]],Xt=F("github",Qt);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const er=[["path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",key:"c2jq9f"}],["rect",{width:"4",height:"12",x:"2",y:"9",key:"mk3on5"}],["circle",{cx:"4",cy:"4",r:"2",key:"bt5ra8"}]],tr=F("linkedin",er);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rr=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],or=F("loader-circle",rr);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ar=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],Ce=F("mail",ar);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nr=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],ir=F("map-pin",nr);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sr=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],cr=F("send",sr),lr=[{platform:"GitHub",url:"https://github.com/rauffatali",icon:"github"},{platform:"LinkedIn",url:"https://linkedin.com/in/rauffatali",icon:"linkedin"},{platform:"X",url:"https://x.com/raufatali",icon:"twitter"}],dr=(e,t="w-5 h-5")=>{switch(e.toLowerCase()){case"github":return p.jsx(Xt,{className:t});case"linkedin":return p.jsx(tr,{className:t});case"twitter":return p.jsx("svg",{role:"img",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",className:t,fill:"currentColor",children:p.jsx("path",{d:"M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"})});default:return p.jsx(Ce,{className:t})}},mr=()=>{const e=h.useRef(null),t=h.useRef(null),[r,a]=h.useState(!1),[o,n]=h.useState({name:"",email:"",message:""}),i=async s=>{var g;s.preventDefault();const u="service_itaeyxh",m="template_lugrcbu",f="3Rm2P2qTKCOL6YuIv",l=(g=t.current)==null?void 0:g.getValue();if(!l){z.error("Please complete the reCAPTCHA verification.");return}a(!0);const d=z.loading("Sending your message...");try{const y={user_name:o.name,user_email:o.email,message:o.message,time:new Date().toLocaleString(),"g-recaptcha-response":l};await Ue.send(u,m,y,{publicKey:f,limitRate:{id:"contact_form",throttle:1e4}}),z.success("Message sent successfully! I will get back to you soon.",{id:d,duration:5e3}),n({name:"",email:"",message:""}),e.current&&e.current.reset(),t.current&&t.current.reset()}catch(y){console.error("EmailJS Error:",y),z.error("Failed to send message. Please try again or contact me directly via social media.",{id:d,duration:5e3})}finally{a(!1)}};return p.jsxs("section",{id:"contact",className:"py-24 theme-bg-surface relative overflow-hidden",children:[p.jsx(Ot,{position:"bottom-right",toastOptions:{style:{background:"var(--bg-elevated)",color:"var(--text-primary)",border:"1px solid var(--border-light)",backdropFilter:"blur(10px)"},success:{iconTheme:{primary:"var(--accent)",secondary:"#fff"}}}}),p.jsx("div",{className:"absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full theme-bg-accent opacity-10 blur-3xl pointer-events-none"}),p.jsx("div",{className:"absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full theme-bg-accent opacity-10 blur-3xl pointer-events-none"}),p.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10",children:[p.jsxs("div",{className:"text-center mb-16",children:[p.jsxs("h2",{className:"text-3xl md:text-4xl font-bold theme-text-primary mb-4",children:["Let's ",p.jsx("span",{className:"theme-accent-text",children:"Connect"})]}),p.jsx("p",{className:"text-lg theme-text-secondary max-w-2xl mx-auto leading-relaxed",children:"Have a question, a project proposal, or just want to collaborate on AI and computer vision? I'm always open to discussing new opportunities."})]}),p.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-5 gap-12 items-start",children:[p.jsxs("div",{className:"lg:col-span-3 theme-bg-elevated p-8 md:p-10 rounded-2xl backdrop-blur-md border shadow-xl transition-all duration-300 hover:shadow-2xl",style:{borderColor:"var(--border-color)",boxShadow:"0 4px 30px rgba(0, 0, 0, 0.1)"},children:[p.jsxs("h3",{className:"text-2xl font-bold theme-text-primary mb-8 flex items-center",children:[p.jsx(Ce,{className:"w-6 h-6 mr-3 theme-accent-text"}),"Send me a message"]}),p.jsxs("form",{ref:e,onSubmit:i,className:"space-y-6 text-left",children:[p.jsxs("div",{className:"group",children:[p.jsx("label",{htmlFor:"user_name",className:"block text-sm font-medium theme-text-secondary mb-2 transition-colors group-focus-within:theme-accent-text",children:"Your Name"}),p.jsx("input",{type:"text",id:"user_name",name:"user_name",required:!0,placeholder:"John Doe",value:o.name,onChange:s=>n({...o,name:s.target.value}),className:"w-full px-4 py-3 rounded-lg theme-bg-main border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200",style:{backgroundColor:"var(--bg-main)",borderColor:"var(--border-light)",color:"var(--text-primary)"},onFocus:s=>s.target.style.borderColor="var(--accent)",onBlur:s=>s.target.style.borderColor="var(--border-light)"})]}),p.jsxs("div",{className:"group",children:[p.jsx("label",{htmlFor:"user_email",className:"block text-sm font-medium theme-text-secondary mb-2 transition-colors group-focus-within:theme-accent-text",children:"Email Address"}),p.jsx("input",{type:"email",id:"user_email",name:"user_email",required:!0,placeholder:"john@example.com",value:o.email,onChange:s=>n({...o,email:s.target.value}),className:"w-full px-4 py-3 rounded-lg theme-bg-main border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200",style:{backgroundColor:"var(--bg-main)",borderColor:"var(--border-light)",color:"var(--text-primary)"},onFocus:s=>s.target.style.borderColor="var(--accent)",onBlur:s=>s.target.style.borderColor="var(--border-light)"})]}),p.jsxs("div",{className:"group",children:[p.jsx("label",{htmlFor:"message",className:"block text-sm font-medium theme-text-secondary mb-2 transition-colors group-focus-within:theme-accent-text",children:"Message"}),p.jsx("textarea",{id:"message",name:"message",required:!0,rows:5,placeholder:"How can I help you?",value:o.message,onChange:s=>n({...o,message:s.target.value}),className:"w-full px-4 py-3 rounded-lg theme-bg-main border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 resize-y min-h-[120px]",style:{backgroundColor:"var(--bg-main)",borderColor:"var(--border-light)",color:"var(--text-primary)"},onFocus:s=>s.target.style.borderColor="var(--accent)",onBlur:s=>s.target.style.borderColor="var(--border-light)"})]}),p.jsx("div",{className:"flex justify-start",children:p.jsx(Kt,{ref:t,sitekey:"6LcmAoIsAAAAACRct9wflMrwmQzwKmPM3FpIEL3c",theme:"dark"})}),p.jsx("button",{type:"submit",disabled:r,className:"hero-btn-primary w-full sm:w-auto px-8 py-3.5 mt-4 rounded-lg font-bold flex items-center justify-center transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1 hover:shadow-xl",style:{backgroundColor:"var(--accent)",color:"var(--text-on-accent, #ffffff)",border:"1px solid transparent"},children:r?p.jsxs(p.Fragment,{children:[p.jsx(or,{className:"w-5 h-5 mr-2 animate-spin"}),"Sending..."]}):p.jsxs(p.Fragment,{children:[p.jsx(cr,{className:"w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform"}),"Send Message"]})})]})]}),p.jsxs("div",{className:"lg:col-span-2 flex flex-col space-y-8",children:[p.jsxs("div",{className:"theme-bg-elevated p-8 rounded-2xl backdrop-blur-md border shadow-lg",style:{borderColor:"var(--border-color)"},children:[p.jsx("h3",{className:"text-xl font-bold theme-text-primary mb-6",children:"Connect Digitally"}),p.jsx("div",{className:"flex flex-col space-y-4",children:lr.map(s=>p.jsxs("a",{href:s.url,target:"_blank",rel:"noopener noreferrer",className:"flex items-center p-4 rounded-xl border border-transparent hover:border-current transition-all duration-300 group",style:{backgroundColor:"var(--bg-main)",color:"var(--text-secondary)"},onMouseEnter:u=>u.currentTarget.style.color="var(--accent)",onMouseLeave:u=>u.currentTarget.style.color="var(--text-secondary)",children:[p.jsx("div",{className:"p-2 rounded-lg theme-bg-elevated mr-4 transition-transform group-hover:scale-110",children:dr(s.icon||"mail")}),p.jsx("span",{className:"font-medium flex-1",children:s.platform}),p.jsx("svg",{className:"w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:p.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5l7 7-7 7"})})]},s.platform))})]}),p.jsxs("div",{className:"theme-bg-elevated p-10 rounded-2xl backdrop-blur-md border shadow-lg",style:{borderColor:"var(--border-color)"},children:[p.jsxs("div",{className:"flex items-center mb-6",children:[p.jsx("div",{className:"p-3 rounded-xl mr-4",style:{backgroundColor:"var(--accent-light)",color:"var(--accent)"},children:p.jsx(ir,{className:"w-6 h-6"})}),p.jsx("h3",{className:"text-xl font-bold theme-text-primary",children:"Location"})]}),p.jsxs("p",{className:"theme-text-secondary leading-relaxed",children:["Currently based in Baku, Azerbaijan.",p.jsx("br",{}),p.jsx("span",{className:"inline-block mt-2 font-medium",style:{color:"var(--accent)"},children:"Available for remote work worldwide."})]})]})]})]})]})]})};export{mr as default};
