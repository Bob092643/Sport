const CACHE='krachthuis-v7';
const SHELL=['./','index.html','firebase-config.js','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','icon-maskable-512.png'];
const EXT=['https://fonts.googleapis.com','https://fonts.gstatic.com','https://www.gstatic.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url),own=u.origin===location.origin;
  if(!own&&!EXT.includes(u.origin))return;
  if(own&&(r.mode==='navigate'||/\.(html|js)$/.test(u.pathname))){
    e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res})));
});
