// Arhez Tech — hero minimal + cotizador
document.documentElement.classList.remove('no-js');

const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !service) {
      const firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // honeypot
    const hp = document.getElementById('website');
    if (hp && hp.value) return;

    const lines = [
      `Hola Arhez Tech, quiero cotizar: *${service}*`,
      ``,
      `*Nombre:* ${name}`,
      `*Email:* ${email}`,
      message ? `*Detalle:* ${message}` : null
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/524272777153?text=${encodeURIComponent(lines)}`;
    const success = document.getElementById('formSuccess');
    if (success) {
      success.hidden = false;
      success.textContent = '¡Gracias! Te redirigimos a WhatsApp...';
    }
    window.open(url, '_blank', 'noopener');
    setTimeout(() => { if (success) success.hidden = true; }, 4000);
  });
}
