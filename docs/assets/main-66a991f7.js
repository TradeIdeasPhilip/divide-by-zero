(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();var i={};Object.defineProperty(i,"__esModule",{value:!0});i.permutations=i.polarToRectangular=R=i.makeBoundedLinear=T=i.makeLinear=i.sum=i.countMap=M=i.initializedArray=i.count=F=i.zip=i.FIGURE_SPACE=i.NON_BREAKING_SPACE=i.dateIsValid=i.MIN_DATE=i.MAX_DATE=i.makePromise=i.filterMap=i.pick=i.pickAny=i.csvStringToArray=i.parseTimeT=i.parseIntX=i.parseFloatX=i.getAttribute=i.followPath=i.parseXml=i.testXml=i.sleep=z=i.assertClass=void 0;function ue(t,e,n="Assertion Failed."){const r=o=>{throw new Error(`${n}  Expected type:  ${e.name}.  Found type:  ${o}.`)};if(t===null)r("null");else if(typeof t!="object")r(typeof t);else if(!(t instanceof e))r(t.constructor.name);else return t;throw new Error("wtf")}var z=i.assertClass=ue;function de(t){return new Promise(e=>setTimeout(e,t))}i.sleep=de;function j(t){const n=new DOMParser().parseFromString(t,"application/xml");for(const r of Array.from(n.querySelectorAll("parsererror")))if(r instanceof HTMLElement)return{error:r};return{parsed:n}}i.testXml=j;function me(t){if(t!==void 0)return j(t)?.parsed?.documentElement}i.parseXml=me;function K(t,...e){for(const n of e){if(t===void 0)return;if(typeof n=="number")t=t.children[n];else{const r=t.getElementsByTagName(n);if(r.length!=1)return;t=r[0]}}return t}i.followPath=K;function fe(t,e,...n){if(e=K(e,...n),e!==void 0&&e.hasAttribute(t))return e.getAttribute(t)??void 0}i.getAttribute=fe;function Q(t){if(t==null)return;const e=parseFloat(t);if(isFinite(e))return e}i.parseFloatX=Q;function J(t){const e=Q(t);if(e!==void 0)return e>Number.MAX_SAFE_INTEGER||e<Number.MIN_SAFE_INTEGER||e!=Math.floor(e)?void 0:e}i.parseIntX=J;function he(t){if(typeof t=="string"&&(t=J(t)),t!=null&&!(t<=0))return new Date(t*1e3)}i.parseTimeT=he;const pe=t=>{const e=/(,|\r?\n|\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^,\r\n]*))/gi,n=[[]];let r;for(;r=e.exec(t);)r[1].length&&r[1]!==","&&n.push([]),n[n.length-1].push(r[2]!==void 0?r[2].replace(/""/g,'"'):r[3]);return n};i.csvStringToArray=pe;function ge(t){const e=t.values().next();if(!e.done)return e.value}i.pickAny=ge;function ye(t){return t[Math.random()*t.length|0]}i.pick=ye;function ve(t,e){const n=[];return t.forEach((r,o)=>{const s=e(r,o);s!==void 0&&n.push(s)}),n}i.filterMap=ve;function Ee(){let t,e;return{promise:new Promise((r,o)=>{t=r,e=o}),resolve:t,reject:e}}i.makePromise=Ee;i.MAX_DATE=new Date(864e13);i.MIN_DATE=new Date(-864e13);function we(t){return isFinite(t.getTime())}i.dateIsValid=we;i.NON_BREAKING_SPACE=" ";i.FIGURE_SPACE=" ";function*Ae(...t){const e=t.map(n=>n[Symbol.iterator]());for(;;){const n=e.map(r=>r.next());if(n.some(({done:r})=>r))break;yield n.map(({value:r})=>r)}}var F=i.zip=Ae;function*Pe(t=0,e=1/0,n=1){for(let r=t;r<e;r+=n)yield r}i.count=Pe;function ee(t,e){const n=[];for(let r=0;r<t;r++)n.push(e(r));return n}var M=i.initializedArray=ee;i.countMap=ee;function be(t){return t.reduce((e,n)=>e+n,0)}i.sum=be;function Me(t,e,n,r){const o=(r-e)/(n-t);return function(s){return(s-t)*o+e}}var T=i.makeLinear=Me;function Se(t,e,n,r){n<t&&([t,e,n,r]=[n,r,t,e]);const o=(r-e)/(n-t);return function(s){return s<=t?e:s>=n?r:(s-t)*o+e}}var R=i.makeBoundedLinear=Se;function Te(t,e){return{x:Math.sin(e)*t,y:Math.cos(e)*t}}i.polarToRectangular=Te;function*te(t,e=[]){if(t.length==0)yield e;else for(let n=0;n<t.length;n++){const r=t[n],o=[...e,r],s=[...t.slice(0,n),...t.slice(n+1)];yield*te(s,o)}}i.permutations=te;var d={};Object.defineProperty(d,"__esModule",{value:!0});d.download=d.createElementFromHTML=d.getHashInfo=d.getAudioBalanceControl=d.getBlobFromCanvas=d.loadDateTimeLocal=l=d.getById=void 0;const ne=i;function Le(t,e){const n=document.getElementById(t);if(!n)throw new Error("Could not find element with id "+t+".  Expected type:  "+e.name);if(n instanceof e)return n;throw new Error("Element with id "+t+" has type "+n.constructor.name+".  Expected type:  "+e.name)}var l=d.getById=Le;function Ce(t,e,n="milliseconds"){let r;switch(n){case"minutes":{r=e.getSeconds()*1e3+e.getMilliseconds();break}case"seconds":{r=e.getMilliseconds();break}case"milliseconds":{r=0;break}default:throw new Error("wtf")}t.valueAsNumber=+e-e.getTimezoneOffset()*6e4-r}d.loadDateTimeLocal=Ce;function Ie(t){const{reject:e,resolve:n,promise:r}=(0,ne.makePromise)();return t.toBlob(o=>{o?n(o):e(new Error("blob is null!"))}),r}d.getBlobFromCanvas=Ie;function Ge(t){const e=new AudioContext,n=e.createMediaElementSource(t),r=new StereoPannerNode(e,{pan:0});return n.connect(r).connect(e.destination),o=>{r.pan.value=o}}d.getAudioBalanceControl=Ge;function $e(){const t=new Map;return/^#?(.*)$/.exec(location.hash.replace("+","%20"))[1].split("&").forEach(r=>{const o=r.split("=",2);if(o.length==2){const s=decodeURIComponent(o[0]),a=decodeURIComponent(o[1]);t.set(s,a)}}),t}d.getHashInfo=$e;function Ve(t,e){var n=document.createElement("div");return n.innerHTML=t.trim(),(0,ne.assertClass)(n.firstChild,e,"createElementFromHTML:")}d.createElementFromHTML=Ve;function xe(t,e){var n=document.createElement("a");if(n.setAttribute("href","data:text/plain;charset=utf-8,"+encodeURIComponent(e)),n.setAttribute("download",t),document.createEvent){var r=document.createEvent("MouseEvents");r.initEvent("click",!0,!0),n.dispatchEvent(r)}else n.click()}d.download=xe;function re(t,e){const n={x:(t.x+e.x)/2,y:(t.y+e.y)/2};{const s=(e.y-t.y)/(e.x-t.x);if(t.yPrime>s&&e.yPrime>s||t.yPrime<s&&e.yPrime<s)return n}const r=(t.x*t.yPrime-t.y-e.x*e.yPrime+e.y)/(t.yPrime-e.yPrime);if(!isFinite(r))return console.log({x:r,p1:t,p2:e}),n;const o=(r-t.x)*t.yPrime+t.y;return isFinite(o)?{x:r,y:o}:(console.log({y:o,x:r,p1:t,p2:e}),n)}window.quadraticControlPoint=re;function*Ne(t,e=2){if(e<1||(e|0)!=e)throw new Error("wtf");const n=[];for(const r of t)n.push(r),n.length==e&&(yield n,n.shift())}function ke(t){let e="";for(const[n,r]of Ne(t)){e==""&&(e=`M ${n.x},${n.y}`);const o=re(n,r);e+=` Q ${o.x},${o.y} ${r.x},${r.y}`}return e}function Fe({x0:t,frequencyMultiplier:e,yCenter:n,amplitude:r}){return{f(o){return Math.sin((o-t)*e)*r+n},fPrime(o){return Math.cos((o-t)*e)*r*e}}}function ze({left:t,right:e,frequencyMultiplier:n}){if(e<=t)return[];const r=10,o=(e-t)/(2*Math.PI)*n,s=Math.max(1,Math.round(o*r));return M(s+1,T(0,t,s,e))}function He(t){const e=ze(t),n=Fe(t);return e.map(o=>({x:o,y:n.f(o),yPrime:n.fPrime(o)}))}function B(t){return ke(He(t))}window.sineWavePath=B;const _e=l("zoomIn",SVGSVGElement),w=l("mouseListener",SVGRectElement),D=l("mousePointer",SVGGeometryElement),q=l("currentlyCenteredPointer",SVGGeometryElement),Re=l("currentlyCenteredTranslate",SVGGElement),Be=l("currentlyCenteredZoom",SVGGElement),Z=l("zoomedInParabola",SVGPathElement);function De(){D.style.display=""}function oe(){D.style.display="none"}["mouseenter","mousemove","mousedown"].forEach(t=>w.addEventListener(t,()=>{De()}));w.addEventListener("mouseleave",()=>{oe()});function ie({screenX:t,screenY:e}){const n=_e.createSVGPoint();n.x=t,n.y=e;const r=n.matrixTransform(w.getScreenCTM().inverse()),o=2-r.x*r.x;return{x:r.x,y:o}}function se(t,{x:e,y:n}){const r=-2*e,o=Math.atan(r)/Math.PI*180;t.setAttribute("transform",`translate(${e}, ${n}) rotate(${o})`)}["mousemove","mouseenter"].forEach(t=>w.addEventListener(t,e=>{se(D,ie(e))}));class E{static centerX=0;static centerY=0;static ratio=1;static#e;static animationIsRunning(){return this.#e!==void 0}static#t=!1;static#n=l("zoomText",SVGGElement);static#r=z(this.#n.firstElementChild,SVGTextElement);static startAnimation(){this.animationIsRunning()||this.restartAnimation()}static restartAnimation(e=0){const n=performance.now()+e,r=R(n,0,n+1e4,Math.log(300)),o=R(n+1e3,0,n+1e4,.75),s=n+15e3;this.#e=a=>{if(a>s){const c=(Math.random()+Math.random())/2*5-2.5,u=2-c*c;this.selectNewTarget({x:c,y:u}),this.restartAnimation(500)}else{const c=Math.exp(r(a));this.setNewZoom(c);const u=o(a);q.style.opacity=u.toString()}},oe(),this.setNewZoom(1),this.#t||(this.#t=!0,requestAnimationFrame(this.onAnimationFrame))}static stopAnimation(){this.#e=void 0,this.setNewZoom(1)}static onAnimationFrame(e){requestAnimationFrame(E.onAnimationFrame),E.#e?.(e)}static updateGUI(){Z.setAttribute("transform",`scale(${this.ratio}) translate(${-this.centerX}, ${-this.centerY})`),Re.setAttribute("transform",`translate(${this.centerX}, ${this.centerY})`),Be.setAttribute("transform",`scale(${1/this.ratio})`),se(q,{x:this.centerX,y:this.centerY});const e=(.15/this.ratio).toString();Z.setAttribute("stroke-width",e),this.#r.textContent=`${this.ratio<10?Math.round(this.ratio*10)/10:Math.round(this.ratio)}⨉`}static selectNewTarget({x:e,y:n}){this.centerX=e,this.centerY=n,this.ratio=1,this.updateGUI()}static setNewZoom(e){this.ratio=e,this.updateGUI()}}function Xe(t){w.style.cursor=t.buttons?"zoom-in":"ew-resize"}["mouseup","mousedown","mouseenter"].forEach(t=>{w.addEventListener(t,Xe)});["mouseenter","mousemove","mousedown"].forEach(t=>{w.addEventListener(t,e=>{e.buttons&&E.selectNewTarget(ie(e))})});w.addEventListener("mouseleave",()=>{E.startAnimation()});["mouseenter","mouseup","mousedown"].forEach(t=>{w.addEventListener(t,e=>{e.buttons==0?E.startAnimation():E.stopAnimation()})});E.selectNewTarget({x:0,y:2});E.startAnimation();class k{constructor(e,n){this.parent=e,this.type=n;let r;for(const o of e.children)if(o instanceof n){r=o;break}if(!r)throw new Error("wtf");r.remove(),this.#e=r}#e;create(){return z(this.#e.cloneNode(!0),this.type)}createParented(){return this.parent.appendChild(this.create())}}class H{constructor(e,n,r,o=6/e){this.numberOfSegments=e;const s=n===void 0?void 0:l(n,SVGGElement),a=l(r,SVGGElement);if(s){{const c=new k(s,SVGCircleElement);this.#e=M(e+1,()=>c.createParented())}{const c=new k(s,SVGLineElement);this.#t=M(e,()=>c.createParented())}}else this.#e=[],this.#t=[];{const c=new k(a,SVGCircleElement),u=new k(a,SVGLineElement);this.#n=M(e,()=>{const h=u.createParented(),A=c.createParented(),G=c.createParented();return{start:A,middle:h,end:G}})}this.resize(o)}#e;#t;#n;resize(e){const n=this.numberOfSegments+1,r=this.numberOfSegments/2,o=M(n,a=>{const c=(a-r)*e,u=c*c/2;return{x:c,y:u}});for(const[a,c]of F(o,this.#e))c.cx.baseVal.value=a.x,c.cy.baseVal.value=a.y;const s=M(o.length-1,a=>({first:o[a],second:o[a+1]}));for(const[{first:a,second:c},u]of F(s,this.#t))u.x1.baseVal.value=a.x,u.y1.baseVal.value=a.y,u.x2.baseVal.value=c.x,u.y2.baseVal.value=c.y;for(const[{first:a,second:c},{start:u,middle:h,end:A}]of F(s,this.#n)){const L=(c.y-a.y)/(c.x-a.x)/2;u.cx.baseVal.value=h.x1.baseVal.value=a.x,u.cy.baseVal.value=h.y1.baseVal.value=L,A.cx.baseVal.value=h.x2.baseVal.value=c.x,A.cy.baseVal.value=h.y2.baseVal.value=L}}}class I{constructor(e){this.toDo=e,this.callback=this.callback.bind(this),this.callback(performance.now())}#e=!1;cancel(){this.#e=!0}callback(e){this.#e||(requestAnimationFrame(this.callback),this.toDo(e))}}function X(t,e,n,r){n<t&&([t,e,n,r]=[n,r,t,e]);const o=T(t,0,n,Math.PI),s=T(1,e,-1,r);return function(a){return a<=t?e:a>=n?r:s(Math.cos(o(a)))}}new H(6,"sampleParabola","sampleDerivative",1);{const n=X(0,1,2e3,.5),r=new H(24,"animatedParabola1","animatedDerivative1");new I(o=>{const s=o%4897;r.resize(n(s))})}{const n=X(0,.5,2e3,.25),r=new H(24,"animatedParabola2","animatedDerivative2");new I(o=>{const s=o%5e3;r.resize(n(s))})}{const n=X(0,1,5e3,.125),r=new H(48,void 0,"animatedDerivative3");new I(o=>{const s=o%7e3;r.resize(n(s))})}class Oe{static#e=l("tangentLine",SVGGElement);static setPosition(e){const n=2-e*e,r=-2*e,o=Math.atan(r)/Math.PI*180;this.#e.setAttribute("transform",`translate(${e}, ${n}) rotate(${o})`)}static setRelativePosition(e){this.setPosition(e*2.25)}}new I(t=>Oe.setRelativePosition(Math.sin(t/2200)));{const t=l("anyNumber",HTMLSpanElement),e=Array.from("34,567.89");setInterval(()=>{let n=Math.random()*7|0;n==2?n=7:n==6&&(n=8);let r;n==0?r=(Math.random()*9|0)+1:r=Math.random()*10|0,e[n]=r.toString(),t.innerText=e.join("")},500)}Array.from(document.querySelectorAll("a:not([href])[id]")).forEach(t=>{const e=z(t,HTMLAnchorElement);e.innerText!=""&&(e.classList.add("self-link"),e.href="#"+e.id)});class S{element;static DEFAULT_LENGTH=10;static STROKE_WIDTH=1.6;#e;#t=!0;constructor(e=S.DEFAULT_LENGTH){this.element=document.createElementNS("http://www.w3.org/2000/svg","polygon"),this.#e=e,this.redraw(),this.element.setAttribute("stroke-width","0.25"),this.element.setAttribute("stroke-miterlimit","10")}redraw(){const e=this.#e,n=this.#t?0:e;if(!isFinite(e)){this.element.setAttribute("points","");return}const r=6,o=Math.sign(e)*Math.min(1,Math.abs(e)/r);this.element.setAttribute("points",`0,${0-n} 2.4,${o*6-n} 0.6,${o*4.4-n} 0.6,${e-n} -0.6,${e-n} -0.6,${o*4.4-n} -2.4,${o*6-n} 0,${0-n}`)}get length(){return this.#e}set length(e){this.#e=e,this.redraw()}get originAtHead(){return this.#t}set originAtHead(e){this.#t=e,this.redraw()}get originAtTail(){return!this.originAtHead}set originAtTail(e){this.originAtHead=!e}}window.Pointer=S;{let t=function(P){const g=P/1e3,m=Math.sin(g),N=Math.cos(g),_=-Math.sin(g);{const f=m/2,y=f*70+50,p=Math.asin(f);l("pendulum",SVGGElement).setAttribute("transform",`rotate(${-p/Math.PI*180})`);const C=Math.cos(p)*70+10,v=l("offsetHorizontal",SVGLineElement);v.x1.baseVal.value=v.x2.baseVal.value=y,v.y1.baseVal.value=C,n.length=f*70,r.element.setAttribute("transform",`translate(${y},${C}) rotate(90)`),r.length=N*35,o.element.setAttribute("transform",`translate(${y},${C-10+S.STROKE_WIDTH/2}) rotate(90)`),o.length=_*35}s.forEach(({path:f,offset:y})=>{const p={left:-4,amplitude:-1,yCenter:0,right:4,x0:-g-y,frequencyMultiplier:1},b=B(p);f.setAttribute("d",b)});{const f=G(-m),y=ae(-m),p=ce(-m);let b=`M 50,${$}`;for(let Y=0;Y<V;Y++)b+=` a ${p},${f},180,0,0,0,${2*f}`,b+=` a ${p},${y},180,0,0,0,${-2*y}`;b+=` a ${p},${f},180,0,0,${-p},${f} h ${p} v ${x}`,a.setAttribute("d",b);const C=$+V*2*(f-y)+f+x;c.cy.baseVal.value=C;const v=(U-W)/2,le={left:-3.25*v,amplitude:-1*v,yCenter:(U+W)/2,right:3.25*v,x0:-g*v,frequencyMultiplier:1/v};u.setAttribute("d",B(le))}};const e=l("pendulumContainer",SVGSVGElement),n=new S;n.originAtTail=!0,e.appendChild(n.element),n.element.setAttribute("fill","red"),n.element.setAttribute("transform","translate(50,90) rotate(90)");const r=new S;r.originAtTail=!0,e.appendChild(r.element),r.element.setAttribute("fill","violet"),r.element.setAttribute("transform","translate(50,80) rotate(90)");const o=new S;o.originAtTail=!0,e.appendChild(o.element),o.element.setAttribute("fill","blue"),o.element.setAttribute("transform","translate(50,80) rotate(90)");{const P=e.querySelectorAll("text");if(P.length!=3)throw new Error("wtf");const[g,m,N]=P,_=(g.getBBox().width-N.getBBox().width)/2;m.setAttribute("transform",`translate(${50+_},98)`)}const s=[["red",0],["magenta",Math.PI/2],["blue",Math.PI]].map(([P,g])=>{const m=document.createElementNS("http://www.w3.org/2000/svg","path");return l("threeSineWaves",SVGGElement).appendChild(m),m.style.strokeWidth="0.056",m.style.fill="none",m.style.stroke=P,{path:m,offset:g}}),a=l("springPath",SVGPathElement),c=l("springWeight",SVGCircleElement),u=l("springSineWave",SVGPathElement),h=10,A=15,G=T(-1,h,1,A),L=7.5,O=10,ae=T(-1,L,1,O),ce=T(-1,22,1,18),$=-17,V=7,x=21,W=$+V*2*(h-L)+h+x,U=$+V*2*(A-O)+A+x;new I(P=>{t(P)})}
