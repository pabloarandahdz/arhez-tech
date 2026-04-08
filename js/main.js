const whatsappNumber = "524272777153"; 

//150220262110 cuadro estadistico de seccion de impacto
const canvasImpact = document.getElementById('impactChartClean');
if (canvasImpact) {
    const ctxClean = canvasImpact.getContext('2d');
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
}

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
    const n = document.getElementById('contactName').value;
    const t = document.getElementById('contactSolution').value;
    const m = document.getElementById('contactMessage').value;
    sendToWhatsapp(`Hola, soy ${n}. Me interesa: *${t}*. Mensaje: ${m}`);
}
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}
document.querySelectorAll('.hover-accent').forEach(icon => {
    icon.addEventListener('mouseover', () => icon.style.color = 'var(--accent-green)');
    icon.addEventListener('mouseout', () => icon.style.color = 'white');
});

//040420261600 logica de demos multi-opcion
const demoData = {
    comercial: {
        icon: 'fa-store',
        options: [
            { type: 'Landing Page', title: 'Landing Page Comercial', desc: 'Campañas de captación B2C. Generación de ventas y distribución rápida de catálogos.', url: 'demos/comercial/landing.html' },
            { type: 'SaaS Ultra', title: 'SaaS Punto de Venta', desc: 'Plataforma integral comercial. Gestión de inventarios, CRM comercial y facturación automatizada.', url: 'demos/saas-ultra.html?industry=comercial' },
            { type: 'Sitio Corporativo', title: 'Sitio Corporativo B2B/B2C', desc: 'Presencia empresarial líder. Catálogos digitales de miles de productos y cultura corporativa.', url: 'demos/comercial/corporativo.html' }
        ]
    },
    salud: {
        icon: 'fa-heartbeat',
        options: [
            { type: 'Landing Page', title: 'Landing Page Médica', desc: 'Diseño optimizado para captación rápida de pacientes y agendamiento 100% enfocado vía WhatsApp.', url: 'demos/salud/landing.html' },
            { type: 'SaaS Ultra', title: 'SaaS Expediente Clínico', desc: 'Plataforma hiper-segura de salud. Expedientes electrónicos, sistema avanzado de citas en la nube.', url: 'demos/saas-ultra.html?industry=salud' },
            { type: 'Sitio Corporativo', title: 'Sitio Corporativo Salud', desc: 'Presencia web jerárquica para clínicas. Directorio corporativo de especialistas y hospital.', url: 'demos/salud/corporativo.html' }
        ]
    },
    bienesRaices: {
        icon: 'fa-hard-hat',
        options: [
            { type: 'Landing Page', title: 'Landing Inmobiliaria', desc: 'Captura prospectos para tus preventas o residenciales. Galerías hermosas enfocadas a mostrar valor.', url: 'demos/construccion/landing.html' },
            { type: 'SaaS Ultra', title: 'SaaS Gestión de Obras', desc: 'Software interno. Control financiero de obras, métricas en vivo y portal inmobiliario.', url: 'demos/saas-ultra.html?industry=construccion' },
            { type: 'Sitio Corporativo', title: 'Sitio Constructora o Inmuebles', desc: 'Muestra a gran escala todos tus desarrollos y avances de obra con excelente reputación.', url: 'demos/construccion/corporativo.html' }
        ]
    },
    otro: {
        icon: 'fa-industry',
        options: [
            { type: 'Landing Page', title: 'Manufactura Inteligente', desc: 'Optimización industrial 4.0. Células robóticas, monitoreo predictivo y líneas automatizadas.', url: 'demos/manufactura/landing.html' },
            { type: 'SaaS Ultra', title: 'ERP Industrial a Medida', desc: 'Control total de la cadena de suministro, gestión de fallos en planta y analítica de producción.', url: 'demos/saas-ultra.html?industry=manufactura' },
            { type: 'Sitio Corporativo', title: 'Corporativo Industrial', desc: 'Presencia global para grandes plantas. Portafolio de maquinaria, certificaciones ISO e historia.', url: 'demos/manufactura/corporativo.html' }
        ]
    },
    deportes: {
        icon: 'fa-dumbbell',
        options: [
            { type: 'Landing Page', title: 'Landing Promociones Fit', desc: 'Flujo enfocado en cobrar y suscribir nuevos usuarios a retos funcionales e inscripciones de gimnasio.', url: 'demos/gimnasio/landing.html' },
            { type: 'SaaS Ultra', title: 'SaaS Deportivo a Medida', desc: 'Acceso corporativo vía celular para socios, bloqueo de morosos, reservas de canchas y control mensual.', url: 'demos/saas-ultra.html?industry=gimnasio' },
            { type: 'Sitio Corporativo', title: 'Sitio Instalaciones y Coaches', desc: 'Fotografías amplias de instalaciones, especialidades y staff de coaching para generar reputación.', url: 'demos/gimnasio/corporativo.html' }
        ]
    },
    alimentosBebidas: {
        icon: 'fa-utensils',
        options: [
            { type: 'Landing Page', title: 'Landing Menu Digital', desc: 'Promoción dinámica que muestra el menú e invita agresivamente a realizar reservas y pedidos telefónicos.', url: 'demos/alimentos/landing.html' },
            { type: 'SaaS Ultra', title: 'SaaS Restaurantero POS', desc: 'Centro de control integral. Comandas ligadas a la cocina, control de stock e historial de platillos.', url: 'demos/saas-ultra.html?industry=alimentos' },
            { type: 'Sitio Corporativo', title: 'Sitio Experiencia Gastronómica', desc: 'Sitio atmosférico que narra la experiencia del chef, la historia de la cocina y el ambiente del salón.', url: 'demos/alimentos/corporativo.html' }
        ]
    }
};

