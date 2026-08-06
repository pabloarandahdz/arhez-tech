/* ============================================================
   main.js - Arhez Tech
   Logica del formulario de cotizacion via WhatsApp
   ============================================================ */

// 1. Formulario de cotización - Envío estructurado de leads vía WhatsApp
(function() {
  const form    = document.getElementById('ctaForm');
  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name    = document.getElementById('ctaName').value.trim();
    const email   = document.getElementById('ctaEmail').value.trim();
    const service = document.getElementById('ctaService').value;
    const msg     = document.getElementById('ctaMsg').value.trim();

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
