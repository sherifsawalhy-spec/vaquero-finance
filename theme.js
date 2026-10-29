/* Vaquero apps — shared light / dark choice (25/10/2026).
   Dark mode follows the phone/computer setting (see theme.css). The moon/sun
   button on the Vaquero home screen (launch page) overrides it: the home
   screen opens each app with ?theme=light|dark, and the app keeps that choice
   in a shared store (theme-store.html in a hidden frame) so every Vaquero app
   on the device uses it, however it is opened. */
(function () {
  var KEY = 'vqTheme', root = document.documentElement;
  var STORE = 'https://vaquerohospitality.github.io', STORE_URL = STORE + '/theme-store.html';
  var cur = '';
  try { cur = localStorage.getItem(KEY) || ''; } catch (e) {}
  function apply(t) { cur = t || ''; if (cur) root.setAttribute('data-theme', cur); else root.removeAttribute('data-theme'); try { if (cur) localStorage.setItem(KEY, cur); else localStorage.removeItem(KEY); } catch (e) {} }
  apply(cur);   // last known choice straight away, then the shared one when the frame answers

  var frame = null, pending = null;
  function send(msg) { if (frame && frame.contentWindow) frame.contentWindow.postMessage(msg, STORE); }
  window.addEventListener('message', function (e) {
    if (e.origin !== STORE) return;
    var d = e.data || {};
    if (d.vq !== 'theme' || typeof d.value !== 'string') return;
    if (pending !== null) { var p = pending; pending = null; if (p !== d.value) { send({ vq: 'theme', set: p }); return; } }
    if (d.value !== cur) apply(d.value);
  });
  function addFrame() {
    if (frame || !document.body) return;
    frame = document.createElement('iframe');
    frame.src = STORE_URL; frame.title = 'theme'; frame.setAttribute('aria-hidden', 'true'); frame.tabIndex = -1;
    frame.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden';
    frame.onload = function () { send(pending !== null ? { vq: 'theme', set: pending } : { vq: 'theme' }); };
    document.body.appendChild(frame);
  }
  /* Opened from the home screen with ?theme=light|dark: use it and save it for all apps. */
  function fromUrl() {
    try {
      google.script.url.getLocation(function (l) {
        var t = l && l.parameter && l.parameter.theme;
        if (t === 'light' || t === 'dark' || t === 'auto') {
          var v = t === 'auto' ? '' : t;
          apply(v); pending = v;
          send({ vq: 'theme', set: v });
        }
      });
    } catch (e) {}
  }
  function start() { addFrame(); fromUrl(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  /* Remove the per-app button from the earlier version if a cached page still has it. */
  var old = document.getElementById('vqThemeBtn'); if (old) old.remove();
})();

/* Vaquero Assistant (29/10/2026): adds the chat button to every Vaquero app that loads this file. */
(function () {
  try {
    if (window.__vqAssistant || /^Vaquero Assistant$/i.test(document.title)) return;
    var s = document.createElement('script');
    s.src = 'https://vaquerohospitality.github.io/assistant.js'; s.async = true;
    (document.head || document.documentElement).appendChild(s);
  } catch (e) {}
})();
