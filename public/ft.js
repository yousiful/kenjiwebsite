// Site-wide drop-off tracker for kenjiai.com (loaded from index.html).
// Per page: page_view, scroll_25/50/75/100, time_10s..300s, sections tagged
// data-track-section, and clicks on checkout/booking links (cta_click).
// Each SPA route counts as its own visit. The version is the hashed Vite
// bundle name, so every deploy shows up as a new version in the dashboard.
(function () {
  var ENDPOINT = '/.netlify/functions/funnel-track';
  if (/^\/funnel-stats/.test(location.pathname)) return;
  var bundle = document.querySelector('script[type="module"][src*="/assets/"]');
  var version = bundle ? (bundle.getAttribute('src').match(/index-([\w-]+)\.js/) || [])[1] || 'unknown' : 'unknown';
  var params = new URLSearchParams(location.search);
  var sid, sent, timers = [], io;

  function send(step, extra) {
    if (sent[step]) return;
    sent[step] = 1;
    var body = { funnel: 'kenjiai', sid: sid, step: step, page: location.pathname.slice(0, 60), version: version,
      utm_source: params.get('utm_source') || '', utm_campaign: params.get('utm_campaign') || '', utm_content: params.get('utm_content') || '',
      device: innerWidth < 768 ? 'mobile' : 'desktop' };
    for (var k in extra || {}) body[k] = extra[k];
    var s = JSON.stringify(body);
    try { if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, s)) return; } catch (e) { /* fall through */ }
    fetch(ENDPOINT, { method: 'POST', body: s, keepalive: true }).catch(function () {});
  }

  function onScroll() {
    var seen = ((scrollY + innerHeight) / document.documentElement.scrollHeight) * 100;
    [25, 50, 75, 100].forEach(function (m) { if (seen >= m - 1) send('scroll_' + m); });
  }

  function startPage() {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sent = {};
    timers.forEach(clearInterval); timers = [];
    if (io) io.disconnect();
    send('page_view');
    var secs = 0;
    timers.push(setInterval(function () {
      if (document.visibilityState !== 'visible') return;
      secs++;
      if ([10, 30, 60, 120, 300].indexOf(secs) >= 0) send('time_' + secs + 's');
    }, 1000));
    // Let the SPA render before measuring height and sections.
    setTimeout(function () {
      onScroll();
      if ('IntersectionObserver' in window) {
        io = new IntersectionObserver(function (es) {
          es.forEach(function (e) { if (e.isIntersecting) { send('section_' + e.target.getAttribute('data-track-section')); io.unobserve(e.target); } });
        }, { threshold: 0.4 });
        document.querySelectorAll('[data-track-section]').forEach(function (el) { io.observe(el); });
      }
    }, 800);
  }

  // Lets page code (e.g. the pricing VSL) report its own steps into the same visit.
  window.__ft = { send: function (step) { if (sid) send(step); } };

  addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href], [data-track-cta]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var tag = a.getAttribute('data-track-cta');
    if (tag || /freedom\.kenjiai\.com|calendly|\/book|\/partner-apply|checkout|startnow|finishhere/i.test(href)) {
      send('cta_click', { source: (tag || 'checkout-link').toLowerCase().replace(/[^a-z-]/g, '').slice(0, 30) || 'link' });
    }
  }, true);

  // SPA navigation: each route is its own visit.
  var last = location.pathname;
  function routeChanged() { if (location.pathname !== last) { last = location.pathname; startPage(); } }
  ['pushState', 'replaceState'].forEach(function (m) {
    var orig = history[m];
    history[m] = function () { var r = orig.apply(this, arguments); setTimeout(routeChanged, 0); return r; };
  });
  addEventListener('popstate', routeChanged);
  startPage();
})();
