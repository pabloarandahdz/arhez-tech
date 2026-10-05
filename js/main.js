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
  var BRAND_ICONS = {
    facebook: '<path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>',
    instagram: '<path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>',
    x: '<path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/>',
    threads: '<path d="M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z"/>',
    github: '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
    whatsapp: '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>'
  };
  var socialMeta = {
    facebook: { icon: 'facebook', label: 'Facebook' },
    instagramArhez: { icon: 'instagram', label: 'Instagram — Arhez Tech' },
    instagramPablo: { icon: 'instagram', label: 'Instagram — Pablo Aranda' },
    x: { icon: 'x', label: 'X' },
    threads: { icon: 'threads', label: 'Threads' },
    github: { icon: 'github', label: 'GitHub' },
    whatsapp: { icon: 'whatsapp', label: 'WhatsApp' }
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
      a.innerHTML = '<svg class="icon-brand" viewBox="0 0 24 24" aria-hidden="true">' + BRAND_ICONS[meta.icon] + '</svg><span>' + meta.label + '</span>';
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
