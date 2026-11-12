/* ==========================================================================
   skjsl.js ADDITION — skReveal (append to the end of assets/skjsl.js)
   Scroll reveal shared by the e-* sections. Add data-sk-reveal to the
   element that should fade up; the section background stays static.
   - Skipped in the Theme Editor (Shopify.designMode) and under
     prefers-reduced-motion, so content is never hidden while editing.
   - Re-runs for a section when the editor reloads it.
   ========================================================================== */
(function () {
  'use strict';
  if (window.skReveal) return; /* never define twice */

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var observer = null;

  function revealNow(el) {
    el.classList.add('is-visible');
  }

  function getObserver() {
    if (observer || !('IntersectionObserver' in window)) return observer;
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealNow(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    return observer;
  }

  function skReveal(root) {
    var scope = root || document;
    var els = scope.querySelectorAll('[data-sk-reveal]:not([data-sk-reveal-init])');
    var designMode = window.Shopify && window.Shopify.designMode;
    var obs = (reduced || designMode) ? null : getObserver();

    Array.prototype.forEach.call(els, function (el) {
      el.setAttribute('data-sk-reveal-init', '');
      if (!obs) return; /* no animation: leave content visible */
      el.classList.add('sk-reveal-pending');
      /* let the hidden state paint first so in-view content still animates */
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { obs.observe(el); });
      });
    });

    /* Safety net: if the observer never fires (some embedded frames),
       reveal anything already on screen after a short delay. */
    if (obs) {
      setTimeout(function () {
        Array.prototype.forEach.call(els, function (el) {
          if (el.classList.contains('is-visible')) return;
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) revealNow(el);
        });
      }, 1500);
    }
  }

  window.skReveal = skReveal;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { skReveal(); });
  } else {
    skReveal();
  }
  document.addEventListener('shopify:section:load', function (e) { skReveal(e.target); });
})();
