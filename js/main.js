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

//150220262110 cuadro estadistico de seccion de impacto
const ctxClean = document.getElementById('impactChartClean').getContext('2d');
const gradientClean = ctxClean.createLinearGradient(0, 0, 0, 300);
gradientClean.addColorStop(0, 'rgba(6, 7, 27, 0.1)'); 
gradientClean.addColorStop(1, 'rgba(6, 7, 27, 0)');

new Chart(ctxClean, {
    type: 'line',
    data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
        datasets: [
            {
                label: 'Crecimiento Digital',
                data: [5, 10, 15, 30, 48],
                borderColor: '#06071b',
                backgroundColor: gradientClean,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#8dee12',
                pointBorderColor: '#06071b',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            },
            {
                label: 'Negocio Tradicional',
                data: [1, 3, 5, 10, 15],
                borderColor: '#cbd5e1',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0.1,
                fill: false,
                pointRadius: 0
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                align: 'start',
                labels: { 
                    font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
                    color: '#4b5563',
                    usePointStyle: true,
                    boxWidth: 8
                }
            },
            tooltip: {
                backgroundColor: '#06071b',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#8dee12',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': ' + context.parsed.y + '%';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#f3f4f6' },
                ticks: { display: false }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af', font: { size: 11 } }
            }
        }
    }
});