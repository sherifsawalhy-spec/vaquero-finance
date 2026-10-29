/*
 * Vaquero Assistant — floating chat button for every Vaquero app.
 * Loaded automatically by theme.js (which every Vaquero app already includes), so no app needs
 * changing. An app can also include it directly with data-app="Name" to set the app name.
 * Computer: opens the chat as a side panel over the app. Phone: opens the chat full screen
 * (Back returns to the app).
 */
(function () {
  if (window.__vqAssistant) return; window.__vqAssistant = 1;
  var URL = 'https://script.google.com/a/macros/vaquerohospitality.com/s/AKfycbxYQIo82hg0-HICa7P1_ivoIYpE3H_2uvE82G-ZKchKAq4LrIHxYtcszmhRcz8sefxF/exec';
  var me = document.currentScript || document.querySelector('script[src*="assistant.js"]');
  var app = (me && me.getAttribute('data-app')) || String(document.title || '').replace(/^Vaquero\s+/i, '').replace(/\s*[-–—|].*$/, '').trim();
  if (/^Vaquero Assistant$/i.test(document.title)) return;   // never inside the assistant itself
  var mobile = window.matchMedia('(max-width: 700px)').matches || /iPhone|Android.+Mobile/.test(navigator.userAgent);
  var link = URL + '?app=' + encodeURIComponent(app);

  var css = '.vqa-btn{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom));z-index:2147483000;width:54px;height:54px;border-radius:50%;border:0;cursor:pointer;' +
    'background:#c0643b;color:#fff;box-shadow:0 6px 18px rgba(27,42,65,.28);display:flex;align-items:center;justify-content:center;transition:transform .12s}' +
    '.vqa-btn:hover{transform:scale(1.06)}.vqa-btn svg{width:26px;height:26px}' +
    '.vqa-btn.has-bar{bottom:calc(78px + env(safe-area-inset-bottom))}' +
    '.vqa-panel{position:fixed;top:0;right:0;bottom:0;width:min(440px,100vw);z-index:2147483001;background:#f7f2ea;box-shadow:-8px 0 30px rgba(0,0,0,.25);transform:translateX(105%);transition:transform .2s ease;display:flex}' +
    '.vqa-panel.open{transform:none}.vqa-panel iframe{border:0;width:100%;height:100%}' +
    '@media print{.vqa-btn,.vqa-panel{display:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var b = document.createElement('button');
  b.className = 'vqa-btn'; b.type = 'button'; b.title = 'Ask the Vaquero Assistant'; b.setAttribute('aria-label', 'Vaquero Assistant');
  b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/></svg>';

  // keep clear of a bottom tab bar if the app has one
  function lift() {
    var bar = document.querySelector('.bottom-nav,.bottombar,.tabbar,nav.bottom,#bottomNav,.bnav');
    b.classList.toggle('has-bar', !!(bar && getComputedStyle(bar).position === 'fixed'));
  }

  // pass this page's light/dark choice so the chat looks the same (it can't read it itself inside a frame)
  function themeQ() {
    var t = document.documentElement.getAttribute('data-theme');
    if (!t) { try { t = localStorage.getItem('vqTheme'); } catch (e) { } }
    return (t === 'light' || t === 'dark') ? '&theme=' + t : '';
  }
  var panel = null;
  function openPanel() {
    if (mobile) { window.top.location.href = link + themeQ(); return; }   // full screen on phones
    if (!panel) {
      panel = document.createElement('div'); panel.className = 'vqa-panel';
      var f = document.createElement('iframe'); f.src = link + '&embed=1' + themeQ(); f.allow = 'clipboard-write';
      panel.appendChild(f); document.body.appendChild(panel);
      // if the chat cannot load inside the app (browser blocks sign-in in frames), open it in a new tab instead
      var loaded = false; f.onload = function () { loaded = true; };
      setTimeout(function () { if (!loaded) { closePanel(); window.open(link, '_blank'); } }, 12000);
    }
    requestAnimationFrame(function () { panel.classList.add('open'); });
  }
  function closePanel() { if (panel) panel.classList.remove('open'); }
  b.onclick = function () { panel && panel.classList.contains('open') ? closePanel() : openPanel(); };
  window.addEventListener('message', function (e) {
    var d = e.data || {};
    if (d.vqAssistant === 'close') closePanel();
    if (d.vqAssistant === 'full') { closePanel(); window.open(link, '_blank'); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePanel(); });

  function mount() { document.body.appendChild(b); lift(); setTimeout(lift, 1500); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
