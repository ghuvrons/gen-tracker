(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[4],{"8b24":function(e,t,a){"use strict";a.r(t);var c=a("7a23");function l(e,t,a,l,o,n){const b=Object(c["G"])("map-management"),i=Object(c["G"])("q-avatar"),r=Object(c["G"])("q-badge"),s=Object(c["G"])("q-tab"),d=Object(c["G"])("q-tabs"),O=Object(c["G"])("report-log"),j=Object(c["G"])("q-tab-panel"),u=Object(c["G"])("driver-management"),p=Object(c["G"])("global-configuration"),v=Object(c["G"])("q-tab-panels"),f=Object(c["G"])("q-splitter"),m=Object(c["G"])("q-page");return Object(c["A"])(),Object(c["h"])(m,null,{default:Object(c["S"])((()=>[Object(c["k"])(f,{modelValue:e.splitter,"onUpdate:modelValue":t[3]||(t[3]=t=>e.splitter=t),style:{height:"calc(100vh - 50px)"},horizontal:""},{before:Object(c["S"])((()=>[Object(c["k"])(b)])),separator:Object(c["S"])((()=>[Object(c["k"])(i,{color:"grey","text-color":"white",size:"20px",icon:"drag_indicator"})])),after:Object(c["S"])((()=>[Object(c["k"])(d,{modelValue:e.selectedTab,"onUpdate:modelValue":t[1]||(t[1]=t=>e.selectedTab=t),class:"bg-primary text-white",dense:""},{default:Object(c["S"])((()=>[Object(c["k"])(s,{name:"tab-1",label:"Report Log"},{default:Object(c["S"])((()=>[Object(c["k"])(r,{color:"red",floating:""},{default:Object(c["S"])((()=>[Object(c["j"])(Object(c["K"])(e.devReports.length),1)])),_:1})])),_:1}),Object(c["k"])(s,{name:"tab-2",label:"Driver Management"},{default:Object(c["S"])((()=>[Object(c["k"])(r,{color:"red",floating:""},{default:Object(c["S"])((()=>[Object(c["j"])(Object(c["K"])(e.devFingers.length),1)])),_:1})])),_:1}),Object(c["k"])(s,{name:"tab-3",label:"Configuration"})])),_:1},8,["modelValue"]),Object(c["k"])(v,{modelValue:e.selectedTab,"onUpdate:modelValue":t[2]||(t[2]=t=>e.selectedTab=t),swipeable:""},{default:Object(c["S"])((()=>[Object(c["k"])(j,{name:"tab-1"},{default:Object(c["S"])((()=>[Object(c["k"])(O,{"content-style":e.contentStyle},null,8,["content-style"])])),_:1}),Object(c["k"])(j,{name:"tab-2"},{default:Object(c["S"])((()=>[Object(c["k"])(u,{"content-style":e.contentStyle},null,8,["content-style"])])),_:1}),Object(c["k"])(j,{name:"tab-3"},{default:Object(c["S"])((()=>[Object(c["k"])(p,{"content-style":e.contentStyle},null,8,["content-style"])])),_:1})])),_:1},8,["modelValue"])])),_:1},8,["modelValue"])])),_:1})}const o=Object(c["j"])(" No report yet ");function n(e,t,a,l,n,b){const i=Object(c["G"])("q-icon"),r=Object(c["G"])("q-banner"),s=Object(c["G"])("q-chip"),d=Object(c["G"])("q-item-section"),O=Object(c["G"])("q-item-label"),j=Object(c["G"])("q-item"),u=Object(c["G"])("q-virtual-scroll"),p=Object(c["G"])("q-tooltip"),v=Object(c["G"])("q-btn"),f=Object(c["G"])("q-page-sticky");return Object(c["A"])(),Object(c["h"])("div",{style:e.contentStyle},[0==e.devReports.length?(Object(c["A"])(),Object(c["h"])(r,{key:0},{avatar:Object(c["S"])((()=>[Object(c["k"])(i,{name:"info"})])),default:Object(c["S"])((()=>[o])),_:1})):(Object(c["A"])(),Object(c["h"])(u,{key:1,onKeyup:t[1]||(t[1]=t=>e.changeReport(t)),items:e.devReports,separator:""},{default:Object(c["S"])((({item:t})=>[Object(c["k"])(j,{key:t.sendDatetime.val,onClick:a=>e.setReport(t),active:t.hex===e.report.hex,"active-class":"bg-primary text-white",clickable:"",dense:""},{default:Object(c["S"])((()=>[Object(c["k"])(d,{avatar:""},{default:Object(c["S"])((()=>[Object(c["k"])("div",null,[Object(c["k"])(s,{color:"FULL"==t.frameID.out?"green":"light-green",class:"q-ml-sm text-center",style:{width:"60px"},dark:"",dense:"",square:""},{default:Object(c["S"])((()=>[Object(c["j"])(Object(c["K"])(t.frameID.out),1)])),_:2},1032,["color"]),Object(c["k"])(s,{color:"primary",dark:"",dense:"",square:""},{default:Object(c["S"])((()=>[Object(c["j"])(Object(c["K"])(e.getDatetime(t.logDatetime)),1)])),_:2},1024)])])),_:2},1024),Object(c["k"])(d,null,{default:Object(c["S"])((()=>[Object(c["k"])(O,{class:"ellipsis"},{default:Object(c["S"])((()=>[Object(c["j"])(Object(c["K"])(t.hex),1)])),_:2},1024)])),_:2},1024)])),_:2},1032,["onClick","active"])])),_:1},8,["items"])),Object(c["k"])(f,{position:"bottom-right",offset:[18,18]},{default:Object(c["S"])((()=>[Object(c["k"])(v,{onClick:t[2]||(t[2]=t=>e.followState=!e.followState),icon:e.followState?"lock":"lock_open",color:e.followState?"secondary":"grey",disable:0==e.devReports.length,"fab-mini":""},{default:Object(c["S"])((()=>[e.$q.platform.is.desktop?(Object(c["A"])(),Object(c["h"])(p,{key:0,anchor:"top middle",self:"bottom middle"},{default:Object(c["S"])((()=>[Object(c["j"])(Object(c["K"])(e.followState?"Unfollow":"Follow"),1)])),_:1})):Object(c["i"])("",!0)])),_:1},8,["icon","color","disable"])])),_:1})],4)}a("26e9");var b=a("cfbf"),i=a("a7bc"),r=a("5662"),s=a("5502"),d=Object(c["l"])({props:{contentStyle:{type:String,required:!0}},setup(e){const t=Object(s["b"])(),a=Object(c["f"])((()=>t.state.db.report)),l=Object(c["f"])((()=>t.getters["db/devReports"])),o=e=>t.commit(i["k"],e),n=Object(c["f"])((()=>t.state.common.follow)),d=e=>t.commit(r["b"],e),O=Object(c["f"])({get:()=>n.value,set:e=>d(e)}),j=e=>b["a"].unix(e.val).format("HH:mm:ss"),u=({code:e})=>{var t,c;if(!["ArrowUp","ArrowDown"].includes(e))return;const n=null===(t=a.value)||void 0===t||null===(c=t.sendDatetime)||void 0===c?void 0:c.val;if(!n)return;let b;b="ArrowUp"==e?l.value.slice().reverse().find((({sendDatetime:e})=>e.val>n)):l.value.find((({sendDatetime:e})=>e.val<n)),b&&o(b)};return{report:a,devReports:l,followState:O,setReport:o,changeReport:u,getDatetime:j}}}),O=a("54e1"),j=a("0016"),u=a("a12b"),p=a("66e5"),v=a("4074"),f=a("b047"),m=a("0170"),k=a("de5e"),g=a("9c40"),S=a("05c0"),h=a("eebe"),y=a.n(h);d.render=n;var q=d;y()(d,"components",{QBanner:O["a"],QIcon:j["a"],QVirtualScroll:u["a"],QItem:p["a"],QItemSection:v["a"],QChip:f["a"],QItemLabel:m["a"],QPageSticky:k["a"],QBtn:g["a"],QTooltip:S["a"]});var _=a("ded3"),G=a.n(_);function D(e,t,a,l,o,n){const b=Object(c["G"])("Marker"),i=Object(c["G"])("Polyline"),r=Object(c["G"])("GoogleMap");return Object(c["A"])(),Object(c["h"])(r,{class:"fit","api-key":e.apiKey,center:e.center,zoom:e.zoom},{default:Object(c["S"])((()=>[e.position.valid?(Object(c["A"])(),Object(c["h"])(b,{key:0,options:{position:e.center,icon:e.icon}},null,8,["options"])):Object(c["i"])("",!0),Object(c["k"])(i,{options:G()({path:e.path},e.polyOptions)},null,8,["options"])])),_:1},8,["api-key","center","zoom"])}var w=a("4082"),Q=a.n(w),x=a("9482"),C=a("af6a"),R=a("9944");const F=({lng:e,lat:t})=>{const{lngMin:a,lngMax:c,latMin:l,latMax:o}=x["a"].map.borderIndonesia;return e>a&&e<c&&t>l&&t<o},A=e=>{var t;const a=G()(G()({},x["a"].map.centerIndonesia),{},{valid:!1});var c,l;"FULL"==Object(R["e"])(null===e||void 0===e||null===(t=e.frameID)||void 0===t?void 0:t.val)&&(a.lat=null===e||void 0===e||null===(c=e.gpsLatitude)||void 0===c?void 0:c.val,a.lng=null===e||void 0===e||null===(l=e.gpsLongitude)||void 0===l?void 0:l.val,a.valid=F(a));return a},I=e=>{var t,a;return"FULL"==Object(R["e"])(null===e||void 0===e||null===(t=e.frameID)||void 0===t?void 0:t.val)?null===e||void 0===e||null===(a=e.gpsHeading)||void 0===a?void 0:a.val:0};var T=a("7ec9"),L=Object(c["l"])({components:{GoogleMap:T["a"],Marker:T["b"],Polyline:T["c"]},setup(e){const t=Object(s["b"])(),a=Object(c["f"])((()=>t.state.db.report)),l=Object(c["f"])((()=>t.getters["db/devDevice"])),o=Object(c["f"])((()=>t.getters["db/devReports"])),{centerIndonesia:n,zoom:b}=x["a"].map,i=Object(c["C"])({zoom:b,icon:{path:"M16.001 5c-4.216 0-7.714 3.418-7.634 7.634.029 1.578.719 2.824 1.351 4.024.242.461 6.264 10.332 6.264 10.332V27l.001-.007.002.007v-.01l6.531-10.377c.407-.703.793-1.771.793-1.771A7.631 7.631 0 0 0 16.001 5zM16 16.019a3.895 3.895 0 0 1-3.896-3.897A3.898 3.898 0 1 1 16 16.019z",rotation:-180,fillColor:"red",fillOpacity:1,strokeWeight:.3,anchor:{x:16,y:28}},path:[],center:G()({},n),position:G()(G()({},n),{},{valid:!1}),polyOptions:{geodesic:!0,strokeColor:"#F88",strokeOpacity:.75,strokeWeight:2}}),r=e=>{let{valid:t}=e,a=Q()(e,["valid"]);i.zoom=t?17:b,i.center=G()({},t?a:n),i.position=G()(G()({},a),{},{valid:t})},d=e=>{const t=A(e);t.valid&&i.path.push(t)};return Object(c["Q"])((()=>l.value),((e,t)=>{(null===e||void 0===e?void 0:e.vin)!=(null===t||void 0===t?void 0:t.vin)?(i.path=[],o.value.filter((({frameID:e})=>"FULL"==Object(R["e"])(e.val))).forEach((e=>d(e)))):d(null===e||void 0===e?void 0:e.lastFullReport)}),{immediate:!0,deep:!0}),Object(c["Q"])((()=>a.value),((e,t)=>{var a;const c="FULL"==Object(R["e"])(null===e||void 0===e||null===(a=e.frameID)||void 0===a?void 0:a.val),l=c?e:Object(C["c"])(e,o.value);r(A(l)),i.icon.rotation=I(l)-180}),{immediate:!0}),G()(G()({},Object(c["N"])(i)),{},{apiKey:x["a"].map.apiKey})}});L.render=D;var V=L;const M={class:"text-subtitle2"},U=Object(c["j"])(" No finger driver yet ");function N(e,t,a,l,o,n){const b=Object(c["G"])("q-icon"),i=Object(c["G"])("q-banner"),r=Object(c["G"])("q-chip"),s=Object(c["G"])("q-item-section"),d=Object(c["G"])("q-item-label"),O=Object(c["G"])("q-btn"),j=Object(c["G"])("q-item"),u=Object(c["G"])("q-virtual-scroll"),p=Object(c["G"])("q-fab-action"),v=Object(c["G"])("q-fab"),f=Object(c["G"])("q-page-sticky");return Object(c["A"])(),Object(c["h"])("div",{style:e.contentStyle},[Object(c["k"])("div",M,"Last fetch: "+Object(c["K"])(e.getFingerTime()),1),0==e.devFingers.length?(Object(c["A"])(),Object(c["h"])(i,{key:0},{avatar:Object(c["S"])((()=>[Object(c["k"])(b,{name:"info"})])),default:Object(c["S"])((()=>[U])),_:1})):(Object(c["A"])(),Object(c["h"])(u,{key:1,items:e.devFingers,separator:""},{default:Object(c["S"])((({item:t,index:a})=>[Object(c["k"])(j,{key:a,dense:""},{default:Object(c["S"])((()=>[Object(c["k"])(s,{avatar:""},{default:Object(c["S"])((()=>[Object(c["k"])(r,{color:"primary",dark:"",square:""},{default:Object(c["S"])((()=>[Object(c["j"])(Object(c["K"])(t.fingerID),1)])),_:2},1024)])),_:2},1024),Object(c["k"])(s,null,{default:Object(c["S"])((()=>[Object(c["k"])(d,null,{default:Object(c["S"])((()=>[Object(c["j"])("Mr. "+Object(c["K"])(e.name[t.fingerID-1]),1)])),_:2},1024)])),_:2},1024),Object(c["k"])(s,{side:""},{default:Object(c["S"])((()=>[Object(c["k"])(O,{onClick:a=>e.remove(t),size:"sm",icon:"delete",outline:"",unelevated:"",round:""},null,8,["onClick"])])),_:2},1024)])),_:2},1024)])),_:1},8,["items"])),Object(c["k"])(f,{position:"bottom-right",offset:[18,18]},{default:Object(c["S"])((()=>[Object(c["k"])(v,{modelValue:e.fab,"onUpdate:modelValue":t[1]||(t[1]=t=>e.fab=t),"external-label":"","vertical-actions-align":"right",color:"secondary",icon:"keyboard_arrow_left",direction:"left","label-position":"top",padding:"sm"},{default:Object(c["S"])((()=>[Object(c["k"])(p,{onClick:e.fetch,disable:!e.devDevice,"label-position":"top",color:"primary",icon:"download",label:"Fetch","external-label":""},null,8,["onClick","disable"]),Object(c["k"])(p,{onClick:e.add,disable:!e.devDevice,"label-position":"top",color:"green",icon:"upload",label:"Add","external-label":""},null,8,["onClick","disable"]),Object(c["k"])(p,{onClick:e.clear,disable:!e.devDevice,"label-position":"top",color:"orange",icon:"delete_forever",label:"Reset","external-label":""},null,8,["onClick","disable"])])),_:1},8,["modelValue"])])),_:1})],4)}var K=a("b7fa"),E=Object(c["l"])({props:{contentStyle:{type:String,required:!0}},setup(e){const t=Object(c["o"])("sendCommand"),a=Object(s["b"])(),l=Object(c["f"])((()=>a.getters["db/devDevice"])),o=Object(c["f"])((()=>a.getters["db/devFingers"])),n=Object(c["D"])(["One","Two","Three","Four","Five"]),i=Object(c["D"])(!1),r=()=>{var e;const{fingerTime:t}=null!==(e=l.value)&&void 0!==e?e:{};return t?b["a"].unix(t).format("DD-MM-YY HH:mm:ss"):"Unknown"},d=()=>t("FINGER_FETCH"),O=()=>t("FINGER_ADD"),j=({fingerID:e})=>Object(K["a"])(`Are you sure to remove this fingerprint ${e} ?`).onOk((()=>t(`FINGER_DEL=${e}`))),u=()=>Object(K["a"])("Are you sure to clear all fingerprints  ?").onOk((()=>t("FINGER_RST")));return{name:n,fab:i,devFingers:o,devDevice:l,getFingerTime:r,fetch:d,add:O,remove:j,clear:u}}}),z=a("c294"),P=a("72db");E.render=N;var $=E;y()(E,"components",{QBanner:O["a"],QIcon:j["a"],QVirtualScroll:u["a"],QItem:p["a"],QItemSection:v["a"],QChip:f["a"],QItemLabel:m["a"],QBtn:g["a"],QPageSticky:k["a"],QFab:z["a"],QFabAction:P["a"]});const H={class:"row q-gutter-xs"},B={class:"col-auto"},J={key:0,class:"col-auto"},Y={class:"col-auto"},W={class:"col-auto"},X={class:"col-auto"},Z=Object(c["j"])("CSV"),ee=Object(c["j"])("JSON"),te={class:"row q-gutter-xs q-mt-xs"},ae={class:"col-auto"},ce={class:"row q-gutter-xs q-mt-xs"},le={class:"col-auto"};function oe(e,t,a,l,o,n){const b=Object(c["G"])("q-btn"),i=Object(c["G"])("q-item-label"),r=Object(c["G"])("q-item-section"),s=Object(c["G"])("q-item"),d=Object(c["G"])("q-list"),O=Object(c["G"])("q-btn-dropdown"),j=Object(c["G"])("q-uploader"),u=Object(c["G"])("q-toggle"),p=Object(c["H"])("close-popup");return Object(c["A"])(),Object(c["h"])("div",{style:e.contentStyle},[Object(c["k"])("div",H,[Object(c["k"])("div",B,[Object(c["k"])(b,{icon:"delete",label:"Reset DB",disable:0==e.devices.length,onClick:t[1]||(t[1]=t=>e.clearStore())},null,8,["disable"])]),e.$q.fullscreen.isCapable?(Object(c["A"])(),Object(c["h"])("div",J,[Object(c["k"])(b,{onClick:t[2]||(t[2]=t=>e.$q.fullscreen.toggle()),label:e.$q.fullscreen.isActive?"Normal":"Full",icon:e.$q.fullscreen.isActive?"fullscreen_exit":"fullscreen"},null,8,["label","icon"])])):Object(c["i"])("",!0),Object(c["k"])("div",Y,[Object(c["k"])(b,{icon:"alarm_on",label:"Calibrate",disable:0==e.devReports.length,onClick:t[3]||(t[3]=t=>e.calibrate())},null,8,["disable"])]),Object(c["k"])("div",W,[Object(c["k"])(b,{icon:"gavel",label:"FORCE READY",onClick:t[4]||(t[4]=t=>e.ignoreResponse())})]),Object(c["k"])("div",X,[Object(c["k"])(O,{icon:"cloud_download",label:"Export"},{default:Object(c["S"])((()=>[Object(c["k"])(d,null,{default:Object(c["S"])((()=>[Object(c["T"])(Object(c["k"])(s,{clickable:e.reports.length>0,onClick:t[5]||(t[5]=t=>e.exportCSV(e.reports))},{default:Object(c["S"])((()=>[Object(c["k"])(r,null,{default:Object(c["S"])((()=>[Object(c["k"])(i,null,{default:Object(c["S"])((()=>[Z])),_:1})])),_:1})])),_:1},8,["clickable"]),[[p]]),Object(c["T"])(Object(c["k"])(s,{clickable:e.reports.length>0,onClick:t[6]||(t[6]=t=>e.exportJSON(e.reports))},{default:Object(c["S"])((()=>[Object(c["k"])(r,null,{default:Object(c["S"])((()=>[Object(c["k"])(i,null,{default:Object(c["S"])((()=>[ee])),_:1})])),_:1})])),_:1},8,["clickable"]),[[p]])])),_:1})])),_:1})])]),Object(c["k"])("div",te,[Object(c["k"])("div",ae,[Object(c["k"])(j,{ref:"uploader",factory:e.importData,accept:".json",label:"Import JSON","auto-upload":""},null,8,["factory"])])]),Object(c["k"])("div",ce,[Object(c["k"])("div",le,[Object(c["k"])(u,{modelValue:e.notificationState,"onUpdate:modelValue":t[7]||(t[7]=t=>e.notificationState=t),label:"Push Notification"},null,8,["modelValue"])])])],4)}a("ddb0"),a("13d5"),a("e6cf");var ne=a("f23f"),be=a("2e92");const ie=e=>e.map((e=>G()({},C["a"].reduce(((t,{field:a,no:c})=>G()(G()({},t),{},{[c]:e[a]?e[a].out:""})),{})))),re=()=>C["a"].reduce(((e,{title:t,unit:a})=>e.concat([t+(a?` (${a})`:"")])),[]),se=e=>{const t=new ne["ExportToCsv"]({fieldSeparator:",",quoteStrings:'"',decimalSeparator:".",showLabels:!0,showTitle:!1,title:"My Awesome CSV",useTextFile:!1,useBom:!0,useKeysAsHeaders:!1,headers:re()});t.generateCsv(ie(e))},de=e=>e?e.map((({hex:e})=>e)):[],Oe=e=>{const t=`tracking-${Object(b["a"])().format("YYMMDDHHmmss")}`,a=de(e.slice().reverse()),c="json";Object(be["a"])({data:a,fileName:t,exportType:c})},je=e=>new Promise(((t,a)=>{e||a();const c=new FileReader;c.onload=e=>t(JSON.parse(e.target.result)),c.readAsText(e)}));var ue=a("6ad4"),pe=Object(c["l"])({props:{contentStyle:{type:String,required:!0}},setup(e){const t=Object(c["o"])("sendCommand"),a=Object(c["o"])("ignoreResponse"),l=Object(s["b"])(),o=Object(c["f"])((()=>l.state.db.reports)),n=Object(c["f"])((()=>l.state.db.buffers)),b=Object(c["f"])((()=>l.state.db.devices)),d=Object(c["f"])((()=>l.state.db.command)),O=Object(c["f"])((()=>l.getters["db/devDevice"])),j=Object(c["f"])((()=>l.getters["db/devReports"])),u=e=>l.commit(i["g"],e),p=e=>l.dispatch(ue["a"],e),v=Object(c["f"])((()=>l.state.common.notification)),f=e=>l.commit(r["c"],e),m=Object(c["D"])(null),k=Object(c["f"])({get:()=>v.value,set:e=>f(e)}),g=()=>Object(K["a"])("Are you sure to remove all data?").onOk((()=>u())),S=()=>{if(!O.value)return;const e=j.value.find((({frameID:e})=>"FULL"==Object(R["e"])(e.val)));if(!e)return;const a=Object(R["b"])(e);a&&t(`REPORT_RTC=${a}`)},h=([e])=>{je(e).then((e=>p(e)))};return Object(c["Q"])((()=>n.value.length),(e=>0==e&&m.value.reset()),{deep:!0}),{uploader:m,devices:b,command:d,reports:o,devReports:j,notificationState:k,calibrate:S,clearStore:g,ignoreResponse:a,importData:h,exportJSON:Oe,exportCSV:se}}}),ve=a("f20b"),fe=a("1c1c"),me=a("ee89"),ke=a("9564"),ge=a("7f67");pe.render=oe;var Se=pe;y()(pe,"components",{QBtn:g["a"],QBtnDropdown:ve["a"],QList:fe["a"],QItem:p["a"],QItemSection:v["a"],QItemLabel:m["a"],QUploader:me["a"],QToggle:ke["a"]}),y()(pe,"directives",{ClosePopup:ge["a"]});var he=Object(c["l"])({components:{MapManagement:V,ReportLog:q,DriverManagement:$,GlobalConfiguration:Se},setup(e){const t=Object(s["b"])(),a=Object(c["f"])((()=>t.getters["db/devReports"])),l=Object(c["f"])((()=>t.getters["db/devFingers"])),o=Object(c["D"])("tab-1"),n=Object(c["D"])(50),b=Object(c["f"])((()=>`height: calc(100vh - ${n.value}vh - 95px)`));return{selectedTab:o,splitter:n,devReports:a,devFingers:l,contentStyle:b}}}),ye=a("9989"),qe=a("8562"),_e=a("cb32"),Ge=a("429bb"),De=a("7460"),we=a("58a81"),Qe=a("adad"),xe=a("823b");he.render=l;t["default"]=he;y()(he,"components",{QPage:ye["a"],QSplitter:qe["a"],QAvatar:_e["a"],QTabs:Ge["a"],QTab:De["a"],QBadge:we["a"],QTabPanels:Qe["a"],QTabPanel:xe["a"]})}}]);