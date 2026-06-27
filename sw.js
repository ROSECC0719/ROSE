const CACHE_NAME='rose-studio-v5-0';
const ASSETS=['./','./index.html','./manifest.json','./assets/logo.svg','./assets/favicon.svg','./css/style.css','./css/card.css','./css/setting.css','./js/app.js','./js/storage.js','./js/utils.js','./js/countries.js','./js/settings.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null))));self.clients.claim();});
self.addEventListener('fetch',e=>{e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));});
