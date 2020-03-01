importScripts('js/sw-utils.js');
const STATIC_CACHE  = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTA_CACHE  = 'inmuta-v1';

const APP_SCHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'
];
const APP_SCHELL_INMUTA = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'    
];
self.addEventListener('fetch', e => {
    const rpta = caches.match(e.request).then( resp => {
                    if(resp) {return resp}
                    else{
                        console.log(e.request.url);
                        return fetch(e.request).then(nresp => {
                            return actualizarDynamic(DYNAMIC_CACHE, e.request, nresp);
                        }); 
                    }
                });
});
self.addEventListener('install', e => {
    const cachestatic = caches.open(STATIC_CACHE).then(cache => {
        cache.addAll(APP_SCHELL);
    });
    const cacheinmuta = caches.open(INMUTA_CACHE).then(cache => {
        cache.addAll(APP_SCHELL_INMUTA);
    });
    e.waitUntil(Promise.all([cachestatic, cacheinmuta]));
});
self.addEventListener('activate', e => {
    const respuesta = caches.keys().then( keys => {
        console.log(keys);
        keys.forEach( key => {
            console.log(key);
            if (  key !== STATIC_CACHE && key.includes('static') ) {
                console.log("delete "+key);
                return caches.delete(key);
            }
        });
    });
    e.waitUntil( respuesta );
});
