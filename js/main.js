function enviarWhatsApp() {
    // 200120262012 extraemos los datos de los campos del formulario de contacto
    const nombre = document.getElementById('nombreCompleto').value;
    const correo = document.getElementById('correoEmpresa').value;
    const proyecto = document.getElementById('tipoProyecto').value;
    const detalles = document.getElementById('detalles').value;

    // 200120262013 creamos la estructura del mensaje
    const textoMensaje = `¡Hola ARHEZ TECH! 👋\n` +
                         `Solicito una cotización de proyecto:\n\n` +
                         `👤 Nombre: ${nombre}\n` +
                         `📧 Correo: ${correo}\n` +
                         `📦 Proyecto: ${proyecto}\n` +
                         `📝 Detalles: ${detalles}`;

    // 200120262013 codificamos el mensaje para la URL
    const mensajeCodificado = encodeURIComponent(textoMensaje);
    
    // 200120262013 número de teléfono de whatsapp al que se enviarán los mensajes
    const telefono = "524272777153";

    // 200120262013 creamos el enlace por el cual se abrirá la plataforma de whatsapp y cargará el mensaje codificado
    const urlWhatsapp = `https://api.whatsapp.com/send?phone=${telefono}&text=${mensajeCodificado}`;
    
    window.open(urlWhatsapp, '_blank');
}