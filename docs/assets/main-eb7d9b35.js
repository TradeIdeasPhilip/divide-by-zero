(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();var a={};Object.defineProperty(a,"__esModule",{value:!0});a.permutations=a.polarToRectangular=I=a.makeBoundedLinear=T=a.makeLinear=a.sum=a.countMap=b=a.initializedArray=U=a.count=C=a.zip=a.FIGURE_SPACE=a.NON_BREAKING_SPACE=a.dateIsValid=a.MIN_DATE=a.MAX_DATE=a.makePromise=a.filterMap=W=a.pick=a.pickAny=a.csvStringToArray=a.parseTimeT=a.parseIntX=a.parseFloatX=a.getAttribute=a.followPath=a.parseXml=a.testXml=$=a.sleep=D=a.assertClass=void 0;function Z(e,t,n="Assertion Failed."){const i=s=>{throw new Error(`${n}  Expected type:  ${t.name}.  Found type:  ${s}.`)};if(e===null)i("null");else if(typeof e!="object")i(typeof e);else if(!(e instanceof t))i(e.constructor.name);else return e;throw new Error("wtf")}var D=a.assertClass=Z;function Q(e){return new Promise(t=>setTimeout(t,e))}var $=a.sleep=Q;function R(e){const n=new DOMParser().parseFromString(e,"application/xml");for(const i of Array.from(n.querySelectorAll("parsererror")))if(i instanceof HTMLElement)return{error:i};return{parsed:n}}a.testXml=R;function J(e){if(e!==void 0)return R(e)?.parsed?.documentElement}a.parseXml=J;function X(e,...t){for(const n of t){if(e===void 0)return;if(typeof n=="number")e=e.children[n];else{const i=e.getElementsByTagName(n);if(i.length!=1)return;e=i[0]}}return e}a.followPath=X;function tt(e,t,...n){if(t=X(t,...n),t!==void 0&&t.hasAttribute(e))return t.getAttribute(e)??void 0}a.getAttribute=tt;function z(e){if(e==null)return;const t=parseFloat(e);if(isFinite(t))return t}a.parseFloatX=z;function B(e){const t=z(e);if(t!==void 0)return t>Number.MAX_SAFE_INTEGER||t<Number.MIN_SAFE_INTEGER||t!=Math.floor(t)?void 0:t}a.parseIntX=B;function et(e){if(typeof e=="string"&&(e=B(e)),e!=null&&!(e<=0))return new Date(e*1e3)}a.parseTimeT=et;const nt=e=>{const t=/(,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^,\r\n]*))/gi,n=[[]];let i;for(;i=t.exec(e);)i[1].length&&i[1]!==","&&n.push([]),n[n.length-1].push(i[2]!==void 0?i[2].replace(/""/g,'"'):i[3]);return n};a.csvStringToArray=nt;function it(e){const t=e.values().next();if(!t.done)return t.value}a.pickAny=it;function st(e){return e[Math.random()*e.length|0]}var W=a.pick=st;function rt(e,t){const n=[];return e.forEach((i,s)=>{const r=t(i,s);r!==void 0&&n.push(r)}),n}a.filterMap=rt;function at(){let e,t;return{promise:new Promise((i,s)=>{e=i,t=s}),resolve:e,reject:t}}a.makePromise=at;a.MAX_DATE=new Date(864e13);a.MIN_DATE=new Date(-864e13);function ot(e){return isFinite(e.getTime())}a.dateIsValid=ot;a.NON_BREAKING_SPACE=" ";a.FIGURE_SPACE=" ";function*ct(...e){const t=e.map(n=>n[Symbol.iterator]());for(;;){const n=t.map(i=>i.next());if(n.some(({done:i})=>i))break;yield n.map(({value:i})=>i)}}var C=a.zip=ct;function*lt(e=0,t=1/0,n=1){for(let i=e;i<t;i+=n)yield i}var U=a.count=lt;function q(e,t){const n=[];for(let i=0;i<e;i++)n.push(t(i));return n}var b=a.initializedArray=q;a.countMap=q;function ut(e){return e.reduce((t,n)=>t+n,0)}a.sum=ut;function ht(e,t,n,i){const s=(i-t)/(n-e);return function(r){return(r-e)*s+t}}var T=a.makeLinear=ht;function mt(e,t,n,i){n<e&&([e,t,n,i]=[n,i,e,t]);const s=(i-t)/(n-e);return function(r){return r<=e?t:r>=n?i:(r-e)*s+t}}var I=a.makeBoundedLinear=mt;function dt(e,t){return{x:Math.sin(t)*e,y:Math.cos(t)*e}}a.polarToRectangular=dt;function*Y(e,t=[]){if(e.length==0)yield t;else for(let n=0;n<e.length;n++){const i=e[n],s=[...t,i],r=[...e.slice(0,n),...e.slice(n+1)];yield*Y(r,s)}}a.permutations=Y;var y={};Object.defineProperty(y,"__esModule",{value:!0});y.download=y.createElementFromHTML=y.getHashInfo=y.getAudioBalanceControl=y.getBlobFromCanvas=y.loadDateTimeLocal=u=y.getById=void 0;const j=a;function ft(e,t){const n=document.getElementById(e);if(!n)throw new Error("Could not find element with id "+e+".  Expected type:  "+t.name);if(n instanceof t)return n;throw new Error("Element with id "+e+" has type "+n.constructor.name+".  Expected type:  "+t.name)}var u=y.getById=ft;function pt(e,t,n="milliseconds"){let i;switch(n){case"minutes":{i=t.getSeconds()*1e3+t.getMilliseconds();break}case"seconds":{i=t.getMilliseconds();break}case"milliseconds":{i=0;break}default:throw new Error("wtf")}e.valueAsNumber=+t-t.getTimezoneOffset()*6e4-i}y.loadDateTimeLocal=pt;function gt(e){const{reject:t,resolve:n,promise:i}=(0,j.makePromise)();return e.toBlob(s=>{s?n(s):t(new Error("blob is null!"))}),i}y.getBlobFromCanvas=gt;function yt(e){const t=new AudioContext,n=t.createMediaElementSource(e),i=new StereoPannerNode(t,{pan:0});return n.connect(i).connect(t.destination),s=>{i.pan.value=s}}y.getAudioBalanceControl=yt;function Et(){const e=new Map;return/^#?(.*)$/.exec(location.hash.replace("+","%20"))[1].split("&").forEach(i=>{const s=i.split("=",2);if(s.length==2){const r=decodeURIComponent(s[0]),o=decodeURIComponent(s[1]);e.set(r,o)}}),e}y.getHashInfo=Et;function wt(e,t){var n=document.createElement("div");return n.innerHTML=e.trim(),(0,j.assertClass)(n.firstChild,t,"createElementFromHTML:")}y.createElementFromHTML=wt;function vt(e,t){var n=document.createElement("a");if(n.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(t)),n.setAttribute("download",e),document.createEvent){var i=document.createEvent("MouseEvents");i.initEvent("click",!0,!0),n.dispatchEvent(i)}else n.click()}y.download=vt;function K(e,t){const n={x:(e.x+t.x)/2,y:(e.y+t.y)/2};{const r=(t.y-e.y)/(t.x-e.x);if(e.yPrime>r&&t.yPrime>r||e.yPrime<r&&t.yPrime<r)return n}const i=(e.x*e.yPrime-e.y-t.x*t.yPrime+t.y)/(e.yPrime-t.yPrime);if(!isFinite(i))return console.log({x:i,p1:e,p2:t}),n;const s=(i-e.x)*e.yPrime+e.y;return isFinite(s)?{x:i,y:s}:(console.log({y:s,x:i,p1:e,p2:t}),n)}window.quadraticControlPoint=K;function*Mt(e,t=2){if(t<1||(t|0)!=t)throw new Error("wtf");const n=[];for(const i of e)n.push(i),n.length==t&&(yield n,n.shift())}function Tt(e){let t="";for(const[n,i]of Mt(e)){t==""&&(t=`M ${n.x},${n.y}`);const s=K(n,i);t+=` Q ${s.x},${s.y} ${i.x},${i.y}`}return t}function Pt({x0:e,frequencyMultiplier:t,yCenter:n,amplitude:i}){return{f(s){return Math.sin((s-e)*t)*i+n},fPrime(s){return Math.cos((s-e)*t)*i*t}}}function St({left:e,right:t,frequencyMultiplier:n}){if(t<=e)return[];const i=10,s=(t-e)/(2*Math.PI)*n,r=Math.max(1,Math.round(s*i));return b(r+1,T(0,e,r,t))}function At(e){const t=St(e),n=Pt(e);return t.map(s=>({x:s,y:n.f(s),yPrime:n.fPrime(s)}))}function k(e){return Tt(At(e))}window.sineWavePath=k;const F=u("currentlyCenteredPointer",SVGGeometryElement),bt=u("currentlyCenteredTranslate",SVGGElement),Gt=u("currentlyCenteredZoom",SVGGElement),O=u("zoomedInParabola",SVGPathElement);function It(e,{x:t,y:n}){const i=-2*t,s=Math.atan(i)/Math.PI*180;e.setAttribute("transform",`translate(${t}, ${n}) rotate(${s})`)}class V{static centerX=0;static centerY=0;static ratio=1;static#t;static animationIsRunning(){return this.#t!==void 0}static#e=!1;static#n=u("zoomText",SVGGElement);static#i=D(this.#n.firstElementChild,SVGTextElement);static startAnimation(){this.animationIsRunning()||this.restartAnimation()}static restartAnimation(t=0){const n=performance.now()+t,i=I(n,0,n+1e4,Math.log(300)),s=I(n+1e3,0,n+1e4,.75),r=n+13e3;this.#t=o=>{if(o>r){const c=(Math.random()+Math.random())/2*5-2.5,l=2-c*c;this.selectNewTarget({x:c,y:l}),this.restartAnimation(500)}else{const c=Math.exp(i(o));this.setNewZoom(c);const l=s(o);F.style.opacity=l.toString()}},this.setNewZoom(1),this.#e||(this.#e=!0,requestAnimationFrame(this.onAnimationFrame))}static stopAnimation(){this.#t=void 0,this.setNewZoom(1)}static onAnimationFrame(t){requestAnimationFrame(V.onAnimationFrame),V.#t?.(t)}static updateGUI(){O.setAttribute("transform",`scale(${this.ratio}) translate(${-this.centerX}, ${-this.centerY})`),bt.setAttribute("transform",`translate(${this.centerX}, ${this.centerY})`),Gt.setAttribute("transform",`scale(${1/this.ratio})`),It(F,{x:this.centerX,y:this.centerY});const t=(.15/this.ratio).toString();O.setAttribute("stroke-width",t),this.#i.textContent=`${this.ratio<10?Math.round(this.ratio*10)/10:Math.round(this.ratio)}⨉`}static selectNewTarget({x:t,y:n}){this.centerX=t,this.centerY=n,this.ratio=1,this.updateGUI()}static setNewZoom(t){this.ratio=t,this.updateGUI()}}V.selectNewTarget({x:0,y:2});V.startAnimation();class L{constructor(t,n){this.parent=t,this.type=n;let i;for(const s of t.children)if(s instanceof n){i=s;break}if(!i)throw new Error("wtf");i.remove(),this.#t=i}#t;create(){return D(this.#t.cloneNode(!0),this.type)}createParented(){return this.parent.appendChild(this.create())}}class x{constructor(t,n,i,s=6/t){this.numberOfSegments=t;const r=n===void 0?void 0:u(n,SVGGElement),o=u(i,SVGGElement);if(r){{const c=new L(r,SVGCircleElement);this.#t=b(t+1,()=>c.createParented())}{const c=new L(r,SVGLineElement);this.#e=b(t,()=>c.createParented())}}else this.#t=[],this.#e=[];{const c=new L(o,SVGCircleElement),l=new L(o,SVGLineElement);this.#n=b(t,()=>{const f=l.createParented(),m=c.createParented(),d=c.createParented();return{start:m,middle:f,end:d}})}this.resize(s)}#t;#e;#n;resize(t){const n=this.numberOfSegments+1,i=this.numberOfSegments/2,s=b(n,o=>{const c=(o-i)*t,l=c*c/2;return{x:c,y:l}});for(const[o,c]of C(s,this.#t))c.cx.baseVal.value=o.x,c.cy.baseVal.value=o.y;const r=b(s.length-1,o=>({first:s[o],second:s[o+1]}));for(const[{first:o,second:c},l]of C(r,this.#e))l.x1.baseVal.value=o.x,l.y1.baseVal.value=o.y,l.x2.baseVal.value=c.x,l.y2.baseVal.value=c.y;for(const[{first:o,second:c},{start:l,middle:f,end:m}]of C(r,this.#n)){const h=(c.y-o.y)/(c.x-o.x)/2;l.cx.baseVal.value=f.x1.baseVal.value=o.x,l.cy.baseVal.value=f.y1.baseVal.value=h,m.cx.baseVal.value=f.x2.baseVal.value=c.x,m.cy.baseVal.value=f.y2.baseVal.value=h}}}class S{constructor(t){this.toDo=t,this.callback=this.callback.bind(this),this.callback(performance.now())}#t=!1;cancel(){this.#t=!0}callback(t){this.#t||(requestAnimationFrame(this.callback),this.toDo(t))}}function _(e,t,n,i){n<e&&([e,t,n,i]=[n,i,e,t]);const s=T(e,0,n,Math.PI),r=T(1,t,-1,i);return function(o){return o<=e?t:o>=n?i:r(Math.cos(s(o)))}}new x(6,"sampleParabola","sampleDerivative",1);{const n=_(0,1,2e3,.5),i=new x(24,"animatedParabola1","animatedDerivative1");new S(s=>{const r=s%4897;i.resize(n(r))})}{const n=_(0,.5,2e3,.25),i=new x(24,"animatedParabola2","animatedDerivative2");new S(s=>{const r=s%5e3;i.resize(n(r))})}{const n=_(0,1,5e3,.05454545454545454),i=new x(150,void 0,"animatedDerivative3");new S(s=>{const r=s%7e3;i.resize(n(r))})}class $t{static#t=u("tangentLine",SVGGElement);static setPosition(t){const n=2-t*t,i=-2*t,s=Math.atan(i)/Math.PI*180;this.#t.setAttribute("transform",`translate(${t}, ${n}) rotate(${s})`)}static setRelativePosition(t){this.setPosition(t*2.25)}}new S(e=>$t.setRelativePosition(Math.sin(e/2200)));{const e=u("anyNumber",HTMLSpanElement),t=[".000001",".999997",".3125",".3̅",".16̅",".1̅4̅2̅8̅5̅7̅",".0̅9̅"," ½"," ¼"," ¾"," ⅐"," ⅑"," ⅒"," ⅓"," ⅔"," ⅕"," ⅖"," ⅗"," ⅘"," ⅙"," ⅚"," ⅛"," ⅜"," ⅝"," ⅞"];let n=1001,i="";setInterval(()=>{n++,Math.random()>.75&&(Math.random()<.8?i="":i=W(t)),e.innerText=n.toLocaleString()+i},1500)}Array.from(document.querySelectorAll("a:not([href])[id]")).forEach(e=>{const t=D(e,HTMLAnchorElement);t.innerText!=""&&(t.classList.add("self-link"),t.href="#"+t.id)});class w{element;static DEFAULT_LENGTH=10;static COMPATIBLE_STROKE_WIDTH=1.6;static RECOMMENDED_STROKE_WIDTH=.25;#t;#e=!0;#n=0;constructor(t=w.DEFAULT_LENGTH){this.element=document.createElementNS("http://www.w3.org/2000/svg","polygon"),this.#t=t,this.redraw(),this.element.setAttribute("stroke-width","0"),this.element.setAttribute("stroke-miterlimit","10")}redraw(){const t=this.#t,n=this.#e?-this.#n*27/20:t+this.#n/2;if(!isFinite(t)){this.element.setAttribute("points","");return}const i=6,s=Math.sign(t)*Math.min(1,Math.abs(t)/i);this.element.setAttribute("points",`0,${0-n} 2.4,${s*6-n} 0.6,${s*4.4-n} 0.6,${t-n} -0.6,${t-n} -0.6,${s*4.4-n} -2.4,${s*6-n} 0,${0-n}`)}get length(){return this.#t}set length(t){this.#t=t,this.redraw()}get originAtHead(){return this.#e}set originAtHead(t){this.#e=t,this.redraw()}get originAtTail(){return!this.originAtHead}set originAtTail(t){this.originAtHead=!t}setStrokeWidth(t=w.RECOMMENDED_STROKE_WIDTH){this.#n=t,this.element.setAttribute("stroke-width",t.toString()),this.redraw()}removeStroke(){this.setStrokeWidth(0)}}window.Pointer=w;{let e=function(f,m=f){const d=m.getScreenCTM(),p=new DOMMatrix([d.a,d.b,d.c,d.d,d.e,d.f]).inverse(),g=f.getBoundingClientRect(),{x:E,y:v}=p.transformPoint(g),{x:P,y:G}=p.transformPoint({x:g.right,y:g.bottom}),M=G-v,A=P-E;return new DOMRectReadOnly(E,v,A,M)},t=function(f){const m=f/1e3,d=Math.sin(m),h=Math.cos(m),p=-Math.sin(m),g={functionX:m,position:d,velocity:h,acceleration:p};n.updateDisplay(g);{const E=d/2,v=E*70+50,P=Math.asin(E);u("pendulum",SVGGElement).setAttribute("transform",`rotate(${-P/Math.PI*180})`);const M=Math.cos(P)*70+10,A=u("offsetHorizontal",SVGLineElement);A.x1.baseVal.value=A.x2.baseVal.value=v,A.y1.baseVal.value=M,r.length=E*70,o.element.setAttribute("transform",`translate(${v},${M}) rotate(90)`),o.length=h*35,c.element.setAttribute("transform",`translate(${v},${M-10+w.COMPATIBLE_STROKE_WIDTH/2}) rotate(90)`),c.length=p*35}i.updateDisplay(g),l.updateDisplay(g)};class n{constructor(){throw new Error("wtf")}static#t=Array.from(u("electron",SVGGElement).querySelectorAll("circle"));static#e=u("electricCurrentArrow",SVGPolygonElement);static#n=this.#e.getAttribute("transform");static#i=T(-1,85,1,215);static updateDisplay({functionX:m,velocity:d}){this.#t.forEach((h,p)=>{const g=this.#i(Math.sin(m-.1*p));h.cx.baseVal.value=g}),this.#e.setAttribute("transform",`${this.#n} scale(${d} 1)`)}}class i{static#t=u("threeSineWavesContainer",SVGSVGElement);static#e=u("threeSineWavesPast",SVGGElement);static#n=u("threeSineWavesFuture",SVGGElement);static#i=[["red",0],["magenta",Math.PI/2],["blue",Math.PI]].map(([m,d])=>{const h=document.createElementNS("http://www.w3.org/2000/svg","path");return u("threeSineWaves",SVGGElement).appendChild(h),h.style.strokeWidth="0.056",h.style.fill="none",h.style.stroke=m,{path:h,offset:d}});static#s=u("threeSineWavesGrid",SVGPathElement);static updateDisplay({functionX:m}){const{top:d,left:h,bottom:p,right:g}=e(this.#t);this.#e.setAttribute("transform",`translate(${h/2})`),this.#n.setAttribute("transform",`translate(${g/2})`),this.#s.setAttribute("d",`M ${h},0 ${g},0 M 0,${d} 0,${p}`),this.#i.forEach(({path:E,offset:v})=>{const P={left:h,amplitude:-1,yCenter:0,right:g,x0:-m-v,frequencyMultiplier:1},G=k(P);E.setAttribute("d",G)})}}const s=u("pendulumContainer",SVGSVGElement),r=new w;r.originAtTail=!0,s.appendChild(r.element),r.element.setAttribute("fill","red"),r.element.setAttribute("transform","translate(50,90) rotate(90)");const o=new w;o.originAtTail=!0,s.appendChild(o.element),o.element.setAttribute("fill","violet"),o.element.setAttribute("transform","translate(50,80) rotate(90)");const c=new w;c.originAtTail=!0,s.appendChild(c.element),c.element.setAttribute("fill","blue"),c.element.setAttribute("transform","translate(50,80) rotate(90)");{const f=s.querySelectorAll("text");if(f.length!=3)throw new Error("wtf");const[m,d,h]=f,p=(m.getBBox().width-h.getBBox().width)/2;d.setAttribute("transform",`translate(${50+p},98)`)}class l{static updateDisplay({position:m,functionX:d}){const h=this.#a(-m),p=this.#f(-m),g=this.#p(-m);let E=`M 50,${this.#c}`;for(let N=0;N<this.#l;N++)E+=` a ${g},${h},180,0,0,0,${2*h}`,E+=` a ${g},${p},180,0,0,0,${-2*p}`;E+=` a ${g},${h},180,0,0,${-g},${h} h ${g} v ${this.#u}`,this.#e.setAttribute("d",E);const v=this.#c+this.#l*2*(h-p)+h+this.#u;this.#n.cy.baseVal.value=v;const{left:P,right:G}=e(this.#t,this.#i),M=(this.#d-this.#m)/2,A={left:P,amplitude:-1*M,yCenter:(this.#d+this.#m)/2,right:G,x0:-d*M,frequencyMultiplier:1/M};this.#i.setAttribute("d",k(A))}static#t=u("springContainer",SVGSVGElement);static#e=u("springPath",SVGPathElement);static#n=u("springWeight",SVGCircleElement);static#i=u("springSineWave",SVGPathElement);static#s=10;static#r=15;static#a=T(-1,this.#s,1,this.#r);static#o=7.5;static#h=10;static#f=T(-1,this.#o,1,this.#h);static#p=T(-1,19,1,15);static#c=-17;static#l=7;static#u=21;static#m=this.#c+this.#l*2*(this.#s-this.#o)+this.#s+this.#u;static#d=this.#c+this.#l*2*(this.#r-this.#h)+this.#r+this.#u}new S(f=>{t(f)})}class H{static f(t){return .5*t+.5*Math.sin(t)+.25*Math.sin(2.3*t+.7)+.05*Math.cos(5.11*t-.2)}static fPrime(t){return .5+.5*Math.cos(t)+2.3*.25*Math.cos(2.3*t+.7)+5.11*.05*-Math.sin(5.11*t-.2)}static#t=u("deadReckoningEstimate",SVGPolylineElement);static#e=u("deadReckoningPointers",SVGGElement);static WIDTH=8.2;static update(t){this.#e.innerHTML="";const n=Math.ceil(1/t),i=this.WIDTH*t;let s="",r=this.f(0);for(let o=0;o<=n;o++){const c=i*o;s+=` ${c}, ${r}`;const l=this.fPrime(c),f=i*l,m=this.f(c),d=Math.atan(l)/Math.PI*180,h=new w;this.#e.appendChild(h.element),h.element.setAttribute("transform",`translate(${c} ${m}) scale(0.05) rotate(${d+180})`);const p=new w;this.#e.appendChild(p.element),p.element.setAttribute("transform",`translate(${c} ${r}) scale(0.05) rotate(${d})`),o%2&&(h.element.style.opacity=p.element.style.opacity="0.333"),r+=f}this.#t.setAttribute("points",s)}static startDemo(){const r=I(500,.4,20500,.025);new S(o=>{const c=o%22e3,l=r(c);this.update(l)})}}H.startDemo();class Ct{constructor(){throw new Error("wtf")}static#t=[...[-3,-2,-1,0,1].map(t=>-Math.sqrt(2-t)),...[2,1,0,-1,-2,-3].map(t=>Math.sqrt(2-t))];static#e=0;static#n=()=>this.#t[this.#e];static pickNewDestination(){let t=Math.floor(Math.random()*(this.#t.length-1));t==this.#e&&(t=this.#t.length-1);const n=performance.now(),i=250*(Math.abs(this.#e-t)+1),s=n+i;return this.#n=_(n,this.#t[this.#e],s,this.#t[t]),this.#e=t,i}static#i=u("sampleGraph",SVGGElement);static#s=u("sampleGraphInput",SVGTextElement);static#r=u("sampleGraphOutput",SVGTextElement);static#a=new w;static#o=new Intl.NumberFormat("en-US",{minimumFractionDigits:3});static startDemo(){const t=this.#a.element;this.#i.appendChild(t),this.setX(this.#t[this.#e]),t.style.fill="gold",this.#a.setStrokeWidth(.5),t.style.stroke="rgb(149, 69, 53)",new S(n=>this.setX(this.#n(n))),(async()=>{for(;;){const n=this.pickNewDestination();await $(n+2e3)}})()}static setX(t){const n=o=>{const c=this.#o.format(o),l=/^(.*)\.000$/.exec(c);if(l)return l[1]=="-0"?"=0":`=${l[1]}`;switch(c){case"-2.236":return"=-√5̅";case"2.236":return"=√5̅";case"-1.732":return"=-√3̅";case"1.732":return"=√3̅";case"-1.414":return"=-√2̅";case"1.414":return"=√2̅"}return`≈${c}`};this.#s.innerHTML="x"+n(t);const i=2-t*t;this.#r.innerHTML="y"+n(i);const s=-2*t,r=Math.atan(s)/Math.PI*180;this.#a.element.setAttribute("transform",`translate(${t}, ${i}) scale(0.075) rotate(${r})`)}}Ct.startDemo();(async()=>{const e=Array.from(u("integralSquares",SVGGElement).children).map(n=>D(n,SVGTextElement)),t=I(0,1e3,e.length,100);for(;;){e.forEach(n=>n.style.display="none"),await $(2e3);for(const[n,i]of C(e,U()))n.style.display="",await $(t(i));await $(3e3)}})();class Vt{static#t=u("positiveUnderTheCurve",SVGGElement);static#e=u("negativeUnderTheCurve",SVGGElement);static update(t){this.#t.innerHTML="",this.#e.innerHTML="";const n=1/t,i=H.WIDTH*n;t=Math.ceil(t);for(let s=0;s<=t;s++){const r=i*s,o=H.fPrime(r);if(o!=0){const c=i*(s+1),l=document.createElementNS("http://www.w3.org/2000/svg","polygon");l.setAttribute("points",`${r},0 ${r},${o} ${c},${o} ${c},0`),(o>0?this.#t:this.#e).appendChild(l)}}}static startDemo(){const r=I(500,0,30500,1),o=l=>{const m=2*Math.PI*4;return l-Math.sin(l*m)/m},c=T(0,2.5,1,164);new S(l=>{const f=l%34e3,m=c(o(r(f)));this.update(m)})}}Vt.startDemo();
