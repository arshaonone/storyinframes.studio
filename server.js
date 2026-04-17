const express = require('express');
const path = require('path');
const zlib = require('zlib');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// ── Gzip compression (built-in zlib — no extra dependency needed) ──
app.use((req, res, next) => {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const ext = path.extname(req.path).toLowerCase();

  // Don't compress already-compressed formats
  const skipCompress = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.woff', '.woff2', '.mp4', '.webm'];
  if (skipCompress.includes(ext)) return next();

  // Brotli (best) → gzip (good) → none
  if (/\bbr\b/.test(acceptEncoding)) {
    const _write = res.write.bind(res);
    const _end   = res.end.bind(res);
    const br     = zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 } });
    res.setHeader('Content-Encoding', 'br');
    res.setHeader('Vary', 'Accept-Encoding');
    res.removeHeader('Content-Length');
    res.write = (chunk) => br.write(chunk);
    res.end   = (chunk) => { if (chunk) br.write(chunk); br.end(); };
    br.on('data', (c) => _write(c));
    br.on('end',  () => _end());
    return next();
  }
  if (/\bgzip\b/.test(acceptEncoding)) {
    const _write = res.write.bind(res);
    const _end   = res.end.bind(res);
    const gz     = zlib.createGzip({ level: 6 });
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Vary', 'Accept-Encoding');
    res.removeHeader('Content-Length');
    res.write = (chunk) => gz.write(chunk);
    res.end   = (chunk) => { if (chunk) gz.write(chunk); gz.end(); };
    gz.on('data', (c) => _write(c));
    gz.on('end',  () => _end());
    return next();
  }
  next();
});

// ── Cache headers ──
app.use((req, res, next) => {
  const ext = path.extname(req.path).toLowerCase();
  // Immutable assets (images, fonts, icons)
  const longCache  = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.woff', '.woff2', '.svg'];
  // Cache CSS/JS for 1 day (short — they change often)
  const shortCache = ['.css', '.js'];

  if (longCache.includes(ext)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (shortCache.includes(ext)) {
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
  } else {
    // HTML — no cache (always fresh)
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  next();
});

// ── Security + performance headers ──
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Preconnect hints pushed as Link headers
  res.setHeader('Link', [
    '<https://fonts.googleapis.com>; rel=preconnect',
    '<https://fonts.gstatic.com>; rel=preconnect; crossorigin',
    '<https://cdnjs.cloudflare.com>; rel=dns-prefetch',
  ].join(', '));
  next();
});

// ── Static files ──
app.use(express.static(path.join(__dirname, 'public'), {
  etag: true,
  lastModified: true,
  maxAge: 0, // cache-control handled above
}));

// ── SPA fallback ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`StoryInFrames active — port ${port}`);
});
