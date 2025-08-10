// Simple offline cache for core assets and last lessons JSON
const CACHE = 'finpath-v1';
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/','/manifest.webmanifest','/content/tracks.v1.json'].filter(Boolean))));
  self.skipWaiting();
});
self.addEventListener('activate', (e)=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e)=>{
  const url = new URL(e.request.url);
  if (url.pathname.startsWith('/content/') || url.pathname.endsWith('.json')) {
    e.respondWith(
      caches.match(e.request).then((r)=> r || fetch(e.request).then(res=>{
        const copy = res.clone();
        caches.open(CACHE).then(c=>c.put(e.request, copy));
        return res;
      }).catch(()=> caches.match(e.request)))
    );
  }
});