let currentSector = 'comercial';

function updateDemoView() {
    if (!demoData[currentSector]) return;
    const sectorData = demoData[currentSector];
    const container = document.getElementById('demo-results-container');
    if(!container) return;

    container.innerHTML = ''; // Limpiar contenedor

    sectorData.options.forEach(opt => {
        const isUltra = opt.type === 'SaaS Ultra';
        const cardClass = isUltra 
            ? 'background: rgba(17, 24, 39, 0.95); color: white; border: 2px solid var(--accent-green); box-shadow: 0 20px 40px rgba(141, 238, 18, 0.15);' 
            : 'background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(6,7,27,0.1); box-shadow: 0 10px 30px rgba(6,7,27,0.05);';
        
        const titleColor = isUltra ? 'text-white' : 'text-primary-dark';
        const badge = isUltra ? `<span class="badge bg-accent text-dark px-3 py-2 rounded-pill position-absolute top-0 start-50 translate-middle fw-bold">EXPERIENCIA PREMIUM</span>` : '';
        const descColor = isUltra ? 'text-white-50' : 'text-muted';
        
        const cardHTML = `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="h-100 p-4 p-md-5 rounded-4 text-center position-relative d-flex flex-column transition-all demo-card-hover" style="${cardClass} backdrop-filter: blur(10px);">
                    ${badge}
                    <div class="mb-4">
                        <span class="badge ${isUltra ? 'bg-primary-dark text-white border border-secondary' : 'bg-light text-secondary'} mb-3 px-3 py-1 rounded-pill">${opt.type}</span>
                    </div>
                    <div class="demo-icon-wrapper mb-4 mx-auto d-flex align-items-center justify-content-center rounded-circle" style="width: 70px; height: 70px; background: ${isUltra ? 'rgba(255,255,255,0.1)' : 'var(--primary-dark)'};">
                        <i class="fas ${sectorData.icon} fs-2 text-accent"></i>
                    </div>
                    <h4 class="fw-bold ${titleColor} mb-3">${opt.title}</h4>
                    <p class="${descColor} mb-4 flex-grow-1" style="font-size: 0.95rem;">${opt.desc}</p>
                    
                    <a href="${opt.url}" target="_blank" class="${isUltra ? 'btn-arhez-primary' : 'btn-arhez-dark'} py-2 px-4 w-100 fw-bold mb-2 rounded-pill">
                        Ver Demo <i class="fas fa-external-link-alt ms-2"></i>
                    </a>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

document.querySelectorAll('.btn-demo-sector').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-demo-sector').forEach(b => b.classList.remove('active'));
        const targetBtn = e.currentTarget;
        targetBtn.classList.add('active');
        currentSector = targetBtn.dataset.sector;
        updateDemoView();
    });
});

// Inicializar la vista
document.addEventListener('DOMContentLoaded', updateDemoView);