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
    salud: {
        icon: 'fa-heartbeat',
        options: [
            { type: 'Landing Page', title: 'Landing Page - Salud', desc: 'Diseño optimizado para captación de pacientes, agenda integrada por WhatsApp y presencia móvil perfecta.', url: 'demos/salud/landing.html' },
            { type: 'SaaS Ultra', title: 'SaaS Ultra - Salud', desc: 'Plataforma integral de gestión médica. Expedientes electrónicos, sistema avanzado de citas y panel administrativo.', url: 'demos/salud/ultra.html' },
            { type: 'Sitio Corporativo', title: 'Sitio Corporativo - Salud', desc: 'Presencia web completa para clínicas y hospitales. Múltiples secciones, directorio de especialistas y blog de salud.', url: 'demos/salud/corporativo.html' }
        ]
    },
    construccion: {
        icon: 'fa-hard-hat',
        options: [
            { type: 'Landing Page', title: 'Landing Page - Construcción', desc: 'Captura prospectos para tus desarrollos. Galería de proyectos, formulario de cotización y diseño robusto.', url: 'demos/construccion/landing.html' },
            { type: 'SaaS Ultra', title: 'SaaS Ultra - Construcción', desc: 'Gestor de proyectos de obra. Seguimiento de avances, cotizaciones dinámicas y portal para clientes.', url: 'demos/construccion/ultra.html' },
            { type: 'Sitio Corporativo', title: 'Sitio Corporativo - Construcción', desc: 'Portafolio completo de tu constructora. Secciones detalladas de servicios, certificaciones y casos de éxito.', url: 'demos/construccion/corporativo.html' }
        ]
    },
    alimentos: {
        icon: 'fa-utensils',
        options: [
            { type: 'Landing Page', title: 'Landing Page - Alimentos', desc: 'Ideal para promociones o menú digital básico. Botón directo a pedidos por WhatsApp.', url: 'demos/alimentos/landing.html' },
            { type: 'SaaS Ultra', title: 'SaaS Ultra - Alimentos', desc: 'Sistema POS integral. Gestión de mesas, pedidos online, inventario en tiempo real y facturación.', url: 'demos/alimentos/ultra.html' },
            { type: 'Sitio Corporativo', title: 'Sitio Corporativo - Alimentos', desc: 'La casa digital de tu restaurante. Menú interactivo, historia del chef, galería de platillos y reservaciones.', url: 'demos/alimentos/corporativo.html' }
        ]
    },
    gimnasio: {
        icon: 'fa-dumbbell',
        options: [
            { type: 'Landing Page', title: 'Landing Page - Gimnasio', desc: 'Atrae nuevos socios con promociones de inscripción. Horarios, clases destacadas y contacto rápido.', url: 'demos/gimnasio/landing.html' },
            { type: 'SaaS Ultra', title: 'SaaS Ultra - Gimnasio', desc: 'Software de control de acceso. Membresías recurrentes, app para socios y retención automatizada.', url: 'demos/gimnasio/ultra.html' },
            { type: 'Sitio Corporativo', title: 'Sitio Corporativo - Gimnasio', desc: 'Experiencia inmersiva de tu marca fitness. Perfiles de entrenadores, descripción de disciplinas y tienda de suplementos.', url: 'demos/gimnasio/corporativo.html' }
        ]
    },
    comercial: {
        icon: 'fa-store',
        options: [
            { type: 'Landing Page', title: 'Landing Page - Comercial', desc: 'Campañas de captación B2B y prospección. Generación de leads calificados y presentación rápida de servicios.', url: 'demos/comercial/landing.html' },
            { type: 'SaaS Ultra', title: 'SaaS Ultra - Comercial', desc: 'Plataforma ERP comercial. Gestión de inventarios, CRM para seguimiento de ventas y facturación.', url: 'demos/comercial/ultra.html' },
            { type: 'Sitio Corporativo', title: 'Sitio Corporativo - Comercial', desc: 'Presencia empresarial. Catálogos digitales de productos, cultura institucional y canales B2B para inversores.', url: 'demos/comercial/corporativo.html' }
        ]
    }
};

let currentSector = 'salud';

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