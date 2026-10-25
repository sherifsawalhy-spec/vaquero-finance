/* Vaquero apps — light / dark switch (25/10/2026).
   Dark mode follows the phone/computer setting (see theme.css). This adds a
   small moon/sun button to the app header that overrides it; the choice is
   remembered on that device. */
(function () {
  var KEY = 'vqTheme', root = document.documentElement;
  function saved() { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } }
  function apply(t) { if (t) root.setAttribute('data-theme', t); else root.removeAttribute('data-theme'); }
  function dark() { var t = saved(); return t ? t === 'dark' : !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches); }
  apply(saved());
  var HOSTS = ['#mHead .topbar-actions', '.topbar-actions', '.topright', '.hdr-actions', 'header .actions', '.topbar', 'header'];
  function icon(b) { b.textContent = dark() ? '\u2600' : '\u263e'; b.title = dark() ? 'Light mode' : 'Dark mode'; }
  function add() {
    var b = document.getElementById('vqThemeBtn'), host = null;
    for (var i = 0; i < HOSTS.length && !host; i++) host = document.querySelector(HOSTS[i]);
    if (!host) return;
    if (b && b.parentNode === host) return;
    if (!b) {
      b = document.createElement('button');
      b.id = 'vqThemeBtn'; b.type = 'button';
      b.style.cssText = 'width:30px;height:30px;min-width:30px;padding:0;margin:0 0 0 6px;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:transparent;color:#fff;font-size:15px;line-height:28px;text-align:center;cursor:pointer;flex:none';
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var next = dark() ? 'light' : 'dark';
        try { localStorage.setItem(KEY, next); } catch (er) {}
        apply(next); icon(b);
      });
    }
    icon(b);
    host.appendChild(b);
  }
  function start() { add(); var n = 0, t = setInterval(function () { add(); if (++n > 20) clearInterval(t); }, 500); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  if (window.matchMedia) try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { var b = document.getElementById('vqThemeBtn'); if (b) icon(b); }); } catch (e) {}
})();
