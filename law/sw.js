/* 구주소(/KIMMANMIN/law/) 전용 — 자기 자신을 해지하는 서비스워커.
   법규 사이트는 https://manminkim-eng.github.io/manmin-law/ 로 이전했다.
   기존 방문자 브라우저에 남아 있는 구 SW·구 캐시를 정리하고 등록을 해제한다. */
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil((async function(){
    var keys = await caches.keys();
    await Promise.all(keys.map(function(k){ return caches.delete(k); }));
    await self.registration.unregister();
    var cs = await self.clients.matchAll({ type:'window' });
    cs.forEach(function(c){ try{ c.navigate(c.url); }catch(_){} });
  })());
});
