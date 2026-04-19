/* 
   22032026 core.js 
   Motor principal de la aplicación SaaS Arhez Shop.
   Gestiona la navegación SPA, sesiones y trazabilidad.
*/

// 22032026 Objeto principal de la aplicación
const App = {
    user: null,
    business: null,
    currentModule: 'pos',

    init() {
        console.log('22032026 SaaS Arhez Shop Core Initialized');
        
        if (sessionStorage.getItem('arhez_demo_authorized') !== 'true') {
            alert('Acceso restringido: Debes llenar el formulario de solicitud en la página principal para acceder al Demo Web.');
            window.location.href = '../index.html#demo';
            return;
        }

        this.seedInitialAdmin();
        this.checkSession();
        this.registerEvents();
        this.updateTime();
        setInterval(() => this.updateTime(), 60000);

        // 22032026 Sincronización Automática entre pestañas y módulos
        window.addEventListener('storage', (e) => {
            console.log('Detectado cambio externo en:', e.key);
            if (this.currentModule) {
                this.loadModule(this.currentModule);
            }
        });

        // 13042026 Cierre automático del servidor Node
        window.addEventListener('beforeunload', () => {
            // Utilizamos Beacon porque fetch puede abortarse cuando se cierra la pestaña
            navigator.sendBeacon('http://localhost:3000/api/shutdown');
        });
    },

    // Notificación manual de actualización interna
    notifyUpdate() {
        if (this.currentModule) {
            console.log('Actualizando módulo activo por cambio local...');
            this.loadModule(this.currentModule);
        }
    },

    // 22032026 Generar o Reparar cuenta maestra por defecto (Demo)
    seedInitialAdmin() {
        let users = JSON.parse(localStorage.getItem('arhez_users') || '[]');
        const existingMaster = users.find(u => u.email === 'admin@arhez.com');
        
        const masterAdmin = {
            id: 'owner-001',
            name: 'Dueño Arhez',
            email: 'admin@arhez.com',
            password: 'admin', 
            role: 'admin',
            permissions: ['pos', 'inventory', 'sales-history', 'finance', 'employees', 'dashboard'],
            business: 'Arhez Shop Matriz',
            created_at: new Date().toISOString()
        };

        if (!existingMaster) {
            users.push(masterAdmin);
            localStorage.setItem('arhez_users', JSON.stringify(users));
            console.log('22032026 Arhez: Cuenta maestra de demo creada.');
        } else if (existingMaster.password !== 'admin') {
            // Reparar cuenta master si el usuario la dañó sin querer
            const idx = users.findIndex(u => u.email === 'admin@arhez.com');
            users[idx] = masterAdmin;
            localStorage.setItem('arhez_users', JSON.stringify(users));
        }
    },

    // 22032026 Verificación de sesión local (Simulada por ahora, expandible a Supabase)
    checkSession() {
        const savedUser = JSON.parse(localStorage.getItem('arhez_session'));
        if (savedUser) {
            this.user = savedUser;
            this.showApp();
        } else {
            this.showAuth();
        }
    },

    // 22032026 Alternar entre Login y Registro
    toggleAuthMode(mode) {
        if (mode === 'register') {
            document.getElementById('login-view').classList.add('d-none');
            document.getElementById('register-view').classList.remove('d-none');
            document.getElementById('auth-title').innerText = 'Crear Nueva Cuenta';
        } else {
            document.getElementById('login-view').classList.remove('d-none');
            document.getElementById('register-view').classList.add('d-none');
            document.getElementById('auth-title').innerText = 'Acceder al Sistema';
        }
    },

    // 22032026 Mostrar Interfaz de Usuario autenticada
    showApp() {
        document.getElementById('auth-overlay').classList.add('d-none');
        document.getElementById('app-layout').classList.remove('d-none');
        
        // Cargar datos de usuario en la UI
        document.getElementById('user-display-name').innerText = this.user.name;
        document.getElementById('user-display-role').innerText = this.user.role === 'admin' ? 'DUEÑO / ADMIN' : 'VENDEDOR';

        this.applyPermissions();
        this.loadModule(this.currentModule);
    },

    // 13042026 Sistema de Control de Acceso Estricto (Basado en Licencia/Roles)
    applyPermissions() {
        const perms = this.user.permissions || [];
        const isAdmin = this.user.role === 'admin';

        // Ocultar primero todos los bloques admin
        document.querySelectorAll('.admin-only').forEach(el => {
            el.classList.add('d-none');
        });

        // Filtrado iterativo de cada link del Menú
        document.querySelectorAll('.menu-item').forEach(link => {
            const modId = link.getAttribute('data-module');
            const hasAccess = perms.includes(modId); // Exigencia estricta por el array (Plan/Empleado)
            
            if (hasAccess) {
                link.classList.remove('d-none');
                // Si el módulo pertenece a zona administrativa, hacemos visible el bloque contenedor
                let parentBlock = link.closest('.admin-only');
                if (parentBlock) parentBlock.classList.remove('d-none');
            } else {
                link.classList.add('d-none');
            }
        });
    },

    // 22032026 Mostrar pantalla de Login
    showAuth() {
        document.getElementById('auth-overlay').classList.remove('d-none');
        document.getElementById('app-layout').classList.add('d-none');
    },

    // 22032026 Registro de eventos globales
    registerEvents() {
        // Manejo de envío de login
        const loginForm = document.getElementById('login-form');
        if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));

        // Navegación Sidebar
        document.querySelectorAll('.menu-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const module = e.currentTarget.getAttribute('data-module');
                this.loadModule(module);
            });
        });
    },

    // 13042026 Lógica de Login Híbrida (Nube Licencias + SQL Local Empleados)
    async handleLogin(e) {
        e.preventDefault();
        const emailEl = document.getElementById('login-email');
        const passEl = document.getElementById('login-password');
        
        const email = emailEl ? emailEl.value : '';
        const pass = passEl ? passEl.value : '';

        if (!email || !pass) return this.showToast('Ingresa tus credenciales.', 'warning');

        // ==== PASO 1: VALIDACIÓN NUBE (LICENCIA DEL SERVIDOR MAESTRO) ====
        if (window.supabase) {
            this.showToast('Verificando licencia...', 'primary');
            if (!this.sbClient) {
                this.sbClient = window.supabase.createClient('https://wrjqbyntrjepvkrtautz.supabase.co', 'sb_publishable_aYdImCiJFZsgWe9kTsRLTw_JIB7k6nI');
            }

            try {
                const { data: cloudUser, error } = await this.sbClient
                    .from('saas_licenses')
                    .select('*')
                    .eq('email', email)
                    .eq('password_hash', pass)
                    .maybeSingle();

                if (cloudUser && cloudUser.payment_status === 'PAID_STRIPE') {
                    
                    // Asignación de Roles por Tier (Restricción de software exigida)
                    let assignedPermissions = ['pos', 'inventory']; // Plan Esencial
                    if (cloudUser.plan === 'Enterprise') {
                        assignedPermissions = ['pos', 'inventory', 'sales-history', 'finance'];
                    } else if (cloudUser.plan === 'Ultra') {
                        assignedPermissions = ['pos', 'inventory', 'sales-history', 'finance', 'employees', 'dashboard', 'settings'];
                    }

                    const masterAdmin = {
                        id: 'owner-cloud-' + cloudUser.id,
                        name: cloudUser.admin_name,
                        email: cloudUser.email,
                        password: cloudUser.password_hash,
                        role: 'admin',
                        plan: cloudUser.plan,
                        permissions: assignedPermissions,
                        business: 'Comercio Principal',
                        created_at: new Date().toISOString()
                    };

                    this.user = masterAdmin;
                    localStorage.setItem('arhez_session', JSON.stringify(masterAdmin));
                    
                    // Forzar guardado profundo para validaciones subsecuentes locales (modo offline backup)
                    let usersInfo = JSON.parse(localStorage.getItem('arhez_users') || '[]');
                    const existentIdx = usersInfo.findIndex(u => u.email === email);
                    if (existentIdx > -1) { usersInfo[existentIdx] = masterAdmin; } else { usersInfo.push(masterAdmin); }
                    localStorage.setItem('arhez_users', JSON.stringify(usersInfo));

                    this.logAction('USER_LOGIN', `Sesión Maestra iniciada [Licencia: ${cloudUser.plan}].`);
                    this.showToast(`Licencia ${cloudUser.plan} validada. ¡Bienvenido!`, 'success');
                    this.showApp();
                    return; // Terminamos aquí si fue validez de nube
                }
            } catch (err) {
                console.warn('[Arhez Shop] Supabase error (quizá no hay internet, fallback a local):', err);
            }
        }

        // ==== PASO 2: FALLBACK LOCAL (EMPLEADOS O SIN INTERNET) ====
        const users = await window.Storage.get('arhez_users');
        const foundUser = users.find(u => u.email === email && u.password === pass);

        if (foundUser) {
            this.user = foundUser;
            localStorage.setItem('arhez_session', JSON.stringify(foundUser));
            this.logAction('USER_LOGIN', `Sesión iniciada por ${foundUser.name} (Modo Local).`);
            this.showApp();
        } else {
            this.showToast('⛔ Acceso restringido: Correo o clave incorrectos.', 'danger');
        }
    },


    // 22032026 Cargar módulos SPA
    loadModule(moduleName) {
        // Validación Estricta de Seguridad (Tier Plan)
        const perms = this.user.permissions || [];
        const hasAccess = perms.includes(moduleName);

        if (!hasAccess) {
            let userPlanInfo = this.user.plan ? ` (Tu Plan actual es ${this.user.plan})` : '';
            this.showToast(`⛔ Acceso restringido: Mejora tu licencia para usar este módulo${userPlanInfo}.`, 'danger');
            if (this.currentModule !== 'pos' && perms.includes('pos')) this.loadModule('pos');
            return;
        }

        this.currentModule = moduleName;
        
        // Cerrar sidebar en móvil tras selección
        document.getElementById('sidebar').classList.remove('show');

        // Actualizar UI del sidebar
        document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        document.querySelector(`.menu-item[data-module="${moduleName}"]`).classList.add('active');
        
        // Actualizar título
        const titles = {
            'pos': 'Caja Registradora',
            'inventory': 'Gestión de Inventarios',
            'sales-history': 'Historial de Transacciones',
            'finance': 'Cuentas y Finanzas',
            'employees': 'Plantilla de Empleados',
            'dashboard': 'Tablero de Control',
            'settings': 'Configuración del Comercio'
        };
        document.getElementById('module-title').innerText = titles[moduleName];

        // Limpiar contenedor
        document.getElementById('module-render').innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary"></div></div>';

        // Inicializar lógica según el módulo
        if (moduleName === 'pos' && window.POS) {
            window.POS.init();
        } else if (moduleName === 'inventory' && window.Inventory) {
            window.Inventory.init();
        } else if (moduleName === 'sales-history' && window.SalesHistory) {
            window.SalesHistory.init();
        } else if (moduleName === 'finance' && window.Finance) {
            window.Finance.init();
        } else if (moduleName === 'employees' && window.Employees) {
            window.Employees.init();
        } else if (moduleName === 'dashboard' && window.Dashboard) {
            window.Dashboard.init();
        } else if (moduleName === 'settings' && window.Settings) {
            window.Settings.init();
        } else {
            this.renderPlaceholder(moduleName);
        }
    },

    // 22032026 Mostrar Notificaciones elegantes (Toasts)
    showToast(message, color = 'success') {
        const toastEl = document.getElementById('app-toast');
        const messageEl = document.getElementById('toast-message');
        const indicator = toastEl.querySelector('.toast-indicator');
        
        messageEl.innerText = message;
        indicator.className = `toast-indicator bg-${color}`;
        
        const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
        toast.show();
    },

    // 22032026 Renderizado de contenidos dinámicos
    renderPlaceholder(name) {
        const container = document.getElementById('module-render');
        container.innerHTML = `
            <div class="p-4 bg-white rounded-4 shadow-sm">
                <h3>Módulo: ${name.toUpperCase()}</h3>
                <p class="text-muted">Desarrollando la lógica principal de trazabilidad y gestión para Arhez Shop...</p>
                <div class="mt-4 p-3 border-start border-4 border-primary bg-light">
                    <strong>Próximo paso:</strong> Implementar formularios e integración remota.
                </div>
            </div>
        `;
    },

    // 22032026 Toggle Sidebar en Móvil
    toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('show');
    },

    // 22032026 Registro de trazabilidad (Log de acciones)
    logAction(type, description) {
        const logEntry = {
            id: Date.now(),
            user_id: this.user ? this.user.id : 'desconocido',
            user_name: this.user ? this.user.name : 'Vendedor Anónimo',
            type: type,
            description: description,
            timestamp: new Date().toLocaleString()
        };

        let logs = JSON.parse(localStorage.getItem('arhez_logs') || '[]');
        logs.unshift(logEntry); // Más recientes primero
        localStorage.setItem('arhez_logs', JSON.stringify(logs));
        console.log(`[Bitácora] ${logEntry.timestamp}: ${description}`);
    },

    // 22032026 Cerrar Sesión
    logout() {
        localStorage.removeItem('arhez_session');
        window.location.reload();
    },

    // 22032026 Actualizador de hora en tiempo real
    updateTime() {
        const now = new Date();
        document.getElementById('current-time').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
};

// 22032026 Exportar al contexto global para otros módulos
window.App = App;

// 22032026 Inicializar aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => App.init());
