if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return c[e]||(r=new Promise(async r=>{if("document"in self){const c=document.createElement("script");c.src=e,document.head.appendChild(c),c.onload=r}else importScripts(e),r()})),r.then(()=>{if(!c[e])throw new Error(`Module ${e} didn’t register its module`);return c[e]})},r=(r,c)=>{Promise.all(r.map(e)).then(e=>c(1===e.length?e[0]:e))},c={require:Promise.resolve(r)};self.define=(r,i,s)=>{c[r]||(c[r]=Promise.resolve().then(()=>{let c={};const n={uri:location.origin+r.slice(1)};return Promise.all(i.map(r=>{switch(r){case"exports":return c;case"module":return n;default:return e(r)}})).then(e=>{const r=s(...e);return c.default||(c.default=r),c})}))}}define("./service-worker.js",["./workbox-a867ce74"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"icons/icon-180.png",revision:"ec4efdf1e2c5774773504eac4754ae64"},{url:"icons/icon-192.png",revision:"bda55b0fbf3bf038742ee43f04afc5e1"},{url:"icons/icon-64.png",revision:"2e3cb2f7b34c3d6d9ea8e1f52029f9a1"},{url:"index.html",revision:"674e61cf0525293d41f0cf66a01fcd8a"},{url:"scripts/deck.f22c06601ec3925d46be.js",revision:"7560bf157d121cdc8ad4c5ff20c759d5"},{url:"scripts/vendor.6844bcb2aac0c64dfb90.js",revision:"c9e30ad87d7e2f5d6f8c972f7775010a"},{url:"scripts/vendor.6844bcb2aac0c64dfb90.js.LICENSE.txt",revision:"17a65840fb48b92dda10a0551122495d"},{url:"styles/deck.f22c06601ec3925d46be.css",revision:"9201a654f4f6c68bc4838c12573629c7"}],{}),e.registerRoute(/\.md5$/gi,new e.NetworkFirst,"GET"),e.registerRoute(/^https:\/\/3594t\.net\/img\/.*\.(jpg|png|gif)$/gi,new e.CacheFirst({cacheName:"3594t.net/img",plugins:[new e.ExpirationPlugin({maxAgeSeconds:259200,purgeOnQuotaError:!0})]}),"GET")}));
