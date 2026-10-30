/* Watch-along achievements for the 3-min "Get Paid for Running Ads" VSL.
   Small toasts at set points in the video to keep people watching (Yousif 10/30).
   Timings match the transcript of /overview/get-paid-running-ads.mp4.
   Usage: KenjiAchievements.attach(videoEl, { optionsSelector: '#offer', page: 'vsl2-watch' }) */
(function () {
  var STEPS = [
    { at: 60, icon: '🏅', title: '1 minute in', body: 'Next up: what a $7 buyer actually costs you on Meta.' },
    { at: 102, icon: '💡', title: 'You found the math', body: 'You pay Meta about $6, the buyer pays you $7. The leads pay for themselves.' },
    { at: 114, icon: '🔓', title: 'Your options are unlocked', body: 'Both ways to work with us are open below. Keep going, a real client review is next.' },
    { at: 168, icon: '🏆', title: 'You finished the training', body: 'Now pick the option that fits you.', cta: 'See my options', sticky: true }
  ];

  var css = '' +
    '.ka-toast{position:fixed;left:50%;bottom:20px;transform:translate(-50%,24px);opacity:0;z-index:2147483000;' +
    'width:calc(100% - 32px);max-width:380px;box-sizing:border-box;display:flex;gap:12px;align-items:flex-start;' +
    'padding:14px 16px;border-radius:14px;background:rgba(17,24,39,.97);border:1px solid rgba(245,158,11,.45);' +
    'box-shadow:0 18px 40px -12px rgba(0,0,0,.7);color:#f9fafb;font-family:inherit;transition:transform .35s ease,opacity .35s ease}' +
    '.ka-toast.ka-in{transform:translate(-50%,0);opacity:1}' +
    '.ka-icon{font-size:26px;line-height:1}' +
    '.ka-kicker{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#fbbf24;font-weight:700;margin-bottom:2px}' +
    '.ka-title{font-size:15px;font-weight:700;margin-bottom:2px}' +
    '.ka-body{font-size:13px;line-height:1.4;color:#d1d5db}' +
    '.ka-cta{margin-top:10px;display:inline-block;padding:8px 14px;border-radius:999px;border:0;cursor:pointer;' +
    'background:#f59e0b;color:#111827;font-weight:700;font-size:13px}' +
    '.ka-x{margin-left:auto;background:none;border:0;color:#9ca3af;font-size:18px;line-height:1;cursor:pointer;padding:0 0 0 6px}' +
    '@media (prefers-reduced-motion:reduce){.ka-toast{transition:none}}';

  function track(page, step) {
    try { if (window.fbq) window.fbq('trackCustom', 'VSLAchievement', { step: step, page_path: location.pathname }); } catch (e) {}
    try { if (window.dataLayer) window.dataLayer.push({ event: 'vsl_achievement', step: step, page: page }); } catch (e) {}
  }

  function show(step, n, opts) {
    var old = document.querySelector('.ka-toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.className = 'ka-toast';
    t.setAttribute('role', 'status');
    t.innerHTML = '<div class="ka-icon"></div><div><div class="ka-kicker"></div><div class="ka-title"></div>' +
      '<div class="ka-body"></div></div><button class="ka-x" aria-label="Close">×</button>';
    t.querySelector('.ka-icon').textContent = step.icon;
    t.querySelector('.ka-kicker').textContent = 'Achievement ' + n + ' of ' + STEPS.length;
    t.querySelector('.ka-title').textContent = step.title;
    t.querySelector('.ka-body').textContent = step.body;
    if (step.cta) {
      var b = document.createElement('button');
      b.className = 'ka-cta';
      b.textContent = step.cta;
      b.onclick = function () {
        var target = document.querySelector(opts.optionsSelector);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        close();
      };
      t.querySelector('.ka-body').parentNode.appendChild(b);
    }
    function close() { t.classList.remove('ka-in'); setTimeout(function () { t.remove(); }, 400); }
    t.querySelector('.ka-x').onclick = close;
    (document.fullscreenElement || document.body).appendChild(t);
    requestAnimationFrame(function () { requestAnimationFrame(function () { t.classList.add('ka-in'); }); });
    if (!step.sticky) setTimeout(close, 7000);
  }

  function attach(video, opts) {
    if (!video || video.__ka) return;
    video.__ka = true;
    opts = opts || {};
    if (!document.getElementById('ka-style')) {
      var s = document.createElement('style');
      s.id = 'ka-style';
      s.textContent = css;
      document.head.appendChild(s);
    }
    var key = 'ka:' + (opts.page || location.pathname);
    var done = {};
    try { done = JSON.parse(sessionStorage.getItem(key) || '{}'); } catch (e) {}
    function check() {
      for (var i = 0; i < STEPS.length; i++) {
        var st = STEPS[i];
        if (!done[st.at] && video.currentTime >= st.at && video.currentTime < st.at + 8) {
          done[st.at] = 1;
          try { sessionStorage.setItem(key, JSON.stringify(done)); } catch (e) {}
          show(st, i + 1, opts);
          track(opts.page, i + 1);
          break;
        }
      }
    }
    video.addEventListener('timeupdate', check);
    video.addEventListener('ended', function () {
      var last = STEPS[STEPS.length - 1];
      if (!done[last.at]) { done[last.at] = 1; show(last, STEPS.length, opts); track(opts.page, STEPS.length); }
    });
  }

  window.KenjiAchievements = { attach: attach };
})();
