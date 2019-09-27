/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

importScripts(
  "scripts/precache-manifest.c0993ce610cafbdb906286bfc168a8b2.js"
);

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/\.md5$/gi, new workbox.strategies.NetworkFirst(), 'GET');
workbox.routing.registerRoute(/^https:\/\/3594t\.net\/img\/.*\.(jpg|png|gif)$/gi, new workbox.strategies.CacheFirst({ "cacheName":"3594t.net/img", plugins: [new workbox.expiration.Plugin({ maxAgeSeconds: 259200, purgeOnQuotaError: false })] }), 'GET');
