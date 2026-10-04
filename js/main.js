/* ============================================================
   Arhez Tech — interacción y conversión
   Menú · navbar · reveal · FAQ · preselect · tracking · form WA
   Sin dependencias. Respeta prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.getElementById('site-header');
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav-menu');
  var waFloat = document.getElementById('wa-float');
  var contact = document.getElementById('contacto');
  var form = document.getElementById('contactForm');

  function track(eventName, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }
  }

  /* ---------- Año del copyright ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Redes sociales (config única, sin enlaces inventados) ----------
     Arhez Tech y Pablo Aranda son cuentas de Instagram distintas y ambas deben
     poder mostrarse. Una entrada vacía ("") simplemente no se renderiza: nunca
     se pinta un href="#" ni un ícono roto. Si más adelante se gestiona también
     pabloaranda.com.mx desde este mismo patrón, bastaría con reutilizar este
     objeto allí y cambiar PRIORITY_ORDER.pablo como orden activo. */
  var socialLinks = {
    instagramArhez: 'https://www.instagram.com/arhez.tech',
    instagramPablo: 'https://www.instagram.com/pabloarandahdz',
    facebook: 'https://www.facebook.com/arhez.tech',
    x: 'https://x.com/pabloarandahdz',
    threads: 'https://www.threads.net/@pabloarandahdz',
    github: '', // pendiente: URL de GitHub
    whatsapp: 'https://wa.me/524272777153'
  };
  var socialMeta = {
    facebook: { icon: 'fa-facebook', label: 'Facebook' },
    instagramArhez: { icon: 'fa-instagram', label: 'Instagram — Arhez Tech' },
    instagramPablo: { icon: 'fa-instagram', label: 'Instagram — Pablo Aranda' },
    x: { icon: 'fa-x-twitter', label: 'X' },
    threads: { icon: 'fa-threads', label: 'Threads' },
    github: { icon: 'fa-github', label: 'GitHub' },
    whatsapp: { icon: 'fa-whatsapp', label: 'WhatsApp' }
  };
  var PRIORITY_ORDER = {
    // arhez-tech.com: prioriza la marca; Instagram de Pablo aparece como
    // enlace relacionado con el fundador, sin competir con el de la marca.
    arhez: ['facebook', 'instagramArhez', 'instagramPablo', 'x', 'threads', 'github', 'whatsapp'],
    // pabloaranda.com.mx (referencia, no se renderiza desde este proyecto):
    // prioriza al fundador; Instagram de Arhez aparece como enlace relacionado.
    pablo: ['instagramPablo', 'instagramArhez', 'github', 'facebook', 'x', 'threads', 'whatsapp']
  };
  var socialMount = document.getElementById('footer-social');
  if (socialMount) {
    var site = socialMount.getAttribute('data-site') || 'arhez';
    var order = PRIORITY_ORDER[site] || PRIORITY_ORDER.arhez;
    order.forEach(function (key) {
      var url = socialLinks[key];
      if (!url) return; // sin URL configurada: no se pinta enlace roto ni "#"
      var meta = socialMeta[key];
      var a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = '<i class="fa-brands ' + meta.icon + '" aria-hidden="true"></i><span>' + meta.label + '</span>';
      socialMount.appendChild(a);
    });
  }

  /* ---------- Navegación móvil accesible ---------- */
  function closeMenu() {
    if (!nav || !navToggle) return;
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        navToggle.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  /* ---------- Navbar sólida + WhatsApp flotante ---------- */
  function updateScrollUi() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('header--solid', y > 16);
    var showFloating = y > window.innerHeight * 0.85;
    var contactVisible = false;
    if (contact) {
      var rect = contact.getBoundingClientRect();
      contactVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
    }
    if (waFloat) {
      waFloat.hidden = false;
      waFloat.classList.toggle('visible', showFloating && !contactVisible);
    }
  }
  window.addEventListener('scroll', updateScrollUi, { passive: true });
  window.addEventListener('resize', updateScrollUi);
  updateScrollUi();

  /* ---------- Reveal on scroll ---------- */
  var revealElements = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(function (el) { el.classList.add('visible'); });
  } else if (revealElements.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(function (el) { io.observe(el); });
  }

  /* ---------- FAQ accordion (uno abierto a la vez) ---------- */
  function faqOpen(btn, panel) {
    btn.setAttribute('aria-expanded', 'true');
    panel.dataset.state = 'open';
    panel.hidden = false;
    panel.style.maxHeight = panel.scrollHeight + 'px';
    var done = function (e) {
      if (e.propertyName !== 'max-height') return;
      if (panel.dataset.state === 'open') panel.style.maxHeight = 'none';
      panel.removeEventListener('transitionend', done);
    };
    panel.addEventListener('transitionend', done);
  }
  function faqClose(btn, panel) {
    btn.setAttribute('aria-expanded', 'false');
    panel.dataset.state = 'closed';
    if (panel.hidden) return;
    panel.style.maxHeight = panel.scrollHeight + 'px';
    void panel.offsetHeight;
    panel.style.maxHeight = '0px';
    var done = function (e) {
      if (e.propertyName !== 'max-height') return;
      if (panel.dataset.state === 'closed') panel.hidden = true;
      panel.removeEventListener('transitionend', done);
    };
    panel.addEventListener('transitionend', done);
  }
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var panel = item.querySelector('.faq-panel');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      var willOpen = btn.getAttribute('aria-expanded') !== 'true';
      document.querySelectorAll('.faq-q[aria-expanded="true"]').forEach(function (openBtn) {
        if (openBtn === btn) return;
        var openPanel = document.getElementById(openBtn.getAttribute('aria-controls'));
        if (openPanel) faqClose(openBtn, openPanel);
      });
      if (willOpen) {
        faqOpen(btn, panel);
        track('faq_open', { question: btn.textContent.replace('+', '').trim() });
      } else {
        faqClose(btn, panel);
      }
    });
  });

  /* ---------- Preselección del servicio desde CTAs ---------- */
  document.querySelectorAll('[data-service]').forEach(function (link) {
    link.addEventListener('click', function () {
      var select = document.getElementById('service');
      var value = link.getAttribute('data-service');
      if (!select || !value) return;
      var exists = Array.prototype.some.call(select.options, function (o) { return o.value === value; });
      if (exists) {
        select.value = value;
        track('service_select', { service: value });
      }
    });
  });

  /* ---------- Tracking de tipo de proyecto en el form ---------- */
  var serviceSelect = document.getElementById('service');
  if (serviceSelect) {
    serviceSelect.addEventListener('change', function () {
      if (serviceSelect.value) track('service_select', { service: serviceSelect.value });
    });
  }

  /* ---------- Tracking genérico de CTAs ---------- */
  document.querySelectorAll('[data-track]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (el.type === 'submit') return;
      track('cta_click', { cta: el.getAttribute('data-track'), text: el.textContent.trim().slice(0, 80) });
    });
  });

  /* ---------- Formulario → WhatsApp ---------- */
  if (form) {
    var status = document.getElementById('formSuccess');
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var hp = document.getElementById('website');
      if (hp && hp.value.trim()) return;

      if (!form.checkValidity()) {
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        form.reportValidity();
        if (status) {
          status.hidden = false;
          status.textContent = 'Revisa los campos obligatorios antes de continuar.';
        }
        track('form_error', { reason: 'validation' });
        return;
      }

      var name = document.getElementById('name').value.trim();
      var company = document.getElementById('company').value.trim();
      var email = document.getElementById('email').value.trim();
      var phone = document.getElementById('phone').value.trim();
      var service = document.getElementById('service').value;
      var message = document.getElementById('message').value.trim();

      var lines = [
        'Hola, Arhez Tech.',
        'Quiero solicitar un diagnóstico de mi infraestructura IT.',
        '',
        '*Nombre:* ' + name,
        company ? '*Empresa:* ' + company : null,
        '*Correo:* ' + email,
        phone ? '*Teléfono/WhatsApp:* ' + phone : null,
        '*Servicio de interés:* ' + service,
        '',
        '*Necesidad:* ' + message
      ].filter(Boolean).join('\n');

      if (submitBtn) submitBtn.disabled = true;
      if (status) {
        status.hidden = false;
        status.textContent = '¡Gracias! Te redirigimos a WhatsApp...';
      }
      track('generate_lead', { method: 'whatsapp', service: service, has_phone: Boolean(phone) });
      window.open('https://wa.me/524272777153?text=' + encodeURIComponent(lines), '_blank', 'noopener');
      setTimeout(function () {
        form.reset();
        if (submitBtn) submitBtn.disabled = false;
        if (status) status.hidden = true;
      }, 5000);
    });
  }
})();
