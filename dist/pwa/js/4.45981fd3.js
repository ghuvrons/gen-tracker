(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[4],{"8b24":function(e,t,l){"use strict";l.r(t);var a=l("7a23");function c(e,t,l,c,o,n){const b=Object(a["G"])("map-management"),i=Object(a["G"])("q-avatar"),r=Object(a["G"])("q-badge"),s=Object(a["G"])("q-tab"),d=Object(a["G"])("q-tabs"),j=Object(a["G"])("report-log"),O=Object(a["G"])("q-tab-panel"),u=Object(a["G"])("driver-management"),p=Object(a["G"])("global-configuration"),v=Object(a["G"])("q-tab-panels"),m=Object(a["G"])("q-splitter"),f=Object(a["G"])("q-page");return Object(a["A"])(),Object(a["h"])(f,null,{default:Object(a["S"])((()=>[Object(a["k"])(m,{modelValue:e.splitter,"onUpdate:modelValue":t[3]||(t[3]=t=>e.splitter=t),style:{height:"calc(100vh - 50px)"},horizontal:""},{before:Object(a["S"])((()=>[Object(a["k"])(b)])),separator:Object(a["S"])((()=>[Object(a["k"])(i,{color:"grey","text-color":"white",size:"20px",icon:"drag_indicator"})])),after:Object(a["S"])((()=>[Object(a["k"])(d,{modelValue:e.selectedTab,"onUpdate:modelValue":t[1]||(t[1]=t=>e.selectedTab=t),class:"bg-primary text-white",dense:""},{default:Object(a["S"])((()=>[Object(a["k"])(s,{name:"tab-1",label:"Report Log"},{default:Object(a["S"])((()=>[Object(a["k"])(r,{color:"red",floating:""},{default:Object(a["S"])((()=>[Object(a["j"])(Object(a["K"])(e.devReports.length),1)])),_:1})])),_:1}),Object(a["k"])(s,{name:"tab-2",label:"Driver Management"},{default:Object(a["S"])((()=>[Object(a["k"])(r,{color:"red",floating:""},{default:Object(a["S"])((()=>[Object(a["j"])(Object(a["K"])(e.devFingers.length),1)])),_:1})])),_:1}),Object(a["k"])(s,{name:"tab-3",label:"Configuration"})])),_:1},8,["modelValue"]),Object(a["k"])(v,{modelValue:e.selectedTab,"onUpdate:modelValue":t[2]||(t[2]=t=>e.selectedTab=t),swipeable:""},{default:Object(a["S"])((()=>[Object(a["k"])(O,{name:"tab-1"},{default:Object(a["S"])((()=>[Object(a["k"])(j,{"content-style":e.contentStyle},null,8,["content-style"])])),_:1}),Object(a["k"])(O,{name:"tab-2"},{default:Object(a["S"])((()=>[Object(a["k"])(u,{"content-style":e.contentStyle},null,8,["content-style"])])),_:1}),Object(a["k"])(O,{name:"tab-3"},{default:Object(a["S"])((()=>[Object(a["k"])(p,{"content-style":e.contentStyle},null,8,["content-style"])])),_:1})])),_:1},8,["modelValue"])])),_:1},8,["modelValue"])])),_:1})}const o=Object(a["j"])(" No report yet ");function n(e,t,l,c,n,b){const i=Object(a["G"])("q-icon"),r=Object(a["G"])("q-banner"),s=Object(a["G"])("q-chip"),d=Object(a["G"])("q-item-section"),j=Object(a["G"])("q-item-label"),O=Object(a["G"])("q-item"),u=Object(a["G"])("q-virtual-scroll"),p=Object(a["G"])("q-tooltip"),v=Object(a["G"])("q-btn"),m=Object(a["G"])("q-page-sticky");return Object(a["A"])(),Object(a["h"])("div",{style:e.contentStyle},[0==e.devReports.length?(Object(a["A"])(),Object(a["h"])(r,{key:0},{avatar:Object(a["S"])((()=>[Object(a["k"])(i,{name:"info"})])),default:Object(a["S"])((()=>[o])),_:1})):(Object(a["A"])(),Object(a["h"])(u,{key:1,onKeyup:t[1]||(t[1]=t=>e.changeReport(t)),items:e.devReports,separator:""},{default:Object(a["S"])((({item:t,index:l})=>[Object(a["k"])(O,{key:`${t.sendDatetime.val}.${l}`,onClick:l=>e.setReport(t),active:t.hex===e.report.hex,"active-class":"bg-primary text-white",clickable:"",dense:""},{default:Object(a["S"])((()=>[Object(a["k"])(d,{avatar:""},{default:Object(a["S"])((()=>[Object(a["k"])("div",null,[Object(a["k"])(s,{outline:t.hex!==e.report.hex,color:e.fullFrame(t)?"green":"light-green",class:"q-ml-sm text-center",dark:"",dense:"",square:""},{default:Object(a["S"])((()=>[Object(a["j"])(Object(a["K"])(e.fullFrame(t)?"F":"S"),1)])),_:2},1032,["outline","color"]),Object(a["k"])(s,{outline:t.hex!==e.report.hex,color:"red",class:"q-ml-sm text-center",dark:"",dense:"",square:""},{default:Object(a["S"])((()=>[Object(a["j"])(Object(a["K"])(t.logBuffered.val),1)])),_:2},1032,["outline"]),Object(a["k"])(s,{outline:t.hex!==e.report.hex,color:"orange",class:"q-ml-sm text-center",dark:"",dense:"",square:""},{default:Object(a["S"])((()=>[Object(a["j"])(Object(a["K"])(e.getDilation(t))+"s ",1)])),_:2},1032,["outline"]),Object(a["k"])(s,{outline:t.hex!==e.report.hex,color:"indigo",dark:"",dense:"",square:""},{default:Object(a["S"])((()=>[Object(a["j"])(Object(a["K"])(e.getDatetime(t.sendDatetime))+" - "+Object(a["K"])(e.getDatetime(t.logDatetime)),1)])),_:2},1032,["outline"])])])),_:2},1024),Object(a["k"])(d,null,{default:Object(a["S"])((()=>[Object(a["k"])(j,{class:"ellipsis"},{default:Object(a["S"])((()=>[Object(a["j"])(Object(a["K"])(t.hex),1)])),_:2},1024)])),_:2},1024)])),_:2},1032,["onClick","active"])])),_:1},8,["items"])),Object(a["k"])(m,{position:"bottom-right",offset:[18,18]},{default:Object(a["S"])((()=>[Object(a["k"])(v,{onClick:t[2]||(t[2]=t=>e.followState=!e.followState),icon:e.followState?"lock":"lock_open",color:e.followState?"secondary":"grey",disable:0==e.devReports.length,"fab-mini":""},{default:Object(a["S"])((()=>[e.$q.platform.is.desktop?(Object(a["A"])(),Object(a["h"])(p,{key:0,anchor:"top middle",self:"bottom middle"},{default:Object(a["S"])((()=>[Object(a["j"])(Object(a["K"])(e.followState?"Unfollow":"Follow"),1)])),_:1})):Object(a["i"])("",!0)])),_:1},8,["icon","color","disable"])])),_:1})],4)}l("26e9");var b=l("9482"),i=l("cfbf"),r=l("a7bc"),s=l("5662"),d=l("5502"),j=l("9944"),O=Object(a["l"])({props:{contentStyle:{type:String,required:!0}},setup(e){const t=Object(d["b"])(),l=Object(a["f"])((()=>t.state.db.report)),c=Object(a["f"])((()=>t.getters["db/devReports"])),o=e=>t.commit(r["k"],e),n=Object(a["f"])((()=>t.state.common.follow)),O=e=>t.commit(s["b"],e),u=Object(a["f"])({get:()=>n.value,set:e=>O(e)}),p=({frameID:e})=>{const t=b["a"].frames.findIndex((e=>"FULL"==e));return e.val===t},v=e=>i["a"].unix(e.val).format("HH:mm:ss"),m=({sendDatetime:e,logDatetime:t})=>Object(j["c"])(t.val,"seconds",e.val),f=({code:e})=>{var t,a;if(!["ArrowUp","ArrowDown"].includes(e))return;const n=null===(t=l.value)||void 0===t||null===(a=t.sendDatetime)||void 0===a?void 0:a.val;if(!n)return;let b;b="ArrowUp"==e?c.value.slice().reverse().find((({sendDatetime:e})=>e.val>n)):c.value.find((({sendDatetime:e})=>e.val<n)),b&&o(b)};return{report:l,devReports:c,followState:u,setReport:o,fullFrame:p,changeReport:f,getDatetime:v,getDilation:m}}}),u=l("54e1"),p=l("0016"),v=l("a12b"),m=l("66e5"),f=l("4074"),k=l("b047"),g=l("0170"),S=l("de5e"),h=l("9c40"),y=l("05c0"),q=l("eebe"),_=l.n(q);O.render=n;var G=O;_()(O,"components",{QBanner:u["a"],QIcon:p["a"],QVirtualScroll:v["a"],QItem:m["a"],QItemSection:f["a"],QChip:k["a"],QItemLabel:g["a"],QPageSticky:S["a"],QBtn:h["a"],QTooltip:y["a"]});var x=l("ded3"),D=l.n(x);function Q(e,t,l,c,o,n){const b=Object(a["G"])("Marker"),i=Object(a["G"])("Polyline"),r=Object(a["G"])("GoogleMap");return Object(a["A"])(),Object(a["h"])(r,{class:"fit","api-key":e.apiKey,center:e.center,zoom:e.zoom},{default:Object(a["S"])((()=>[e.position.valid?(Object(a["A"])(),Object(a["h"])(b,{key:0,options:{position:e.center,icon:e.icon}},null,8,["options"])):Object(a["i"])("",!0),Object(a["k"])(i,{options:D()({path:e.path},e.polyOptions)},null,8,["options"])])),_:1},8,["api-key","center","zoom"])}var w=l("4082"),C=l.n(w),F=l("af6a");const A=({lng:e,lat:t})=>{const{lngMin:l,lngMax:a,latMin:c,latMax:o}=b["a"].map.borderIndonesia;return e>l&&e<a&&t>c&&t<o},I=e=>{var t;const l=D()(D()({},b["a"].map.centerIndonesia),{},{valid:!1});var a,c,o;"FULL"==Object(j["e"])(null===e||void 0===e||null===(t=e.frameID)||void 0===t?void 0:t.val)&&(l.lat=null===e||void 0===e||null===(a=e.gpsLatitude)||void 0===a?void 0:a.val,l.lng=null===e||void 0===e||null===(c=e.gpsLongitude)||void 0===c?void 0:c.val,l.valid=A(l)&&(null===e||void 0===e||null===(o=e.gpsHDOP)||void 0===o?void 0:o.val)<=b["a"].map.hdopMin);return l},R=e=>{var t,l;return"FULL"==Object(j["e"])(null===e||void 0===e||null===(t=e.frameID)||void 0===t?void 0:t.val)?null===e||void 0===e||null===(l=e.gpsHeading)||void 0===l?void 0:l.val:0};var T=l("7ec9"),L=Object(a["l"])({components:{GoogleMap:T["a"],Marker:T["b"],Polyline:T["c"]},setup(e){const t=Object(d["b"])(),l=Object(a["f"])((()=>t.state.db.report)),c=Object(a["f"])((()=>t.getters["db/devDevice"])),o=Object(a["f"])((()=>t.getters["db/devReports"])),{centerIndonesia:n,zoom:i}=b["a"].map,r=Object(a["C"])({zoom:i,icon:{path:"M16.001 5c-4.216 0-7.714 3.418-7.634 7.634.029 1.578.719 2.824 1.351 4.024.242.461 6.264 10.332 6.264 10.332V27l.001-.007.002.007v-.01l6.531-10.377c.407-.703.793-1.771.793-1.771A7.631 7.631 0 0 0 16.001 5zM16 16.019a3.895 3.895 0 0 1-3.896-3.897A3.898 3.898 0 1 1 16 16.019z",rotation:-180,fillColor:"red",fillOpacity:1,strokeWeight:.3,anchor:{x:16,y:28}},path:[],center:D()({},n),position:D()(D()({},n),{},{valid:!1}),polyOptions:{geodesic:!0,strokeColor:"#F88",strokeOpacity:.75,strokeWeight:2}}),s=e=>{let{valid:t}=e,l=C()(e,["valid"]);r.zoom=t?17:i,r.center=D()({},t?l:n),r.position=D()(D()({},l),{},{valid:t})},O=e=>{const t=I(e);t.valid&&r.path.push(t)};return Object(a["Q"])((()=>c.value),((e,t)=>{(null===e||void 0===e?void 0:e.vin)!=(null===t||void 0===t?void 0:t.vin)?(r.path=[],o.value.filter((({frameID:e})=>"FULL"==Object(j["e"])(e.val))).forEach((e=>O(e)))):O(null===e||void 0===e?void 0:e.lastFullReport)}),{immediate:!0,deep:!0}),Object(a["Q"])((()=>l.value),(e=>{var t;const l="FULL"==Object(j["e"])(null===e||void 0===e||null===(t=e.frameID)||void 0===t?void 0:t.val),a=l?e:Object(F["c"])(e,o.value);s(I(a)),r.icon.rotation=R(a)-180}),{immediate:!0}),D()(D()({},Object(a["N"])(r)),{},{apiKey:b["a"].map.apiKey})}});L.render=Q;var V=L;const M={class:"text-subtitle2"},K=Object(a["j"])(" No finger driver yet ");function N(e,t,l,c,o,n){const b=Object(a["G"])("q-icon"),i=Object(a["G"])("q-banner"),r=Object(a["G"])("q-chip"),s=Object(a["G"])("q-item-section"),d=Object(a["G"])("q-item-label"),j=Object(a["G"])("q-btn"),O=Object(a["G"])("q-item"),u=Object(a["G"])("q-virtual-scroll"),p=Object(a["G"])("q-fab-action"),v=Object(a["G"])("q-fab"),m=Object(a["G"])("q-page-sticky");return Object(a["A"])(),Object(a["h"])("div",{style:e.contentStyle},[Object(a["k"])("div",M,"Last fetch: "+Object(a["K"])(e.getFingerTime()),1),0==e.devFingers.length?(Object(a["A"])(),Object(a["h"])(i,{key:0},{avatar:Object(a["S"])((()=>[Object(a["k"])(b,{name:"info"})])),default:Object(a["S"])((()=>[K])),_:1})):(Object(a["A"])(),Object(a["h"])(u,{key:1,items:e.devFingers,separator:""},{default:Object(a["S"])((({item:t,index:l})=>[Object(a["k"])(O,{key:l,dense:""},{default:Object(a["S"])((()=>[Object(a["k"])(s,{avatar:""},{default:Object(a["S"])((()=>[Object(a["k"])(r,{color:"primary",dark:"",square:""},{default:Object(a["S"])((()=>[Object(a["j"])(Object(a["K"])(t.fingerID),1)])),_:2},1024)])),_:2},1024),Object(a["k"])(s,null,{default:Object(a["S"])((()=>[Object(a["k"])(d,null,{default:Object(a["S"])((()=>[Object(a["j"])("Mr. "+Object(a["K"])(e.name[t.fingerID-1]),1)])),_:2},1024)])),_:2},1024),Object(a["k"])(s,{side:""},{default:Object(a["S"])((()=>[Object(a["k"])(j,{onClick:l=>e.remove(t),size:"sm",icon:"delete",outline:"",unelevated:"",round:""},null,8,["onClick"])])),_:2},1024)])),_:2},1024)])),_:1},8,["items"])),Object(a["k"])(m,{position:"bottom-right",offset:[18,18]},{default:Object(a["S"])((()=>[Object(a["k"])(v,{modelValue:e.fab,"onUpdate:modelValue":t[1]||(t[1]=t=>e.fab=t),"external-label":"","vertical-actions-align":"right",color:"secondary",icon:"keyboard_arrow_left",direction:"left","label-position":"top",padding:"sm"},{default:Object(a["S"])((()=>[Object(a["k"])(p,{onClick:e.fetch,disable:!e.devDevice,"label-position":"top",color:"primary",icon:"download",label:"Fetch","external-label":""},null,8,["onClick","disable"]),Object(a["k"])(p,{onClick:e.add,disable:!e.devDevice,"label-position":"top",color:"green",icon:"upload",label:"Add","external-label":""},null,8,["onClick","disable"]),Object(a["k"])(p,{onClick:e.clear,disable:!e.devDevice,"label-position":"top",color:"orange",icon:"delete_forever",label:"Reset","external-label":""},null,8,["onClick","disable"])])),_:1},8,["modelValue"])])),_:1})],4)}var U=l("b7fa"),$=Object(a["l"])({props:{contentStyle:{type:String,required:!0}},setup(e){const t=Object(a["o"])("sendCommand"),l=Object(d["b"])(),c=Object(a["f"])((()=>l.getters["db/devDevice"])),o=Object(a["f"])((()=>l.getters["db/devFingers"])),n=Object(a["D"])(["One","Two","Three","Four","Five"]),b=Object(a["D"])(!1),r=()=>{var e;const{fingerTime:t}=null!==(e=c.value)&&void 0!==e?e:{};return t?i["a"].unix(t).format("DD-MM-YY HH:mm:ss"):"Unknown"},s=()=>t("FINGER_FETCH"),j=()=>t("FINGER_ADD"),O=({fingerID:e})=>Object(U["a"])(`Are you sure to remove this fingerprint ${e} ?`).onOk((()=>t(`FINGER_DEL=${e}`))),u=()=>Object(U["a"])("Are you sure to clear all fingerprints  ?").onOk((()=>t("FINGER_RST")));return{name:n,fab:b,devFingers:o,devDevice:c,getFingerTime:r,fetch:s,add:j,remove:O,clear:u}}}),z=l("c294"),H=l("72db");$.render=N;var P=$;_()($,"components",{QBanner:u["a"],QIcon:p["a"],QVirtualScroll:v["a"],QItem:m["a"],QItemSection:f["a"],QChip:k["a"],QItemLabel:g["a"],QBtn:h["a"],QPageSticky:S["a"],QFab:z["a"],QFabAction:H["a"]});const B={class:"row q-gutter-xs"},E={class:"col-auto"},J={key:0,class:"col-auto"},Y={class:"col-auto"},W={class:"col-auto"},X=Object(a["j"])("CSV"),Z=Object(a["j"])("JSON"),ee={class:"row q-gutter-xs q-mt-xs"},te={class:"col-auto"},le={class:"row q-gutter-xs q-mt-xs"},ae={class:"col-auto"};function ce(e,t,l,c,o,n){const b=Object(a["G"])("q-btn"),i=Object(a["G"])("q-item-label"),r=Object(a["G"])("q-item-section"),s=Object(a["G"])("q-item"),d=Object(a["G"])("q-list"),j=Object(a["G"])("q-btn-dropdown"),O=Object(a["G"])("q-uploader"),u=Object(a["G"])("q-toggle"),p=Object(a["H"])("close-popup");return Object(a["A"])(),Object(a["h"])("div",{style:e.contentStyle},[Object(a["k"])("div",B,[Object(a["k"])("div",E,[Object(a["k"])(b,{icon:"delete",label:"Reset DB",disable:0==e.devices.length,onClick:t[1]||(t[1]=t=>e.clearStore())},null,8,["disable"])]),e.$q.fullscreen.isCapable?(Object(a["A"])(),Object(a["h"])("div",J,[Object(a["k"])(b,{onClick:t[2]||(t[2]=t=>e.$q.fullscreen.toggle()),label:e.$q.fullscreen.isActive?"Normal":"Full",icon:e.$q.fullscreen.isActive?"fullscreen_exit":"fullscreen"},null,8,["label","icon"])])):Object(a["i"])("",!0),Object(a["k"])("div",Y,[Object(a["k"])(b,{icon:"alarm_on",label:"Calibrate",disable:0==e.devReports.length,onClick:t[3]||(t[3]=t=>e.calibrate())},null,8,["disable"])]),Object(a["k"])("div",W,[Object(a["k"])(j,{icon:"cloud_download",label:"Export"},{default:Object(a["S"])((()=>[Object(a["k"])(d,null,{default:Object(a["S"])((()=>[Object(a["T"])(Object(a["k"])(s,{clickable:e.reports.length>0,onClick:t[4]||(t[4]=t=>e.exportCSV(e.reports))},{default:Object(a["S"])((()=>[Object(a["k"])(r,null,{default:Object(a["S"])((()=>[Object(a["k"])(i,null,{default:Object(a["S"])((()=>[X])),_:1})])),_:1})])),_:1},8,["clickable"]),[[p]]),Object(a["T"])(Object(a["k"])(s,{clickable:e.reports.length>0,onClick:t[5]||(t[5]=t=>e.exportJSON(e.reports))},{default:Object(a["S"])((()=>[Object(a["k"])(r,null,{default:Object(a["S"])((()=>[Object(a["k"])(i,null,{default:Object(a["S"])((()=>[Z])),_:1})])),_:1})])),_:1},8,["clickable"]),[[p]])])),_:1})])),_:1})])]),Object(a["k"])("div",ee,[Object(a["k"])("div",te,[Object(a["k"])(O,{ref:"uploader",factory:e.importData,accept:".json",label:"Import JSON","auto-upload":""},null,8,["factory"])])]),Object(a["k"])("div",le,[Object(a["k"])("div",ae,[Object(a["k"])(u,{modelValue:e.notificationState,"onUpdate:modelValue":t[6]||(t[6]=t=>e.notificationState=t),label:"Push Notification"},null,8,["modelValue"])])])],4)}l("ddb0"),l("13d5"),l("e6cf");var oe=l("f23f"),ne=l("2e92");const be=e=>e.map((e=>D()({},F["a"].reduce(((t,{field:l,no:a})=>D()(D()({},t),{},{[a]:e[l]?e[l].out:""})),{})))),ie=()=>F["a"].reduce(((e,{title:t,unit:l})=>e.concat([t+(l?` (${l})`:"")])),[]),re=e=>{const t=new oe["ExportToCsv"]({fieldSeparator:",",quoteStrings:'"',decimalSeparator:".",showLabels:!0,showTitle:!1,title:"My Awesome CSV",useTextFile:!1,useBom:!0,useKeysAsHeaders:!1,headers:ie()});t.generateCsv(be(e))},se=e=>e?e.map((({hex:e})=>e)):[],de=e=>{const t=`tracking-${Object(i["a"])().format("YYMMDDHHmmss")}`,l=se(e.slice().reverse()),a="json";Object(ne["a"])({data:l,fileName:t,exportType:a})},je=e=>new Promise(((t,l)=>{e||l();const a=new FileReader;a.onload=e=>t(JSON.parse(e.target.result)),a.readAsText(e)}));var Oe=l("6ad4"),ue=Object(a["l"])({props:{contentStyle:{type:String,required:!0}},setup(e){const t=Object(a["o"])("sendCommand"),l=Object(d["b"])(),c=Object(a["f"])((()=>l.state.db.reports)),o=Object(a["f"])((()=>l.state.db.buffers)),n=Object(a["f"])((()=>l.state.db.devices)),b=Object(a["f"])((()=>l.state.db.command)),i=Object(a["f"])((()=>l.getters["db/devDevice"])),O=Object(a["f"])((()=>l.getters["db/devReports"])),u=e=>l.commit(r["g"],e),p=e=>l.dispatch(Oe["a"],e),v=Object(a["f"])((()=>l.state.common.notification)),m=e=>l.commit(s["c"],e),f=Object(a["D"])(null),k=Object(a["f"])({get:()=>v.value,set:e=>m(e)}),g=()=>Object(U["a"])("Are you sure to remove all data?").onOk((()=>u())),S=()=>{if(!i.value)return;const e=O.value.find((({frameID:e})=>"FULL"==Object(j["e"])(e.val)));if(!e)return;const l=Object(j["b"])(e);l&&t(`GEN_RTC=${l}`)},h=([e])=>{je(e).then((e=>p(e)))};return Object(a["Q"])((()=>o.value.length),(e=>0==e&&f.value.reset()),{deep:!0}),{uploader:f,devices:n,command:b,reports:c,devReports:O,notificationState:k,calibrate:S,clearStore:g,importData:h,exportJSON:de,exportCSV:re}}}),pe=l("f20b"),ve=l("1c1c"),me=l("ee89"),fe=l("9564"),ke=l("7f67");ue.render=ce;var ge=ue;_()(ue,"components",{QBtn:h["a"],QBtnDropdown:pe["a"],QList:ve["a"],QItem:m["a"],QItemSection:f["a"],QItemLabel:g["a"],QUploader:me["a"],QToggle:fe["a"]}),_()(ue,"directives",{ClosePopup:ke["a"]});var Se=Object(a["l"])({components:{MapManagement:V,ReportLog:G,DriverManagement:P,GlobalConfiguration:ge},setup(e){const t=Object(d["b"])(),l=Object(a["f"])((()=>t.getters["db/devReports"])),c=Object(a["f"])((()=>t.getters["db/devFingers"])),o=Object(a["D"])("tab-1"),n=Object(a["D"])(50),b=Object(a["f"])((()=>`height: calc(100vh - ${n.value}vh - 95px)`));return{selectedTab:o,splitter:n,devReports:l,devFingers:c,contentStyle:b}}}),he=l("9989"),ye=l("8562"),qe=l("cb32"),_e=l("429bb"),Ge=l("7460"),xe=l("58a81"),De=l("adad"),Qe=l("823b");Se.render=c;t["default"]=Se;_()(Se,"components",{QPage:he["a"],QSplitter:ye["a"],QAvatar:qe["a"],QTabs:_e["a"],QTab:Ge["a"],QBadge:xe["a"],QTabPanels:De["a"],QTabPanel:Qe["a"]})}}]);