const whatsappNumber = "524272777153"; 

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

//150220262313 envio de mensajes por whatsapp
function sendToWhatsapp(text) {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}
function sendGeneralWhatsapp() {
    sendToWhatsapp("Hola Arhez Tech, me interesa saber más.");
}
function selectPlan(plan) {
    sendToWhatsapp(`Hola Arhez Tech, me interesa el plan: *${plan}*.`);
}
function submitForm(event) {
    event.preventDefault();
    const n = document.getElementById('nombre').value;
    const t = document.getElementById('tipo').value;
    const m = document.getElementById('mensaje').value;
    sendToWhatsapp(`Hola, soy ${n}. Me interesa: *${t}*. Mensaje: ${m}`);
}
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}
document.querySelectorAll('.hover-accent').forEach(icon => {
    icon.addEventListener('mouseover', () => icon.style.color = 'var(--accent-green)');
    icon.addEventListener('mouseout', () => icon.style.color = 'white');
});