if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let n=Promise.resolve();return i[e]||(n=new Promise((async n=>{if("document"in self){const i=document.createElement("script");i.src=e,document.head.appendChild(i),i.onload=n}else importScripts(e),n()}))),n.then((()=>{if(!i[e])throw new Error(`Module ${e} didn’t register its module`);return i[e]}))},n=(n,i)=>{Promise.all(n.map(e)).then((e=>i(1===e.length?e[0]:e)))},i={require:Promise.resolve(n)};self.define=(n,r,c)=>{i[n]||(i[n]=Promise.resolve().then((()=>{let i={};const o={uri:location.origin+n.slice(1)};return Promise.all(r.map((n=>{switch(n){case"exports":return i;case"module":return o;default:return e(n)}}))).then((e=>{const n=c(...e);return i.default||(i.default=n),i}))})))}}define("./service-worker.js",["./workbox-2f0deffe"],(function(e){"use strict";e.setCacheNameDetails({prefix:"gen-tracker"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"css/app.0e433876.css",revision:null},{url:"css/vendor.85a60df6.css",revision:null},{url:"favicon.ico",revision:"741d77e92b287b1791c75de4f72b2c0d"},{url:"fonts/KFOkCnqEu92Fr1MmgVxIIzQ.a45108d3.woff",revision:null},{url:"fonts/KFOlCnqEu92Fr1MmEU9fBBc-.cea99d3e.woff",revision:null},{url:"fonts/KFOlCnqEu92Fr1MmSU5fBBc-.865f928c.woff",revision:null},{url:"fonts/KFOlCnqEu92Fr1MmWUlfBBc-.2267169e.woff",revision:null},{url:"fonts/KFOlCnqEu92Fr1MmYUtfBBc-.bac8362e.woff",revision:null},{url:"fonts/KFOmCnqEu92Fr1Mu4mxM.49ae34d4.woff",revision:null},{url:"fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.88e9c0a1.woff",revision:null},{url:"fonts/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.b8c10426.woff2",revision:null},{url:"icons/apple-icon-120x120.png",revision:"2c5e4f92436cbb09e775acefbd4e5737"},{url:"icons/apple-icon-152x152.png",revision:"059b8976c03f2b818f02a7412e44f720"},{url:"icons/apple-icon-167x167.png",revision:"13a64b1b0930abfb608729c7d838c34f"},{url:"icons/apple-icon-180x180.png",revision:"874fd7000d5dc8e5c319247b1a52cc3a"},{url:"icons/apple-launch-1125x2436.png",revision:"969ad7689e4a687352a33f2fe014573a"},{url:"icons/apple-launch-1242x2208.png",revision:"59f7ce3bde7bdf7bb371349a65f6690c"},{url:"icons/apple-launch-1242x2688.png",revision:"d47df111281ffe7c2f053d62e5b492e4"},{url:"icons/apple-launch-1536x2048.png",revision:"3c174c8c64b11d7d8ed3c4bf0f74ded5"},{url:"icons/apple-launch-1668x2224.png",revision:"e2c0924b5537f1eb1e306d763be77045"},{url:"icons/apple-launch-1668x2388.png",revision:"a088625e5118653aa0fa3d954d24c578"},{url:"icons/apple-launch-2048x2732.png",revision:"5e97cce3b793c3328897a0d6805ef657"},{url:"icons/apple-launch-640x1136.png",revision:"805d405a0754ee229901becbd98f1ab9"},{url:"icons/apple-launch-750x1334.png",revision:"2388ab4a0e692cb47608101afe9518c5"},{url:"icons/apple-launch-828x1792.png",revision:"288d0d02fb45072f4ea1ffdd33a01014"},{url:"icons/favicon-128x128.png",revision:"b3f5cea2171bb86284d0f4f38b5afd29"},{url:"icons/favicon-16x16.png",revision:"8ec3a6fd37b7bed1f4ffeaabddd27464"},{url:"icons/favicon-32x32.png",revision:"a42d2bb5bda62d71ed5b5e4c79b6967b"},{url:"icons/favicon-96x96.png",revision:"95efede26cf7cad6d0dd8979e7925210"},{url:"icons/icon-128x128.png",revision:"b3f5cea2171bb86284d0f4f38b5afd29"},{url:"icons/icon-192x192.png",revision:"cce8050ec1d5c395a0a972e5c1313afd"},{url:"icons/icon-256x256.png",revision:"4a64e7d9eba7038dcdd5faf423f558de"},{url:"icons/icon-384x384.png",revision:"154d7c352e3607f76153b1bdc01644cb"},{url:"icons/icon-512x512.png",revision:"a3fa4ec2916de9f2d478b1f32fcf1301"},{url:"icons/ms-icon-144x144.png",revision:"4ba5616dc7c8b55d328ab85177ae9f60"},{url:"icons/safari-pinned-tab.svg",revision:"20018e2a40a8bf324bd6b72492ea5e60"},{url:"index.html",revision:"e960ac1ccec38a897946e58437533a54"},{url:"js/2.b491b81f.js",revision:null},{url:"js/3.ce940dae.js",revision:null},{url:"js/4.efdaaacb.js",revision:null},{url:"js/app.1f961d07.js",revision:null},{url:"js/vendor.db9c2572.js",revision:null},{url:"manifest.json",revision:"338988c7fb28970a66146d66d6121224"},{url:"motorcycle.png",revision:"87c9ce0da47fe3b5e10686bb038e0180"}],{}),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{denylist:[/service-worker\.js$/,/workbox-(.)*\.js$/]}))}));
