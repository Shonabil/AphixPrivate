// Service worker Aphix Private.
// Naikkan VERSION setiap kali isi website diubah supaya pengunjung dapat versi terbaru.
const VERSION = "aphix-v12";
const CORE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/images/aphixlogo-navy.png",
  "/images/aphixfull.jpg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Video terlalu besar untuk disimpan, langsung ambil dari jaringan
  if (/\.(mp4|webm|mov)$/i.test(url.pathname) || req.headers.has("range")) return;

  // File rapor dan halaman rapor jangan disimpan, supaya rapor terbaru selalu yang tampil
  if (url.pathname.startsWith("/rapor")) return;

  // Halaman: coba jaringan dulu (biar selalu terbaru), kalau offline pakai cache
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          // hanya beranda yang disimpan sebagai cadangan offline
          if (res.ok && (url.pathname === "/" || url.pathname === "/index.html")) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put("/index.html", copy));
          }
          return res;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Foto, ikon, Tailwind, Google Fonts: pakai cache dulu, perbarui di belakang
  const sameOrigin = url.origin === self.location.origin;
  const allowedCdn = /(cdn\.tailwindcss\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname);
  if (!sameOrigin && !allowedCdn) return;

  event.respondWith(
    caches.open(VERSION).then((cache) =>
      cache.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    )
  );
});
