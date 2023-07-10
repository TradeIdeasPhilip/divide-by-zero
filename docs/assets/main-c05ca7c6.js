(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();var a={};Object.defineProperty(a,"__esModule",{value:!0});a.permutations=a.polarToRectangular=V=a.makeBoundedLinear=A=a.makeLinear=a.sum=a.countMap=b=a.initializedArray=a.count=C=a.zip=a.FIGURE_SPACE=a.NON_BREAKING_SPACE=a.dateIsValid=a.MIN_DATE=a.MAX_DATE=a.makePromise=a.filterMap=B=a.pick=a.pickAny=a.csvStringToArray=a.parseTimeT=a.parseIntX=a.parseFloatX=a.getAttribute=a.followPath=a.parseXml=a.testXml=F=a.sleep=D=a.assertClass=void 0;function j(e,t,n="Assertion Failed."){const i=s=>{throw new Error(`${n}  Expected type:  ${t.name}.  Found type:  ${s}.`)};if(e===null)i("null");else if(typeof e!="object")i(typeof e);else if(!(e instanceof t))i(e.constructor.name);else return e;throw new Error("wtf")}var D=a.assertClass=j;function K(e){return new Promise(t=>setTimeout(t,e))}var F=a.sleep=K;function R(e){const n=new DOMParser().parseFromString(e,"application/xml");for(const i of Array.from(n.querySelectorAll("parsererror")))if(i instanceof HTMLElement)return{error:i};return{parsed:n}}a.testXml=R;function Z(e){if(e!==void 0)return R(e)?.parsed?.documentElement}a.parseXml=Z;function O(e,...t){for(const n of t){if(e===void 0)return;if(typeof n=="number")e=e.children[n];else{const i=e.getElementsByTagName(n);if(i.length!=1)return;e=i[0]}}return e}a.followPath=O;function Q(e,t,...n){if(t=O(t,...n),t!==void 0&&t.hasAttribute(e))return t.getAttribute(e)??void 0}a.getAttribute=Q;function X(e){if(e==null)return;const t=parseFloat(e);if(isFinite(t))return t}a.parseFloatX=X;function z(e){const t=X(e);if(t!==void 0)return t>Number.MAX_SAFE_INTEGER||t<Number.MIN_SAFE_INTEGER||t!=Math.floor(t)?void 0:t}a.parseIntX=z;function J(e){if(typeof e=="string"&&(e=z(e)),e!=null&&!(e<=0))return new Date(e*1e3)}a.parseTimeT=J;const tt=e=>{const t=/(,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^,\r\n]*))/gi,n=[[]];let i;for(;i=t.exec(e);)i[1].length&&i[1]!==","&&n.push([]),n[n.length-1].push(i[2]!==void 0?i[2].replace(/""/g,'"'):i[3]);return n};a.csvStringToArray=tt;function et(e){const t=e.values().next();if(!t.done)return t.value}a.pickAny=et;function nt(e){return e[Math.random()*e.length|0]}var B=a.pick=nt;function it(e,t){const n=[];return e.forEach((i,s)=>{const r=t(i,s);r!==void 0&&n.push(r)}),n}a.filterMap=it;function st(){let e,t;return{promise:new Promise((i,s)=>{e=i,t=s}),resolve:e,reject:t}}a.makePromise=st;a.MAX_DATE=new Date(864e13);a.MIN_DATE=new Date(-864e13);function rt(e){return isFinite(e.getTime())}a.dateIsValid=rt;a.NON_BREAKING_SPACE=" ";a.FIGURE_SPACE=" ";function*at(...e){const t=e.map(n=>n[Symbol.iterator]());for(;;){const n=t.map(i=>i.next());if(n.some(({done:i})=>i))break;yield n.map(({value:i})=>i)}}var C=a.zip=at;function*ot(e=0,t=1/0,n=1){for(let i=e;i<t;i+=n)yield i}a.count=ot;function W(e,t){const n=[];for(let i=0;i<e;i++)n.push(t(i));return n}var b=a.initializedArray=W;a.countMap=W;function ct(e){return e.reduce((t,n)=>t+n,0)}a.sum=ct;function lt(e,t,n,i){const s=(i-t)/(n-e);return function(r){return(r-e)*s+t}}var A=a.makeLinear=lt;function ut(e,t,n,i){n<e&&([e,t,n,i]=[n,i,e,t]);const s=(i-t)/(n-e);return function(r){return r<=e?t:r>=n?i:(r-e)*s+t}}var V=a.makeBoundedLinear=ut;function ht(e,t){return{x:Math.sin(t)*e,y:Math.cos(t)*e}}a.polarToRectangular=ht;function*U(e,t=[]){if(e.length==0)yield t;else for(let n=0;n<e.length;n++){const i=e[n],s=[...t,i],r=[...e.slice(0,n),...e.slice(n+1)];yield*U(r,s)}}a.permutations=U;var E={};Object.defineProperty(E,"__esModule",{value:!0});E.download=E.createElementFromHTML=E.getHashInfo=E.getAudioBalanceControl=E.getBlobFromCanvas=E.loadDateTimeLocal=u=E.getById=void 0;const q=a;function mt(e,t){const n=document.getElementById(e);if(!n)throw new Error("Could not find element with id "+e+".  Expected type:  "+t.name);if(n instanceof t)return n;throw new Error("Element with id "+e+" has type "+n.constructor.name+".  Expected type:  "+t.name)}var u=E.getById=mt;function dt(e,t,n="milliseconds"){let i;switch(n){case"minutes":{i=t.getSeconds()*1e3+t.getMilliseconds();break}case"seconds":{i=t.getMilliseconds();break}case"milliseconds":{i=0;break}default:throw new Error("wtf")}e.valueAsNumber=+t-t.getTimezoneOffset()*6e4-i}E.loadDateTimeLocal=dt;function ft(e){const{reject:t,resolve:n,promise:i}=(0,q.makePromise)();return e.toBlob(s=>{s?n(s):t(new Error("blob is null!"))}),i}E.getBlobFromCanvas=ft;function pt(e){const t=new AudioContext,n=t.createMediaElementSource(e),i=new StereoPannerNode(t,{pan:0});return n.connect(i).connect(t.destination),s=>{i.pan.value=s}}E.getAudioBalanceControl=pt;function gt(){const e=new Map;return/^#?(.*)$/.exec(location.hash.replace("+","%20"))[1].split("&").forEach(i=>{const s=i.split("=",2);if(s.length==2){const r=decodeURIComponent(s[0]),o=decodeURIComponent(s[1]);e.set(r,o)}}),e}E.getHashInfo=gt;function Et(e,t){var n=document.createElement("div");return n.innerHTML=e.trim(),(0,q.assertClass)(n.firstChild,t,"createElementFromHTML:")}E.createElementFromHTML=Et;function yt(e,t){var n=document.createElement("a");if(n.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(t)),n.setAttribute("download",e),document.createEvent){var i=document.createEvent("MouseEvents");i.initEvent("click",!0,!0),n.dispatchEvent(i)}else n.click()}E.download=yt;function Y(e,t){const n={x:(e.x+t.x)/2,y:(e.y+t.y)/2};{const r=(t.y-e.y)/(t.x-e.x);if(e.yPrime>r&&t.yPrime>r||e.yPrime<r&&t.yPrime<r)return n}const i=(e.x*e.yPrime-e.y-t.x*t.yPrime+t.y)/(e.yPrime-t.yPrime);if(!isFinite(i))return console.log({x:i,p1:e,p2:t}),n;const s=(i-e.x)*e.yPrime+e.y;return isFinite(s)?{x:i,y:s}:(console.log({y:s,x:i,p1:e,p2:t}),n)}window.quadraticControlPoint=Y;function*wt(e,t=2){if(t<1||(t|0)!=t)throw new Error("wtf");const n=[];for(const i of e)n.push(i),n.length==t&&(yield n,n.shift())}function Mt(e){let t="";for(const[n,i]of wt(e)){t==""&&(t=`M ${n.x},${n.y}`);const s=Y(n,i);t+=` Q ${s.x},${s.y} ${i.x},${i.y}`}return t}function vt({x0:e,frequencyMultiplier:t,yCenter:n,amplitude:i}){return{f(s){return Math.sin((s-e)*t)*i+n},fPrime(s){return Math.cos((s-e)*t)*i*t}}}function St({left:e,right:t,frequencyMultiplier:n}){if(t<=e)return[];const i=10,s=(t-e)/(2*Math.PI)*n,r=Math.max(1,Math.round(s*i));return b(r+1,A(0,e,r,t))}function At(e){const t=St(e),n=vt(e);return t.map(s=>({x:s,y:n.f(s),yPrime:n.fPrime(s)}))}function x(e){return Mt(At(e))}window.sineWavePath=x;const k=u("currentlyCenteredPointer",SVGGeometryElement),Pt=u("currentlyCenteredTranslate",SVGGElement),bt=u("currentlyCenteredZoom",SVGGElement),H=u("zoomedInParabola",SVGPathElement);function Tt(e,{x:t,y:n}){const i=-2*t,s=Math.atan(i)/Math.PI*180;e.setAttribute("transform",`translate(${t}, ${n}) rotate(${s})`)}class I{static centerX=0;static centerY=0;static ratio=1;static#t;static animationIsRunning(){return this.#t!==void 0}static#e=!1;static#n=u("zoomText",SVGGElement);static#i=D(this.#n.firstElementChild,SVGTextElement);static startAnimation(){this.animationIsRunning()||this.restartAnimation()}static restartAnimation(t=0){const n=performance.now()+t,i=V(n,0,n+1e4,Math.log(300)),s=V(n+1e3,0,n+1e4,.75),r=n+13e3;this.#t=o=>{if(o>r){const c=(Math.random()+Math.random())/2*5-2.5,h=2-c*c;this.selectNewTarget({x:c,y:h}),this.restartAnimation(500)}else{const c=Math.exp(i(o));this.setNewZoom(c);const h=s(o);k.style.opacity=h.toString()}},this.setNewZoom(1),this.#e||(this.#e=!0,requestAnimationFrame(this.onAnimationFrame))}static stopAnimation(){this.#t=void 0,this.setNewZoom(1)}static onAnimationFrame(t){requestAnimationFrame(I.onAnimationFrame),I.#t?.(t)}static updateGUI(){H.setAttribute("transform",`scale(${this.ratio}) translate(${-this.centerX}, ${-this.centerY})`),Pt.setAttribute("transform",`translate(${this.centerX}, ${this.centerY})`),bt.setAttribute("transform",`scale(${1/this.ratio})`),Tt(k,{x:this.centerX,y:this.centerY});const t=(.15/this.ratio).toString();H.setAttribute("stroke-width",t),this.#i.textContent=`${this.ratio<10?Math.round(this.ratio*10)/10:Math.round(this.ratio)}⨉`}static selectNewTarget({x:t,y:n}){this.centerX=t,this.centerY=n,this.ratio=1,this.updateGUI()}static setNewZoom(t){this.ratio=t,this.updateGUI()}}I.selectNewTarget({x:0,y:2});I.startAnimation();class ${constructor(t,n){this.parent=t,this.type=n;let i;for(const s of t.children)if(s instanceof n){i=s;break}if(!i)throw new Error("wtf");i.remove(),this.#t=i}#t;create(){return D(this.#t.cloneNode(!0),this.type)}createParented(){return this.parent.appendChild(this.create())}}class L{constructor(t,n,i,s=6/t){this.numberOfSegments=t;const r=n===void 0?void 0:u(n,SVGGElement),o=u(i,SVGGElement);if(r){{const c=new $(r,SVGCircleElement);this.#t=b(t+1,()=>c.createParented())}{const c=new $(r,SVGLineElement);this.#e=b(t,()=>c.createParented())}}else this.#t=[],this.#e=[];{const c=new $(o,SVGCircleElement),h=new $(o,SVGLineElement);this.#n=b(t,()=>{const f=h.createParented(),m=c.createParented(),d=c.createParented();return{start:m,middle:f,end:d}})}this.resize(s)}#t;#e;#n;resize(t){const n=this.numberOfSegments+1,i=this.numberOfSegments/2,s=b(n,o=>{const c=(o-i)*t,h=c*c/2;return{x:c,y:h}});for(const[o,c]of C(s,this.#t))c.cx.baseVal.value=o.x,c.cy.baseVal.value=o.y;const r=b(s.length-1,o=>({first:s[o],second:s[o+1]}));for(const[{first:o,second:c},h]of C(r,this.#e))h.x1.baseVal.value=o.x,h.y1.baseVal.value=o.y,h.x2.baseVal.value=c.x,h.y2.baseVal.value=c.y;for(const[{first:o,second:c},{start:h,middle:f,end:m}]of C(r,this.#n)){const l=(c.y-o.y)/(c.x-o.x)/2;h.cx.baseVal.value=f.x1.baseVal.value=o.x,h.cy.baseVal.value=f.y1.baseVal.value=l,m.cx.baseVal.value=f.x2.baseVal.value=c.x,m.cy.baseVal.value=f.y2.baseVal.value=l}}}class T{constructor(t){this.toDo=t,this.callback=this.callback.bind(this),this.callback(performance.now())}#t=!1;cancel(){this.#t=!0}callback(t){this.#t||(requestAnimationFrame(this.callback),this.toDo(t))}}function _(e,t,n,i){n<e&&([e,t,n,i]=[n,i,e,t]);const s=A(e,0,n,Math.PI),r=A(1,t,-1,i);return function(o){return o<=e?t:o>=n?i:r(Math.cos(s(o)))}}new L(6,"sampleParabola","sampleDerivative",1);{const n=_(0,1,2e3,.5),i=new L(24,"animatedParabola1","animatedDerivative1");new T(s=>{const r=s%4897;i.resize(n(r))})}{const n=_(0,.5,2e3,.25),i=new L(24,"animatedParabola2","animatedDerivative2");new T(s=>{const r=s%5e3;i.resize(n(r))})}{const n=_(0,1,5e3,.05454545454545454),i=new L(150,void 0,"animatedDerivative3");new T(s=>{const r=s%7e3;i.resize(n(r))})}class Gt{static#t=u("tangentLine",SVGGElement);static setPosition(t){const n=2-t*t,i=-2*t,s=Math.atan(i)/Math.PI*180;this.#t.setAttribute("transform",`translate(${t}, ${n}) rotate(${s})`)}static setRelativePosition(t){this.setPosition(t*2.25)}}new T(e=>Gt.setRelativePosition(Math.sin(e/2200)));{const e=u("anyNumber",HTMLSpanElement),t=[".000001",".999997",".3125",".3̅",".16̅",".1̅4̅2̅8̅5̅7̅",".0̅9̅"," ½"," ¼"," ¾"," ⅐"," ⅑"," ⅒"," ⅓"," ⅔"," ⅕"," ⅖"," ⅗"," ⅘"," ⅙"," ⅚"," ⅛"," ⅜"," ⅝"," ⅞"];let n=1001,i="";setInterval(()=>{n++,Math.random()>.75&&(Math.random()<.9?i="":i=B(t)),e.innerText=n.toLocaleString()+i},1500)}Array.from(document.querySelectorAll("a:not([href])[id]")).forEach(e=>{const t=D(e,HTMLAnchorElement);t.innerText!=""&&(t.classList.add("self-link"),t.href="#"+t.id)});class w{element;static DEFAULT_LENGTH=10;static COMPATIBLE_STROKE_WIDTH=1.6;static RECOMMENDED_STROKE_WIDTH=.25;#t;#e=!0;#n=0;constructor(t=w.DEFAULT_LENGTH){this.element=document.createElementNS("http://www.w3.org/2000/svg","polygon"),this.#t=t,this.redraw(),this.element.setAttribute("stroke-width","0"),this.element.setAttribute("stroke-miterlimit","10")}redraw(){const t=this.#t,n=this.#e?-this.#n*27/20:t+this.#n/2;if(!isFinite(t)){this.element.setAttribute("points","");return}const i=6,s=Math.sign(t)*Math.min(1,Math.abs(t)/i);this.element.setAttribute("points",`0,${0-n} 2.4,${s*6-n} 0.6,${s*4.4-n} 0.6,${t-n} -0.6,${t-n} -0.6,${s*4.4-n} -2.4,${s*6-n} 0,${0-n}`)}get length(){return this.#t}set length(t){this.#t=t,this.redraw()}get originAtHead(){return this.#e}set originAtHead(t){this.#e=t,this.redraw()}get originAtTail(){return!this.originAtHead}set originAtTail(t){this.originAtHead=!t}setStrokeWidth(t=w.RECOMMENDED_STROKE_WIDTH){this.#n=t,this.element.setAttribute("stroke-width",t.toString()),this.redraw()}removeStroke(){this.setStrokeWidth(0)}}window.Pointer=w;{let e=function(f,m=f){const d=m.getScreenCTM(),p=new DOMMatrix([d.a,d.b,d.c,d.d,d.e,d.f]).inverse(),g=f.getBoundingClientRect(),{x:y,y:M}=p.transformPoint(g),{x:S,y:G}=p.transformPoint({x:g.right,y:g.bottom}),v=G-M,P=S-y;return new DOMRectReadOnly(y,M,P,v)},t=function(f){const m=f/1e3,d=Math.sin(m),l=Math.cos(m),p=-Math.sin(m),g={functionX:m,position:d,velocity:l,acceleration:p};n.updateDisplay(g);{const y=d/2,M=y*70+50,S=Math.asin(y);u("pendulum",SVGGElement).setAttribute("transform",`rotate(${-S/Math.PI*180})`);const v=Math.cos(S)*70+10,P=u("offsetHorizontal",SVGLineElement);P.x1.baseVal.value=P.x2.baseVal.value=M,P.y1.baseVal.value=v,r.length=y*70,o.element.setAttribute("transform",`translate(${M},${v}) rotate(90)`),o.length=l*35,c.element.setAttribute("transform",`translate(${M},${v-10+w.COMPATIBLE_STROKE_WIDTH/2}) rotate(90)`),c.length=p*35}i.updateDisplay(g),h.updateDisplay(g)};class n{constructor(){throw new Error("wtf")}static#t=Array.from(u("electron",SVGGElement).querySelectorAll("circle"));static#e=u("electricCurrentArrow",SVGPolygonElement);static#n=this.#e.getAttribute("transform");static#i=A(-1,85,1,215);static updateDisplay({functionX:m,velocity:d}){this.#t.forEach((l,p)=>{const g=this.#i(Math.sin(m-.1*p));l.cx.baseVal.value=g}),this.#e.setAttribute("transform",`${this.#n} scale(${d} 1)`)}}class i{static#t=u("threeSineWavesContainer",SVGSVGElement);static#e=u("threeSineWavesPast",SVGGElement);static#n=u("threeSineWavesFuture",SVGGElement);static#i=[["red",0],["magenta",Math.PI/2],["blue",Math.PI]].map(([m,d])=>{const l=document.createElementNS("http://www.w3.org/2000/svg","path");return u("threeSineWaves",SVGGElement).appendChild(l),l.style.strokeWidth="0.056",l.style.fill="none",l.style.stroke=m,{path:l,offset:d}});static#s=u("threeSineWavesGrid",SVGPathElement);static updateDisplay({functionX:m}){const{top:d,left:l,bottom:p,right:g}=e(this.#t);this.#e.setAttribute("transform",`translate(${l/2})`),this.#n.setAttribute("transform",`translate(${g/2})`),this.#s.setAttribute("d",`M ${l},0 ${g},0 M 0,${d} 0,${p}`),this.#i.forEach(({path:y,offset:M})=>{const S={left:l,amplitude:-1,yCenter:0,right:g,x0:-m-M,frequencyMultiplier:1},G=x(S);y.setAttribute("d",G)})}}const s=u("pendulumContainer",SVGSVGElement),r=new w;r.originAtTail=!0,s.appendChild(r.element),r.element.setAttribute("fill","red"),r.element.setAttribute("transform","translate(50,90) rotate(90)");const o=new w;o.originAtTail=!0,s.appendChild(o.element),o.element.setAttribute("fill","violet"),o.element.setAttribute("transform","translate(50,80) rotate(90)");const c=new w;c.originAtTail=!0,s.appendChild(c.element),c.element.setAttribute("fill","blue"),c.element.setAttribute("transform","translate(50,80) rotate(90)");{const f=s.querySelectorAll("text");if(f.length!=3)throw new Error("wtf");const[m,d,l]=f,p=(m.getBBox().width-l.getBBox().width)/2;d.setAttribute("transform",`translate(${50+p},98)`)}class h{static updateDisplay({position:m,functionX:d}){const l=this.#a(-m),p=this.#f(-m),g=this.#p(-m);let y=`M 50,${this.#c}`;for(let N=0;N<this.#l;N++)y+=` a ${g},${l},180,0,0,0,${2*l}`,y+=` a ${g},${p},180,0,0,0,${-2*p}`;y+=` a ${g},${l},180,0,0,${-g},${l} h ${g} v ${this.#u}`,this.#e.setAttribute("d",y);const M=this.#c+this.#l*2*(l-p)+l+this.#u;this.#n.cy.baseVal.value=M;const{left:S,right:G}=e(this.#t,this.#i),v=(this.#d-this.#m)/2,P={left:S,amplitude:-1*v,yCenter:(this.#d+this.#m)/2,right:G,x0:-d*v,frequencyMultiplier:1/v};this.#i.setAttribute("d",x(P))}static#t=u("springContainer",SVGSVGElement);static#e=u("springPath",SVGPathElement);static#n=u("springWeight",SVGCircleElement);static#i=u("springSineWave",SVGPathElement);static#s=10;static#r=15;static#a=A(-1,this.#s,1,this.#r);static#o=7.5;static#h=10;static#f=A(-1,this.#o,1,this.#h);static#p=A(-1,19,1,15);static#c=-17;static#l=7;static#u=21;static#m=this.#c+this.#l*2*(this.#s-this.#o)+this.#s+this.#u;static#d=this.#c+this.#l*2*(this.#r-this.#h)+this.#r+this.#u}new T(f=>{t(f)})}class It{static f(t){return .5*t+.5*Math.sin(t)+.25*Math.sin(2.3*t+.7)+.05*Math.cos(5.11*t-.2)}static fPrime(t){return .5+.5*Math.cos(t)+2.3*.25*Math.cos(2.3*t+.7)+5.11*.05*-Math.sin(5.11*t-.2)}static#t=u("deadReckoningEstimate",SVGPolylineElement);static#e=u("deadReckoningPointers",SVGGElement);static WIDTH=8.2;static update(t){this.#e.innerHTML="";const n=Math.ceil(1/t),i=this.WIDTH*t;let s="",r=this.f(0);for(let o=0;o<=n;o++){const c=i*o;s+=` ${c}, ${r}`;const h=this.fPrime(c),f=i*h,m=this.f(c),d=Math.atan(h)/Math.PI*180,l=new w;this.#e.appendChild(l.element),l.element.setAttribute("transform",`translate(${c} ${m}) scale(0.05) rotate(${d+180})`);const p=new w;this.#e.appendChild(p.element),p.element.setAttribute("transform",`translate(${c} ${r}) scale(0.05) rotate(${d})`),o%2&&(l.element.style.opacity=p.element.style.opacity="0.333"),r+=f}this.#t.setAttribute("points",s)}static startDemo(){const r=V(500,.4,20500,.025);new T(o=>{const c=o%22e3,h=r(c);this.update(h)})}}It.startDemo();class $t{constructor(){throw new Error("wtf")}static#t=[...[-3,-2,-1,0,1].map(t=>-Math.sqrt(2-t)),...[2,1,0,-1,-2,-3].map(t=>Math.sqrt(2-t))];static#e=0;static#n=()=>this.#t[this.#e];static pickNewDestination(){let t=Math.floor(Math.random()*(this.#t.length-1));t==this.#e&&(t=this.#t.length-1);const n=performance.now(),i=250*(Math.abs(this.#e-t)+1),s=n+i;return this.#n=_(n,this.#t[this.#e],s,this.#t[t]),this.#e=t,i}static#i=u("sampleGraph",SVGGElement);static#s=u("sampleGraphInput",SVGTextElement);static#r=u("sampleGraphOutput",SVGTextElement);static#a=new w;static#o=new Intl.NumberFormat("en-US",{minimumFractionDigits:3});static startDemo(){const t=this.#a.element;this.#i.appendChild(t),this.setX(this.#t[this.#e]),t.style.fill="gold",this.#a.setStrokeWidth(.5),t.style.stroke="rgb(149, 69, 53)",new T(n=>this.setX(this.#n(n))),(async()=>{for(;;){const n=this.pickNewDestination();await F(n+2e3)}})()}static setX(t){const n=o=>{const c=this.#o.format(o),h=/^(.*)\.000$/.exec(c);if(h)return h[1]=="-0"?"=0":`=${h[1]}`;switch(c){case"-2.236":return"=-√5̅";case"2.236":return"=√5̅";case"-1.732":return"=-√3̅";case"1.732":return"=√3̅";case"-1.414":return"=-√2̅";case"1.414":return"=√2̅"}return`≈${c}`};this.#s.innerHTML="x"+n(t);const i=2-t*t;this.#r.innerHTML="y"+n(i);const s=-2*t,r=Math.atan(s)/Math.PI*180;this.#a.element.setAttribute("transform",`translate(${t}, ${i}) scale(0.075) rotate(${r})`)}}$t.startDemo();
