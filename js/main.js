/* ============================================================
   2804261500: main.js - Arhez Tech
   Logica minima: nav scroll, menu movil, formulario de contacto
   ============================================================ */

// 2804261500: Navbar - scroll behaviour
(function() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// 2804261500: Menu movil - toggle
(function() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  // Cerrar al hacer click en un enlace
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
})();

// 2804261500: Formulario de contacto - envio via WhatsApp
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

    const text = encodeURIComponent(
      `Hola, soy ${name} (${email}).\n` +
      `Servicio de interes: ${service}.\n` +
      `Mensaje: ${msg}`
    );

    // Abrir WhatsApp con el mensaje pre-llenado
    window.open(`https://wa.me/524272777153?text=${text}`, '_blank');

    // Mostrar mensaje de exito
    if (submitBtn) submitBtn.disabled = true;
    if (success) success.classList.add('visible');

    setTimeout(() => {
      form.reset();
      if (submitBtn) submitBtn.disabled = false;
      if (success) success.classList.remove('visible');
    }, 5000);
  });
})();
