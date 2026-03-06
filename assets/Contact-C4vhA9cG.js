import{d as h,P as R,g as Ee,j as p}from"./three-drei-RT7BESrq.js";import"./three-core-B21wAXIv.js";class D{constructor(t=0,r="Network Error"){this.status=t,this.text=r}}const Oe=()=>{if(!(typeof localStorage>"u"))return{get:e=>Promise.resolve(localStorage.getItem(e)),set:(e,t)=>Promise.resolve(localStorage.setItem(e,t)),remove:e=>Promise.resolve(localStorage.removeItem(e))}},_={origin:"https://api.emailjs.com",blockHeadless:!1,storageProvider:Oe()},ae=e=>e?typeof e=="string"?{publicKey:e}:e.toString()==="[object Object]"?e:{}:{},Pe=(e,t="https://api.emailjs.com")=>{if(!e)return;const r=ae(e);_.publicKey=r.publicKey,_.blockHeadless=r.blockHeadless,_.storageProvider=r.storageProvider,_.blockList=r.blockList,_.limitRate=r.limitRate,_.origin=r.origin||t},pe=async(e,t,r={})=>{const o=await fetch(_.origin+e,{method:"POST",headers:r,body:t}),a=await o.text(),i=new D(o.status,a);if(o.ok)return i;throw i},me=(e,t,r)=>{if(!e||typeof e!="string")throw"The public key is required. Visit https://dashboard.emailjs.com/admin/account";if(!t||typeof t!="string")throw"The service ID is required. Visit https://dashboard.emailjs.com/admin";if(!r||typeof r!="string")throw"The template ID is required. Visit https://dashboard.emailjs.com/admin/templates"},$e=e=>{if(e&&e.toString()!=="[object Object]")throw"The template params have to be the object. Visit https://www.emailjs.com/docs/sdk/send/"},fe=e=>e.webdriver||!e.languages||e.languages.length===0,he=()=>new D(451,"Unavailable For Headless Browser"),Te=(e,t)=>{if(!Array.isArray(e))throw"The BlockList list has to be an array";if(typeof t!="string")throw"The BlockList watchVariable has to be a string"},Ie=e=>{var t;return!((t=e.list)!=null&&t.length)||!e.watchVariable},Ae=(e,t)=>e instanceof FormData?e.get(t):e[t],ge=(e,t)=>{if(Ie(e))return!1;Te(e.list,e.watchVariable);const r=Ae(t,e.watchVariable);return typeof r!="string"?!1:e.list.includes(r)},ye=()=>new D(403,"Forbidden"),Fe=(e,t)=>{if(typeof e!="number"||e<0)throw"The LimitRate throttle has to be a positive number";if(t&&typeof t!="string")throw"The LimitRate ID has to be a non-empty string"},De=async(e,t,r)=>{const o=Number(await r.get(e)||0);return t-Date.now()+o},be=async(e,t,r)=>{if(!t.throttle||!r)return!1;Fe(t.throttle,t.id);const o=t.id||e;return await De(o,t.throttle,r)>0?!0:(await r.set(o,Date.now().toString()),!1)},ve=()=>new D(429,"Too Many Requests"),Me=async(e,t,r,o)=>{const a=ae(o),i=a.publicKey||_.publicKey,n=a.blockHeadless||_.blockHeadless,d=a.storageProvider||_.storageProvider,m={..._.blockList,...a.blockList},f={..._.limitRate,...a.limitRate};return n&&fe(navigator)?Promise.reject(he()):(me(i,e,t),$e(r),r&&ge(m,r)?Promise.reject(ye()):await be(location.pathname,f,d)?Promise.reject(ve()):pe("/api/v1.0/email/send",JSON.stringify({lib_version:"4.4.1",user_id:i,service_id:e,template_id:t,template_params:r}),{"Content-type":"application/json"}))},He=e=>{if(!e||e.nodeName!=="FORM")throw"The 3rd parameter is expected to be the HTML form element or the style selector of the form"},ze=e=>typeof e=="string"?document.querySelector(e):e,qe=async(e,t,r,o)=>{const a=ae(o),i=a.publicKey||_.publicKey,n=a.blockHeadless||_.blockHeadless,d=_.storageProvider||a.storageProvider,m={..._.blockList,...a.blockList},f={..._.limitRate,...a.limitRate};if(n&&fe(navigator))return Promise.reject(he());const s=ze(r);me(i,e,t),He(s);const c=new FormData(s);return ge(m,c)?Promise.reject(ye()):await be(location.pathname,f,d)?Promise.reject(ve()):(c.append("lib_version","4.4.1"),c.append("service_id",e),c.append("template_id",t),c.append("user_id",i),pe("/api/v1.0/email/send-form",c))},Ue={init:Pe,send:Me,sendForm:qe,EmailJSResponseStatus:D};let Be={data:""},Ve=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||Be},Ke=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,We=/\/\*[^]*?\*\/|  +/g,se=/\n+/g,T=(e,t)=>{let r="",o="",a="";for(let i in e){let n=e[i];i[0]=="@"?i[1]=="i"?r=i+" "+n+";":o+=i[1]=="f"?T(n,i):i+"{"+T(n,i[1]=="k"?"":t)+"}":typeof n=="object"?o+=T(n,t?t.replace(/([^,])+/g,d=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,m=>/&/.test(m)?m.replace(/&/g,d):d?d+" "+m:m)):i):n!=null&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=T.p?T.p(i,n):i+":"+n+";")}return r+(t&&a?t+"{"+a+"}":a)+o},P={},xe=e=>{if(typeof e=="object"){let t="";for(let r in e)t+=r+xe(e[r]);return t}return e},Ge=(e,t,r,o,a)=>{let i=xe(e),n=P[i]||(P[i]=(m=>{let f=0,s=11;for(;f<m.length;)s=101*s+m.charCodeAt(f++)>>>0;return"go"+s})(i));if(!P[n]){let m=i!==e?e:(f=>{let s,c,u=[{}];for(;s=Ke.exec(f.replace(We,""));)s[4]?u.shift():s[3]?(c=s[3].replace(se," ").trim(),u.unshift(u[0][c]=u[0][c]||{})):u[0][s[1]]=s[2].replace(se," ").trim();return u[0]})(e);P[n]=T(a?{["@keyframes "+n]:m}:m,r?"":"."+n)}let d=r&&P.g?P.g:null;return r&&(P.g=P[n]),((m,f,s,c)=>{c?f.data=f.data.replace(c,m):f.data.indexOf(m)===-1&&(f.data=s?m+f.data:f.data+m)})(P[n],t,o,d),n},Ze=(e,t,r)=>e.reduce((o,a,i)=>{let n=t[i];if(n&&n.call){let d=n(r),m=d&&d.props&&d.props.className||/^go/.test(d)&&d;n=m?"."+m:d&&typeof d=="object"?d.props?"":T(d,""):d===!1?"":d}return o+a+(n??"")},"");function V(e){let t=this||{},r=e.call?e(t.p):e;return Ge(r.unshift?r.raw?Ze(r,[].slice.call(arguments,1),t.p):r.reduce((o,a)=>Object.assign(o,a&&a.call?a(t.p):a),{}):r,Ve(t.target),t.g,t.o,t.k)}let we,J,Q;V.bind({g:1});let $=V.bind({k:1});function Ye(e,t,r,o){T.p=t,we=e,J=r,Q=o}function I(e,t){let r=this||{};return function(){let o=arguments;function a(i,n){let d=Object.assign({},i),m=d.className||a.className;r.p=Object.assign({theme:J&&J()},d),r.o=/ *go\d+/.test(m),d.className=V.apply(r,o)+(m?" "+m:"");let f=e;return e[0]&&(f=d.as||e,delete d.as),Q&&f[0]&&Q(d),we(f,d)}return t?t(a):a}}var Je=e=>typeof e=="function",B=(e,t)=>Je(e)?e(t):e,Qe=(()=>{let e=0;return()=>(++e).toString()})(),je=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),Xe=20,ne="default",_e=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(n=>n.id===t.toast.id?{...n,...t.toast}:n)};case 2:let{toast:o}=t;return _e(e,{type:e.toasts.find(n=>n.id===o.id)?1:0,toast:o});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(n=>n.id===a||a===void 0?{...n,dismissed:!0,visible:!1}:n)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(n=>n.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(n=>({...n,pauseDuration:n.pauseDuration+i}))}}},U=[],ke={toasts:[],pausedAt:void 0,settings:{toastLimit:Xe}},O={},Se=(e,t=ne)=>{O[t]=_e(O[t]||ke,e),U.forEach(([r,o])=>{r===t&&o(O[t])})},Re=e=>Object.keys(O).forEach(t=>Se(e,t)),et=e=>Object.keys(O).find(t=>O[t].toasts.some(r=>r.id===e)),K=(e=ne)=>t=>{Se(t,e)},tt={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},rt=(e={},t=ne)=>{let[r,o]=h.useState(O[t]||ke),a=h.useRef(O[t]);h.useEffect(()=>(a.current!==O[t]&&o(O[t]),U.push([t,o]),()=>{let n=U.findIndex(([d])=>d===t);n>-1&&U.splice(n,1)}),[t]);let i=r.toasts.map(n=>{var d,m,f;return{...e,...e[n.type],...n,removeDelay:n.removeDelay||((d=e[n.type])==null?void 0:d.removeDelay)||(e==null?void 0:e.removeDelay),duration:n.duration||((m=e[n.type])==null?void 0:m.duration)||(e==null?void 0:e.duration)||tt[n.type],style:{...e.style,...(f=e[n.type])==null?void 0:f.style,...n.style}}});return{...r,toasts:i}},ot=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(r==null?void 0:r.id)||Qe()}),M=e=>(t,r)=>{let o=ot(t,e,r);return K(o.toasterId||et(o.id))({type:2,toast:o}),o.id},x=(e,t)=>M("blank")(e,t);x.error=M("error");x.success=M("success");x.loading=M("loading");x.custom=M("custom");x.dismiss=(e,t)=>{let r={type:3,toastId:e};t?K(t)(r):Re(r)};x.dismissAll=e=>x.dismiss(void 0,e);x.remove=(e,t)=>{let r={type:4,toastId:e};t?K(t)(r):Re(r)};x.removeAll=e=>x.remove(void 0,e);x.promise=(e,t,r)=>{let o=x.loading(t.loading,{...r,...r==null?void 0:r.loading});return typeof e=="function"&&(e=e()),e.then(a=>{let i=t.success?B(t.success,a):void 0;return i?x.success(i,{id:o,...r,...r==null?void 0:r.success}):x.dismiss(o),a}).catch(a=>{let i=t.error?B(t.error,a):void 0;i?x.error(i,{id:o,...r,...r==null?void 0:r.error}):x.dismiss(o)}),e};var at=1e3,nt=(e,t="default")=>{let{toasts:r,pausedAt:o}=rt(e,t),a=h.useRef(new Map).current,i=h.useCallback((c,u=at)=>{if(a.has(c))return;let g=setTimeout(()=>{a.delete(c),n({type:4,toastId:c})},u);a.set(c,g)},[]);h.useEffect(()=>{if(o)return;let c=Date.now(),u=r.map(g=>{if(g.duration===1/0)return;let y=(g.duration||0)+g.pauseDuration-(c-g.createdAt);if(y<0){g.visible&&x.dismiss(g.id);return}return setTimeout(()=>x.dismiss(g.id,t),y)});return()=>{u.forEach(g=>g&&clearTimeout(g))}},[r,o,t]);let n=h.useCallback(K(t),[t]),d=h.useCallback(()=>{n({type:5,time:Date.now()})},[n]),m=h.useCallback((c,u)=>{n({type:1,toast:{id:c,height:u}})},[n]),f=h.useCallback(()=>{o&&n({type:6,time:Date.now()})},[o,n]),s=h.useCallback((c,u)=>{let{reverseOrder:g=!1,gutter:y=8,defaultPosition:w}=u||{},L=r.filter(b=>(b.position||w)===(c.position||w)&&b.height),E=L.findIndex(b=>b.id===c.id),k=L.filter((b,j)=>j<E&&b.visible).length;return L.filter(b=>b.visible).slice(...g?[k+1]:[0,k]).reduce((b,j)=>b+(j.height||0)+y,0)},[r]);return h.useEffect(()=>{r.forEach(c=>{if(c.dismissed)i(c.id,c.removeDelay);else{let u=a.get(c.id);u&&(clearTimeout(u),a.delete(c.id))}})},[r,i]),{toasts:r,handlers:{updateHeight:m,startPause:d,endPause:f,calculateOffset:s}}},it=$`
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
`,vt=({toast:e})=>{let{icon:t,type:r,iconTheme:o}=e;return t!==void 0?typeof t=="string"?h.createElement(bt,null,t):t:r==="blank"?null:h.createElement(gt,null,h.createElement(ut,{...o}),r!=="loading"&&h.createElement(ht,null,r==="error"?h.createElement(lt,{...o}):h.createElement(ft,{...o})))},xt=e=>`
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
`,Rt=(e,t)=>{let r=e.includes("top")?1:-1,[o,a]=je()?[jt,_t]:[xt(r),wt(r)];return{animation:t?`${$(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${$(a)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Lt=h.memo(({toast:e,position:t,style:r,children:o})=>{let a=e.height?Rt(e.position||t||"top-center",e.visible):{opacity:0},i=h.createElement(vt,{toast:e}),n=h.createElement(St,{...e.ariaProps},B(e.message,e));return h.createElement(kt,{className:e.className,style:{...a,...r,...e.style}},typeof o=="function"?o({icon:i,message:n}):h.createElement(h.Fragment,null,i,n))});Ye(h.createElement);var Ct=({id:e,className:t,style:r,onHeightUpdate:o,children:a})=>{let i=h.useCallback(n=>{if(n){let d=()=>{let m=n.getBoundingClientRect().height;o(e,m)};d(),new MutationObserver(d).observe(n,{subtree:!0,childList:!0,characterData:!0})}},[e,o]);return h.createElement("div",{ref:i,className:t,style:r},a)},Nt=(e,t)=>{let r=e.includes("top"),o=r?{top:0}:{bottom:0},a=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:je()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...o,...a}},Et=V`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,H=16,Ot=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:o,children:a,toasterId:i,containerStyle:n,containerClassName:d})=>{let{toasts:m,handlers:f}=nt(r,i);return h.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:H,left:H,right:H,bottom:H,pointerEvents:"none",...n},className:d,onMouseEnter:f.startPause,onMouseLeave:f.endPause},m.map(s=>{let c=s.position||t,u=f.calculateOffset(s,{reverseOrder:e,gutter:o,defaultPosition:t}),g=Nt(c,u);return h.createElement(Ct,{id:s.id,key:s.id,onHeightUpdate:f.updateHeight,className:s.visible?Et:"",style:g},s.type==="custom"?B(s.message,s):a?a(s):h.createElement(Lt,{toast:s,position:c}))}))},z=x,Pt=["sitekey","onChange","theme","type","tabindex","onExpired","onErrored","size","stoken","grecaptcha","badge","hl","isolated"];function X(){return X=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o])}return e},X.apply(this,arguments)}function $t(e,t){if(e==null)return{};var r={},o=Object.keys(e),a,i;for(i=0;i<o.length;i++)a=o[i],!(t.indexOf(a)>=0)&&(r[a]=e[a]);return r}function q(e){if(e===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function Tt(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,ee(e,t)}function ee(e,t){return ee=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(o,a){return o.__proto__=a,o},ee(e,t)}var W=(function(e){Tt(t,e);function t(){var o;return o=e.call(this)||this,o.handleExpired=o.handleExpired.bind(q(o)),o.handleErrored=o.handleErrored.bind(q(o)),o.handleChange=o.handleChange.bind(q(o)),o.handleRecaptchaRef=o.handleRecaptchaRef.bind(q(o)),o}var r=t.prototype;return r.getCaptchaFunction=function(a){return this.props.grecaptcha?this.props.grecaptcha.enterprise?this.props.grecaptcha.enterprise[a]:this.props.grecaptcha[a]:null},r.getValue=function(){var a=this.getCaptchaFunction("getResponse");return a&&this._widgetId!==void 0?a(this._widgetId):null},r.getWidgetId=function(){return this.props.grecaptcha&&this._widgetId!==void 0?this._widgetId:null},r.execute=function(){var a=this.getCaptchaFunction("execute");if(a&&this._widgetId!==void 0)return a(this._widgetId);this._executeRequested=!0},r.executeAsync=function(){var a=this;return new Promise(function(i,n){a.executionResolve=i,a.executionReject=n,a.execute()})},r.reset=function(){var a=this.getCaptchaFunction("reset");a&&this._widgetId!==void 0&&a(this._widgetId)},r.forceReset=function(){var a=this.getCaptchaFunction("reset");a&&a()},r.handleExpired=function(){this.props.onExpired?this.props.onExpired():this.handleChange(null)},r.handleErrored=function(){this.props.onErrored&&this.props.onErrored(),this.executionReject&&(this.executionReject(),delete this.executionResolve,delete this.executionReject)},r.handleChange=function(a){this.props.onChange&&this.props.onChange(a),this.executionResolve&&(this.executionResolve(a),delete this.executionReject,delete this.executionResolve)},r.explicitRender=function(){var a=this.getCaptchaFunction("render");if(a&&this._widgetId===void 0){var i=document.createElement("div");this._widgetId=a(i,{sitekey:this.props.sitekey,callback:this.handleChange,theme:this.props.theme,type:this.props.type,tabindex:this.props.tabindex,"expired-callback":this.handleExpired,"error-callback":this.handleErrored,size:this.props.size,stoken:this.props.stoken,hl:this.props.hl,badge:this.props.badge,isolated:this.props.isolated}),this.captcha.appendChild(i)}this._executeRequested&&this.props.grecaptcha&&this._widgetId!==void 0&&(this._executeRequested=!1,this.execute())},r.componentDidMount=function(){this.explicitRender()},r.componentDidUpdate=function(){this.explicitRender()},r.handleRecaptchaRef=function(a){this.captcha=a},r.render=function(){var a=this.props;a.sitekey,a.onChange,a.theme,a.type,a.tabindex,a.onExpired,a.onErrored,a.size,a.stoken,a.grecaptcha,a.badge,a.hl,a.isolated;var i=$t(a,Pt);return h.createElement("div",X({},i,{ref:this.handleRecaptchaRef}))},t})(h.Component);W.displayName="ReCAPTCHA";W.propTypes={sitekey:R.string.isRequired,onChange:R.func,grecaptcha:R.object,theme:R.oneOf(["dark","light"]),type:R.oneOf(["image","audio"]),tabindex:R.number,onExpired:R.func,onErrored:R.func,size:R.oneOf(["compact","normal","invisible"]),stoken:R.string,hl:R.string,badge:R.oneOf(["bottomright","bottomleft","inline"]),isolated:R.bool};W.defaultProps={onChange:function(){},theme:"light",type:"image",tabindex:0,size:"normal",badge:"bottomright"};var Z={exports:{}},v={};/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ce;function It(){if(ce)return v;ce=1;var e=typeof Symbol=="function"&&Symbol.for,t=e?Symbol.for("react.element"):60103,r=e?Symbol.for("react.portal"):60106,o=e?Symbol.for("react.fragment"):60107,a=e?Symbol.for("react.strict_mode"):60108,i=e?Symbol.for("react.profiler"):60114,n=e?Symbol.for("react.provider"):60109,d=e?Symbol.for("react.context"):60110,m=e?Symbol.for("react.async_mode"):60111,f=e?Symbol.for("react.concurrent_mode"):60111,s=e?Symbol.for("react.forward_ref"):60112,c=e?Symbol.for("react.suspense"):60113,u=e?Symbol.for("react.suspense_list"):60120,g=e?Symbol.for("react.memo"):60115,y=e?Symbol.for("react.lazy"):60116,w=e?Symbol.for("react.block"):60121,L=e?Symbol.for("react.fundamental"):60117,E=e?Symbol.for("react.responder"):60118,k=e?Symbol.for("react.scope"):60119;function b(l){if(typeof l=="object"&&l!==null){var C=l.$$typeof;switch(C){case t:switch(l=l.type,l){case m:case f:case o:case i:case a:case c:return l;default:switch(l=l&&l.$$typeof,l){case d:case s:case y:case g:case n:return l;default:return C}}case r:return C}}}function j(l){return b(l)===f}return v.AsyncMode=m,v.ConcurrentMode=f,v.ContextConsumer=d,v.ContextProvider=n,v.Element=t,v.ForwardRef=s,v.Fragment=o,v.Lazy=y,v.Memo=g,v.Portal=r,v.Profiler=i,v.StrictMode=a,v.Suspense=c,v.isAsyncMode=function(l){return j(l)||b(l)===m},v.isConcurrentMode=j,v.isContextConsumer=function(l){return b(l)===d},v.isContextProvider=function(l){return b(l)===n},v.isElement=function(l){return typeof l=="object"&&l!==null&&l.$$typeof===t},v.isForwardRef=function(l){return b(l)===s},v.isFragment=function(l){return b(l)===o},v.isLazy=function(l){return b(l)===y},v.isMemo=function(l){return b(l)===g},v.isPortal=function(l){return b(l)===r},v.isProfiler=function(l){return b(l)===i},v.isStrictMode=function(l){return b(l)===a},v.isSuspense=function(l){return b(l)===c},v.isValidElementType=function(l){return typeof l=="string"||typeof l=="function"||l===o||l===f||l===i||l===a||l===c||l===u||typeof l=="object"&&l!==null&&(l.$$typeof===y||l.$$typeof===g||l.$$typeof===n||l.$$typeof===d||l.$$typeof===s||l.$$typeof===L||l.$$typeof===E||l.$$typeof===k||l.$$typeof===w)},v.typeOf=b,v}var le;function At(){return le||(le=1,Z.exports=It()),Z.exports}var Y,de;function Ft(){if(de)return Y;de=1;var e=At(),t={childContextTypes:!0,contextType:!0,contextTypes:!0,defaultProps:!0,displayName:!0,getDefaultProps:!0,getDerivedStateFromError:!0,getDerivedStateFromProps:!0,mixins:!0,propTypes:!0,type:!0},r={name:!0,length:!0,prototype:!0,caller:!0,callee:!0,arguments:!0,arity:!0},o={$$typeof:!0,render:!0,defaultProps:!0,displayName:!0,propTypes:!0},a={$$typeof:!0,compare:!0,defaultProps:!0,displayName:!0,propTypes:!0,type:!0},i={};i[e.ForwardRef]=o,i[e.Memo]=a;function n(y){return e.isMemo(y)?a:i[y.$$typeof]||t}var d=Object.defineProperty,m=Object.getOwnPropertyNames,f=Object.getOwnPropertySymbols,s=Object.getOwnPropertyDescriptor,c=Object.getPrototypeOf,u=Object.prototype;function g(y,w,L){if(typeof w!="string"){if(u){var E=c(w);E&&E!==u&&g(y,E,L)}var k=m(w);f&&(k=k.concat(f(w)));for(var b=n(y),j=n(w),l=0;l<k.length;++l){var C=k[l];if(!r[C]&&!(L&&L[C])&&!(j&&j[C])&&!(b&&b[C])){var S=s(w,C);try{d(y,C,S)}catch{}}}}return y}return Y=g,Y}var Dt=Ft();const Mt=Ee(Dt);function te(){return te=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o])}return e},te.apply(this,arguments)}function Ht(e,t){if(e==null)return{};var r={},o=Object.keys(e),a,i;for(i=0;i<o.length;i++)a=o[i],!(t.indexOf(a)>=0)&&(r[a]=e[a]);return r}function zt(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}var N={},qt=0;function Ut(e,t){return t=t||{},function(o){var a=o.displayName||o.name||"Component",i=(function(d){zt(m,d);function m(s,c){var u;return u=d.call(this,s,c)||this,u.state={},u.__scriptURL="",u}var f=m.prototype;return f.asyncScriptLoaderGetScriptLoaderID=function(){return this.__scriptLoaderID||(this.__scriptLoaderID="async-script-loader-"+qt++),this.__scriptLoaderID},f.setupScriptURL=function(){return this.__scriptURL=typeof e=="function"?e():e,this.__scriptURL},f.asyncScriptLoaderHandleLoad=function(c){var u=this;this.setState(c,function(){return u.props.asyncScriptOnLoad&&u.props.asyncScriptOnLoad(u.state)})},f.asyncScriptLoaderTriggerOnScriptLoaded=function(){var c=N[this.__scriptURL];if(!c||!c.loaded)throw new Error("Script is not loaded.");for(var u in c.observers)c.observers[u](c);delete window[t.callbackName]},f.componentDidMount=function(){var c=this,u=this.setupScriptURL(),g=this.asyncScriptLoaderGetScriptLoaderID(),y=t,w=y.globalName,L=y.callbackName,E=y.scriptId;if(w&&typeof window[w]<"u"&&(N[u]={loaded:!0,observers:{}}),N[u]){var k=N[u];if(k&&(k.loaded||k.errored)){this.asyncScriptLoaderHandleLoad(k);return}k.observers[g]=function(S){return c.asyncScriptLoaderHandleLoad(S)};return}var b={};b[g]=function(S){return c.asyncScriptLoaderHandleLoad(S)},N[u]={loaded:!1,observers:b};var j=document.createElement("script");j.src=u,j.async=!0;for(var l in t.attributes)j.setAttribute(l,t.attributes[l]);E&&(j.id=E);var C=function(A){if(N[u]){var Ne=N[u],G=Ne.observers;for(var ie in G)A(G[ie])&&delete G[ie]}};L&&typeof window<"u"&&(window[L]=function(){return c.asyncScriptLoaderTriggerOnScriptLoaded()}),j.onload=function(){var S=N[u];S&&(S.loaded=!0,C(function(A){return L?!1:(A(S),!0)}))},j.onerror=function(){var S=N[u];S&&(S.errored=!0,C(function(A){return A(S),!0}))},document.body.appendChild(j)},f.componentWillUnmount=function(){var c=this.__scriptURL;if(t.removeOnUnmount===!0)for(var u=document.getElementsByTagName("script"),g=0;g<u.length;g+=1)u[g].src.indexOf(c)>-1&&u[g].parentNode&&u[g].parentNode.removeChild(u[g]);var y=N[c];y&&(delete y.observers[this.asyncScriptLoaderGetScriptLoaderID()],t.removeOnUnmount===!0&&delete N[c])},f.render=function(){var c=t.globalName,u=this.props;u.asyncScriptOnLoad;var g=u.forwardedRef,y=Ht(u,["asyncScriptOnLoad","forwardedRef"]);return c&&typeof window<"u"&&(y[c]=typeof window[c]<"u"?window[c]:void 0),y.ref=g,h.createElement(o,y)},m})(h.Component),n=h.forwardRef(function(d,m){return h.createElement(i,te({},d,{forwardedRef:m}))});return n.displayName="AsyncScriptLoader("+a+")",n.propTypes={asyncScriptOnLoad:R.func},Mt(n,o)}}var re="onloadcallback",Bt="grecaptcha";function oe(){return typeof window<"u"&&window.recaptchaOptions||{}}function Vt(){var e=oe(),t=e.useRecaptchaNet?"recaptcha.net":"www.google.com";return e.enterprise?"https://"+t+"/recaptcha/enterprise.js?onload="+re+"&render=explicit":"https://"+t+"/recaptcha/api.js?onload="+re+"&render=explicit"}const Kt=Ut(Vt,{callbackName:re,globalName:Bt,attributes:oe().nonce?{nonce:oe().nonce}:{}})(W);/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Le=(...e)=>e.filter((t,r,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===r).join(" ").trim();/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wt=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gt=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,r,o)=>o?o.toUpperCase():r.toLowerCase());/**
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
 */const Jt=h.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:o,className:a="",children:i,iconNode:n,...d},m)=>h.createElement("svg",{ref:m,...Zt,width:t,height:t,stroke:e,strokeWidth:o?Number(r)*24/Number(t):r,className:Le("lucide",a),...!i&&!Yt(d)&&{"aria-hidden":"true"},...d},[...n.map(([f,s])=>h.createElement(f,s)),...Array.isArray(i)?i:[i]]));/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=(e,t)=>{const r=h.forwardRef(({className:o,...a},i)=>h.createElement(Jt,{ref:i,iconNode:t,className:Le(`lucide-${Wt(ue(e))}`,`lucide-${e}`,o),...a}));return r.displayName=ue(e),r};/**
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
 */const sr=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],cr=F("send",sr),lr=[{platform:"LinkedIn",url:"https://linkedin.com/in/rauffatali",icon:"linkedin"},{platform:"GitHub",url:"https://github.com/rauffatali",icon:"github"},{platform:"X",url:"https://x.com/raufatali",icon:"twitter"}],dr=(e,t="w-5 h-5")=>{switch(e.toLowerCase()){case"github":return p.jsx(Xt,{className:t});case"linkedin":return p.jsx(tr,{className:t});case"twitter":return p.jsx("svg",{role:"img",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",className:t,fill:"currentColor",children:p.jsx("path",{d:"M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"})});default:return p.jsx(Ce,{className:t})}},mr=()=>{const e=h.useRef(null),t=h.useRef(null),[r,o]=h.useState(!1),[a,i]=h.useState(!1),[n,d]=h.useState({name:"",email:"",message:""}),m=async(s="")=>{const c="service_itaeyxh",u="template_lugrcbu",g="3Rm2P2qTKCOL6YuIv";o(!0);const y=z.loading("Sending your message...");try{const w={user_name:n.name,user_email:n.email,message:n.message,time:new Date().toLocaleString(),...s&&{"g-recaptcha-response":s}};await Ue.send(c,u,w,{publicKey:g,limitRate:{id:"contact_form",throttle:1e4}}),z.success("Message sent successfully! I will get back to you soon.",{id:y,duration:5e3}),d({name:"",email:"",message:""}),e.current&&e.current.reset(),t.current&&t.current.reset(),i(!1)}catch(w){console.error("EmailJS Error:",w),z.error("Failed to send message. Please try again or contact me directly via social media.",{id:y,duration:5e3})}finally{o(!1)}},f=async s=>{var c;if(s.preventDefault(),!a){i(!0);return}if(a){const u=(c=t.current)==null?void 0:c.getValue();if(!u){z.error("Please complete the reCAPTCHA verification.");return}await m(u);return}await m()};return p.jsxs("section",{id:"contact",className:"py-24 theme-bg-surface relative overflow-hidden",children:[p.jsx(Ot,{position:"bottom-right",toastOptions:{style:{background:"var(--bg-elevated)",color:"var(--text-primary)",border:"1px solid var(--border-light)",backdropFilter:"blur(10px)"},success:{iconTheme:{primary:"var(--accent)",secondary:"#fff"}}}}),p.jsx("div",{className:"absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full theme-bg-accent opacity-10 blur-3xl pointer-events-none"}),p.jsx("div",{className:"absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full theme-bg-accent opacity-10 blur-3xl pointer-events-none"}),p.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10",children:[p.jsxs("div",{className:"text-center mb-16",children:[p.jsxs("h2",{className:"text-3xl md:text-4xl font-bold theme-text-primary mb-4",children:["Let's ",p.jsx("span",{className:"theme-accent-text",children:"Connect"})]}),p.jsx("p",{className:"text-lg theme-text-secondary max-w-2xl mx-auto leading-relaxed",children:"Have a question, a project proposal, or just want to collaborate on AI and computer vision? I'm always open to discussing new opportunities."})]}),p.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-5 gap-12 items-start",children:[p.jsxs("div",{className:"lg:col-span-3 theme-bg-elevated p-8 md:p-10 rounded-2xl backdrop-blur-md border shadow-xl transition-all duration-300 hover:shadow-2xl",style:{borderColor:"var(--border-color)",boxShadow:"0 4px 30px rgba(0, 0, 0, 0.1)"},children:[p.jsxs("h3",{className:"text-2xl font-bold theme-text-primary mb-8 flex items-center",children:[p.jsx(Ce,{className:"w-6 h-6 mr-3 theme-accent-text"}),"Send me a message"]}),p.jsxs("form",{ref:e,onSubmit:f,className:"space-y-6 text-left",children:[p.jsxs("div",{className:"group",children:[p.jsx("label",{htmlFor:"user_name",className:"block text-sm font-medium theme-text-secondary mb-2 transition-colors group-focus-within:theme-accent-text",children:"Your Name"}),p.jsx("input",{type:"text",id:"user_name",name:"user_name",required:!0,placeholder:"John Doe",value:n.name,onChange:s=>d({...n,name:s.target.value}),className:"w-full px-4 py-3 rounded-lg theme-bg-main border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200",style:{backgroundColor:"var(--bg-main)",borderColor:"var(--border-light)",color:"var(--text-primary)"},onFocus:s=>s.target.style.borderColor="var(--accent)",onBlur:s=>s.target.style.borderColor="var(--border-light)"})]}),p.jsxs("div",{className:"group",children:[p.jsx("label",{htmlFor:"user_email",className:"block text-sm font-medium theme-text-secondary mb-2 transition-colors group-focus-within:theme-accent-text",children:"Email Address"}),p.jsx("input",{type:"email",id:"user_email",name:"user_email",required:!0,placeholder:"john@example.com",value:n.email,onChange:s=>d({...n,email:s.target.value}),className:"w-full px-4 py-3 rounded-lg theme-bg-main border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200",style:{backgroundColor:"var(--bg-main)",borderColor:"var(--border-light)",color:"var(--text-primary)"},onFocus:s=>s.target.style.borderColor="var(--accent)",onBlur:s=>s.target.style.borderColor="var(--border-light)"})]}),p.jsxs("div",{className:"group",children:[p.jsx("label",{htmlFor:"message",className:"block text-sm font-medium theme-text-secondary mb-2 transition-colors group-focus-within:theme-accent-text",children:"Message"}),p.jsx("textarea",{id:"message",name:"message",required:!0,rows:5,placeholder:"How can I help you?",value:n.message,onChange:s=>d({...n,message:s.target.value}),className:"w-full px-4 py-3 rounded-lg theme-bg-main border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 resize-y min-h-[120px]",style:{backgroundColor:"var(--bg-main)",borderColor:"var(--border-light)",color:"var(--text-primary)"},onFocus:s=>s.target.style.borderColor="var(--accent)",onBlur:s=>s.target.style.borderColor="var(--border-light)"})]}),p.jsxs("div",{children:[p.jsx("div",{className:`transition-all duration-300 overflow-hidden flex justify-start ${a?"max-h-32 opacity-100 mb-6":"max-h-0 opacity-0 mb-0"}`,children:p.jsx(Kt,{ref:t,sitekey:"6LcmAoIsAAAAACRct9wflMrwmQzwKmPM3FpIEL3c",theme:"dark",onChange:s=>{s&&m(s)}})}),p.jsx("button",{type:"submit",disabled:r,className:"hero-btn-primary w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold flex items-center justify-center transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1 hover:shadow-xl",style:{backgroundColor:"var(--accent)",color:"var(--text-on-accent, #ffffff)",border:"1px solid transparent"},children:r?p.jsxs(p.Fragment,{children:[p.jsx(or,{className:"w-5 h-5 mr-2 animate-spin"}),"Sending..."]}):p.jsxs(p.Fragment,{children:[p.jsx(cr,{className:"w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform"}),"Send Message"]})})]})]})]}),p.jsxs("div",{className:"lg:col-span-2 flex flex-col space-y-8",children:[p.jsxs("div",{className:"theme-bg-elevated p-8 rounded-2xl backdrop-blur-md border shadow-lg",style:{borderColor:"var(--border-color)"},children:[p.jsx("h3",{className:"text-xl font-bold theme-text-primary mb-6",children:"Connect Digitally"}),p.jsx("div",{className:"flex flex-col space-y-4",children:lr.map(s=>p.jsxs("a",{href:s.url,target:"_blank",rel:"noopener noreferrer",className:"flex items-center p-4 rounded-xl border border-transparent hover:border-current transition-all duration-300 group",style:{backgroundColor:"var(--bg-main)",color:"var(--text-secondary)"},onMouseEnter:c=>c.currentTarget.style.color="var(--accent)",onMouseLeave:c=>c.currentTarget.style.color="var(--text-secondary)",children:[p.jsx("div",{className:"p-2 rounded-lg theme-bg-elevated mr-4 transition-transform group-hover:scale-110",children:dr(s.icon||"mail")}),p.jsx("span",{className:"font-medium flex-1",children:s.platform}),p.jsx("svg",{className:"w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:p.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5l7 7-7 7"})})]},s.platform))})]}),p.jsxs("div",{className:"theme-bg-elevated p-10 rounded-2xl backdrop-blur-md border shadow-lg",style:{borderColor:"var(--border-color)"},children:[p.jsxs("div",{className:"flex items-center mb-6",children:[p.jsx("div",{className:"p-3 rounded-xl mr-4",style:{backgroundColor:"var(--accent-light)",color:"var(--accent)"},children:p.jsx(ir,{className:"w-6 h-6"})}),p.jsx("h3",{className:"text-xl font-bold theme-text-primary",children:"Location"})]}),p.jsxs("p",{className:"theme-text-secondary leading-relaxed",children:["Currently based in Baku, Azerbaijan.",p.jsx("br",{}),p.jsx("span",{className:"inline-block mt-2 font-medium",style:{color:"var(--accent)"},children:"Available for remote work worldwide."})]})]})]})]})]})]})};export{mr as default};
