/* 
   22032026 main.js 
   Lógica funcional para el acceso al demo de Arhez Shop.
   Actualizado para funcionar sin módulos (Protocolo file:// compatible).
*/

// Ya no usamos importación por el protocolo file://
// El objeto DemoService ahora está disponible globalmente a través de demoService.js

// 22032026 Aplicación principal del Landing Page
const App = {
    
    init() {
        console.log('22032026 Arhez Shop - Landing Page Inicializada (Modo Compatible)');
        
        // Inicializar el servicio de prospección global
        if (window.DemoService) {
            window.DemoService.init();
        } else {
            console.error('[App] ❌ Error: DemoService no cargado.');
        }
        
        this.registerEvents();
        this.checkScrollEffect();
    },

    // 22032026 Registro de eventos interactivos
    registerEvents() {
        // Enlaces de navegación suave
        document.querySelectorAll('a.nav-link[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });

        // Efectos de scroll en la UI
        window.addEventListener('scroll', () => this.checkScrollEffect());

        // Manejo del formulario de demo
        const demoForm = document.getElementById('demo-request-form');
        if (demoForm) {
            demoForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    },

    // 22032026 Validación y envío del formulario de demo
    async handleSubmit(e) {
        e.preventDefault();
        
        // 22032026 Recolección de datos del prospecto
        const formData = {
            name: document.getElementById('demo-name').value.trim(),
            company: document.getElementById('demo-company').value.trim(),
            phone: document.getElementById('demo-phone').value.trim(),
            email: document.getElementById('demo-email').value.trim().toLowerCase(),
            origin: 'arhez-shop'
        };

        // 22032026 Lógica de validación
        if (!this.isValidData(formData)) return;

        const submitBtn = e.target.querySelector('button[type="submit"]');
        this.toggleButtonLoading(submitBtn, true);

        try {
            // 22032026 Procesamos ingreso al demo usando el servicio global
            const result = await window.DemoService.processDemoEntry(formData);
            
            if (result.success) {
                sessionStorage.setItem('arhez_demo_authorized', 'true');
                this.redirectUserToDemo();
            } else {
                alert(`Error: ${result.error}`);
                this.toggleButtonLoading(submitBtn, false);
            }
        } catch (error) {
            console.error('Error fatal detectado:', error);
            alert('Ocurrió un error inesperado al conectar con el servidor.');
            this.toggleButtonLoading(submitBtn, false);
        }
    },

    // 22032026 Validación básica de datos
    isValidData(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Por favor, ingresa un correo electrónico válido.');
            return false;
        }

        if (data.phone.length < 8) {
            alert('Ingresa un número de teléfono de contacto válido.');
            return false;
        }

        if (data.name.length < 3 || data.company.length < 2) {
            alert('Por favor, completa correctamente todos los campos.');
            return false;
        }

        return true;
    },

    // 22032026 Redirección al área privada del demo
    redirectUserToDemo() {
        console.log('[App] Redirigiendo al entorno de demostración...');
        // Redirigimos a la carpeta del SaaS real
        window.location.href = 'saas-app/index.html';
    },

    // 22032026 Estética de botones de carga
    toggleButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Cargando...';
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText;
        }
    },

    // 22032026 Efecto de scroll para la navbar
    checkScrollEffect() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-sm', 'py-2');
            navbar.classList.remove('py-3');
        } else {
            navbar.classList.remove('shadow-sm', 'py-2');
            navbar.classList.add('py-3');
        }
    },

    // 22032026 Scroll suave para navegación interna
    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }
};

// 22032026 Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', () => App.init());
