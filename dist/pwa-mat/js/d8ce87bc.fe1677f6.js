(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["d8ce87bc"],{"10d0":function(t,e,n){"use strict";var a=n("ea40"),i=n.n(a);i.a},5437:function(t,e,n){},"5e58":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=function(){function t(){}return t.EOL="\r\n",t.BOM="\ufeff",t.DEFAULT_FIELD_SEPARATOR=",",t.DEFAULT_DECIMAL_SEPARATOR=".",t.DEFAULT_QUOTE='"',t.DEFAULT_SHOW_TITLE=!1,t.DEFAULT_TITLE="My Generated Report",t.DEFAULT_FILENAME="generated",t.DEFAULT_SHOW_LABELS=!1,t.DEFAULT_USE_TEXT_FILE=!1,t.DEFAULT_USE_BOM=!0,t.DEFAULT_HEADER=[],t.DEFAULT_KEYS_AS_HEADERS=!1,t}();e.CsvConfigConsts=a,e.ConfigDefaults={filename:a.DEFAULT_FILENAME,fieldSeparator:a.DEFAULT_FIELD_SEPARATOR,quoteStrings:a.DEFAULT_QUOTE,decimalSeparator:a.DEFAULT_DECIMAL_SEPARATOR,showLabels:a.DEFAULT_SHOW_LABELS,showTitle:a.DEFAULT_SHOW_TITLE,title:a.DEFAULT_TITLE,useTextFile:a.DEFAULT_USE_TEXT_FILE,useBom:a.DEFAULT_USE_BOM,headers:a.DEFAULT_HEADER,useKeysAsHeaders:a.DEFAULT_KEYS_AS_HEADERS};var i=function(){function t(t){this._csv="";var n=t||{};this._options=l({},e.ConfigDefaults,n),this._options.useKeysAsHeaders&&this._options.headers&&this._options.headers.length>0&&console.warn("Option to use object keys as headers was set, but headers were still passed!")}return Object.defineProperty(t.prototype,"options",{get:function(){return this._options},set:function(t){this._options=l({},e.ConfigDefaults,t)},enumerable:!0,configurable:!0}),t.prototype.generateCsv=function(t,e){if(void 0===e&&(e=!1),this._csv="",this._parseData(t),this._options.useBom&&(this._csv+=a.BOM),this._options.showTitle&&(this._csv+=this._options.title+"\r\n\n"),this._getHeaders(),this._getBody(),""!=this._csv){if(e)return this._csv;var n=this._options.useTextFile?"plain":"csv",i=this._options.useTextFile?".txt":".csv",r=new Blob([this._csv],{type:"text/"+n+";charset=utf8;"});if(navigator.msSaveBlob){var o=this._options.filename.replace(/ /g,"_")+i;navigator.msSaveBlob(r,o)}else{var s=this._options.useTextFile?"text":"csv",l=(encodeURI(this._csv),document.createElement("a"));l.href=URL.createObjectURL(r),l.setAttribute("visibility","hidden"),l.download=this._options.filename.replace(/ /g,"_")+i,document.body.appendChild(l),l.click(),document.body.removeChild(l)}}else console.log("Invalid data")},t.prototype._getHeaders=function(){if(this._options.showLabels||this._options.useKeysAsHeaders){var t=this._options.useKeysAsHeaders,e=t?Object.keys(this._data[0]):this._options.headers;if(e.length>0){for(var n="",i=0;i<e.length;i++)n+=e[i]+this._options.fieldSeparator;n=n.slice(0,-1),this._csv+=n+a.EOL}}},t.prototype._getBody=function(){for(var t=Object.keys(this._data[0]),e=0;e<this._data.length;e++){for(var n="",i=0;i<t.length;i++){var r=t[i];n+=this._formatData(this._data[e][r])+this._options.fieldSeparator}n=n.slice(0,-1),this._csv+=n+a.EOL}},t.prototype._formatData=function(t){return"locale"===this._options.decimalSeparator&&this._isFloat(t)?t.toLocaleString():"."!==this._options.decimalSeparator&&this._isFloat(t)?t.toString().replace(".",this._options.decimalSeparator):"string"===typeof t?(t=t.replace(/"/g,'""'),(this._options.quoteStrings||t.indexOf(",")>-1||t.indexOf("\n")>-1||t.indexOf("\r")>-1)&&(t=this._options.quoteStrings+t+this._options.quoteStrings),t):"boolean"===typeof t?t?"TRUE":"FALSE":t},t.prototype._isFloat=function(t){return+t===t&&(!isFinite(t)||Boolean(t%1))},t.prototype._parseData=function(t){return this._data="object"!=typeof t?JSON.parse(t):t,this._data},t}();e.ExportToCsv=i;var r=Object.prototype.hasOwnProperty,o=Object.prototype.propertyIsEnumerable;function s(t){if(null===t||void 0===t)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t)}function l(t){for(var e,n=[],a=1;a<arguments.length;a++)n[a-1]=arguments[a];for(var i,l=s(t),c=1;c<arguments.length;c++){for(var d in e=Object(arguments[c]),e)r.call(e,d)&&(l[d]=e[d]);if(Object.getOwnPropertySymbols){i=Object.getOwnPropertySymbols(e);for(var u=0;u<i.length;u++)o.call(e,i[u])&&(l[i[u]]=e[i[u]])}}return l}},"7c8f":function(t,e,n){"use strict";var a=n("c953"),i=n.n(a);i.a},8041:function(t,e,n){"use strict";var a=n("cddb"),i=n.n(a);i.a},"8b24":function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("q-page",{class:t.darkerClass},[n("q-resize-observable",{on:{resize:t.onResizePage}}),n("q-window-resize-observable",{on:{resize:t.onResize}}),n("map-management",{attrs:{height:t.mapHeight,pageWidth:t.pageWidth}}),n("q-tabs",{attrs:{animated:"",swipeable:""},model:{value:t.selectedTab,callback:function(e){t.selectedTab=e},expression:"selectedTab"}},[n("q-tab",{attrs:{slot:"title",count:t.devReports.length,name:"tab-1",label:"Report Log"},slot:"title"}),n("q-tab",{attrs:{slot:"title",count:t.devFingers.length,name:"tab-2",label:"Driver Management"},slot:"title"}),n("q-tab",{attrs:{slot:"title",name:"tab-3",label:"Configuration"},slot:"title"}),n("q-tab-pane",{attrs:{name:"tab-1","keep-alive":""}},[n("report-log",{attrs:{height:t.paneHeight}})],1),n("q-tab-pane",{attrs:{name:"tab-2","keep-alive":""}},[n("driver-management",{attrs:{height:t.paneHeight}})],1),n("q-tab-pane",{attrs:{name:"tab-3","keep-alive":""}},[n("global-configuration")],1)],1)],1)},i=[];a._withStripped=!0;var r=n("3156"),o=n.n(r),s=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"row",style:{height:t.height+"px"}},[n("div",{staticClass:"col-xs-12",class:{"col-sm-6":t.showStreetView}},[n("gmap-map",{staticClass:"fit",attrs:{center:t.center,zoom:t.zoom,"map-type-id":"roadmap"}},[t.position.valid?n("gmap-marker",{attrs:{position:t.position}}):t._e(),t.path.length>0?n("gmap-polyline",{ref:"polyline",attrs:{path:t.path}}):t._e()],1)],1),t.showStreetView?n("div",{staticClass:"col-xs-12 col-sm-6"},[n("gmap-street-view-panorama",{staticClass:"fit",attrs:{position:t.position,pov:t.pov,zoom:1},on:{pano_changed:t.updatePano,pov_changed:t.updatePov}})],1):t._e()])},l=[];s._withStripped=!0;var c=n("4082"),d=n.n(c),u=(n("c5f6"),n("110e")),p=function(t){var e=t.lng,n=t.lat,a=u["b"].map.borderIndonesia;return e>a.lngMin&&e<a.lngMax&&n>a.latMin&&n<a.latMax},h=function(t){var e=t.frameID,n=t.lat,a=t.lng,i=o()({},u["b"].map.centerIndonesia,{valid:!1});return e===u["b"].frame.id.FULL&&(i.lat=n,i.lng=a,i.valid=p(i)),i},f=function(t){var e=t.frameID,n=t.heading;return e===u["b"].frame.id.FULL?n:0},m=n("d87e"),v=n("2f62"),g={props:{height:Number,pageWidth:Number},data:function(){return{center:o()({},u["b"].map.centerIndonesia),position:o()({},u["b"].map.centerIndonesia,{valid:!1}),zoom:u["b"].map.zoom,pov:null,pano:null,path:[]}},computed:o()({},Object(v["e"])("db",["theReport"]),Object(v["c"])("db",[m["d"]]),{showStreetView:function(){return this.pageWidth>=728}}),methods:{updatePov:function(t){this.pov=t},updatePano:function(t){this.pano=t},setPosition:function(t){var e=t.valid,n=d()(t,["valid"]);e?(this.zoom=17,this.center=o()({},n)):(this.zoom=u["b"].map.zoom,this.center=o()({},u["b"].map.centerIndonesia)),this.position=o()({},n,{valid:e})}},watch:{devReports:{immediate:!0,handler:function(t){if(t.length>0){var e=t[0],n=e.frameID,a=e.gpsLatitude,i=e.gpsLongitude,r=h({frameID:n.val,lat:a&&a.val,lng:i&&i.val});r.valid&&this.path.push(r)}}},theReport:{immediate:!0,handler:function(t){if(t){var e=t.frameID,n=t.gpsLatitude,a=t.gpsLongitude,i=t.gpsHeading;this.setPosition(h({frameID:e.val,lat:n&&n.val,lng:a&&a.val})),this.pov&&this.updatePov(o()({},this.pov,{heading:f({frameID:e.val,heading:i&&i.val})}))}}}}},b=g,_=(n("7c8f"),n("2877")),E=Object(_["a"])(b,s,l,!1,null,null,null);E.options.__file="MapManagement.vue";var x=E.exports,y=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"row gutter-xs"},[n("div",{staticClass:"col-xs-12 text-right"},[n("q-btn",{staticClass:"q-ma-xs",attrs:{color:"green",label:"FOLLOW",icon:t.lock.follow?"lock":"lock_open",dense:"",outline:!t.lock.follow,loading:t.loading,disable:0==t.devReports.length},on:{click:function(e){t.lock.follow=!t.lock.follow}}})],1),n("div",{staticClass:"col-xs-12"},[n("q-scroll-area",{ref:"scroller",style:{height:(t.height<150?150:t.height)+"px"}},[t.devReports.length>0?n("q-list",{attrs:{dark:t.darker,highlight:"",link:"",dense:"",separator:""}},t._l(t.devReports,function(e,a){return n("q-item",{key:a,attrs:{dark:t.darker,active:e.hex===t.theReport.hex},nativeOn:{click:function(n){t.SET_THE_REPORT(e)}}},[n("q-item-side",[n("q-chip",{attrs:{color:"primary",dense:"",square:""}},[t._v("\n              "+t._s(t.getDatetime(e))+"\n            ")]),n("q-chip",{staticClass:"q-ml-sm",staticStyle:{width:"60px"},attrs:{color:"FULL"==e.frameID.out?"green":"light-green",dense:"",square:""}},[t._v("\n              "+t._s(e.frameID.out)+"\n            ")])],1),n("q-item-main",{staticClass:"q-caption"},[t._v("\n            "+t._s(e.hex)+"\n          ")])],1)})):n("q-alert",{staticClass:"q-ma-xs",attrs:{icon:"info",color:"faded"}},[t._v("\n        No report yet\n      ")])],1)],1)])},S=[];y._withStripped=!0;var O=n("1a0d"),C=n("a7bc"),w=n("ae51"),T={props:{height:Number},mixins:[w["a"]],data:function(){return{lock:{follow:!0}}},computed:o()({},Object(v["e"])("db",["theUnit","theReport"]),Object(v["c"])("db",[m["d"]])),methods:o()({},Object(v["d"])("db",[C["m"]]),{getDatetime:function(t){var e=t.logDatetime;return Object(O["i"])(e.val)}}),watch:{devReports:{immediate:!0,handler:function(t){t.length>0&&this.lock.follow&&this.SET_THE_REPORT(t[0])}}}},D=T,F=(n("10d0"),Object(_["a"])(D,y,S,!1,null,null,null));F.options.__file="ReportLog.vue";var q=F.exports,L=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"row gutter-xs"},[n("div",{staticClass:"col-xs-12 text-right"},[n("q-btn",{staticClass:"q-ma-xs",attrs:{color:"purple",label:"FETCH",dense:"",disable:!t.theUnit,loading:t.loading},on:{click:function(e){t.fetchFinger()}}}),n("q-btn",{staticClass:"q-ma-xs",attrs:{color:"green",label:"ADD",dense:"",disable:!t.theUnit,loading:t.loading},on:{click:function(e){t.addFinger()}}}),n("q-btn",{staticClass:"q-ma-xs",attrs:{color:"red",label:"RESET",dense:"",disable:t.loading||!t.theUnit,loading:t.loading},on:{click:function(e){t.resetFinger()}}})],1),n("div",{staticClass:"col-xs-12"},[n("q-scroll-area",{style:{height:(t.height<150?150:t.height)+"px"}},[t.devFingers.length>0?n("q-list",{attrs:{dark:t.darker,highlight:"",separator:"",dense:"",link:""}},t._l(t.devFingers,function(e,a){return n("q-item",{key:a,attrs:{dark:t.darker}},[n("q-item-side",[n("q-chip",{attrs:{color:"primary",square:""}},[t._v("\n              "+t._s(e.fingerID)+"\n            ")])],1),n("q-item-main",[t._v(" Mr. "+t._s(t.name[e.fingerID-1]))]),n("q-item-side",{attrs:{right:""}},[n("q-btn",{attrs:{round:"",dense:"",color:"red",size:"sm",icon:"delete",loading:t.loading},on:{click:function(n){t.deleteFinger(e)}}})],1)],1)})):n("q-alert",{staticClass:"q-ma-xs",attrs:{icon:"info",color:"faded"}},[t._v("\n        No finger driver yet\n      ")])],1)],1)])},R=[];L._withStripped=!0;n("28a5");var A=n("95f8"),k=n("595a"),I=n("5f41"),j={props:{height:Number},mixins:[w["a"]],data:function(){return{name:["One","Two","Three","Four","Five"]}},computed:o()({},Object(v["e"])("db",["theUnit","commands"]),Object(v["c"])("db",[m["c"],m["d"]])),mounted:function(){this.devReports.length>0&&this.devReports[0].vehicleState.out>=I["b"]["STANDBY"]&&this.fetchFinger()},methods:o()({},Object(v["d"])("db",[C["b"],C["h"],C["i"]]),{fetchFinger:function(){this.$root.$emit("executeCommand","FINGER_FETCH")},addFinger:function(){this.$root.$emit("executeCommand","FINGER_ADD")},deleteFinger:function(t){var e=this,n=t.fingerID;this.$q.dialog({title:"Confirmation",message:"Are you sure to remove this fingerprint *".concat(n,"* ?"),preventClose:!0,cancel:!0}).then(function(){return e.$root.$emit("executeCommand","FINGER_DEL=".concat(n))}).catch(function(){})},resetFinger:function(){var t=this;this.$q.dialog({title:"Confirmation",message:"Are you sure to remove all fingerprints  ?",preventClose:!0,cancel:!0}).then(function(){return t.$root.$emit("executeCommand","FINGER_RST")}).catch(function(){})}}),watch:{commands:{deep:!0,handler:function(t){if(t.length>0){var e=t[0],n=e.resCode,a=e.payload,i=e.unitID,r=e.message,o=Object(k["a"])(n);if("OK"==o.title){var s=Object(A["b"])(a),l=s.prop,c=s.value;if("FINGER_FETCH"==l){if(r.length>0)for(var d=r.split(","),u=d.length-1;u>=0;u--)this.ADD_FINGERS({unitID:i,fingerID:d[u]})}else"FINGER_ADD"==l?this.ADD_FINGERS({unitID:i,fingerID:r}):"FINGER_DEL"==l?this.DELETE_FINGERS({unitID:i,fingerID:c}):"FINGER_RST"==l&&this.RESET_FINGERS({unitID:i})}}}}}},U=j,N=(n("e787"),Object(_["a"])(U,L,R,!1,null,null,null));N.options.__file="DriverManagement.vue";var H=N.exports,P=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"row"},[n("div",{staticClass:"col-12"},[n("div",{staticClass:"row"},[n("div",{staticClass:"col-auto q-ma-sm"},[n("q-btn",{staticClass:"q-ma-xs",attrs:{icon:"delete",color:"negative",label:"Clear data",disable:0==t.units.length},on:{click:function(e){t.clearStore()}}})],1),n("div",{staticClass:"col-auto q-ma-sm"},[n("q-btn",{staticClass:"q-ma-xs",attrs:{icon:"stop",color:"primary",label:"Ignore command",disable:!t.theCommand},on:{click:function(e){t.$root.$emit("ignoreCommand")}}})],1),n("div",{staticClass:"col-auto q-ma-sm"},[n("q-btn",{staticClass:"q-ma-xs",attrs:{icon:"cloud_download",color:"green",label:"Export CSV",disable:0==t.reports.length},nativeOn:{click:function(e){t.exportCSV()}}})],1),n("div",{staticClass:"col-auto q-ma-sm"},[n("q-btn",{staticClass:"q-ma-xs",attrs:{icon:"cloud_download",color:"purple",label:"Export JSON",disable:0==t.reports.length},nativeOn:{click:function(e){t.exportJSON()}}})],1)]),n("div",{staticClass:"row"},[n("div",{staticClass:"col-auto q-ma-sm"},[n("q-uploader",{ref:"importer",staticClass:"q-ma-sm",attrs:{dark:t.darker,"upload-factory":t.importJSON,url:"",extensions:".json","stack-label":"Import JSON","auto-expand":"","hide-upload-progress":""}})],1)]),n("div",{staticClass:"row"},[n("div",{staticClass:"col-auto q-ma-sm"},[n("q-toggle",{staticClass:"q-pt-lg",attrs:{dark:t.darker,label:"Dark Mode"},model:{value:t.darkState,callback:function(e){t.darkState=e},expression:"darkState"}})],1),n("div",{staticClass:"col-auto q-ma-sm"},[n("q-toggle",{staticClass:"q-pt-lg",attrs:{dark:t.darker,label:"Time Calibration",disable:0==t.units.length},model:{value:t.calibrationState,callback:function(e){t.calibrationState=e},expression:"calibrationState"}})],1)])])])},$=[];P._withStripped=!0;var M=n("6ad4"),B=n("9523"),G=n.n(B),z=n("ab1c"),J=n("f23f");function W(t){return"[object Array]"===Object.prototype.toString.call(t)}function K(t,e){if(!t)throw new Error(e)}function V(t){return Object.keys(t).map(function(e){return t[e]})}function Y(t){return Object.keys(t)}function Q(t){return Object.keys(t).map(function(e){return[e,t[e]]})}function X(t,e){var n="."+e,a=new RegExp("(\\"+e+")?$");return t.replace(/\s+/,"_").replace(a,n)}function Z(t){return"555xmlHello .  world!".trim().replace(/^([0-9,;]|(xml))+/,""),t.replace(/[^_a-zA-Z 0-9:\-\.]/g,"").replace(/^([ 0-9-:\-\.]|(xml))+/i,"").replace(/ +/g,"-")}function tt(t){return Array(t+1).join(" ")}function et(t){return t.replace(/([<>&])/g,function(t,e){switch(e){case"<":return"&lt;";case">":return"&gt;";case"&":return"&amp;";default:return""}})}function nt(t,e){switch(e){case"txt":return"data:text/plain;charset=utf-8,"+encodeURIComponent(t);case"json":return"data:application/json;charset=utf-8,"+encodeURIComponent(t);case"csv":return"data:text/csv;charset=utf-8,\ufeff"+encodeURIComponent(t);case"xls":return"data:application/vnd.ms-excel;charset=utf-8,"+encodeURIComponent(t);case"xml":return"data:application/xml;charset=utf-8,"+encodeURIComponent(t);default:return""}}function at(t,e,n){void 0===n&&(n="download");var a=nt(t,e),i=document.createElement("a");i.href=a,i.download=n,i.setAttribute("style","visibility:hidden"),document.body.appendChild(i),i.click(),document.body.removeChild(i)}var it=function(t,e){var n="function"===typeof Symbol&&t[Symbol.iterator];if(!n)return t;var a,i,r=n.call(t),o=[];try{while((void 0===e||e-- >0)&&!(a=r.next()).done)o.push(a.value)}catch(t){i={error:t}}finally{try{a&&!a.done&&(n=r["return"])&&n.call(r)}finally{if(i)throw i.error}}return o};function rt(t){var e="Invalid export data. Please provide a valid JSON";try{return"string"===typeof t?JSON.parse(t):t}catch(t){throw new Error(e)}}function ot(t,e,n){void 0===e&&(e=null);var a="Invalid export data. Please provide valid JSON object";try{return JSON.stringify(t,e,n)}catch(t){throw new Error(a)}}function st(t){return t.map(Q).reduce(function(e,n,a){return n.reduce(function(e,n){var i=n[0],r=n[1],o=e[i]||Array.from({length:t.length}).map(function(t){return""});return o[a]=("string"!==typeof r?JSON.stringify(r):r)||"",e[i]=o,e},e)},Object.create(null))}function lt(t,e){if(void 0===e&&(e=","),!t.length)return"";var n=st(t),a=Y(n).join(e)+"\r\n",i=V(n).map(function(t){return t.map(function(t){return'"'+t.replace(/\"/g,'""')+'"'})}),r=i.reduce(function(t,n){return t.map(function(t,a){return""+t+e+n[a]})});return a+r.join("\r\n")}function ct(t){K(t.length>0);var e=st(t),n=Y(e),a=V(e).map(function(t){return t.map(function(t){return"<td>"+t+"</td>"})}),i=a.reduce(function(t,e){return t.map(function(t,n){return""+t+e[n]})});return"\n    <table>\n      <thead>\n        <tr><th><b>"+n.join("</b></th><th><b>")+"</b></th></tr>\n      </thead>\n      <tbody>\n        <tr>"+i.join("</tr>\n        <tr>")+"</tr>\n      </tbody>\n    </table>\n  "}function dt(t){if(!t.length)return"";var e='<html>\n  <head>\n    <meta charset="UTF-8">\n  </head >\n  <body>\n    '+ct(t)+"\n  </body>\n</html >\n";return e}function ut(t){var e='<?xml version="1.0" encoding="utf-8"?><!DOCTYPE base>\n'+pt(t,"base")+"\n";return e}function pt(t,e,n,a){void 0===n&&(n="element"),void 0===a&&(a=0);var i=Z(e),r=tt(a);if(null===t||void 0===t)return r+"<"+i+" />";var o=W(t)?t.map(function(t){return pt(t,n,n,a+2)}).join("\n"):"object"===typeof t?Q(t).map(function(t){var e=it(t,2),i=e[0],r=e[1];return pt(r,i,n,a+2)}).join("\n"):r+"  "+et(String(t)),s=r+"<"+i+">\n"+o+"\n"+r+"</"+i+">";return s}function ht(t){var e=t.data,n=t.fileName,a=void 0===n?"download":n,i=t.exportType,r=void 0===i?"txt":i,o=t.replacer,s=void 0===o?null:o,l=t.space,c=void 0===l?4:l,d=t.processor,u=void 0===d?at:d,p=t.withBOM,h=void 0!==p&&p,f=t.delimiter,m=void 0===f?",":f,v="Invalid export data. Please provide an array of object",g="Can't export unknown data type "+r+".",b=rt(e),_=ot(b,s,c);switch(r){case"txt":return u(_,r,X(a,"txt"));case"json":return u(_,r,X(a,"json"));case"csv":K(W(b),v);var E="\ufeff",x=lt(b,m),y=h?E+x:x;return u(y,r,X(a,"csv"));case"xls":K(W(b),v);y=dt(b);return u(y,r,X(a,"xls"));case"xml":y=ut(b);return u(y,r,X(a,"xml"));default:throw new Error(g)}}(function(t){t.types={txt:"txt",json:"json",csv:"csv",xls:"xls",xml:"xml"},t.processors={downloadFile:at}})(ht||(ht={}));var ft=ht,mt=ft,vt=function(t){return t.map(function(t){return o()({},z["a"].reduce(function(e,n){var a=n.field,i=n.no;return o()({},e,G()({},i,t[a]?t[a].out:""))},{}))})},gt=function(){return z["a"].reduce(function(t,e){var n=e.title,a=e.unit;return t.concat([n+(a?" (".concat(a,")"):"")])},[])},bt=function(t){var e=new J["ExportToCsv"]({fieldSeparator:",",quoteStrings:'"',decimalSeparator:".",showLabels:!0,showTitle:!1,title:"My Awesome CSV",useTextFile:!1,useBom:!0,useKeysAsHeaders:!1,headers:gt()});e.generateCsv(vt(t))},_t=function(t){var e=t.map(function(t){var e=t.hex;return e}),n=makeExportName(),a="json";mt({data:e,fileName:n,exportType:a})},Et={mixins:[w["a"]],computed:o()({},Object(v["e"])("db",["units","calibration","theCommand","reports"]),Object(v["c"])("db",[m["d"]]),{calibrationState:{get:function(){return this.calibration},set:function(t){this.TOGGLE_CALIBRATION()}},darkState:{get:function(){return this.darker},set:function(t){this.TOGGLE_DARKER()}}}),methods:o()({},Object(v["d"])("db",[C["o"],C["p"]]),Object(v["b"])("db",[M["a"]]),{exportJSON:function(){_t(this.reports)},exportCSV:function(){bt(this.reports)},importJSON:function(t,e){var n=this;if(0==this.reports.length){var a=new FileReader;a.onload=function(t){n.$root.$emit("importReport",JSON.parse(t.target.result).reverse()),n.$refs.importer.reset()},a.readAsText(t)}else this.$q.notify({message:"Database should empty",type:"negative"})},clearStore:function(){var t=this;this.$q.dialog({title:"Confirmation",message:"Are you sure to remove all data?",preventClose:!0,cancel:!0}).then(function(){return t.RESET_DATABASE()}).catch(function(){})}}),watch:{devReports:function(t){if(t.length>0&&this.calibration){var e=t[0],n=e.frameID,a=e.gpsLatitude,i=e.gpsLongitude,r=e.sendDatetime;if(n.val===this.$config.frame.id.FULL){var o=Object(O["b"])({lat:a.val,lng:i.val,datetime:r.val});o&&(this.$root.$emit("executeCommand","REPORT_RTC=".concat(o)),this.$q.notify({message:"Calibrating device time.."}))}}}}},xt=Et,yt=(n("ca88"),Object(_["a"])(xt,P,$,!1,null,null,null));yt.options.__file="GlobalConfiguration.vue";var St=yt.exports,Ot={mixins:[w["a"]],components:{MapManagement:x,ReportLog:q,DriverManagement:H,GlobalConfiguration:St},data:function(){return{selectedTab:"tab-1",mapHeight:300,paneHeight:0,pageWidth:0}},computed:o()({},Object(v["c"])("db",[m["d"],m["c"]])),methods:{onResize:function(t){var e=t.height;this.paneHeight=e-this.mapHeight-180},onResizePage:function(t){var e=t.width;this.pageWidth=e}}},Ct=Ot,wt=(n("8041"),Object(_["a"])(Ct,a,i,!1,null,null,null));wt.options.__file="Index.vue";e["default"]=wt.exports},ae51:function(t,e,n){"use strict";var a=n("3156"),i=n.n(a),r=n("2f62");e["a"]={computed:i()({},Object(r["e"])("db",["loading","darker"]),{darkerClass:function(){return this.darker?"bg-dark text-white":"bg-white text-black"}})}},bdd5:function(t,e,n){},c953:function(t,e,n){},ca88:function(t,e,n){"use strict";var a=n("5437"),i=n.n(a);i.a},cddb:function(t,e,n){},e787:function(t,e,n){"use strict";var a=n("bdd5"),i=n.n(a);i.a},ea40:function(t,e,n){},f23f:function(t,e,n){"use strict";function a(t){for(var n in t)e.hasOwnProperty(n)||(e[n]=t[n])}Object.defineProperty(e,"__esModule",{value:!0}),a(n("5e58"))}}]);