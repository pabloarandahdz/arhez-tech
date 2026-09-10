/* ============================================================
   Arhez Tech — interacciones
   Menú móvil · Navbar · FAQ · Reveal · WhatsApp flotante · Form
   Respeta prefers-reduced-motion. Sin dependencias.
   ============================================================ */
(function() {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Menú móvil accesible ---------- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav-menu');
  if (toggle && nav) {
    var closeMenu = function() {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
      nav.classList.remove('open');
    };
    toggle.addEventListener('click', function() {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        toggle.focus();
      }
    });
    nav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---------- 2. Navbar sólida al hacer scroll + WA flotante ---------- */
  var header = document.getElementById('site-header');
  var waFloat = document.getElementById('wa-float');
  var onScroll = function() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (header) header.classList.toggle('header--solid', y > 24);
    if (waFloat) {
      var show = y > window.innerHeight * 0.9;
      waFloat.hidden = false;
      waFloat.classList.toggle('visible', show);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. FAQ accordion accesible ---------- */
  document.querySelectorAll('.faq-item').forEach(function(item) {
    var btn = item.querySelector('.faq-q');
    var panel = item.querySelector('.faq-a');
    if (!btn || !panel) return;
    btn.addEventListener('click', function() {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        panel.style.maxHeight = '0px';
        panel.setAttribute('hidden', '');
      } else {
        panel.removeAttribute('hidden');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- 4. Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function(el) { el.classList.add('visible'); });
  } else if (revealEls.length) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function(el) { io.observe(el); });
  }

  /* ---------- 5. Formulario → WhatsApp ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var service = document.getElementById('service').value;
      var budget = document.getElementById('budget').value.trim();
      var message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      // Honeypot anti-spam
      var hp = document.getElementById('website');
      if (hp && hp.value) return;

      var lines = [
        'Hola, Arhez Tech.',
        'Quiero cotizar un proyecto web.',
        '',
        '*Nombre:* ' + name,
        '*Correo:* ' + email,
        '*Tipo de proyecto:* ' + service,
        budget ? '*Presupuesto:* ' + budget : null,
        '',
        '*Proyecto:* ' + message
      ].filter(Boolean).join('\n');

      var url = 'https://wa.me/524272777153?text=' + encodeURIComponent(lines);
      var success = document.getElementById('formSuccess');
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      if (success) {
        success.hidden = false;
        success.textContent = '¡Gracias! Te redirigimos a WhatsApp...';
      }
      window.open(url, '_blank', 'noopener');
      setTimeout(function() {
        form.reset();
        if (submitBtn) submitBtn.disabled = false;
        if (success) success.hidden = true;
      }, 5000);
    });
  }
})();
