(function(e){function t(t){for(var n,o,u=t[0],c=t[1],s=t[2],d=0,f=[];d<u.length;d++)o=u[d],Object.prototype.hasOwnProperty.call(i,o)&&i[o]&&f.push(i[o][0]),i[o]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);l&&l(t);while(f.length)f.shift()();return a.push.apply(a,s||[]),r()}function r(){for(var e,t=0;t<a.length;t++){for(var r=a[t],n=!0,o=1;o<r.length;o++){var c=r[o];0!==i[c]&&(n=!1)}n&&(a.splice(t--,1),e=u(u.s=r[0]))}return e}var n={},i={1:0},a=[];function o(e){return u.p+"js/"+({}[e]||e)+"."+{2:"ac310ae7",3:"279e9439",4:"7e655a05"}[e]+".js"}function u(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,u),r.l=!0,r.exports}u.e=function(e){var t=[],r=i[e];if(0!==r)if(r)t.push(r[2]);else{var n=new Promise((function(t,n){r=i[e]=[t,n]}));t.push(r[2]=n);var a,c=document.createElement("script");c.charset="utf-8",c.timeout=120,u.nc&&c.setAttribute("nonce",u.nc),c.src=o(e);var s=new Error;a=function(t){c.onerror=c.onload=null,clearTimeout(d);var r=i[e];if(0!==r){if(r){var n=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src;s.message="Loading chunk "+e+" failed.\n("+n+": "+a+")",s.name="ChunkLoadError",s.type=n,s.request=a,r[1](s)}i[e]=void 0}};var d=setTimeout((function(){a({type:"timeout",target:c})}),12e4);c.onerror=c.onload=a,document.head.appendChild(c)}return Promise.all(t)},u.m=e,u.c=n,u.d=function(e,t,r){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(u.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)u.d(r,n,function(t){return e[t]}.bind(null,n));return r},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="",u.oe=function(e){throw console.error(e),e};var c=window["webpackJsonp"]=window["webpackJsonp"]||[],s=c.push.bind(c);c.push=t,c=c.slice();for(var d=0;d<c.length;d++)t(c[d]);var l=s;a.push([0,0]),r()})({0:function(e,t,r){e.exports=r("2f39")},"004b":function(e,t,r){"use strict";(function(e){var n=r("ded3"),i=r.n(n),a=r("9482"),o=r("9944"),u=r("b7fa3"),c=r("a55c"),s=r("6ad4"),d=r("cfbf"),l=r("2ef0"),f=r("e4fd"),b=r("8d7e");const{useState:m,useGetters:p,useActions:g}=Object(b["a"])("db");t["a"]=function({executor:t,publisher:r,handleResponse:n}){const b=Object(f["ref"])(null),O=Object(f["ref"])(null),v=Object(f["ref"])(null),{command:j}=m(["command"]),{devDevice:h}=p(["devDevice"]),{[s["e"]]:D}=g([s["e"]]),E=e=>{b.value=Object(d["a"])().unix(),O.value=setTimeout(n,1e3*Object(l["max"])([e.timeout,a["a"].command.timeout]),null),v.value=Object(u["c"])("Sending command....","info",0),t.value=e},S=()=>{t.value&&(t.value=null),v.value&&v.value(),O.value&&clearTimeout(O.value)},I=e=>{if(!t.value)return;if(Object(l["get"])(t.value,"timeout")<60)return;let{sendDatetime:r,unitID:n}=e;t.value.unitID==n.val&&(Object(o["c"])(b.value,"seconds",r.val)<10||(Object(u["c"])("Command lost.","warning"),D()))};return Object(f["watch"])((()=>j.value.exec),(n=>{if(!n)return S();if(!h.value)return Object(u["c"])("No device.");if(t.value)return Object(u["c"])("Command busy.");let{payload:a}=j.value,o=Object(c["d"])(a);if("string"===typeof o)return D(),Object(u["c"])(o);let{unitID:s}=h.value,d=Object(c["b"])(o,s),l=e.from(d,"hex");E(i()(i()({},o),{},{unitID:s,payload:a,hexCmd:d})),console.log(`COMMAND ${d}`),r({unitID:s,binCmd:l})}),{lazy:!1,immediate:!0}),{handleLostCommand:I}}}).call(this,r("1c35").Buffer)},"0161":function(e,t,r){"use strict";r.d(t,"a",(function(){return c})),r.d(t,"b",(function(){return s}));r("13d5");var n=r("ded3"),i=r.n(n),a=r("9944"),o=r("b9a2"),u=r("9482");const c=(e,t)=>{let r=0;return t.reduce(((t,n)=>{let a=n.format(e.substr(r,2*n.size));return r+=2*n.size,t.concat([i()(i()({},n),{},{value:a,output:n.display(a)})])}),[])},s=e=>{let t=c(e,o["a"]),{report:r,response:n}=u["a"].prefix,i=Object(a["g"])(t,"prefix");if(![r,n].includes(i))return console.warn("CORRUPT: Prefix not same");let s=o["a"].filter((({field:e})=>["prefix","size"].includes(e))).map((({size:e})=>e)).reduce(((e,t)=>e+t));return Object(a["g"])(t,"size")!=e.length/2-s?console.warn("CORRUPT: Size not same"):t}},"018e":function(e,t){},2166:function(e,t,r){"use strict";r.d(t,"h",(function(){return n})),r.d(t,"g",(function(){return i})),r.d(t,"f",(function(){return o})),r.d(t,"e",(function(){return a})),r.d(t,"d",(function(){return u})),r.d(t,"a",(function(){return c})),r.d(t,"b",(function(){return d})),r.d(t,"c",(function(){return s}));r("4d90");const n=(e,t)=>e.toString(16).padStart(t,"0"),i=e=>parseInt(e,16),a=e=>{e.length%2!==0&&(e="0"+e);let t=parseInt(e,16),r=Math.pow(2,e.length/2*8);return t>r/2-1&&(t-=r),t},o=e=>{let t=parseInt(e,16);return t>127&&(t-=256),t},u=e=>{let t="";e=e.toString();for(let r=0;r<e.length&&"00"!==e.substr(r,2);r+=2)t+=String.fromCharCode(parseInt(e.substr(r,2),16));return t},c=e=>{let t=[];for(let r=0,n=e.length;r<n;r++)t.push(Number(e.charCodeAt(r)).toString(16));return t.join("")},s=(e,t=0)=>Number(e).toLocaleString("id",{minimumFractionDigits:t,maximumFractionDigits:t}),d=e=>{const t=[];let r=e.length-2;while(r>=0)t.push(e.substr(r,2)),r-=2;return t.join("")}},"2f39":function(e,t,r){"use strict";r.r(t);r("e6cf"),r("5319"),r("7d6e"),r("e54f"),r("62f2"),r("7e6d");var n=r("2b0e"),i=r("1f91"),a=r("42d2"),o=r("b05d"),u=r("436b"),c=r("2a19"),s=r("b12a"),d=r("18d6");n["default"].use(o["a"],{config:{notify:{type:"info"}},lang:i["a"],iconSet:a["a"],plugins:{Dialog:u["a"],Notify:c["a"],AppFullscreen:s["a"],LocalStorage:d["a"]}});var l=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"q-app"}},[r("router-view")],1)},f=[],b=r("0161"),m=r("a7bc"),p=r("a55c"),g=r("cfbf"),O=r("8d7e");const{useMutations:v}=Object(O["a"])("db");var j=function({addDevices:e}){const{[m["c"]]:t,[m["i"]]:r,[m["g"]]:n}=v([m["c"],m["i"],m["g"]]),i=({payload:i,unitID:a,message:o})=>{let{prop:u,value:c}=Object(p["c"])(i);"FINGER_FETCH"==u?(o.length>0&&o.split(",").forEach((e=>t({unitID:a,fingerID:e}))),e([{unitID:a,fingerTime:Object(g["a"])().unix()}])):"FINGER_ADD"==u?t({unitID:a,fingerID:o}):"FINGER_DEL"==u?r({unitID:a,fingerID:c}):"FINGER_RST"==u&&n({unitID:a})};return{handleFinger:i}},h=r("6ad4"),D=r("8b56"),E=r("2ef0"),S=r("e4fd"),I=r.n(S);const{useGetters:R,useActions:C}=Object(O["a"])("db");var y=function({executor:e,handleFinger:t}){const{devDevice:r}=R(["devDevice"]),{[h["d"]]:n,[h["e"]]:i}=C([h["d"],h["e"]]),a=t=>{if(!e.value)return console.error(`RESPONSE ${t}`);console.warn(`RESPONSE ${t}`);let r=Object(D["d"])(e.value,t);Object(E["get"])(r,"unitID")===e.value.unitID&&(Object(D["a"])(r),n(r),i())};return Object(S["watch"])((()=>r.value),(e=>{const r=Object(E["get"])(e,"lastResponse");if(!r)return;let n=Object(D["c"])(r.resCode);"OK"==n.title&&t(r)}),{deep:!0}),{handleResponse:a}},_=r("004b");const{useState:T,useMutations:M,useActions:N}=Object(O["a"])("db");var w=function({handleReports:e}){const t=Object(S["ref"])(null),{buffers:r}=T(["buffers"]),{[m["h"]]:n,[m["n"]]:i}=M([m["h"],m["n"]]),{[h["a"]]:a}=N([h["a"]]),o=()=>{if(r.value.length>0){const t=r.value;e(t),n(t)}else i()};return Object(S["onMounted"])((()=>t.value=setInterval(o,1e3))),Object(S["onBeforeUnmount"])((()=>clearInterval(t.value))),{insertBuffers:a}},A=(r("13d5"),r("ddb0"),r("af6a")),x=r("9944"),U=r("b7fa3");const{useState:B,useGetters:k,useMutations:P,useActions:F}=Object(O["a"])("db");var q=function({handleEvents:e,handleLostCommand:t}){const{reports:r}=B(["reports"]),{devDevice:n}=k(["devDevice"]),{[m["k"]]:i}=P([m["k"]]),{[h["c"]]:a}=F([h["c"]]),o=Object(O["a"])("common"),{follow:u}=o.useState(["follow"]),c=e=>{const{val:t}=e.logDatetime;return r.value.some((({logDatetime:e})=>e.val==t))?(Object(U["c"])("Report duplicate","info"),console.error("^REPORT (DUPLICATE)")):e},s=e=>{let r=e.reduce(((e,r)=>{console.log(`REPORT ${r}`);let n=c(Object(A["d"])(r));return n?(t(n),[...e,n]):e}),[]);a(r)};return Object(S["watch"])((()=>n.value),((t,r)=>{const n=Object(E["get"])(t,"lastReport"),a=Object(E["get"])(r,"lastReport");if(!n)return i(null);(n.unitID.val!=Object(E["get"])(a,"unitID.val")||u.value)&&i(n),e(n,a)}),{lazy:!1,immediate:!0,deep:!0}),{handleReports:s}},z=r("fd30"),V=function(){const{useState:e}=Object(O["a"])("common"),{notification:t}=e(["notification"]),r=(e,r)=>{if(!t.value)return;if(!r)return;let n=Object(z["d"])(e.eventsGroup),i=Object(z["d"])(r.eventsGroup),a=n.filter((e=>!i.includes(e)));a.forEach((t=>Object(U["d"])(t,e.logDatetime.out)))};return{handleEvents:r}};const{useGetters:G,useMutations:L}=Object(O["a"])("db");var $=function(){const{devDevice:e}=G(["devDevice"]),{[m["b"]]:t}=L([m["b"]]);return Object(S["watch"])((()=>e.value),((e,t)=>{if(!e||!t)return;const{status:r}=t,{status:n}=e;r!=n&&Object(U["d"])("DEVICE "+(n?"ONLINE":"OFFLINE"),Object(g["a"])().format("ddd, DD-MM-YY HH:mm:ss"))}),{deep:!0}),{addDevices:t}},H={setup(e,{root:t}){const r=Object(S["ref"])(null),n=(e,t)=>{let r=e.toString("hex").toUpperCase();return Object(b["b"])(r)?r:console.error(`CORRUPT ${r}`)},i=({unitID:e,binCmd:r})=>t.$mqtt.publish(`VCU/${e}/CMD`,r,{qos:2}),{addDevices:a}=$(),{handleFinger:o}=j({addDevices:a}),{handleResponse:u}=y({executor:r,handleFinger:o}),{handleLostCommand:c}=Object(_["a"])({executor:r,publisher:i,handleResponse:u}),{handleEvents:s}=V(),{handleReports:d}=q({handleEvents:s,handleLostCommand:c}),{insertBuffers:l}=w({handleReports:d});return Object(S["onMounted"])((()=>{t.$mqtt.subscribe("VCU/+/RPT",{qos:1}),t.$mqtt.subscribe("VCU/+/RSP",{qos:1}),t.$mqtt.subscribe("VCU/+/STS",{qos:1})})),{validFrame:n,insertBuffers:l,handleResponse:u,addDevices:a}},mqtt:{"VCU/+/RSP":function(e,t){const r=this.validFrame(e,t);r&&this.handleResponse(r)},"VCU/+/RPT":function(e,t){const r=this.validFrame(e,t);r&&this.insertBuffers([r])},"VCU/+/STS":function(e,t){let r=parseInt(t.split("/")[1]),n=parseInt(e);console.warn(`STATUS ${r},${n}`),this.addDevices([{unitID:r,status:n}])}}},Y=H,K=r("2877"),W=Object(K["a"])(Y,l,f,!1,null,null,null),J=W.exports,Q=r("2f62"),X=r("bfa9"),Z=function(){return{processing:!1,darker:!1,tree:!1,follow:!0,notification:!0}},ee=r("4930b"),te=r.n(ee),re=r("5662"),ne={[re["a"]](e){e.processing=!1},[re["e"]](e,t){e.processing=t},[re["b"]](e,t){e.darker=t},[re["c"]](e,t){e.follow=t},[re["f"]](e,t){e.tree=t},[re["d"]](e,t){e.notification=t}},ie=r("018e"),ae=r.n(ie),oe={namespaced:!0,state:Z,getters:te.a,mutations:ne,actions:ae.a},ue=function(){return{buffering:null,unitID:null,report:null,command:{payload:"",exec:!1},devices:[],buffers:[],reports:[],responses:[],fingers:[]}},ce={reportIdxByUnitID:({reports:e})=>e.reduce(((e,{unitID:t},r)=>(e[t.val]=e[t.val]||[],e[t.val].push(r),e)),{}),reportByUnitID:(e,t)=>r=>(t.reportIdxByUnitID[r]||[]).map((t=>e.reports[t])),devReports({unitID:e},t){return t.reportByUnitID(e)},devEvents(e,t){return Object(z["b"])(t.devReports)},devDevice({devices:e,unitID:t}){return e.find((e=>e.unitID===t))},devResponses({responses:e,unitID:t}){return e.filter((e=>e.unitID===t))},devFingers({fingers:e,unitID:t}){return e.filter((e=>e.unitID===t))}},se=(r("a434"),r("ded3")),de=r.n(se),le=r("9482"),fe={[m["f"]](e){Object.assign(e,ue())},[m["l"]](e,t){e.unitID=t},[m["k"]](e,t){e.report=t},[m["j"]](e,t){e.command=t},[m["b"]](e,t){t.forEach((t=>{let r=e.devices.findIndex((({unitID:e})=>e===t.unitID));r<0?e.devices.unshift(de()({status:0,sendDatetime:0},t)):e.devices.splice(r,1,de()(de()({},e.devices[r]),t))})),e.unitID||(e.unitID=t[t.length-1].unitID)},[m["m"]](e){e.buffering||(e.buffering=Object(U["b"])("Syncing...","Please wait a moment"))},[m["n"]](e){e.buffering&&(e.buffering.hide(),e.buffering=null)},[m["a"]](e,t){e.buffers.push(...t)},[m["h"]](e,t){e.buffers=[...e.buffers.filter((e=>!t.includes(e)))]},[m["d"]](e,t){const r=t.map((e=>Object.freeze(e)));e.reports=[...Object(E["orderBy"])([...e.reports,...r],"logDatetime.val","desc")],e.reports.length>le["a"].maxStorage.reports-1&&e.reports.splice(le["a"].maxStorage.reports,e.reports.length-le["a"].maxStorage.reports)},[m["e"]](e,t){const r=de()({},t);Object.freeze(r),e.responses.unshift(r),e.responses.length>le["a"].maxStorage.responses&&e.responses.pop()},[m["c"]](e,t){let r=e.fingers.find((({unitID:e,fingerID:r})=>e===t.unitID&&r===t.fingerID));r||e.fingers.unshift(t)},[m["i"]](e,t){let r=e.fingers.findIndex((({unitID:e,fingerID:r})=>e===t.unitID&&r===t.fingerID));e.fingers.splice(r,1)},[m["g"]](e,t){e.fingers=e.fingers.filter((({unitID:e})=>e!==t.unitID))}},be=(r("26e9"),r("fb6a"),{[h["a"]]({state:e,commit:t},r){r.length>1&&t(m["m"]),t(m["a"],r)},[h["c"]]({state:e,commit:t},r){r.length>1&&t(m["m"]),t(m["d"],r.slice().reverse()),t(m["b"],r.map((e=>de()({unitID:e.unitID.val,sendDatetime:e.sendDatetime.val,lastReport:e},"FULL"==Object(x["e"])(e.frameID.val)&&{lastFullReport:e}))))},[h["d"]]({state:e,commit:t,dispatch:r},n){t(m["e"],n),t(m["b"],[{unitID:n.unitID,lastResponse:n}])},[h["b"]]({state:e,commit:t},r){let n=de()({exec:!0},r);t(m["j"],n),t(`common/${re["e"]}`,n.exec,{root:!0})},[h["e"]]({state:e,commit:t}){t(m["j"],de()(de()({},e.command),{},{exec:!1})),t(`common/${re["e"]}`,!1,{root:!0})}}),me={namespaced:!0,state:ue(),getters:ce,mutations:fe,actions:be};n["default"].use(Q["a"]);const pe=new X["a"]({key:"STORAGE_KEY",storage:window.localStorage});var ge=function(){const e=new Q["a"].Store({modules:{common:oe,db:me},plugins:[pe.plugin],strict:!1});return e},Oe=r("8c4f");const ve=[{path:"/",component:()=>Promise.all([r.e(0),r.e(2)]).then(r.bind(null,"713b")),children:[{path:"",component:()=>Promise.all([r.e(0),r.e(4)]).then(r.bind(null,"8b24"))}]}];ve.push({path:"*",component:()=>Promise.all([r.e(0),r.e(3)]).then(r.bind(null,"e51e"))});var je=ve;n["default"].use(Oe["a"]);var he=function(){const e=new Oe["a"]({scrollBehavior:()=>({y:0}),routes:je,mode:"hash",base:""});return e},De=async function(){const e="function"===typeof ge?await ge({Vue:n["default"]}):ge,t="function"===typeof he?await he({Vue:n["default"],store:e}):he;e.$router=t;const r={router:t,store:e,render:e=>e(J),el:"#q-app"};return{app:r,store:e,router:t}},Ee=r("9483");Object(Ee["a"])("service-worker.js",{ready(){console.log("App is being served from cache by a service worker.")},registered(e){console.log("Service worker has been registered.")},cached(e){console.log("Content has been cached for offline use.")},updatefound(e){console.log("New content is downloading.")},updated(e){console.log("New content is available; please refresh."),c["a"].create({message:"New content is available; please refresh.",color:"red",icon:"refresh",timeout:0,actions:[{label:"Refresh",color:"yellow",handler:()=>{window.localStorage.clear(),window.location.reload()}},{label:"Dismiss",color:"white",handler:()=>{}}]})},offline(){console.log("No internet connection found. App is running in offline mode.")},error(e){console.error("Error during service worker registration:",e)}});var Se=({Vue:e})=>{e.mixin({computed:de()({},Object(Q["b"])("common",["processing"]))})},Ie=({app:e,router:t,Vue:r})=>{r.use(I.a)},Re=r("daa7"),Ce=r.n(Re),ye=r("0967");let{mqtt:_e}=le["a"];var Te=({app:e,router:t,store:r,Vue:n})=>{let i=d["a"].getItem("clientId");i||(i="mqttjs_"+Math.random().toString(16).substr(2,8),d["a"].set("clientId",i)),n.use(Ce.a,`wss://${_e.address}:${_e.port}${_e.path}`,{username:_e.username,password:_e.password,clean:ye["b"].is.mobile,clientId:i})},Me=r("755e"),Ne=({app:e,router:t,Vue:r})=>{r.use(Me,{load:{key:"AIzaSyBE8UhrrFkz9m37oowPkHX9to8NXcHw4Ak",region:"ID",language:"id"}})};/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream&&window.navigator.standalone&&r.e(0).then(r.t.bind(null,"a0db",7));const we="";async function Ae(){const{app:e,store:t,router:r}=await De();let i=!1;const a=e=>{i=!0;const t=Object(e)===e?r.resolve(e).route.fullPath:e;window.location.href=t},o=window.location.href.replace(window.location.origin,""),u=[Se,Ie,Te,Ne];for(let s=0;!1===i&&s<u.length;s++)if("function"===typeof u[s])try{await u[s]({app:e,router:r,store:t,Vue:n["default"],ssrContext:null,redirect:a,urlPath:o,publicPath:we})}catch(c){return c&&c.url?void(window.location.href=c.url):void console.error("[Quasar] boot error:",c)}!0!==i&&new n["default"](e)}Ae()},"4930b":function(e,t){},5662:function(e,t,r){"use strict";r.d(t,"a",(function(){return n})),r.d(t,"e",(function(){return i})),r.d(t,"b",(function(){return a})),r.d(t,"f",(function(){return o})),r.d(t,"c",(function(){return u})),r.d(t,"d",(function(){return c}));const n="CLEAR_COMMON",i="SET_PROCESSING",a="SET_DARKER",o="SET_TREE",u="SET_FOLLOW",c="SET_NOTIFICATION"},"5f15":function(e,t,r){"use strict";r.d(t,"b",(function(){return l})),r.d(t,"a",(function(){return g}));r("13d5"),r("ddb0");var n=r("ded3"),i=r.n(n),a=r("cfbf"),o=r("9482"),u=r("2ef0"),c=r("9944"),s=r("b9a2"),d=r("2166");const l={UNKNOWN:-3,LOST:-2,BACKUP:-1,NORMAL:0,STANDBY:1,READY:2,RUN:3},f=e=>Object.keys(l)[Object.values(l).findIndex((t=>t===parseInt(e)))],b=({required:e})=>[{group:"packet",field:"frameID",title:"Frame ID",required:!0,chartable:!0,size:1,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>o["a"].frames[e]},{group:"packet.datetime",field:"logDatetime",title:"Log Datetime",required:!0,chartable:!0,size:7,format:e=>Number(Object(a["a"])(Object(c["h"])(e),"YYMMDDHHmmss0d").unix()),display:e=>a["a"].unix(e).format("ddd, DD-MM-YY HH:mm:ss")},{group:"vcu",field:"driverID",title:"Driver ID",required:!0,chartable:!0,size:1,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>255===e?"NONE":Object(d["h"])(e,2).toUpperCase()},{group:"vcu",field:"eventsGroup",title:"Events Group",required:!0,chartable:!0,size:8,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["h"])(e,16).toUpperCase()},{group:"vcu",field:"vehicleState",title:"Vehicle State",required:!0,chartable:!0,size:1,format:e=>Object(d["f"])(Object(d["b"])(e)),display:e=>f(e)},{group:"vcu.gps",field:"gpsLongitude",title:"GPS Longitude",required:!1,chartable:!0,size:4,format:e=>1e-7*Object(d["e"])(Object(d["b"])(e)),display:e=>parseFloat(e.toFixed(7))},{group:"vcu.gps",field:"gpsLatitude",title:"GPS Latitude",required:!1,chartable:!0,size:4,format:e=>1e-7*Object(d["e"])(Object(d["b"])(e)),display:e=>parseFloat(e.toFixed(7))},{group:"vcu.gps",field:"gpsAltitude",title:"GPS Altitude",required:!1,chartable:!0,unit:"m",size:4,format:e=>.1*Object(d["g"])(Object(d["b"])(e)),display:e=>parseFloat(e.toFixed(2))},{group:"vcu.gps",field:"gpsHDOP",title:"GPS HDOP",required:!1,chartable:!0,size:1,format:e=>.1*Object(d["g"])(Object(d["b"])(e)),display:e=>parseFloat(e.toFixed(2))},{group:"vcu.gps",field:"gpsVDOP",title:"GPS VDOP",required:!1,chartable:!0,size:1,format:e=>.1*Object(d["g"])(Object(d["b"])(e)),display:e=>parseFloat(e.toFixed(2))},{group:"vcu.gps",field:"gpsHeading",title:"GPS Heading",required:!1,chartable:!0,unit:"Degree",size:1,format:e=>2*Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu.gps",field:"gpsSatInUse",title:"GPS Sat. in use",required:!1,chartable:!0,unit:"Sat.",size:1,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu",field:"speed",title:"Vehicle Speed",required:!1,chartable:!0,unit:"Km/hr",size:1,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu.trip",field:"odometer",title:"Odometer",required:!1,chartable:!0,unit:"Km",size:4,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu",field:"signal",title:"Signal Quality",required:!1,chartable:!0,unit:"%",size:1,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu",field:"batVoltage",title:"Battery Voltage",required:!1,chartable:!0,unit:"mVolt",size:1,format:e=>18*Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu.estimation",field:"rangeEstimation",title:"Range Estimation",required:!1,chartable:!0,unit:"Km",size:1,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu.estimation",field:"batteryEstimation",title:"Battery Estimation",required:!1,chartable:!0,unit:"Km/kWh",size:1,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu.trip",field:"tripA",title:"Trip A",required:!1,chartable:!0,unit:"m",size:4,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu.trip",field:"tripB",title:"Trip B",required:!1,chartable:!0,unit:"m",size:4,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)}].filter((({required:t})=>t===e)),m=({required:e})=>["One","Two"].reduce(((e,t)=>e.concat([{group:`bms.${t}`,field:`bms${t}Id`,title:`BMS ${t} ID`,required:!0,size:4,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>4294967295===e?"NONE":Object(d["h"])(e,8).toUpperCase()},{group:`bms.${t}`,field:`bms${t}Voltage`,title:`BMS ${t} Voltage`,required:!0,chartable:!0,unit:"Volt",size:2,format:e=>.01*Object(d["g"])(Object(d["b"])(e)),display:e=>e.toFixed(2)},{group:`bms.${t}`,field:`bms${t}Current`,title:`BMS ${t} Current`,required:!0,chartable:!0,unit:"Ampere",size:2,format:e=>.01*Object(d["g"])(Object(d["b"])(e))-50,display:e=>e.toFixed(2)},{group:`bms.${t}`,field:`bms${t}Soc`,title:`BMS ${t} SoC`,required:!1,chartable:!0,unit:"%",size:2,format:e=>.01*Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:`bms.${t}`,field:`bms${t}Temperature`,title:`BMS ${t} Temperature`,required:!1,chartable:!0,unit:"Celcius",size:2,format:e=>.1*Object(d["g"])(Object(d["b"])(e))-40,display:e=>e.toFixed(2)}])),[]).filter((({required:t})=>t===e)),p=()=>{const e=["managerTask","iotTask","reporterTask","commandTask","gpsTask","gyroTask","remoteTask","fingerTask","audioTask","gateTask","canRxTask","canTxTask","hmi2PowerTask"],t=["Yaw (U/D)","Pitch (F/B)","Roll (L/R)"];return[...e.reduce(((e,t)=>e.concat([{group:"vcu.task.wakeup",field:`${t}Wakeup`,title:`${Object(u["startCase"])(t)} wakeup`,required:!1,chartable:!0,unit:"s",size:1,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu.task.stack",field:`${t}Stack`,title:`${Object(u["startCase"])(t)} stack`,required:!1,chartable:!0,unit:"words",size:2,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)}])),[]),...t.reduce(((e,t)=>e.concat([{group:"vcu.gyro",field:`gyro${t}`,title:`Gyro ${t}`,required:!1,chartable:!0,unit:"Degree",size:1,format:e=>Object(d["f"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)}])),[])]},g=[...s["a"],...b({required:!0}),...m({required:!0}),...b({required:!1}),...m({required:!1}),...p()].map(((e,t)=>i()(i()({},e),{},{no:t})))},"6ad4":function(e,t,r){"use strict";r.d(t,"a",(function(){return n})),r.d(t,"c",(function(){return i})),r.d(t,"d",(function(){return a})),r.d(t,"b",(function(){return o})),r.d(t,"e",(function(){return u}));const n="INSERT_BUFFERS",i="INSERT_REPORTS",a="INSERT_RESPONSES",o="INSERT_COMMAND",u="STOP_COMMAND"},"7e6d":function(e,t,r){},"8b56":function(e,t,r){"use strict";r.d(t,"d",(function(){return l})),r.d(t,"c",(function(){return f})),r.d(t,"b",(function(){return b})),r.d(t,"a",(function(){return m}));r("5319");var n=r("9944"),i=r("0161"),a=r("b7fa3"),o=r("5f15"),u=(r("ddb0"),r("b9a2")),c=r("2166");const s=[{resCode:0,name:"error",title:"ERROR",color:"red"},{resCode:1,name:"ok",title:"OK",color:"green"},{resCode:2,name:"invalid",title:"INVALID",color:"blue"},{resCode:256,name:"timeout",title:"TIMEOUT",color:"orange"},{resCode:257,name:"unknown",title:"UNKNOWN",color:"purple"}],d=[...u["a"],{field:"code",title:"Code",required:!0,size:1,format:e=>Object(c["g"])(e),display:e=>e},{field:"subCode",title:"Sub Code",required:!0,size:1,format:e=>Object(c["g"])(e),display:e=>e},{field:"resCode",title:"Response Code",required:!0,size:1,format:e=>Object(c["g"])(e),display:e=>{let t=s.find((({resCode:t})=>t===e));return t?t.title:s.find((({name:e})=>"unknown"===e)).title}},{field:"message",title:"Message",required:!0,size:200,format:e=>Object(c["d"])(e),display:e=>e}],l=({payload:e,unitID:t,code:r,subCode:a,hexCmd:o},u)=>{let c=s.find((({name:e})=>"timeout"===e)),l=null;if(u){let e=Object(i["a"])(u,d);if(Object(n["g"])(e,"code")!=r)return;if(Object(n["g"])(e,"subCode")!=a)return;c=s.find((({resCode:t})=>t===Object(n["g"])(e,"resCode"))),l=Object(n["g"])(e,"message")}return{hexCmd:o,hexRes:u,unitID:t,payload:e,resCode:c.resCode,message:l}},f=e=>s.find((({resCode:t})=>t==e)),b=e=>{if(!e)return;let t=Object.keys(o["b"]),r=Object.values(o["b"]);return e.replace(/\{(.+?)\}/g,(function(e,n){let i=r.findIndex((e=>e===parseInt(n)));return t[i]}))},m=({resCode:e})=>{let t=f(e),r="OK"==t.title,n=r?"positive":"negative",i=r?"Command sent.":`Command is ${t.title}`;Object(a["c"])(i,n)}},9482:function(e,t,r){"use strict";var n=r("0967");t["a"]={app:{version:"1.82",title:"eBike Tracker",subTitle:"GEN Indonesia"},mqtt:{address:"mqtt.eclipseprojects.io",port:443,path:"/mqtt",username:"",password:""},command:{timeout:10},prefix:{report:"@R",command:"@C",response:"@S"},frames:["SIMPLE","FULL"],map:{zoom:3,centerIndonesia:{lat:-2.6000285,lng:118.015776},borderIndonesia:{lngMin:95.011198,lngMax:141.020354,latMin:-11.107187,latMax:5.90713}},timezone:"Asia/Jakarta",maxStorage:{reports:n["b"].is.desktop?500:250,responses:n["b"].is.desktop?50:25}}},9944:function(e,t,r){"use strict";r.d(t,"d",(function(){return d})),r.d(t,"f",(function(){return l})),r.d(t,"g",(function(){return f})),r.d(t,"b",(function(){return m})),r.d(t,"h",(function(){return p})),r.d(t,"a",(function(){return g})),r.d(t,"c",(function(){return b})),r.d(t,"e",(function(){return O}));r("13d5"),r("4d90");var n=r("ded3"),i=r.n(n),a=r("9482"),o=r("2166"),u=r("2ef0"),c=r("cfbf");const s=r("e002"),d=(e,t)=>Object(u["filter"])(e,Object(u["flow"])(u["identity"],u["values"],u["join"],u["toLower"],Object(u["partialRight"])(u["includes"],t))),l=(e,t,r)=>{let n=e.find((({field:e})=>e===t));return Array.isArray(t)?t.reduce(((t,a)=>(n=e.find((({field:e})=>e===a)),i()(i()({},t),{},{[a]:r?n[r]:n}))),{}):r?n[r]:n},f=(e,t)=>l(e,t,"value"),b=(e,t,r)=>{let n=Object(c["a"])();r&&(n=c["a"].unix(r));let i=n.diff(c["a"].unix(e));return c["a"].duration(i).as(t)},m=({gpsLatitude:e,gpsLongitude:t,sendDatetime:r})=>{let n=Object(u["clone"])(a["a"].timezone);e.val&&t.val&&(n=s(e.val,t.val));let i=Object(c["a"])();return i.tz(n).format("YYMMDDHHmmss0d")},p=e=>{let t=e.match(/.{1,2}/g);return t.reduce(((e,t)=>e.concat(Object(o["g"])(t).toString().padStart(2,"0"))),"")},g=e=>{let t=e.match(/.{1,2}/g);return t.reduce(((e,t)=>e.concat(Object(o["h"])(parseInt(t),2))),"").toUpperCase()},O=e=>a["a"].frames[e]},a55c:function(e,t,r){"use strict";r.d(t,"a",(function(){return s})),r.d(t,"d",(function(){return b})),r.d(t,"b",(function(){return l})),r.d(t,"c",(function(){return f}));r("c975"),r("13d5"),r("ddb0");var n=r("ded3"),i=r.n(n),a=r("b9a2"),o=r("2166"),u=r("9944"),c=r("cfbf");const s=[{command:"GEN_INFO",desc:"Gather device information",code:0,subCode:0},{command:"GEN_QUOTA",desc:"Check internet quota",code:0,subCode:1,timeout:30},{command:"GEN_LED",desc:"Control system led",code:0,subCode:2,type:"bool",range:[0,1]},{command:"GEN_OVERRIDE",desc:"Override vehicle state",code:0,subCode:3,type:"uint8_t",range:[1,3]},{command:"REPORT_RTC",desc:"Set datetime ( d [0=Sunday] )",code:1,subCode:0,type:"uint8_t[7]",range:["YYMMDDHHmmss0d"],formatCmd:e=>Object(u["a"])(e)+"00",validator:e=>Object(c["a"])(e,"YYMMDDHHmmss0d",!0).isValid()},{command:"REPORT_ODOM",desc:"Set odometer (km)",code:1,subCode:1,type:"uint32_t",range:[0,99999]},{command:"AUDIO_BEEP",desc:"Beep the audio module",code:2,subCode:0},{command:"AUDIO_MUTE",desc:"Mute the audio module",code:2,subCode:1,type:"bool",range:[0,1]},{command:"FINGER_FETCH",desc:"Get all registered id",code:3,subCode:0,timeout:15},{command:"FINGER_ADD",desc:"Add a new fingerprint",code:3,subCode:1,timeout:20},{command:"FINGER_DEL",desc:"Delete a fingerprint",code:3,subCode:2,type:"uint8_t",range:[1,5],timeout:15},{command:"FINGER_RST",desc:"Reset all fingerprints",code:3,subCode:3,timeout:15},{command:"REMOTE_PAIRING",desc:"Keyless pairing mode",code:4,subCode:0,timeout:15},{command:"REMOTE_UNITID",desc:"Set device unique id",code:4,subCode:1,type:"uint32_t",range:[0,4294967295]},{command:"FOTA_VCU",desc:"Upgrade VCU firmware",code:5,subCode:0,timeout:360},{command:"FOTA_HMI",desc:"Upgrade HMI firmware",code:5,subCode:1,timeout:720}],d=[...a["a"],{field:"code",title:"Code",size:1,formatCmd:e=>Object(o["b"])(Object(o["h"])(e,2))},{field:"subCode",title:"Sub Code",size:1,formatCmd:e=>Object(o["b"])(Object(o["h"])(e,2))},{field:"value",title:"Value",size:8,formatCmd:e=>Object(o["b"])(Object(o["h"])(parseInt(e),16))}],l=(e,t)=>{if(e)return d.reduce(((r,n,i)=>{let{field:a,formatCmd:o}=d[d.length-i-1];switch(a){case"value":r=e.hasOwnProperty("formatCmd")?e.formatCmd(e.value)+r:o(e.value||0)+r;break;case"subCode":case"code":r=o(e[a])+r;break;case"sendDatetime":r=o()+r;break;case"unitID":r=o(t)+r;break;case"size":case"prefix":r=o(r)+r;break;default:break}return r}),"").toUpperCase()},f=e=>{let t=e,r=null;return e.indexOf("=")>-1&&(t=e.split("=")[0],r=e.split("=")[1]),{prop:t,value:r}},b=e=>{if(!e)return"Empty payload.";let{prop:t,value:r}=f(e),n=s.find((({command:e})=>e===t));if(!n)return"Unknown command.";if(n.range){if(!r)return"Command need value";if(n.validator){if(!n.validator(r))return"Value is invalid"}else{const[e,t]=n.range;if(r<e||r>t)return"Value not in range"}}else if(r)return"Command dont need value";return i()(i()({},n),{},{value:r})}},a7bc:function(e,t,r){"use strict";r.d(t,"f",(function(){return n})),r.d(t,"l",(function(){return i})),r.d(t,"k",(function(){return a})),r.d(t,"j",(function(){return o})),r.d(t,"m",(function(){return u})),r.d(t,"n",(function(){return c})),r.d(t,"a",(function(){return s})),r.d(t,"h",(function(){return d})),r.d(t,"b",(function(){return l})),r.d(t,"d",(function(){return f})),r.d(t,"e",(function(){return b})),r.d(t,"c",(function(){return m})),r.d(t,"i",(function(){return p})),r.d(t,"g",(function(){return g}));const n="CLEAR_DATABASE",i="SET_UNITID",a="SET_REPORT",o="SET_COMMAND",u="START_BUFFERING",c="STOP_BUFFERING",s="ADD_BUFFERS",d="FREE_BUFFER",l="ADD_DEVICES",f="ADD_REPORTS",b="ADD_RESPONSES",m="ADD_FINGERS",p="REMOVE_FINGERS",g="CLEAR_FINGERS"},af6a:function(e,t,r){"use strict";r.d(t,"d",(function(){return d})),r.d(t,"c",(function(){return f})),r.d(t,"e",(function(){return l})),r.d(t,"b",(function(){return b}));r("13d5");var n=r("ded3"),i=r.n(n),a=r("5f15");r.d(t,"a",(function(){return a["a"]}));var o=r("9944"),u=r("0161"),c=r("cfbf");const s=e=>{let t=Object(o["g"])(Object(u["a"])(e,a["a"]),"frameID"),r=a["a"].filter((({required:e})=>"FULL"==Object(o["e"])(t)||"SIMPLE"==Object(o["e"])(t)&&e));return Object(u["a"])(e,r)},d=e=>{let t=s(e);return t.reduce(((e,{field:t,value:r,output:n,unit:a})=>i()(i()({},e),{},{[t]:{val:r,out:n}})),{hex:e})},l=e=>Object.keys(e).reduce(((t,r)=>{let n=e[r];if("hex"!=r){let{group:e,title:t,unit:u}=Object(o["f"])(a["a"],r);n=i()(i()({},n),{},{group:e,title:t,unit:u})}return i()(i()({},t),{},{[r]:n})}),{}),f=(e,t)=>{if(!e)return;let r=t.findIndex((({hex:t})=>t===e.hex));if(!(r<0))while(r<t.length){let e=t[r++];if("FULL"==Object(o["e"])(e.frameID.val))return e}},b=e=>e?c["a"].unix(e).endOf("second").fromNow():"Unknown ago"},b7fa3:function(e,t,r){"use strict";r.d(t,"d",(function(){return u})),r.d(t,"c",(function(){return c})),r.d(t,"a",(function(){return s})),r.d(t,"b",(function(){return d}));var n=r("ff52"),i=r("436b"),a=r("2a19"),o=r("cf57");const u=(e,t)=>{const{protocol:r,host:n}=window.location,i=`${r}//${n}/icons/favicon-32x32.png`,a=()=>new Notification(e,{body:t,icon:i});"granted"===Notification.permission?a():"denied"!==Notification.permission&&Notification.requestPermission().then((e=>"granted"===e&&a()))},c=(e,t="negative",r=5e3)=>a["a"].create({type:t,message:e,timeout:r}),s=e=>i["a"].create({message:e,title:"Confirmation",dark:n["a"].isActive,preventClose:!0,cancel:!0}),d=(e,t)=>i["a"].create({title:e,message:t,dark:n["a"].isActive,persistent:!0,ok:!1,progress:{spinner:o["a"],color:"primary"}})},b9a2:function(e,t,r){"use strict";r.d(t,"a",(function(){return u}));var n=r("9482"),i=r("cfbf"),a=r("2166"),o=r("9944");const u=[{group:"packet",field:"prefix",title:"Prefix",header:!0,required:!0,size:2,format:e=>Object(a["d"])(Object(a["b"])(e)),display:e=>e,formatCmd:e=>Object(a["b"])(Object(a["a"])(n["a"].prefix.command))},{group:"packet",field:"size",title:"Size",header:!0,required:!0,chartable:!0,unit:"Bytes",size:1,format:e=>Object(a["g"])(Object(a["b"])(e)),display:e=>Object(a["c"])(e),formatCmd:e=>Object(a["b"])(Object(a["h"])(e.length/2,2))},{group:"packet",field:"unitID",title:"Unit ID",header:!0,required:!0,size:4,format:e=>Object(a["g"])(Object(a["b"])(e)),display:e=>e,formatCmd:e=>Object(a["b"])(Object(a["h"])(e,8))},{group:"packet.datetime",field:"sendDatetime",title:"Send Datetime",header:!0,required:!0,chartable:!0,size:7,format:e=>Number(Object(i["a"])(Object(o["h"])(e),"YYMMDDHHmmss0d").unix()),display:e=>i["a"].unix(e).format("ddd, DD-MM-YY HH:mm:ss"),formatCmd:()=>Object(o["a"])(Object(i["a"])().format("YYMMDDHHmmss0d"))}]},cfbf:function(e,t,r){"use strict";const n=r("5a0c"),i=r("d772"),a=r("4208"),o=r("0ecf"),u=r("1953"),c=r("f906");n.extend(c),n.extend(i),n.extend(a),n.extend(o),n.extend(u),t["a"]=n},fd30:function(e,t,r){"use strict";r.d(t,"a",(function(){return n})),r.d(t,"c",(function(){return u})),r.d(t,"d",(function(){return c})),r.d(t,"b",(function(){return s}));r("13d5"),r("ddb0");const n=[{name:"VCU_NET_SOFT_RESET",bit:0,group:"VCU"},{name:"VCU_NET_HARD_RESET",bit:1,group:"VCU"},{name:"VCU_REMOTE_MISSING",bit:2,group:"VCU"},{name:"VCU_BIKE_FALLEN",bit:3,group:"VCU"},{name:"VCU_BIKE_MOVED",bit:4,group:"VCU"},{name:"BMS_DISCHARGE_OVER_CURRENT",bit:30,group:"BMS"},{name:"BMS_CHARGE_OVER_CURRENT",bit:31,group:"BMS"},{name:"BMS_SHORT_CIRCUIT",bit:32,group:"BMS"},{name:"BMS_DISCHARGE_OVER_TEMPERATURE",bit:33,group:"BMS"},{name:"BMS_DISCHARGE_UNDER_TEMPERATURE",bit:34,group:"BMS"},{name:"BMS_CHARGE_OVER_TEMPERATURE",bit:35,group:"BMS"},{name:"BMS_CHARGE_UNDER_TEMPERATURE",bit:36,group:"BMS"},{name:"BMS_UNDER_VOLTAGE",bit:37,group:"BMS"},{name:"BMS_OVER_VOLTAGE",bit:38,group:"BMS"},{name:"BMS_OVER_DISCHARGE_CAPACITY",bit:39,group:"BMS"},{name:"BMS_UNBALANCE",bit:40,group:"BMS"},{name:"BMS_SYSTEM_FAILURE",bit:41,group:"BMS"},{name:"BMS_WARNING_OVER_CURRENT",bit:42,group:"BMS"},{name:"BMS_WARNING_OVER_TEMPERATURE",bit:43,group:"BMS"},{name:"BMS_WARNING_UNDER_VOLTAGE",bit:44,group:"BMS"},{name:"BMS_WARNING_UNBALANCE",bit:45,group:"BMS"}];var i=r("2ef0"),a=r("cfbf");const o=r("da5a"),u=(e,t)=>1&o.fromNumber(e,1).shiftRight(t),c=e=>n.filter((({bit:t})=>u(e.val,t))).map((({name:e})=>e)),s=e=>Object(i["groupBy"])(e.reduce(((e,{eventsGroup:t,logDatetime:r})=>e.concat(...n.filter((({bit:e})=>u(t.val,e))).map((({name:e})=>({time:a["a"].unix(r.val).format("HH:mm:ss"),name:e}))))),[]),"name")}});