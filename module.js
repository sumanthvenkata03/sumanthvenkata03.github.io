var app = angular.module("app", []);

app.controller("homeController", function($scope, $timeout) {
  var vm = this;
  $scope.vm = vm; // expose as vm in template
  vm.tab = 1;

  // persist last tab while browsing within the session (nice UX)
  vm.setTab = function(n) {
    vm.tab = n;
    try { sessionStorage.setItem('sv_active_tab', String(n)); } catch(e) {}
  };

  // restore if available
  $timeout(function(){
    try {
      var saved = parseInt(sessionStorage.getItem('sv_active_tab'), 10);
      if (!isNaN(saved)) vm.tab = saved;
      $scope.$applyAsync();
    } catch(e) {}
  }, 0);

  // On every tab switch, jump back to the TOP of the page (instant).
  // Reset window + every scroll-container candidate to cover all engines,
  // in a 0ms $timeout so it fires after the digest swaps the visible section.
  function scrollTop() {
    window.scrollTo(0, 0);
    if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
  $scope.$watch(function () { return vm.tab; }, function (nv, ov) {
    if (nv === ov) return;
    $timeout(scrollTop, 0);
  });
});

// Mobile nav: collapse the menu after tapping any nav link (Bootstrap 3 'in' class)
document.addEventListener('DOMContentLoaded', function () {
  var links = document.querySelectorAll('#main-nav .navbar-nav a');
  links.forEach(function (a) {
    a.addEventListener('click', function () {
      var nav = document.getElementById('main-nav');
      if (nav && nav.classList.contains('in')) nav.classList.remove('in');
    });
  });
});

/* =========================================================================
   Premium animation system (dependency-free)
   - Scroll-reveal via IntersectionObserver
   - Count-up stats, scroll progress bar
   - No-JS safe (html.js gates hidden states) + reduced-motion aware
   ========================================================================= */
(function () {
  var docEl = document.documentElement;
  docEl.classList.add('js'); // also set early inline in <head> to avoid flash

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  // stagger index inside each reveal group
  document.querySelectorAll('[data-reveal-group]').forEach(function (g) {
    g.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(function (el, i) { el.style.setProperty('--rev-i', i); });
  });

  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (reduce || !hasIO) {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Replay reveals when a tab is opened (sections are display:none until active)
  document.addEventListener('click', function (ev) {
    var link = ev.target.closest && ev.target.closest('#main-nav a, a[ng-click]');
    if (!link) return;
    setTimeout(function () {
      document.querySelectorAll('.section').forEach(function (sec) {
        if (sec.offsetParent !== null) { // visible section only
          sec.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function (el) {
            el.classList.remove('in-view'); void el.offsetWidth; el.classList.add('in-view');
          });
        }
      });
    }, 60);
  }, true);

  // Count-up
  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-target')) || 0;
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    var dur = 1200, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (target * eased).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step); else el.textContent = pre + target.toFixed(dec) + suf;
    }
    requestAnimationFrame(step);
  }
  var counts = document.querySelectorAll('.count');
  if (counts.length) {
    if (reduce || !hasIO) {
      counts.forEach(function (el) {
        el.textContent = (el.getAttribute('data-prefix') || '') +
          (parseFloat(el.getAttribute('data-target')) || 0).toFixed(parseInt(el.getAttribute('data-decimals') || '0', 10)) +
          (el.getAttribute('data-suffix') || '');
      });
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); } });
      }, { threshold: 0.6 });
      counts.forEach(function (el) {
        // reset from the no-JS pre-filled value so the reveal starts at 0
        var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
        el.textContent = (el.getAttribute('data-prefix') || '') + (0).toFixed(dec) + (el.getAttribute('data-suffix') || '');
        cio.observe(el);
      });
    }
  }

  // Scroll progress bar.
  // NOTE: this site's `html { overflow-x:hidden; height:100% }` makes <body>
  // the scroll container (not the window), so we read scroll position from a
  // robust fallback chain and listen in the CAPTURE phase (scroll doesn't
  // bubble, but capture still reaches a non-bubbling event on a descendant).
  if (!reduce) {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    var ticking = false;
    function update() {
      var sc = window.pageYOffset || docEl.scrollTop || document.body.scrollTop || 0;
      var sh = Math.max(document.body.scrollHeight, docEl.scrollHeight);
      var ch = window.innerHeight || docEl.clientHeight;
      var max = sh - ch;
      bar.style.transform = 'scaleX(' + (max > 0 ? sc / max : 0) + ')';
      ticking = false;
    }
    function onScroll() { if (!ticking) { requestAnimationFrame(update); ticking = true; } }
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }
})();

/* Cursor-following 3D tilt on cards — desktop pointer only, never on touch
   or with reduced motion. Layers on top of the CSS hover lift + teal glow. */
(function () {
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduce) return;
  document.querySelectorAll('.project-card, .skill-cat').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'translateY(-6px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 6) + 'deg)';
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });
})();
