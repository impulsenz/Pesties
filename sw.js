// Pestis offline app cache.
// Keeps the app and its libraries available with no connection. Photos are NOT stored on the device.
// Database calls are NOT cached here - the app's own upload queue handles data.

const SHELL_CACHE = 'pestis-shell-v15';
const RUNTIME_CACHE = 'pestis-runtime-v15';

const SHELL = ['./', './index.html', './images/pesties-logo.png'];
const CDN = [
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
    'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];
const CDN_HOSTS = ['cdn.tailwindcss.com', 'cdn.jsdelivr.net', 'unpkg.com', 'cdnjs.cloudflare.com'];

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(SHELL_CACHE);
        await Promise.all([
            ...SHELL.map(u => cache.add(new Request(u, { cache: 'reload' })).catch(() => {})),
            ...CDN.map(u => fetch(u, { mode: 'no-cors' }).then(r => cache.put(u, r)).catch(() => {}))
        ]);
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const keep = [SHELL_CACHE, RUNTIME_CACHE]; // any photo cache from older versions is deleted
        for (const k of await caches.keys()) if (!keep.includes(k)) await caches.delete(k);
        await self.clients.claim();
    })());
});

async function trimCache(name, max) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

self.addEventListener('fetch', event => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);

    // App page: try the network first, fall back to the saved copy when offline
    if (req.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                // Always check the server for a newer copy of the app (skips the browser's own cache)
                const res = await fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' });
                if (res.ok) {
                    const cache = await caches.open(SHELL_CACHE);
                    cache.put(url.origin + url.pathname, res.clone());
                }
                return res;
            } catch (e) {
                return (await caches.match(url.origin + url.pathname))
                    || (await caches.match(req, { ignoreSearch: true }))
                    || (await caches.match('./index.html'))
                    || (await caches.match('./'))
                    || Response.error();
            }
        })());
        return;
    }

    // Photos are never kept on the device: they load from the server only when opened
    if (url.hostname.endsWith('.supabase.co') && url.pathname.includes('/storage/')) return;

    // Everything else from Supabase (database, auth) goes straight to the network
    if (url.hostname.endsWith('.supabase.co')) return;

    // App files and libraries: serve the saved copy instantly, refresh it in the background
    if (url.origin === self.location.origin || CDN_HOSTS.includes(url.hostname)) {
        event.respondWith((async () => {
            const cached = await caches.match(req);
            const network = fetch(req).then(async res => {
                if (res && (res.ok || res.type === 'opaque')) {
                    const cache = await caches.open(RUNTIME_CACHE);
                    cache.put(req, res.clone());
                }
                return res;
            }).catch(() => null);
            return cached || (await network) || Response.error();
        })());
    }
});
