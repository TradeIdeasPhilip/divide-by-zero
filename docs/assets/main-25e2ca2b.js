(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();var a={};Object.defineProperty(a,"__esModule",{value:!0});a.permutations=a.polarToRectangular=I=a.makeBoundedLinear=M=a.makeLinear=a.sum=a.countMap=G=a.initializedArray=q=a.count=D=a.zip=a.FIGURE_SPACE=a.NON_BREAKING_SPACE=a.dateIsValid=a.MIN_DATE=a.MAX_DATE=a.makePromise=a.filterMap=U=a.pick=a.pickAny=a.csvStringToArray=a.parseTimeT=a.parseIntX=a.parseFloatX=a.getAttribute=a.followPath=a.parseXml=a.testXml=V=a.sleep=x=a.assertClass=void 0;function Q(e,t,n="Assertion Failed."){const i=s=>{throw new Error(`${n}  Expected type:  ${t.name}.  Found type:  ${s}.`)};if(e===null)i("null");else if(typeof e!="object")i(typeof e);else if(!(e instanceof t))i(e.constructor.name);else return e;throw new Error("wtf")}var x=a.assertClass=Q;function J(e){return new Promise(t=>setTimeout(t,e))}var V=a.sleep=J;function X(e){const n=new DOMParser().parseFromString(e,"application/xml");for(const i of Array.from(n.querySelectorAll("parsererror")))if(i instanceof HTMLElement)return{error:i};return{parsed:n}}a.testXml=X;function tt(e){if(e!==void 0)return X(e)?.parsed?.documentElement}a.parseXml=tt;function z(e,...t){for(const n of t){if(e===void 0)return;if(typeof n=="number")e=e.children[n];else{const i=e.getElementsByTagName(n);if(i.length!=1)return;e=i[0]}}return e}a.followPath=z;function et(e,t,...n){if(t=z(t,...n),t!==void 0&&t.hasAttribute(e))return t.getAttribute(e)??void 0}a.getAttribute=et;function B(e){if(e==null)return;const t=parseFloat(e);if(isFinite(t))return t}a.parseFloatX=B;function W(e){const t=B(e);if(t!==void 0)return t>Number.MAX_SAFE_INTEGER||t<Number.MIN_SAFE_INTEGER||t!=Math.floor(t)?void 0:t}a.parseIntX=W;function nt(e){if(typeof e=="string"&&(e=W(e)),e!=null&&!(e<=0))return new Date(e*1e3)}a.parseTimeT=nt;const it=e=>{const t=/(,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^,\r\n]*))/gi,n=[[]];let i;for(;i=t.exec(e);)i[1].length&&i[1]!==","&&n.push([]),n[n.length-1].push(i[2]!==void 0?i[2].replace(/""/g,'"'):i[3]);return n};a.csvStringToArray=it;function st(e){const t=e.values().next();if(!t.done)return t.value}a.pickAny=st;function rt(e){return e[Math.random()*e.length|0]}var U=a.pick=rt;function ot(e,t){const n=[];return e.forEach((i,s)=>{const r=t(i,s);r!==void 0&&n.push(r)}),n}a.filterMap=ot;function at(){let e,t;return{promise:new Promise((i,s)=>{e=i,t=s}),resolve:e,reject:t}}a.makePromise=at;a.MAX_DATE=new Date(864e13);a.MIN_DATE=new Date(-864e13);function ct(e){return isFinite(e.getTime())}a.dateIsValid=ct;a.NON_BREAKING_SPACE=" ";a.FIGURE_SPACE=" ";function*lt(...e){const t=e.map(n=>n[Symbol.iterator]());for(;;){const n=t.map(i=>i.next());if(n.some(({done:i})=>i))break;yield n.map(({value:i})=>i)}}var D=a.zip=lt;function*ut(e=0,t=1/0,n=1){for(let i=e;i<t;i+=n)yield i}var q=a.count=ut;function Y(e,t){const n=[];for(let i=0;i<e;i++)n.push(t(i));return n}var G=a.initializedArray=Y;a.countMap=Y;function ht(e){return e.reduce((t,n)=>t+n,0)}a.sum=ht;function mt(e,t,n,i){const s=(i-t)/(n-e);return function(r){return(r-e)*s+t}}var M=a.makeLinear=mt;function dt(e,t,n,i){n<e&&([e,t,n,i]=[n,i,e,t]);const s=(i-t)/(n-e);return function(r){return r<=e?t:r>=n?i:(r-e)*s+t}}var I=a.makeBoundedLinear=dt;function ft(e,t){return{x:Math.sin(t)*e,y:Math.cos(t)*e}}a.polarToRectangular=ft;function*j(e,t=[]){if(e.length==0)yield t;else for(let n=0;n<e.length;n++){const i=e[n],s=[...t,i],r=[...e.slice(0,n),...e.slice(n+1)];yield*j(r,s)}}a.permutations=j;var E={};Object.defineProperty(E,"__esModule",{value:!0});E.download=E.createElementFromHTML=E.getHashInfo=E.getAudioBalanceControl=E.getBlobFromCanvas=E.loadDateTimeLocal=d=E.getById=void 0;const K=a;function pt(e,t){const n=document.getElementById(e);if(!n)throw new Error("Could not find element with id "+e+".  Expected type:  "+t.name);if(n instanceof t)return n;throw new Error("Element with id "+e+" has type "+n.constructor.name+".  Expected type:  "+t.name)}var d=E.getById=pt;function yt(e,t,n="milliseconds"){let i;switch(n){case"minutes":{i=t.getSeconds()*1e3+t.getMilliseconds();break}case"seconds":{i=t.getMilliseconds();break}case"milliseconds":{i=0;break}default:throw new Error("wtf")}e.valueAsNumber=+t-t.getTimezoneOffset()*6e4-i}E.loadDateTimeLocal=yt;function gt(e){const{reject:t,resolve:n,promise:i}=(0,K.makePromise)();return e.toBlob(s=>{s?n(s):t(new Error("blob is null!"))}),i}E.getBlobFromCanvas=gt;function Et(e){const t=new AudioContext,n=t.createMediaElementSource(e),i=new StereoPannerNode(t,{pan:0});return n.connect(i).connect(t.destination),s=>{i.pan.value=s}}E.getAudioBalanceControl=Et;function wt(){const e=new Map;return/^#?(.*)$/.exec(location.hash.replace("+","%20"))[1].split("&").forEach(i=>{const s=i.split("=",2);if(s.length==2){const r=decodeURIComponent(s[0]),c=decodeURIComponent(s[1]);e.set(r,c)}}),e}E.getHashInfo=wt;function vt(e,t){var n=document.createElement("div");return n.innerHTML=e.trim(),(0,K.assertClass)(n.firstChild,t,"createElementFromHTML:")}E.createElementFromHTML=vt;function Tt(e,t){var n=document.createElement("a");if(n.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(t)),n.setAttribute("download",e),document.createEvent){var i=document.createEvent("MouseEvents");i.initEvent("click",!0,!0),n.dispatchEvent(i)}else n.click()}E.download=Tt;function Z(e,t){const n={x:(e.x+t.x)/2,y:(e.y+t.y)/2};{const r=(t.y-e.y)/(t.x-e.x);if(e.yPrime>r&&t.yPrime>r||e.yPrime<r&&t.yPrime<r)return n}const i=(e.x*e.yPrime-e.y-t.x*t.yPrime+t.y)/(e.yPrime-t.yPrime);if(!isFinite(i))return console.log({x:i,p1:e,p2:t}),n;const s=(i-e.x)*e.yPrime+e.y;return isFinite(s)?{x:i,y:s}:(console.log({y:s,x:i,p1:e,p2:t}),n)}window.quadraticControlPoint=Z;function*Mt(e,t=2){if(t<1||(t|0)!=t)throw new Error("wtf");const n=[];for(const i of e)n.push(i),n.length==t&&(yield n,n.shift())}function Pt(e){let t="";for(const[n,i]of Mt(e)){t==""&&(t=`M ${n.x},${n.y}`);const s=Z(n,i);t+=` Q ${s.x},${s.y} ${i.x},${i.y}`}return t}function St({x0:e,frequencyMultiplier:t,yCenter:n,amplitude:i}){return{f(s){return Math.sin((s-e)*t)*i+n},fPrime(s){return Math.cos((s-e)*t)*i*t}}}function At({left:e,right:t,frequencyMultiplier:n}){if(t<=e)return[];const i=10,s=(t-e)/(2*Math.PI)*n,r=Math.max(1,Math.round(s*i));return G(r+1,M(0,e,r,t))}function bt(e){const t=At(e),n=St(e);return t.map(s=>({x:s,y:n.f(s),yPrime:n.fPrime(s)}))}function H(e){return Pt(bt(e))}window.sineWavePath=H;const O=d("currentlyCenteredPointer",SVGGeometryElement),Gt=d("currentlyCenteredTranslate",SVGGElement),$t=d("currentlyCenteredZoom",SVGGElement),R=d("zoomedInParabola",SVGPathElement);function It(e,{x:t,y:n}){const i=-2*t,s=Math.atan(i)/Math.PI*180;e.setAttribute("transform",`translate(${t}, ${n}) rotate(${s})`)}class L{static centerX=0;static centerY=0;static ratio=1;static#t;static animationIsRunning(){return this.#t!==void 0}static#e=!1;static#n=d("zoomText",SVGGElement);static#i=x(this.#n.firstElementChild,SVGTextElement);static startAnimation(){this.animationIsRunning()||this.restartAnimation()}static restartAnimation(t=0){const n=performance.now()+t,i=I(n,0,n+1e4,Math.log(300)),s=I(n+1e3,0,n+1e4,.75),r=n+13e3;this.#t=c=>{if(c>r){const o=(Math.random()+Math.random())/2*5-2.5,u=2-o*o;this.selectNewTarget({x:o,y:u}),this.restartAnimation(500)}else{const o=Math.exp(i(c));this.setNewZoom(o);const u=s(c);O.style.opacity=u.toString()}},this.setNewZoom(1),this.#e||(this.#e=!0,requestAnimationFrame(this.onAnimationFrame))}static stopAnimation(){this.#t=void 0,this.setNewZoom(1)}static onAnimationFrame(t){requestAnimationFrame(L.onAnimationFrame),L.#t?.(t)}static updateGUI(){R.setAttribute("transform",`scale(${this.ratio}) translate(${-this.centerX}, ${-this.centerY})`),Gt.setAttribute("transform",`translate(${this.centerX}, ${this.centerY})`),$t.setAttribute("transform",`scale(${1/this.ratio})`),It(O,{x:this.centerX,y:this.centerY});const t=(.15/this.ratio).toString();R.setAttribute("stroke-width",t),this.#i.textContent=`${this.ratio<10?Math.round(this.ratio*10)/10:Math.round(this.ratio)}⨉`}static selectNewTarget({x:t,y:n}){this.centerX=t,this.centerY=n,this.ratio=1,this.updateGUI()}static setNewZoom(t){this.ratio=t,this.updateGUI()}}L.selectNewTarget({x:0,y:2});L.startAnimation();class N{constructor(t,n){this.parent=t,this.type=n;let i;for(const s of t.children)if(s instanceof n){i=s;break}if(!i)throw new Error("wtf");i.remove(),this.#t=i}#t;create(){return x(this.#t.cloneNode(!0),this.type)}createParented(){return this.parent.appendChild(this.create())}}class k{constructor(t,n,i,s=6/t){this.numberOfSegments=t;const r=n===void 0?void 0:d(n,SVGGElement),c=d(i,SVGGElement);if(r){{const o=new N(r,SVGCircleElement);this.#t=G(t+1,()=>o.createParented())}{const o=new N(r,SVGLineElement);this.#e=G(t,()=>o.createParented())}}else this.#t=[],this.#e=[];{const o=new N(c,SVGCircleElement),u=new N(c,SVGLineElement);this.#n=G(t,()=>{const h=u.createParented(),m=o.createParented(),l=o.createParented();return{start:m,middle:h,end:l}})}this.resize(s)}#t;#e;#n;resize(t){const n=this.numberOfSegments+1,i=this.numberOfSegments/2,s=G(n,c=>{const o=(c-i)*t,u=o*o/2;return{x:o,y:u}});for(const[c,o]of D(s,this.#t))o.cx.baseVal.value=c.x,o.cy.baseVal.value=c.y;const r=G(s.length-1,c=>({first:s[c],second:s[c+1]}));for(const[{first:c,second:o},u]of D(r,this.#e))u.x1.baseVal.value=c.x,u.y1.baseVal.value=c.y,u.x2.baseVal.value=o.x,u.y2.baseVal.value=o.y;for(const[{first:c,second:o},{start:u,middle:h,end:m}]of D(r,this.#n)){const f=(o.y-c.y)/(o.x-c.x)/2;u.cx.baseVal.value=h.x1.baseVal.value=c.x,u.cy.baseVal.value=h.y1.baseVal.value=f,m.cx.baseVal.value=h.x2.baseVal.value=o.x,m.cy.baseVal.value=h.y2.baseVal.value=f}}}class A{constructor(t){this.toDo=t,this.callback=this.callback.bind(this),this.callback(performance.now())}#t=!1;cancel(){this.#t=!0}callback(t){this.#t||(requestAnimationFrame(this.callback),this.toDo(t))}}function _(e,t,n,i){n<e&&([e,t,n,i]=[n,i,e,t]);const s=M(e,0,n,Math.PI),r=M(1,t,-1,i);return function(c){return c<=e?t:c>=n?i:r(Math.cos(s(c)))}}new k(6,"sampleParabola","sampleDerivative",1);{const n=_(0,1,2e3,.5),i=new k(24,"animatedParabola1","animatedDerivative1");new A(s=>{const r=s%4897;i.resize(n(r))})}{const n=_(0,.5,2e3,.25),i=new k(24,"animatedParabola2","animatedDerivative2");new A(s=>{const r=s%5e3;i.resize(n(r))})}{const n=_(0,1,5e3,.05454545454545454),i=new k(150,void 0,"animatedDerivative3");new A(s=>{const r=s%7e3;i.resize(n(r))})}class Ct{static#t=d("tangentLine",SVGGElement);static setPosition(t){const n=2-t*t,i=-2*t,s=Math.atan(i)/Math.PI*180;this.#t.setAttribute("transform",`translate(${t}, ${n}) rotate(${s})`)}static setRelativePosition(t){this.setPosition(t*2.25)}}new A(e=>Ct.setRelativePosition(Math.sin(e/2200)));{const e=d("anyNumber",HTMLSpanElement),t=[".000001",".999997",".3125",".3̅",".16̅",".1̅4̅2̅8̅5̅7̅",".0̅9̅"," ½"," ¼"," ¾"," ⅐"," ⅑"," ⅒"," ⅓"," ⅔"," ⅕"," ⅖"," ⅗"," ⅘"," ⅙"," ⅚"," ⅛"," ⅜"," ⅝"," ⅞"];let n=1001,i="";setInterval(()=>{n++,Math.random()>.75&&(Math.random()<.7?i="":i=U(t)),e.innerText=n.toLocaleString()+i},1500)}Array.from(document.querySelectorAll("a:not([href])[id]")).forEach(e=>{const t=x(e,HTMLAnchorElement);t.innerText!=""&&(t.classList.add("self-link"),t.href="#"+t.id)});class v{element;static DEFAULT_LENGTH=10;static COMPATIBLE_STROKE_WIDTH=1.6;static RECOMMENDED_STROKE_WIDTH=.25;#t;#e=!0;#n=0;constructor(t=v.DEFAULT_LENGTH){this.element=document.createElementNS("http://www.w3.org/2000/svg","polygon"),this.#t=t,this.redraw(),this.element.setAttribute("stroke-width","0"),this.element.setAttribute("stroke-miterlimit","10")}redraw(){const t=this.#t,n=this.#e?-this.#n*27/20:t+this.#n/2;if(!isFinite(t)){this.element.setAttribute("points","");return}const i=6,s=Math.sign(t)*Math.min(1,Math.abs(t)/i);this.element.setAttribute("points",`0,${0-n} 2.4,${s*6-n} 0.6,${s*4.4-n} 0.6,${t-n} -0.6,${t-n} -0.6,${s*4.4-n} -2.4,${s*6-n} 0,${0-n}`)}get length(){return this.#t}set length(t){this.#t=t,this.redraw()}get originAtHead(){return this.#e}set originAtHead(t){this.#e=t,this.redraw()}get originAtTail(){return!this.originAtHead}set originAtTail(t){this.originAtHead=!t}setStrokeWidth(t=v.RECOMMENDED_STROKE_WIDTH){this.#n=t,this.element.setAttribute("stroke-width",t.toString()),this.redraw()}removeStroke(){this.setStrokeWidth(0)}}window.Pointer=v;{let e=function(h,m=h){const l=m.getScreenCTM(),y=new DOMMatrix([l.a,l.b,l.c,l.d,l.e,l.f]).inverse(),p=h.getBoundingClientRect(),{x:g,y:w}=y.transformPoint(p),{x:S,y:$}=y.transformPoint({x:p.right,y:p.bottom}),b=$-w,T=S-g;return new DOMRectReadOnly(g,w,T,b)},t=function(h){const m=h/1e3,l=Math.sin(m),f=Math.cos(m),y=-Math.sin(m),p={functionX:m,position:l,velocity:f,acceleration:y};n.updateDisplay(p);{const g=l/2,w=g*70+50,S=Math.asin(g);d("pendulum",SVGGElement).setAttribute("transform",`rotate(${-S/Math.PI*180})`);const b=Math.cos(S)*70+10,T=d("offsetHorizontal",SVGLineElement);T.x1.baseVal.value=T.x2.baseVal.value=w,T.y1.baseVal.value=b,r.length=g*70,c.element.setAttribute("transform",`translate(${w},${b}) rotate(90)`),c.length=f*35,o.element.setAttribute("transform",`translate(${w},${b-10+v.COMPATIBLE_STROKE_WIDTH/2}) rotate(90)`),o.length=y*35}i.updateDisplay(p),u.updateDisplay(p)};class n{constructor(){throw new Error("wtf")}static#t=Array.from(d("electron",SVGGElement).querySelectorAll("circle"));static#e=d("electricCurrentArrow",SVGPolygonElement);static#n=this.#e.getAttribute("transform");static#i=M(-1,85,1,215);static updateDisplay({functionX:m,velocity:l}){this.#t.forEach((f,y)=>{const p=this.#i(Math.sin(m-.1*y));f.cx.baseVal.value=p}),this.#e.setAttribute("transform",`${this.#n} scale(${l} 1)`)}}class i{static#t=d("threeSineWavesContainer",SVGSVGElement);static#e=d("threeSineWavesPast",SVGGElement);static#n=d("threeSineWavesFuture",SVGGElement);static#i=[["red",0],["magenta",Math.PI/2],["blue",Math.PI]].map(([m,l])=>{const f=document.createElementNS("http://www.w3.org/2000/svg","path");return d("threeSineWaves",SVGGElement).appendChild(f),f.style.strokeWidth="0.056",f.style.fill="none",f.style.stroke=m,{path:f,offset:l}});static#r=d("threeSineWavesGrid",SVGPathElement);static updateDisplay({functionX:m}){const{top:l,left:f,bottom:y,right:p}=e(this.#t);this.#e.setAttribute("transform",`translate(${f/2})`),this.#n.setAttribute("transform",`translate(${p/2})`),this.#r.setAttribute("d",`M ${f},0 ${p},0 M 0,${l} 0,${y}`),this.#i.forEach(({path:g,offset:w})=>{const S={left:f,amplitude:-1,yCenter:0,right:p,x0:-m-w,frequencyMultiplier:1},$=H(S);g.setAttribute("d",$)})}}const s=d("pendulumContainer",SVGSVGElement),r=new v;r.originAtTail=!0,s.appendChild(r.element),r.element.setAttribute("fill","red"),r.element.setAttribute("transform","translate(50,90) rotate(90)");const c=new v;c.originAtTail=!0,s.appendChild(c.element),c.element.setAttribute("fill","violet"),c.element.setAttribute("transform","translate(50,80) rotate(90)");const o=new v;o.originAtTail=!0,s.appendChild(o.element),o.element.setAttribute("fill","blue"),o.element.setAttribute("transform","translate(50,80) rotate(90)");{const h=s.querySelectorAll("text");if(h.length!=3)throw new Error("wtf");const[m,l,f]=h,y=(m.getBBox().width-f.getBBox().width)/2;l.setAttribute("transform",`translate(${50+y},98)`)}class u{static updateDisplay({position:m,functionX:l}){const f=this.#u(-m),y=this.#p(-m),p=this.#y(-m);let g=`M 50,${this.#a}`;for(let C=0;C<this.#c;C++)g+=` a ${p},${f},180,0,0,0,${2*f}`,g+=` a ${p},${y},180,0,0,0,${-2*y}`;g+=` a ${p},${f},180,0,0,${-p},${f} h ${p} v ${this.#l}`,this.#e.setAttribute("d",g);const w=2*(f-y);g=`M ${50-p},${this.#a+f}`;for(let C=0;C<this.#c;C++)g+=` a ${f} ${p} 90 0 0 ${p} ${f}`,g+=` a ${y},${p},90,0,0,${p},${-y}`,g+=` m ${-p*2},${w/2}`;this.#n.setAttribute("d",g);const S=this.#a+this.#c*w+f+this.#l;this.#i.cy.baseVal.value=S;const{left:$,right:b}=e(this.#t,this.#r),T=(this.#f-this.#d)/2,F={left:$,amplitude:-1*T,yCenter:(this.#f+this.#d)/2,right:b,x0:-l*T,frequencyMultiplier:1/T};this.#r.setAttribute("d",H(F))}static#t=d("springContainer",SVGSVGElement);static#e=d("springPath",SVGPathElement);static#n=d("springOverlay",SVGPathElement);static#i=d("springWeight",SVGCircleElement);static#r=d("springSineWave",SVGPathElement);static#o=10;static#s=15;static#u=M(-1,this.#o,1,this.#s);static#h=7.5;static#m=10;static#p=M(-1,this.#h,1,this.#m);static#y=M(-1,19,1,15);static#a=-17;static#c=7;static#l=21;static#d=this.#a+this.#c*2*(this.#o-this.#h)+this.#o+this.#l;static#f=this.#a+this.#c*2*(this.#s-this.#m)+this.#s+this.#l}new A(h=>{t(h)})}class P{static f(t){return .5*t+.5*Math.sin(t)+.25*Math.sin(2.3*t+.7)+.05*Math.cos(5.11*t-.2)}static fPrime(t){return .5+.5*Math.cos(t)+2.3*.25*Math.cos(2.3*t+.7)+5.11*.05*-Math.sin(5.11*t-.2)}#t;#e;constructor(t){this.#t=d("deadReckoningEstimate"+t,SVGPolylineElement),this.#e=d("deadReckoningPointers"+t,SVGGElement)}static WIDTH=8.2;update(t){this.#e.innerHTML="";const n=Math.ceil(1/t),i=P.WIDTH*t;let s="",r=P.f(0);for(let c=0;c<=n;c++){const o=i*c;s+=` ${o}, ${r}`;const u=P.fPrime(o),h=i*u,m=P.f(o),l=Math.atan(u)/Math.PI*180,f=new v;this.#e.appendChild(f.element),f.element.setAttribute("transform",`translate(${o} ${m}) scale(0.05) rotate(${l+180})`);const y=new v;this.#e.appendChild(y.element),y.element.setAttribute("transform",`translate(${o} ${r}) scale(0.05) rotate(${l})`),c%2&&(f.element.style.opacity=y.element.style.opacity="0.333"),r+=h}this.#t.setAttribute("points",s)}static startDemo(){const r=I(500,.4,20500,.025),c=new this("");new A(o=>{const u=o%22e3,h=r(u);c.update(h)})}}P.startDemo();class Vt{constructor(){throw new Error("wtf")}static#t=[...[-3,-2,-1,0,1].map(t=>-Math.sqrt(2-t)),...[2,1,0,-1,-2,-3].map(t=>Math.sqrt(2-t))];static#e=0;static#n=()=>this.#t[this.#e];static pickNewDestination(){let t=Math.floor(Math.random()*(this.#t.length-1));t==this.#e&&(t=this.#t.length-1);const n=performance.now(),i=250*(Math.abs(this.#e-t)+1),s=n+i;return this.#n=_(n,this.#t[this.#e],s,this.#t[t]),this.#e=t,i}static#i=d("sampleGraph",SVGGElement);static#r=d("sampleGraphInput",SVGTextElement);static#o=d("sampleGraphOutput",SVGTextElement);static#s=new v;static#u=new Intl.NumberFormat("en-US",{minimumFractionDigits:3});static startDemo(){const t=this.#s.element;this.#i.appendChild(t),this.setX(this.#t[this.#e]),t.style.fill="gold",this.#s.setStrokeWidth(.5),t.style.stroke="rgb(149, 69, 53)",new A(n=>this.setX(this.#n(n))),(async()=>{for(;;){const n=this.pickNewDestination();await V(n+2e3)}})()}static setX(t){const n=c=>{const o=this.#u.format(c),u=/^(.*)\.000$/.exec(o);if(u)return u[1]=="-0"?"=0":`=${u[1]}`;switch(o){case"-2.236":return"=-√5̅";case"2.236":return"=√5̅";case"-1.732":return"=-√3̅";case"1.732":return"=√3̅";case"-1.414":return"=-√2̅";case"1.414":return"=√2̅"}return`≈${o}`};this.#r.innerHTML="x"+n(t);const i=2-t*t;this.#o.innerHTML="y"+n(i);const s=-2*t,r=Math.atan(s)/Math.PI*180;this.#s.element.setAttribute("transform",`translate(${t}, ${i}) scale(0.075) rotate(${r})`)}}Vt.startDemo();(async()=>{const e=Array.from(d("integralSquares",SVGGElement).children).map(n=>x(n,SVGTextElement)),t=I(0,1e3,e.length,100);for(;;){e.forEach(n=>n.style.display="none"),await V(2e3);for(const[n,i]of D(e,q()))n.style.display="",await V(t(i));await V(3e3)}})();class Dt{static#t=d("positiveUnderTheCurve",SVGGElement);static#e=d("negativeUnderTheCurve",SVGGElement);static update(t){this.#t.innerHTML="",this.#e.innerHTML="";const n=1/t,i=P.WIDTH*n;t=Math.ceil(t);for(let s=0;s<=t;s++){const r=i*s,c=P.fPrime(r);if(c!=0){const o=i*(s+1),u=document.createElementNS("http://www.w3.org/2000/svg","polygon");u.setAttribute("points",`${r},0 ${r},${c} ${o},${c} ${o},0`),(c>0?this.#t:this.#e).appendChild(u)}}}static startDemo(){const r=I(500,0,30500,1),c=h=>{const l=2*Math.PI*4;return h-Math.sin(h*l)/l},o=M(0,2.5,1,164),u=new P("1");new A(h=>{const m=h%34e3,l=o(c(r(m)));this.update(l),u.update(1/l)})}}Dt.startDemo();{let e=function(){[o,u,h,m].forEach(l=>l.style.opacity="")},t=function(){[u,h,m].forEach(l=>l.style.opacity="0.2"),o.style.opacity="0.1"},n=function(){[u,h,m].forEach(l=>l.style.opacity="0.2"),o.style.opacity="0.1"},i=function(){[u,h,m].forEach(l=>l.style.opacity="0.2"),o.style.opacity=""},s=function(){[u,m].forEach(l=>l.style.opacity="0.2"),o.style.opacity="",h.style.opacity=""},r=function(){[u].forEach(l=>l.style.opacity="0.2"),o.style.opacity="0.1",[h,m].forEach(l=>l.style.opacity="")},c=function(){o.style.opacity="0.1",[h,m,u].forEach(l=>l.style.opacity="")};const o=d("deadReckoningPointers1",SVGGraphicsElement),u=d("deadReckoningEstimate1",SVGGraphicsElement),h=d("negativeUnderTheCurve",SVGGraphicsElement),m=d("positiveUnderTheCurve",SVGGraphicsElement);console.log("forVideo.…"),window.forVideo={deadReckoningPointers1:o,deadReckoningEstimate1:u,negativeUnderTheCurve:h,positiveUnderTheCurve:m,FToC1:e,FToC2:t,VtD1:n,VtD2:i,VtD3:s,IVtAutC1:r,IVtAutC2:c}}
