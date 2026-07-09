/* ============================================================
   main.js - Arhez Tech
   Logica de navegacion, menu movil y formulario de contacto
   ============================================================ */

// 1. Navegación - comportamiento de scroll (opacidad y bordes)
(function() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// 2. Menú móvil - Toggle y transformación animada de hamburguesa
(function() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    toggle.classList.toggle('open');
  });

  // Cerrar menú al dar click en un enlace interno
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('open');
    });
  });
})();

// 3. Formulario de contacto - Envío estructurado de leads vía WhatsApp
(function() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const service = document.getElementById('contactService').value;
    const msg     = document.getElementById('contactMsg').value.trim();

    // Formatear mensaje profesional en español
    const text = encodeURIComponent(
      `*NUEVO LEAD - ARHEZ TECH*\n\n` +
      `*Nombre:* ${name}\n` +
      `*Email:* ${email}\n` +
      `*Interés:* ${service}\n\n` +
      `*Mensaje:* ${msg}`
    );

    // Abrir WhatsApp con el número +524272777153
    window.open(`https://wa.me/524272777153?text=${text}`, '_blank');

    // Mostrar confirmación visual temporal
    if (submitBtn) submitBtn.disabled = true;
    if (success) success.classList.add('visible');

    setTimeout(() => {
      form.reset();
      if (submitBtn) submitBtn.disabled = false;
      if (success) success.classList.remove('visible');
    }, 5000);
  });
})();

// 4. Formulario del Hero - Envío rápido vía WhatsApp
(function() {
  const form = document.getElementById('heroForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name    = document.getElementById('heroName').value.trim();
    const email   = document.getElementById('heroEmail').value.trim();
    const service = document.getElementById('heroService').value;
    const msg     = document.getElementById('heroMsg').value.trim();

    const text = encodeURIComponent(
      `*COTIZACIÓN RÁPIDA - ARHEZ TECH*\n\n` +
      `*Nombre:* ${name}\n` +
      `*Email:* ${email}\n` +
      `*Interés:* ${service}\n\n` +
      `*Mensaje:* ${msg}`
    );

    window.open(`https://wa.me/524272777153?text=${text}`, '_blank');
    form.reset();
  });
})();

// 5. Contador animado para stats
(function() {
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    let current = 0;
    const increment = Math.ceil(target / 60);
    const update = () => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        return;
      }
      el.textContent = current;
      requestAnimationFrame(update);
    };
    update();
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const els = entry.target.querySelectorAll('.stat-counter');
        els.forEach(el => animateCounter(el));
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.about__stats');
  if (statsSection) counterObserver.observe(statsSection);
})();
