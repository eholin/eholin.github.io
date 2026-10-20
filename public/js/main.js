/* ============================================================
   Персональный сайт «Евгений Холин — разработка с AI-агентами».
   Vanilla JS, без зависимостей.
   - Плавный скролл по якорным ссылкам a[data-scroll] (хедер)
   - Scroll-reveal секций (IntersectionObserver)
   - Sticky-хедер появляется после прокрутки за hero
   - Всё отключается при prefers-reduced-motion: reduce
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Плавный скролл по a[data-scroll] ----------
     CSS уже даёт scroll-behavior:smooth; JS нужен, чтобы
     корректно обработать клик и учесть reduce-motion. */
  document.querySelectorAll('a[data-scroll]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (!targetId || targetId.charAt(0) !== '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });

  /* ---------- Scroll-reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    // Показываем контент сразу.
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Sticky-хедер после hero ---------- */
  var header = document.getElementById('site-header');
  var hero = document.getElementById('hero');

  if (header && hero) {
    if ('IntersectionObserver' in window) {
      // Показываем хедер, когда hero ушёл из вьюпорта.
      var heroObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          header.classList.toggle('is-visible', !entry.isIntersecting);
        });
      }, { threshold: 0, rootMargin: '-80px 0px 0px 0px' });
      heroObserver.observe(hero);
    } else {
      // Fallback: слушаем скролл.
      var onScroll = function () {
        var past = window.pageYOffset > hero.offsetHeight - 80;
        header.classList.toggle('is-visible', past);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }
})();
