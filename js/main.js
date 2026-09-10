/* ============================================================
   Arhez Tech — interacción y conversión
   Menú · FAQ · reveal · CTA · formulario WhatsApp · analytics
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.getElementById('site-header');
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav-menu');
  var waFloat = document.getElementById('wa-float');
  var mobileCta = document.getElementById('mobile-cta');
  var contact = document.getElementById('contacto');
  var form = document.getElementById('contactForm');

  function track(eventName, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }
  }

  /* ---------- Navegación móvil ---------- */
  function closeMenu() {
    if (!nav || !navToggle) return;
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
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
      if (window.innerWidth > 800) closeMenu();
    });
  }

  /* ---------- Header y CTAs flotantes ---------- */
  function updateScrollUi() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 16);

    var showFloating = y > window.innerHeight * 0.72;
    var contactVisible = false;

    if (contact) {
      var rect = contact.getBoundingClientRect();
      contactVisible = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
    }

    if (waFloat) {
      waFloat.hidden = false;
      waFloat.classList.toggle('visible', showFloating && !contactVisible);
    }

    if (mobileCta) {
      mobileCta.hidden = false;
      mobileCta.classList.toggle('visible', window.innerWidth <= 800 && showFloating && !contactVisible);
    }
  }

  window.addEventListener('scroll', updateScrollUi, { passive: true });
  window.addEventListener('resize', updateScrollUi);
  updateScrollUi();

  /* ---------- Reveal ---------- */
  var revealElements = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach(function (element) { element.classList.add('visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

    revealElements.forEach(function (element) { revealObserver.observe(element); });
  }

  /* ---------- FAQ ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var button = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');
    if (!button || !answer) return;

    button.addEventListener('click', function () {
      var willOpen = button.getAttribute('aria-expanded') !== 'true';

      document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(function (openButton) {
        if (openButton === button) return;
        openButton.setAttribute('aria-expanded', 'false');
        var openAnswer = document.getElementById(openButton.getAttribute('aria-controls'));
        if (openAnswer) openAnswer.hidden = true;
      });

      button.setAttribute('aria-expanded', String(willOpen));
      answer.hidden = !willOpen;
      if (willOpen) track('faq_open', { question: button.textContent.replace('+', '').trim() });
    });
  });

  /* ---------- Preselección del servicio desde CTA ---------- */
  document.querySelectorAll('[data-service]').forEach(function (link) {
    link.addEventListener('click', function () {
      var select = document.getElementById('service');
      var value = link.getAttribute('data-service');
      if (!select || !value) return;

      var optionExists = Array.prototype.some.call(select.options, function (option) {
        return option.value === value;
      });
      if (optionExists) select.value = value;
    });
  });

  /* ---------- Tracking de CTA ---------- */
  document.querySelectorAll('[data-track]').forEach(function (element) {
    element.addEventListener('click', function () {
      if (element.type === 'submit') return;
      track('cta_click', {
        cta: element.getAttribute('data-track'),
        text: element.textContent.trim()
      });
    });
  });

  /* ---------- Formulario -> WhatsApp ---------- */
  if (form) {
    var status = document.getElementById('formStatus');
    var submitButton = form.querySelector('button[type="submit"]');
    var fields = form.querySelectorAll('input:not(#website), select, textarea');

    fields.forEach(function (field) {
      field.addEventListener('input', function () { field.classList.remove('field-invalid'); });
      field.addEventListener('change', function () { field.classList.remove('field-invalid'); });
    });

    form.addEventListener('focusin', function () {
      if (!form.dataset.started) {
        form.dataset.started = 'true';
        track('form_start');
      }
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var honeypot = document.getElementById('website');
      if (honeypot && honeypot.value.trim()) return;

      if (!form.checkValidity()) {
        var invalidFields = form.querySelectorAll(':invalid');
        invalidFields.forEach(function (field) { field.classList.add('field-invalid'); });
        if (invalidFields[0]) invalidFields[0].focus();
        form.reportValidity();
        if (status) {
          status.hidden = false;
          status.className = 'form-status is-error';
          status.textContent = 'Revisa los campos obligatorios antes de continuar.';
        }
        track('form_error', { reason: 'validation' });
        return;
      }

      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var service = document.getElementById('service').value;
      var budget = document.getElementById('budget').value.trim();
      var message = document.getElementById('message').value.trim();

      var lines = [
        'Hola, Arhez Tech.',
        'Quiero cotizar un proyecto web.',
        '',
        '*Nombre:* ' + name,
        '*Correo:* ' + email,
        '*Tipo de proyecto:* ' + service,
        budget ? '*Presupuesto aproximado:* ' + budget : null,
        '',
        '*Objetivo / necesidad:*',
        message
      ].filter(Boolean).join('\n');

      var whatsappUrl = 'https://wa.me/524272777153?text=' + encodeURIComponent(lines);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute('aria-disabled', 'true');
      }

      if (status) {
        status.hidden = false;
        status.className = 'form-status is-success';
        status.textContent = 'Listo. Abriremos WhatsApp con tu información preparada.';
      }

      track('generate_lead', {
        method: 'whatsapp',
        service: service,
        has_budget: Boolean(budget)
      });

      var popup = window.open('', '_blank');
      if (popup) {
        popup.opener = null;
        popup.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }

      window.setTimeout(function () {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.removeAttribute('aria-disabled');
        }
      }, 1200);
    });
  }
})();
