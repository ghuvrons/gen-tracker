(function(e){function t(t){for(var n,a,c=t[0],s=t[1],u=t[2],d=0,f=[];d<c.length;d++)a=c[d],Object.prototype.hasOwnProperty.call(i,a)&&i[a]&&f.push(i[a][0]),i[a]=0;for(n in s)Object.prototype.hasOwnProperty.call(s,n)&&(e[n]=s[n]);l&&l(t);while(f.length)f.shift()();return o.push.apply(o,u||[]),r()}function r(){for(var e,t=0;t<o.length;t++){for(var r=o[t],n=!0,a=1;a<r.length;a++){var s=r[a];0!==i[s]&&(n=!1)}n&&(o.splice(t--,1),e=c(c.s=r[0]))}return e}var n={},i={1:0},o=[];function a(e){return c.p+"js/"+({}[e]||e)+"."+{2:"af5bb519",3:"279e9439",4:"b5ab72cd"}[e]+".js"}function c(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,c),r.l=!0,r.exports}c.e=function(e){var t=[],r=i[e];if(0!==r)if(r)t.push(r[2]);else{var n=new Promise((function(t,n){r=i[e]=[t,n]}));t.push(r[2]=n);var o,s=document.createElement("script");s.charset="utf-8",s.timeout=120,c.nc&&s.setAttribute("nonce",c.nc),s.src=a(e);var u=new Error;o=function(t){s.onerror=s.onload=null,clearTimeout(d);var r=i[e];if(0!==r){if(r){var n=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;u.message="Loading chunk "+e+" failed.\n("+n+": "+o+")",u.name="ChunkLoadError",u.type=n,u.request=o,r[1](u)}i[e]=void 0}};var d=setTimeout((function(){o({type:"timeout",target:s})}),12e4);s.onerror=s.onload=o,document.head.appendChild(s)}return Promise.all(t)},c.m=e,c.c=n,c.d=function(e,t,r){c.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},c.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},c.t=function(e,t){if(1&t&&(e=c(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(c.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)c.d(r,n,function(t){return e[t]}.bind(null,n));return r},c.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return c.d(t,"a",t),t},c.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},c.p="",c.oe=function(e){throw console.error(e),e};var s=window["webpackJsonp"]=window["webpackJsonp"]||[],u=s.push.bind(s);s.push=t,s=s.slice();for(var d=0;d<s.length;d++)t(s[d]);var l=u;o.push([0,0]),r()})({0:function(e,t,r){e.exports=r("2f39")},"004b":function(e,t,r){"use strict";(function(e){var n=r("9944"),i=r("b7fa3"),o=r("8b56"),a=r("a55c"),c=r("6ad4"),s=r("2ef0"),u=r("e4fd"),d=r("8d7e");const{useState:l,useGetters:f,useActions:b}=Object(d["a"])("db");t["a"]=function({publisher:t,ignoreResponse:r}){const{commands:d}=l(["commands"]),{devDevice:m}=f(["devDevice"]),{[c["b"]]:p}=b([c["b"]]),g=e=>{if(!e)return Object(i["c"])("No payload");if(!m.value)return Object(i["c"])("No device");const{unitID:t,status:r,commandable:n,lastCommand:o}=m.value;if(o&&Object(a["b"])(o))return Object(i["c"])("Command busy");if(!n)return Object(i["c"])("Device busy");e=e.toUpperCase();const c=Object(a["e"])(e);return c?"string"===typeof c?Object(i["c"])(c):void p(Object(a["c"])(c,t)):void 0},O=e=>{const t=Object(s["get"])(m.value,"lastCommand");if(!Object(a["b"])(t))return;const{sendDatetime:i,unitID:c,timeout:u}=t;if(c!=e.unitID.val)return;const d=Object(n["c"])(i,"seconds");u<30?d>u&&r(o["a"].TIMEOUT):d>30&&r(o["a"].UNKNOWN)};return Object(u["watch"])((()=>d.value.length),((r,n)=>{if(r>n){const{unitID:r,hexCmd:n}=d.value[0],i=e.from(n,"hex");console.log(`COMMAND ${n}`),t(r,i)}}),{deep:!0}),{sendCommand:g,handleLostCommand:O}}}).call(this,r("1c35").Buffer)},"0161":function(e,t,r){"use strict";r.d(t,"a",(function(){return s})),r.d(t,"b",(function(){return u}));r("13d5");var n=r("ded3"),i=r.n(n),o=r("9944"),a=r("b9a2"),c=r("9482");const s=(e,t)=>{let r=0;return t.reduce(((t,n)=>{let o=n.format(e.substr(r,2*n.size));return r+=2*n.size,t.concat([i()(i()({},n),{},{value:o,output:n.display(o)})])}),[])},u=(e,t)=>{const r=t==c["a"].prefix.report?a["b"]:a["a"],n=s(e,r);if(Object(o["g"])(n,"prefix")!=t)return console.warn("CORRUPT: Prefix not same");const i=r.filter((({field:e})=>["prefix","size"].includes(e))).map((({size:e})=>e)).reduce(((e,t)=>e+t));return Object(o["g"])(n,"size")!=e.length/2-i?console.warn("CORRUPT: Size not same"):n}},"018e":function(e,t){},2166:function(e,t,r){"use strict";r.d(t,"h",(function(){return n})),r.d(t,"g",(function(){return i})),r.d(t,"f",(function(){return a})),r.d(t,"e",(function(){return o})),r.d(t,"d",(function(){return c})),r.d(t,"a",(function(){return s})),r.d(t,"b",(function(){return d})),r.d(t,"c",(function(){return u}));r("4d90");const n=(e,t)=>e.toString(16).padStart(t,"0"),i=e=>parseInt(e,16),o=e=>{e.length%2!==0&&(e="0"+e);let t=parseInt(e,16),r=Math.pow(2,e.length/2*8);return t>r/2-1&&(t-=r),t},a=e=>{let t=parseInt(e,16);return t>127&&(t-=256),t},c=e=>{let t="";e=e.toString();for(let r=0;r<e.length&&"00"!==e.substr(r,2);r+=2)t+=String.fromCharCode(parseInt(e.substr(r,2),16));return t},s=e=>{let t=[];for(let r=0,n=e.length;r<n;r++)t.push(Number(e.charCodeAt(r)).toString(16));return t.join("")},u=(e,t=0)=>Number(e).toLocaleString("id",{minimumFractionDigits:t,maximumFractionDigits:t}),d=e=>{const t=[];let r=e.length-2;while(r>=0)t.push(e.substr(r,2)),r-=2;return t.join("")}},"2f39":function(e,t,r){"use strict";r.r(t);r("e6cf"),r("5319"),r("7d6e"),r("e54f"),r("62f2"),r("7e6d");var n=r("2b0e"),i=r("1f91"),o=r("42d2"),a=r("b05d"),c=r("436b"),s=r("2a19"),u=r("b12a"),d=r("18d6");n["default"].use(a["a"],{config:{notify:{type:"info"}},lang:i["a"],iconSet:o["a"],plugins:{Dialog:c["a"],Notify:s["a"],AppFullscreen:u["a"],LocalStorage:d["a"]}});var l=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"q-app"}},[r("router-view")],1)},f=[],b=r("0161"),m=r("b7fa3"),p=r("9482"),g=r("a7bc"),O=r("a55c"),v=r("cfbf"),j=r("8d7e");const{useMutations:h}=Object(j["a"])("db");var D=function({addDevices:e}){const{[g["d"]]:t,[g["j"]]:r,[g["h"]]:n}=h([g["d"],g["j"],g["h"]]),i=({payload:i,unitID:o,message:a})=>{let{prop:c,value:s}=Object(O["d"])(i);"FINGER_FETCH"==c?(a.length>0&&a.split(",").forEach((e=>t({unitID:o,fingerID:e}))),e([{unitID:o,fingerTime:Object(v["a"])().unix()}])):"FINGER_ADD"==c?t({unitID:o,fingerID:a}):"FINGER_DEL"==c?r({unitID:o,fingerID:s}):"FINGER_RST"==c&&n({unitID:o})};return{handleFinger:i}},E=r("ded3"),I=r.n(E),S=r("6ad4"),C=r("9944"),R=r("8b56"),y=r("2ef0"),_=r("e4fd"),N=r.n(_);const{useGetters:M,useActions:T}=Object(j["a"])("db");var w=function({publisher:e,handleFinger:t}){const{devDevice:r,getDeviceByUnitID:n}=M(["devDevice","getDeviceByUnitID"]),{[S["d"]]:i}=T([S["d"]]),o=(e,t)=>{if(Object(O["b"])(e)){const r=Object(R["b"])(t);Object(R["c"])(r);const{unitID:n,sendDatetime:o,code:a,subCode:c,payload:s}=e;i(I()({unitID:n,sendDatetime:o,code:a,subCode:c,payload:s},r))}},a=t=>{const r=Object(R["f"])(t),i=Object(C["g"])(r,"unitID"),a=n.value(i);if(!a)return;const{lastCommand:c}=a;if(!Object(O["b"])(c))return console.error(`RESPONSE ${t}`);console.warn(`RESPONSE ${t}`),Object(R["g"])(c,r)&&(o(c,r),e(i,null))},c=t=>{const n=Object(y["get"])(r.value,"lastCommand"),{unitID:i}=r.value;o(n,t||R["a"].CANCELLED),e(i,null),Object(m["c"])("Device commandable","info")};return Object(_["watch"])((()=>r.value),(e=>{const r=Object(y["get"])(e,"lastCommand");r&&(Object(O["b"])(r)||r.resCode==R["a"].OK&&t(r))}),{deep:!0}),{ignoreResponse:c,handleResponse:a}},U=r("004b");const{useState:A,useMutations:B,useActions:x}=Object(j["a"])("db");var k=function({handleReports:e}){const t=Object(_["ref"])(null),{buffers:r}=A(["buffers"]),{[g["i"]]:n,[g["n"]]:i}=B([g["i"],g["n"]]),{[S["a"]]:o}=x([S["a"]]),a=()=>{if(r.value.length>0){const t=r.value;e(t),n(t)}else i()};return Object(_["onMounted"])((()=>t.value=setInterval(a,1e3))),Object(_["onBeforeUnmount"])((()=>clearInterval(t.value))),{insertBuffers:o}},P=(r("13d5"),r("ddb0"),r("af6a"));const{useState:q,useGetters:z,useMutations:F,useActions:V}=Object(j["a"])("db");var L=function({handleEvents:e,handleLostCommand:t}){const{reports:r}=q(["reports"]),{devDevice:n}=z(["devDevice"]),{[g["k"]]:i}=F([g["k"]]),{[S["c"]]:o}=V([S["c"]]),a=Object(j["a"])("common"),{follow:c}=a.useState(["follow"]),s=e=>{const{val:t}=e.sendDatetime,{val:n}=e.logDatetime;return r.value.some((({logDatetime:e})=>e.val==n))?(Object(m["c"])("Report duplicate","info"),console.error("^REPORT (DUPLICATE)")):(Math.abs(Object(C["c"])(t,"years"))>1&&(Object(m["c"])("Report expired","info"),console.error("^REPORT (EXPIRED)")),e)},u=e=>{let t=e.reduce(((e,t)=>{console.log(`REPORT ${t}`);let r=s(Object(P["d"])(t));return r?[...e,r]:e}),[]);o(t)};return Object(_["watch"])((()=>n.value),((t,r)=>{const n=Object(y["get"])(t,"lastReport"),o=Object(y["get"])(r,"lastReport");if(!n)return i(null);(n.unitID.val!=Object(y["get"])(o,"unitID.val")||c.value)&&i(n),e(n,o)}),{lazy:!1,immediate:!0,deep:!0}),{handleReports:u}},G=r("fd30");const{useState:$}=Object(j["a"])("common");var H=function(){const{notification:e}=$(["notification"]),t=(t,r)=>{if(!e.value)return;if(!r)return;let n=Object(G["d"])(t.eventsGroup),i=Object(G["d"])(r.eventsGroup),o=n.filter((e=>!i.includes(e)));o.forEach((e=>Object(m["d"])(e,t.logDatetime.out)))};return{handleEvents:t}};const{useGetters:Y,useMutations:K}=Object(j["a"])("db");var W=function(){const{devDevice:e}=Y(["devDevice"]),{[g["c"]]:t}=K([g["c"]]);return Object(_["watch"])((()=>e.value),((e,t)=>{if(!e||!t)return;const{status:r}=t,{status:n}=e;r!=n&&Object(m["d"])("DEVICE "+(n?"ONLINE":"OFFLINE"),Object(v["a"])().format("ddd, DD-MM-YY HH:mm:ss"))}),{deep:!0}),{addDevices:t}},J={setup(e,{root:t}){const r=(e,r)=>{t.$mqtt.publish(`VCU/${e}/CMD`,r,{qos:2,retain:!0},(e=>e&&Object(m["c"])(e))),r||t.$mqtt.publish(`VCU/${e}/RSP`,null,{qos:1,retain:!0},(e=>e&&Object(m["c"])(e)))},{addDevices:n}=W(),{handleFinger:i}=D({addDevices:n}),{handleResponse:o,ignoreResponse:a}=w({publisher:r,handleFinger:i}),{sendCommand:c,handleLostCommand:s}=Object(U["a"])({publisher:r,ignoreResponse:a}),{handleEvents:u}=H(),{handleReports:d}=L({handleEvents:u,handleLostCommand:s}),{insertBuffers:l}=k({handleReports:d});return Object(_["onMounted"])((()=>{t.$mqtt.subscribe("VCU/+/CMD",{qos:1}),t.$mqtt.subscribe("VCU/+/RPT",{qos:1}),t.$mqtt.subscribe("VCU/+/RSP",{qos:1}),t.$mqtt.subscribe("VCU/+/STS",{qos:1})})),Object(_["provide"])("ignoreResponse",a),Object(_["provide"])("sendCommand",c),{validateFrame:b["b"],insertBuffers:l,handleResponse:o,addDevices:n}},mqtt:{"VCU/+/CMD":function(e,t){const r=parseInt(t.split("/")[1]),n=e.toString("hex").toUpperCase();console.warn(`COMMANDABLE ${r}, ${!n}`),this.addDevices([{unitID:r,commandable:!n}])},"VCU/+/RSP":function(e,t){const r=e.toString("hex").toUpperCase();if(r)return Object(b["b"])(r,p["a"].prefix.response)?void this.handleResponse(r):console.error(`CORRUPT ${r}`)},"VCU/+/RPT":function(e,t){const r=e.toString("hex").toUpperCase();if(r)return Object(b["b"])(r,p["a"].prefix.report)?void this.insertBuffers([r]):console.error(`CORRUPT ${r}`)},"VCU/+/STS":function(e,t){const r=parseInt(t.split("/")[1]),n=parseInt(e);console.warn(`STATUS ${r},${n}`),this.addDevices([{unitID:r,status:n}])}}},X=J,Q=r("2877"),Z=Object(Q["a"])(X,l,f,!1,null,null,null),ee=Z.exports,te=r("2f62"),re=r("bfa9"),ne=function(){return{darker:!1,tree:!1,follow:!0,notification:!0}},ie=r("4930b"),oe=r.n(ie),ae=r("5662"),ce={[ae["a"]](e,t){e.darker=t},[ae["b"]](e,t){e.follow=t},[ae["d"]](e,t){e.tree=t},[ae["c"]](e,t){e.notification=t}},se=r("018e"),ue=r.n(se),de={namespaced:!0,state:ne,getters:oe.a,mutations:ce,actions:ue.a},le=function(){return{buffering:null,buffers:[],unitID:null,devices:[],report:null,reports:[],commands:[],fingers:[]}},fe={reportIdxByUnitID:({reports:e})=>e.reduce(((e,{unitID:t},r)=>(e[t.val]=e[t.val]||[],e[t.val].push(r),e)),{}),reportByUnitID:(e,t)=>r=>(t.reportIdxByUnitID[r]||[]).map((t=>e.reports[t])),getDeviceByUnitID:({devices:e},t)=>t=>e.find((e=>e.unitID===t)),devReports({unitID:e},t){return t.reportByUnitID(e)},devEvents(e,t){return Object(G["b"])(t.devReports)},devDevice({devices:e,unitID:t}){return e.find((e=>e.unitID===t))},devCommands({commands:e,unitID:t}){return e.filter((e=>e.unitID===t))},devResponses({responses:e,unitID:t}){return e.filter((e=>e.unitID===t))},devFingers({fingers:e,unitID:t}){return e.filter((e=>e.unitID===t))}},be=(r("a434"),{[g["g"]](e){Object.assign(e,le())},[g["l"]](e,t){e.unitID=t},[g["k"]](e,t){e.report=t},[g["c"]](e,t){t.forEach((t=>{let r=e.devices.findIndex((({unitID:e})=>e===t.unitID));r<0?e.devices.unshift(I()({status:0,sendDatetime:0,commandable:!0},t)):e.devices.splice(r,1,I()(I()({},e.devices[r]),t))})),e.unitID||(e.unitID=t[t.length-1].unitID)},[g["m"]](e){e.buffering||(e.buffering=Object(m["b"])("Syncing...","Please wait a moment"))},[g["n"]](e){if(e.buffering){try{e.buffering.hide()}catch(t){console.warn(t)}e.buffering=null}},[g["a"]](e,t){e.buffers.push(...t)},[g["i"]](e,t){e.buffers=[...e.buffers.filter((e=>!t.includes(e)))]},[g["e"]](e,t){const r=t.map((e=>Object.freeze(e)));e.reports=[...Object(y["orderBy"])([...e.reports,...r],"logDatetime.val","desc")],e.reports.length>p["a"].maxStorage.reports-1&&e.reports.splice(p["a"].maxStorage.reports,e.reports.length-p["a"].maxStorage.reports)},[g["b"]](e,t){e.commands.unshift(t),e.commands.length>p["a"].maxStorage.commands&&e.commands.pop()},[g["f"]](e,t){let r=e.commands.findIndex((({unitID:e})=>e===t.unitID));r>=0&&e.commands.splice(r,1,t)},[g["d"]](e,t){let r=e.fingers.find((({unitID:e,fingerID:r})=>e===t.unitID&&r===t.fingerID));r||e.fingers.unshift(t)},[g["j"]](e,t){let r=e.fingers.findIndex((({unitID:e,fingerID:r})=>e===t.unitID&&r===t.fingerID));e.fingers.splice(r,1)},[g["h"]](e,t){e.fingers=e.fingers.filter((({unitID:e})=>e!==t.unitID))}}),me=(r("26e9"),r("fb6a"),{[S["a"]]({state:e,commit:t},r){r.length>1&&t(g["m"]),t(g["a"],r)},[S["c"]]({state:e,commit:t},r){r.length>1&&t(g["m"]),t(g["e"],r.slice().reverse()),t(g["c"],r.map((e=>I()({unitID:e.unitID.val,sendDatetime:e.sendDatetime.val,lastReport:e},"FULL"==Object(C["e"])(e.frameID.val)&&{lastFullReport:e}))))},[S["b"]]({commit:e},t){e(g["b"],t),e(g["c"],[{unitID:t.unitID,lastCommand:t}])},[S["d"]]({state:e,commit:t},r){t(g["f"],r),t(g["c"],[{unitID:r.unitID,lastCommand:r}])}}),pe={namespaced:!0,state:le(),getters:fe,mutations:be,actions:me};n["default"].use(te["a"]);const ge=["common","db"].map((e=>new re["a"]({key:`${e}_key`,storage:window.localStorage,reducer:t=>({[e]:I()({},t[e])})}).plugin));var Oe=function(){const e=new te["a"].Store({modules:{common:de,db:pe},plugins:[...ge],strict:!1});return e},ve=r("8c4f");const je=[{path:"/",component:()=>Promise.all([r.e(0),r.e(2)]).then(r.bind(null,"713b")),children:[{path:"",component:()=>Promise.all([r.e(0),r.e(4)]).then(r.bind(null,"8b24"))}]}];je.push({path:"*",component:()=>Promise.all([r.e(0),r.e(3)]).then(r.bind(null,"e51e"))});var he=je;n["default"].use(ve["a"]);var De=function(){const e=new ve["a"]({scrollBehavior:()=>({y:0}),routes:he,mode:"hash",base:""});return e},Ee=async function(){const e="function"===typeof Oe?await Oe({Vue:n["default"]}):Oe,t="function"===typeof De?await De({Vue:n["default"],store:e}):De;e.$router=t;const r={router:t,store:e,render:e=>e(ee),el:"#q-app"};return{app:r,store:e,router:t}},Ie=r("9483");Object(Ie["a"])("service-worker.js",{ready(){console.log("App is being served from cache by a service worker.")},registered(e){console.log("Service worker has been registered.")},cached(e){console.log("Content has been cached for offline use.")},updatefound(e){console.log("New content is downloading.")},updated(e){console.log("New content is available; please refresh."),s["a"].create({message:"New content is available; please refresh.",color:"red",icon:"refresh",timeout:0,actions:[{label:"Refresh",color:"yellow",handler:()=>{window.localStorage.removeItem("db_key"),window.location.reload()}},{label:"Dismiss",color:"white",handler:()=>{}}]})},offline(){console.log("No internet connection found. App is running in offline mode.")},error(e){console.error("Error during service worker registration:",e)}});var Se=({Vue:e})=>{e.mixin({computed:{}})},Ce=({app:e,router:t,Vue:r})=>{r.use(N.a)},Re=r("daa7"),ye=r.n(Re),_e=r("0967");const{mqtt:Ne}=p["a"];var Me=({app:e,router:t,store:r,Vue:n})=>{let i=d["a"].getItem("clientId");i||(i="mqttjs_"+Math.random().toString(16).substr(2,8),d["a"].set("clientId",i)),n.use(ye.a,`wss://${Ne.address}:${Ne.port}${Ne.path}`,{username:Ne.username,password:Ne.password,clean:_e["b"].is.mobile,clientId:i})},Te=r("755e"),we=({app:e,router:t,Vue:r})=>{r.use(Te,{load:{key:"AIzaSyBE8UhrrFkz9m37oowPkHX9to8NXcHw4Ak",region:"ID",language:"id"}})};/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream&&window.navigator.standalone&&r.e(0).then(r.t.bind(null,"a0db",7));const Ue="";async function Ae(){const{app:e,store:t,router:r}=await Ee();let i=!1;const o=e=>{i=!0;const t=Object(e)===e?r.resolve(e).route.fullPath:e;window.location.href=t},a=window.location.href.replace(window.location.origin,""),c=[Se,Ce,Me,we];for(let u=0;!1===i&&u<c.length;u++)if("function"===typeof c[u])try{await c[u]({app:e,router:r,store:t,Vue:n["default"],ssrContext:null,redirect:o,urlPath:a,publicPath:Ue})}catch(s){return s&&s.url?void(window.location.href=s.url):void console.error("[Quasar] boot error:",s)}!0!==i&&new n["default"](e)}Ae()},"4930b":function(e,t){},5662:function(e,t,r){"use strict";r.d(t,"a",(function(){return n})),r.d(t,"d",(function(){return i})),r.d(t,"b",(function(){return o})),r.d(t,"c",(function(){return a}));const n="SET_DARKER",i="SET_TREE",o="SET_FOLLOW",a="SET_NOTIFICATION"},"5f15":function(e,t,r){"use strict";r.d(t,"b",(function(){return l})),r.d(t,"a",(function(){return g}));r("13d5"),r("ddb0");var n=r("ded3"),i=r.n(n),o=r("cfbf"),a=r("9482"),c=r("2ef0"),s=r("9944"),u=r("b9a2"),d=r("2166");const l={UNKNOWN:-3,LOST:-2,BACKUP:-1,NORMAL:0,STANDBY:1,READY:2,RUN:3},f=e=>Object.keys(l)[Object.values(l).findIndex((t=>t===parseInt(e)))],b=({required:e})=>[{group:"packet",field:"frameID",title:"Frame ID",required:!0,chartable:!0,size:1,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>a["a"].frames[e]},{group:"packet.datetime",field:"logDatetime",title:"Log Datetime",required:!0,chartable:!0,size:7,format:e=>Number(Object(o["a"])(Object(s["h"])(e),"YYMMDDHHmmss0d").unix()),display:e=>o["a"].unix(e).format("ddd, DD-MM-YY HH:mm:ss")},{group:"vcu",field:"driverID",title:"Driver ID",required:!0,chartable:!0,size:1,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>255===e?"NONE":Object(d["h"])(e,2).toUpperCase()},{group:"vcu",field:"eventsGroup",title:"Events Group",required:!0,chartable:!0,size:8,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["h"])(e,16).toUpperCase()},{group:"vcu",field:"vehicleState",title:"Vehicle State",required:!0,chartable:!0,size:1,format:e=>Object(d["f"])(Object(d["b"])(e)),display:e=>f(e)},{group:"vcu",field:"uptime",title:"Uptime",required:!0,chartable:!0,unit:"s",size:4,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu.gps",field:"gpsLongitude",title:"GPS Longitude",required:!1,chartable:!0,size:4,format:e=>1e-7*Object(d["e"])(Object(d["b"])(e)),display:e=>parseFloat(e.toFixed(7))},{group:"vcu.gps",field:"gpsLatitude",title:"GPS Latitude",required:!1,chartable:!0,size:4,format:e=>1e-7*Object(d["e"])(Object(d["b"])(e)),display:e=>parseFloat(e.toFixed(7))},{group:"vcu.gps",field:"gpsAltitude",title:"GPS Altitude",required:!1,chartable:!0,unit:"m",size:4,format:e=>.1*Object(d["g"])(Object(d["b"])(e)),display:e=>parseFloat(e.toFixed(2))},{group:"vcu.gps",field:"gpsHDOP",title:"GPS HDOP",required:!1,chartable:!0,size:1,format:e=>.1*Object(d["g"])(Object(d["b"])(e)),display:e=>parseFloat(e.toFixed(2))},{group:"vcu.gps",field:"gpsVDOP",title:"GPS VDOP",required:!1,chartable:!0,size:1,format:e=>.1*Object(d["g"])(Object(d["b"])(e)),display:e=>parseFloat(e.toFixed(2))},{group:"vcu.gps",field:"gpsHeading",title:"GPS Heading",required:!1,chartable:!0,unit:"Degree",size:1,format:e=>2*Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu.gps",field:"gpsSatInUse",title:"GPS Sat. in use",required:!1,chartable:!0,unit:"Sat.",size:1,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu",field:"speed",title:"Vehicle Speed",required:!1,chartable:!0,unit:"Km/hr",size:1,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu.trip",field:"odometer",title:"Odometer",required:!1,chartable:!0,unit:"Km",size:4,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu",field:"signal",title:"Signal Quality",required:!1,chartable:!0,unit:"%",size:1,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu",field:"batVoltage",title:"Battery Voltage",required:!1,chartable:!0,unit:"mVolt",size:1,format:e=>18*Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu.estimation",field:"rangeEstimation",title:"Range Estimation",required:!1,chartable:!0,unit:"Km",size:1,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu.estimation",field:"batteryEstimation",title:"Battery Estimation",required:!1,chartable:!0,unit:"Km/kWh",size:1,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu.trip",field:"tripA",title:"Trip A",required:!1,chartable:!0,unit:"m",size:4,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu.trip",field:"tripB",title:"Trip B",required:!1,chartable:!0,unit:"m",size:4,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)}].filter((({required:t})=>t===e)),m=({required:e})=>["One","Two"].reduce(((e,t)=>e.concat([{group:`bms.${t}`,field:`bms${t}Id`,title:`BMS ${t} ID`,required:!0,size:4,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>4294967295===e?"NONE":Object(d["h"])(e,8).toUpperCase()},{group:`bms.${t}`,field:`bms${t}Voltage`,title:`BMS ${t} Voltage`,required:!0,chartable:!0,unit:"Volt",size:2,format:e=>.01*Object(d["g"])(Object(d["b"])(e)),display:e=>e.toFixed(2)},{group:`bms.${t}`,field:`bms${t}Current`,title:`BMS ${t} Current`,required:!0,chartable:!0,unit:"Ampere",size:2,format:e=>.01*Object(d["g"])(Object(d["b"])(e))-50,display:e=>e.toFixed(2)},{group:`bms.${t}`,field:`bms${t}Soc`,title:`BMS ${t} SoC`,required:!1,chartable:!0,unit:"%",size:2,format:e=>.01*Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:`bms.${t}`,field:`bms${t}Temperature`,title:`BMS ${t} Temperature`,required:!1,chartable:!0,unit:"Celcius",size:2,format:e=>.1*Object(d["g"])(Object(d["b"])(e))-40,display:e=>e.toFixed(2)}])),[]).filter((({required:t})=>t===e)),p=()=>{const e=["managerTask","iotTask","reporterTask","commandTask","gpsTask","gyroTask","remoteTask","fingerTask","audioTask","gateTask","canRxTask","canTxTask"],t=["Yaw (U/D)","Pitch (F/B)","Roll (L/R)"];return[...e.reduce(((e,t)=>e.concat([{group:"vcu.task.wakeup",field:`${t}Wakeup`,title:`${Object(c["startCase"])(t)} wakeup`,required:!1,chartable:!0,unit:"s",size:1,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)},{group:"vcu.task.stack",field:`${t}Stack`,title:`${Object(c["startCase"])(t)} stack`,required:!1,chartable:!0,unit:"Bytes",size:2,format:e=>Object(d["g"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)}])),[]),...t.reduce(((e,t)=>e.concat([{group:"vcu.gyro",field:`gyro${t}`,title:`Gyro ${t}`,required:!1,chartable:!0,unit:"Degree",size:1,format:e=>Object(d["f"])(Object(d["b"])(e)),display:e=>Object(d["c"])(e)}])),[])]},g=[...u["b"],...b({required:!0}),...m({required:!0}),...b({required:!1}),...m({required:!1}),...p()].map(((e,t)=>i()(i()({},e),{},{no:t})))},"6ad4":function(e,t,r){"use strict";r.d(t,"a",(function(){return n})),r.d(t,"c",(function(){return i})),r.d(t,"b",(function(){return o})),r.d(t,"d",(function(){return a}));const n="INSERT_BUFFERS",i="INSERT_REPORTS",o="INSERT_COMMAND",a="INSERT_RESPONSE"},"7e6d":function(e,t,r){},"8b56":function(e,t,r){"use strict";r.d(t,"a",(function(){return d})),r.d(t,"f",(function(){return f})),r.d(t,"g",(function(){return b})),r.d(t,"b",(function(){return g})),r.d(t,"e",(function(){return m})),r.d(t,"d",(function(){return O})),r.d(t,"c",(function(){return v}));r("5319");var n=r("9944"),i=r("0161"),o=r("b7fa3"),a=r("5f15"),c=(r("ddb0"),r("b9a2")),s=r("2166");const u=[...c["a"],{field:"resCode",title:"Response Code",required:!0,size:1,format:e=>Object(s["g"])(e),display:e=>{let t=l.find((({resCode:t})=>t===e));return t||(t=l.find((({resCode:e})=>e===d.UNKNOWN))),t.name}},{field:"message",title:"Message",required:!0,size:200,format:e=>Object(s["d"])(e),display:e=>e}],d={ERROR:0,OK:1,INVALID:2,CANCELLED:255,TIMEOUT:256,UNKNOWN:257},l=[{resCode:0,name:"Error",icon:"error",color:"red"},{resCode:1,name:"Ok",icon:"check",color:"green"},{resCode:2,name:"Invalid",icon:"remove_circle",color:"blue"},{resCode:255,name:"Cancelled",icon:"cancel",color:"yellow"},{resCode:256,name:"Timeout",icon:"timer_off",color:"orange"},{resCode:257,name:"Unknown",icon:"help",color:"purple"}],f=e=>Object(i["a"])(e,u),b=(e,t)=>{if(Object(n["g"])(t,"unitID")==e.unitID&&Object(n["g"])(t,"code")==e.code&&Object(n["g"])(t,"subCode")==e.subCode)return!0},m=e=>l.find((({resCode:t})=>t===e)),p=e=>m(e)||m(d.UNKNOWN),g=e=>{let t,r;return"object"===typeof e?(t=p(Object(n["g"])(e,"resCode")),r=Object(n["g"])(e,"message")):t=p(e),t||(t=p(d.UNKNOWN)),{resCode:t.resCode,message:r}},O=e=>{if(!e)return;let t=Object.keys(a["b"]),r=Object.values(a["b"]);return e.replace(/\{(.+?)\}/g,(function(e,n){let i=r.findIndex((e=>e===parseInt(n)));return t[i]}))},v=({resCode:e})=>{let t=e==d.OK,r=m(e),n=t?"positive":"negative",i=t?"Command sent.":`Command ${r.name}`;Object(o["c"])(i,n)}},9482:function(e,t,r){"use strict";var n=r("0967");t["a"]={app:{version:"1.99",title:"eBike Tracker",subTitle:"GEN Indonesia"},mqtt:{address:"mqtt.eclipseprojects.io",port:443,path:"/mqtt",username:"",password:""},command:{timeout:10},prefix:{report:"@R",command:"@C",response:"@S"},frames:["SIMPLE","FULL"],map:{zoom:3,centerIndonesia:{lat:-2.6000285,lng:118.015776},borderIndonesia:{lngMin:95.011198,lngMax:141.020354,latMin:-11.107187,latMax:5.90713}},timezone:"Asia/Jakarta",maxStorage:{reports:n["b"].is.desktop?500:100,responses:n["b"].is.desktop?50:10,commands:n["b"].is.desktop?50:10}}},9944:function(e,t,r){"use strict";r.d(t,"d",(function(){return d})),r.d(t,"f",(function(){return l})),r.d(t,"g",(function(){return f})),r.d(t,"b",(function(){return m})),r.d(t,"h",(function(){return p})),r.d(t,"a",(function(){return g})),r.d(t,"c",(function(){return b})),r.d(t,"e",(function(){return O}));r("13d5"),r("4d90");var n=r("ded3"),i=r.n(n),o=r("9482"),a=r("2166"),c=r("2ef0"),s=r("cfbf");const u=r("e002"),d=(e,t)=>Object(c["filter"])(e,Object(c["flow"])(c["identity"],c["values"],c["join"],c["toLower"],Object(c["partialRight"])(c["includes"],t))),l=(e,t,r)=>{let n=e.find((({field:e})=>e===t));return Array.isArray(t)?t.reduce(((t,o)=>(n=e.find((({field:e})=>e===o)),i()(i()({},t),{},{[o]:r?n[r]:n}))),{}):r?n[r]:n},f=(e,t)=>l(e,t,"value"),b=(e,t,r)=>{let n=Object(s["a"])();r&&(n=s["a"].unix(r));let i=n.diff(s["a"].unix(e));return s["a"].duration(i).as(t)},m=({gpsLatitude:e,gpsLongitude:t,sendDatetime:r})=>{let n=Object(c["clone"])(o["a"].timezone);e.val&&t.val&&(n=u(e.val,t.val));let i=Object(s["a"])();return i.tz(n).format("YYMMDDHHmmss0d")},p=e=>{let t=e.match(/.{1,2}/g);return t.reduce(((e,t)=>e.concat(Object(a["g"])(t).toString().padStart(2,"0"))),"")},g=e=>{let t=e.match(/.{1,2}/g);return t.reduce(((e,t)=>e.concat(Object(a["h"])(parseInt(t),2))),"").toUpperCase()},O=e=>o["a"].frames[e]},a55c:function(e,t,r){"use strict";r.d(t,"a",(function(){return d})),r.d(t,"b",(function(){return f})),r.d(t,"e",(function(){return p})),r.d(t,"c",(function(){return b})),r.d(t,"d",(function(){return m}));r("c975"),r("13d5"),r("ddb0");var n=r("ded3"),i=r.n(n),o=r("cfbf"),a=r("b9a2"),c=r("2166"),s=r("9944");const u=[...a["a"],{field:"value",title:"Value",size:200,formatCmd:(e,t)=>Object(c["b"])(Object(c["h"])(parseInt(e||0),2*(t||0)))}],d=[{command:"GEN_INFO",desc:"Gather device information",code:0,subCode:0},{command:"GEN_LED",desc:"Control system led",code:0,subCode:1,size:1,type:"bool",range:[0,1]},{command:"GEN_OVERRIDE",desc:"Override vehicle state",code:0,subCode:2,size:1,type:"uint8_t",range:[1,3]},{command:"REPORT_RTC",desc:"Set datetime ( d [0=Sunday] )",code:1,subCode:0,size:7,type:"uint8_t",range:["YYMMDDHHmmss0d"],formatCmd:e=>Object(s["a"])(e),validator:e=>Object(o["a"])(e,"YYMMDDHHmmss0d",!0).isValid()},{command:"REPORT_ODOM",desc:"Set odometer (km)",code:1,subCode:1,size:4,type:"uint32_t",range:[0,99999]},{command:"AUDIO_BEEP",desc:"Beep the audio module",code:2,subCode:0},{command:"AUDIO_MUTE",desc:"Mute the audio module",code:2,subCode:1,size:1,type:"bool",range:[0,1]},{command:"FINGER_FETCH",desc:"Get all registered id",code:3,subCode:0,timeout:15},{command:"FINGER_ADD",desc:"Add a new fingerprint",code:3,subCode:1,timeout:20},{command:"FINGER_DEL",desc:"Delete a fingerprint",code:3,subCode:2,size:1,type:"uint8_t",range:[1,5],timeout:15},{command:"FINGER_RST",desc:"Reset all fingerprints",code:3,subCode:3,timeout:15},{command:"REMOTE_PAIRING",desc:"Keyless pairing mode",code:4,subCode:0,timeout:15},{command:"REMOTE_UNITID",desc:"Set device unique id",code:4,subCode:1,size:4,type:"uint32_t",range:[0,4294967295]},{command:"FOTA_VCU",desc:"Upgrade VCU firmware",code:5,subCode:0,timeout:360},{command:"FOTA_HMI",desc:"Upgrade HMI firmware",code:5,subCode:1,timeout:720},{command:"NET_SEND_USSD",desc:"Send USSD (ex: *123*10*3#)",code:6,subCode:0,size:20,type:"char",formatCmd:e=>Object(c["a"])(e),validator:e=>e.length<20&&e.startsWith("*")&&e.endsWith("#")},{command:"NET_READ_SMS",desc:"Read last SMS",code:6,subCode:1}];var l=r("9482");const f=e=>e&&!e.hasOwnProperty("resCode"),b=(e,t)=>{const r=Object(o["a"])().unix(),n=u.reduce(((n,i,o)=>{let{field:a,formatCmd:c}=u[u.length-o-1];switch(a){case"value":n=e.hasOwnProperty("formatCmd")?e.formatCmd(e.value)+n:c(e.value,e.size)+n;break;case"subCode":case"code":n=c(e[a])+n;break;case"sendDatetime":n=c(r)+n;break;case"unitID":n=c(t)+n;break;case"size":case"prefix":n=c(n)+n;break;default:break}return n}),"").toUpperCase();return i()(i()({},e),{},{unitID:t,sendDatetime:r,hexCmd:n})},m=e=>{let t=e,r=null;return e.indexOf("=")>-1&&(t=e.split("=")[0],r=e.split("=")[1]),{prop:t,value:r}},p=e=>{let{prop:t,value:r}=m(e),n=d.find((({command:e})=>e===t));if(!n)return"Unknown command.";if(n.size){if(!r)return"Command need value";if(n.validator){if(!n.validator(r))return"Value is invalid"}else{const[e,t]=n.range;if(r<e||r>t)return"Value not in range"}}else if(r)return"Command dont need value";return i()(i()({},n),{},{timeout:n.timeout||l["a"].command.timeout,payload:e,value:r})}},a7bc:function(e,t,r){"use strict";r.d(t,"g",(function(){return n})),r.d(t,"l",(function(){return i})),r.d(t,"k",(function(){return o})),r.d(t,"m",(function(){return a})),r.d(t,"n",(function(){return c})),r.d(t,"a",(function(){return s})),r.d(t,"i",(function(){return u})),r.d(t,"c",(function(){return d})),r.d(t,"e",(function(){return l})),r.d(t,"b",(function(){return f})),r.d(t,"f",(function(){return b})),r.d(t,"d",(function(){return m})),r.d(t,"j",(function(){return p})),r.d(t,"h",(function(){return g}));const n="CLEAR_DATABASE",i="SET_UNITID",o="SET_REPORT",a="START_BUFFERING",c="STOP_BUFFERING",s="ADD_BUFFERS",u="FREE_BUFFER",d="ADD_DEVICES",l="ADD_REPORTS",f="ADD_COMMANDS",b="ADD_RESPONSE",m="ADD_FINGERS",p="REMOVE_FINGERS",g="CLEAR_FINGERS"},af6a:function(e,t,r){"use strict";r.d(t,"d",(function(){return d})),r.d(t,"c",(function(){return f})),r.d(t,"e",(function(){return l})),r.d(t,"b",(function(){return b}));r("13d5");var n=r("ded3"),i=r.n(n),o=r("5f15");r.d(t,"a",(function(){return o["a"]}));var a=r("9944"),c=r("0161"),s=r("cfbf");const u=e=>{let t=Object(a["g"])(Object(c["a"])(e,o["a"]),"frameID"),r=o["a"].filter((({required:e})=>"FULL"==Object(a["e"])(t)||"SIMPLE"==Object(a["e"])(t)&&e));return Object(c["a"])(e,r)},d=e=>{let t=u(e);return t.reduce(((e,{field:t,value:r,output:n,unit:o})=>i()(i()({},e),{},{[t]:{val:r,out:n}})),{hex:e})},l=e=>Object.keys(e).reduce(((t,r)=>{let n=e[r];if("hex"!=r){let{group:e,title:t,unit:c}=Object(a["f"])(o["a"],r);n=i()(i()({},n),{},{group:e,title:t,unit:c})}return i()(i()({},t),{},{[r]:n})}),{}),f=(e,t)=>{if(!e)return;let r=t.findIndex((({hex:t})=>t===e.hex));if(!(r<0))while(r<t.length){let e=t[r++];if("FULL"==Object(a["e"])(e.frameID.val))return e}},b=e=>e?s["a"].unix(e).endOf("second").fromNow():"Unknown ago"},b7fa3:function(e,t,r){"use strict";r.d(t,"d",(function(){return c})),r.d(t,"c",(function(){return s})),r.d(t,"a",(function(){return u})),r.d(t,"b",(function(){return d}));var n=r("ff52"),i=r("436b"),o=r("2a19"),a=r("cf57");const c=(e,t)=>{const{protocol:r,host:n}=window.location,i=`${r}//${n}/icons/favicon-32x32.png`,o=()=>{if(!("serviceWorker"in navigator))return console.error("No service worker");navigator.serviceWorker.getRegistration().then((r=>{r?r.showNotification(e,{body:t,icon:i}):new Notification(e,{body:t,icon:i})}))};if(!("Notification"in window))return console.error("No notification support");"granted"===Notification.permission?o():"denied"!==Notification.permission&&Notification.requestPermission().then((e=>"granted"===e&&o()))},s=(e,t="negative",r=5e3)=>o["a"].create({type:t,message:e,timeout:r}),u=e=>i["a"].create({message:e,title:"Confirmation",dark:n["a"].isActive,preventClose:!0,cancel:!0}),d=(e,t)=>i["a"].create({title:e,message:t,dark:n["a"].isActive,persistent:!0,ok:!1,progress:{spinner:a["a"],color:"primary"}})},b9a2:function(e,t,r){"use strict";r.d(t,"b",(function(){return c})),r.d(t,"a",(function(){return s}));r("ddb0");var n=r("9482"),i=r("cfbf"),o=r("2166"),a=r("9944");const c=[{group:"packet",field:"prefix",title:"Prefix",header:!0,required:!0,size:2,format:e=>Object(o["d"])(Object(o["b"])(e)),display:e=>e,formatCmd:e=>Object(o["b"])(Object(o["a"])(n["a"].prefix.command))},{group:"packet",field:"size",title:"Size",header:!0,required:!0,chartable:!0,unit:"Bytes",size:1,format:e=>Object(o["g"])(Object(o["b"])(e)),display:e=>Object(o["c"])(e),formatCmd:e=>Object(o["b"])(Object(o["h"])(e.length/2,2))},{group:"packet",field:"unitID",title:"Unit ID",header:!0,required:!0,size:4,format:e=>Object(o["g"])(Object(o["b"])(e)),display:e=>e,formatCmd:e=>Object(o["b"])(Object(o["h"])(e,8))},{group:"packet.datetime",field:"sendDatetime",title:"Send Datetime",header:!0,required:!0,chartable:!0,size:7,format:e=>Number(Object(i["a"])(Object(a["h"])(e),"YYMMDDHHmmss0d").unix()),display:e=>i["a"].unix(e).format("ddd, DD-MM-YY HH:mm:ss"),formatCmd:e=>Object(a["a"])(i["a"].unix(e).format("YYMMDDHHmmss0d"))}],s=[...c,{group:"command",field:"code",title:"Code",header:!0,required:!0,size:1,format:e=>Object(o["g"])(e),display:e=>e,formatCmd:e=>Object(o["b"])(Object(o["h"])(e,2))},{group:"command",field:"subCode",title:"Sub Code",header:!0,required:!0,size:1,format:e=>Object(o["g"])(e),display:e=>e,formatCmd:e=>Object(o["b"])(Object(o["h"])(e,2))}]},cfbf:function(e,t,r){"use strict";const n=r("5a0c"),i=r("d772"),o=r("4208"),a=r("0ecf"),c=r("1953"),s=r("f906");n.extend(s),n.extend(i),n.extend(o),n.extend(a),n.extend(c),t["a"]=n},fd30:function(e,t,r){"use strict";r.d(t,"a",(function(){return n})),r.d(t,"c",(function(){return c})),r.d(t,"d",(function(){return s})),r.d(t,"b",(function(){return u}));r("13d5"),r("ddb0");const n=[{name:"VCU_NET_SOFT_RESET",bit:0,group:"VCU"},{name:"VCU_NET_HARD_RESET",bit:1,group:"VCU"},{name:"VCU_REMOTE_MISSING",bit:2,group:"VCU"},{name:"VCU_BIKE_FALLEN",bit:3,group:"VCU"},{name:"VCU_BIKE_MOVED",bit:4,group:"VCU"},{name:"BMS_DISCHARGE_OVER_CURRENT",bit:30,group:"BMS"},{name:"BMS_CHARGE_OVER_CURRENT",bit:31,group:"BMS"},{name:"BMS_SHORT_CIRCUIT",bit:32,group:"BMS"},{name:"BMS_DISCHARGE_OVER_TEMPERATURE",bit:33,group:"BMS"},{name:"BMS_DISCHARGE_UNDER_TEMPERATURE",bit:34,group:"BMS"},{name:"BMS_CHARGE_OVER_TEMPERATURE",bit:35,group:"BMS"},{name:"BMS_CHARGE_UNDER_TEMPERATURE",bit:36,group:"BMS"},{name:"BMS_UNDER_VOLTAGE",bit:37,group:"BMS"},{name:"BMS_OVER_VOLTAGE",bit:38,group:"BMS"},{name:"BMS_OVER_DISCHARGE_CAPACITY",bit:39,group:"BMS"},{name:"BMS_UNBALANCE",bit:40,group:"BMS"},{name:"BMS_SYSTEM_FAILURE",bit:41,group:"BMS"},{name:"BMS_WARNING_OVER_CURRENT",bit:42,group:"BMS"},{name:"BMS_WARNING_OVER_TEMPERATURE",bit:43,group:"BMS"},{name:"BMS_WARNING_UNDER_VOLTAGE",bit:44,group:"BMS"},{name:"BMS_WARNING_UNBALANCE",bit:45,group:"BMS"}];var i=r("2ef0"),o=r("cfbf");const a=r("da5a"),c=(e,t)=>1&a.fromNumber(e,1).shiftRight(t),s=e=>n.filter((({bit:t})=>c(e.val,t))).map((({name:e})=>e)),u=e=>Object(i["groupBy"])(e.reduce(((e,{eventsGroup:t,logDatetime:r})=>e.concat(...n.filter((({bit:e})=>c(t.val,e))).map((({name:e})=>({time:o["a"].unix(r.val).format("HH:mm:ss"),name:e}))))),[]),"name")}});