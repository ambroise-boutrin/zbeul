const VERSION="zbeul-v13";
const CORE=["./","index.html","voice.js","jeux.js","lib/supabase.js","lib/qrcode.js","manifest.webmanifest",
 "fonts/dela.woff2","fonts/archivo.woff2","fonts/specialelite.woff2","fonts/cinzel.woff2","fonts/bungee.woff2","fonts/righteous.woff2","fonts/alfaslab.woff2",
 "icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","icons/apple-touch-icon.png","icons/favicon-32.png","icons/logo-256.png","lib/jsqr.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;
  const url=new URL(req.url);if(url.origin!==location.origin)return;
  if(req.mode==="navigate"){
    if(url.search){e.respondWith(fetch(req).catch(()=>caches.match("index.html")));return}
    e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(VERSION).then(x=>x.put("index.html",c));return r}).catch(()=>caches.match("index.html")));
    return;
  }
  /* stale-while-revalidate : réponse immédiate depuis le cache, mise à jour en arrière-plan */
  e.respondWith(caches.open(VERSION).then(cache=>cache.match(req,{ignoreSearch:true}).then(hit=>{
    const net=fetch(req).then(r=>{if(r.ok)cache.put(req,r.clone());return r}).catch(()=>hit);
    if(hit){e.waitUntil(net);return hit}
    return net;
  })));
});
