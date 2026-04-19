/* 
   22032026 modules/settings.js 
   Módulo de Configuración de Comercio para Arhez Shop.
   Personalización de identidad, impuestos y parámetros del sistema.
*/

const Settings = {
    profile: null,

    async init() {
        await this.loadData();
        this.render();
    },

    async loadData() {
        let res = await window.Storage.get('arhez_business_profile');
        
        // Si viene del API SQL es una LISTA, tomamos el primero
        if (Array.isArray(res)) {
            this.profile = res.length > 0 ? res[0] : null;
        } else {
            this.profile = res; // LocalStorage devuelve el objeto directo
        }

        if (!this.profile) {
            // Valores iniciales por defecto tomados de la sesión
            const session = JSON.parse(localStorage.getItem('arhez_session'));
            this.profile = {
                name: session?.business || 'Mi Comercio Arhez',
                address: 'Dirección no configurada',
                phone: '000-000-0000',
                email: session?.email || 'hola@comercio.com',
                tax_id: 'XAXX010101000',
                currency: 'MXN',
                tax_percentage: 16,
                include_tax: true,
                ticket_footer: '¡Gracias por su compra!'
            };
            await window.Storage.save('arhez_business_profile', this.profile);
        }
    },

    // 22032026 Renderizado Premium Arhez
    render() {
        const container = document.getElementById('module-render');
        container.innerHTML = `
            <div class="row g-4 mb-5">
                <!-- Columna Izquierda: Identidad -->
                <div class="col-lg-7">
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-4 bg-white border-bottom border-primary border-4">
                        <div class="card-header bg-white border-0 p-4">
                            <div class="d-flex align-items-center">
                                <div class="bg-primary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center me-3 text-primary" style="width: 45px; height: 45px;">
                                    <i class="bi bi-building fs-5"></i>
                                </div>
                                <div>
                                    <h5 class="fw-bold mb-0 text-dark small-caps">Perfil del Establecimiento</h5>
                                    <small class="text-muted">Información legal y de contacto</small>
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-4 pt-0">
                            <form id="settings-branding-form">
                                <div class="row g-3">
                                    <div class="col-md-12">
                                        <label class="form-label small-caps text-muted">Nombre Comercial</label>
                                        <input type="text" class="form-control border-0 bg-light p-3 rounded-3 fw-bold" id="set-name" value="${this.profile.name}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label small-caps text-muted">Registro Federal (RFC)</label>
                                        <input type="text" class="form-control border-0 bg-light p-3 rounded-3" id="set-tax-id" value="${this.profile.tax_id}">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label small-caps text-muted">Teléfono de Atención</label>
                                        <input type="text" class="form-control border-0 bg-light p-3 rounded-3" id="set-phone" value="${this.profile.phone}">
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label small-caps text-muted">Domicilio Fiscal</label>
                                        <textarea class="form-control border-0 bg-light p-3 rounded-3" id="set-address" rows="2">${this.profile.address}</textarea>
                                    </div>
                                    <div class="col-12 mt-2">
                                        <label class="form-label small-caps text-muted">Agradecimiento en Ticket</label>
                                        <input type="text" class="form-control border-0 bg-light p-3 rounded-3 font-italic" id="set-ticket-footer" value="${this.profile.ticket_footer}">
                                    </div>
                                    <div class="col-12 text-end mt-4">
                                        <button type="button" class="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-sm" onclick="Settings.handleSaveProfile()">GUARDAR IDENTIDAD</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Columna Derecha: Vista Previa y Peligro -->
                <div class="col-lg-5">
                    <div class="card border-0 shadow-sm rounded-5 overflow-hidden mb-4 p-4 text-center text-white" style="background: linear-gradient(135deg, #1d1d1d 0%, #333 100%)">
                        <img src="../assets/img/logotipo2.png" alt="Arhez Logo" height="25" class="opacity-50 mb-4 mx-auto d-block">
                        <div class="bg-primary rounded-circle shadow-lg mx-auto mb-3 d-flex align-items-center justify-content-center" style="width: 100px; height: 100px; border: 4px solid #F99D1C">
                             <i class="bi bi-shop display-4 text-white"></i>
                        </div>
                        <h4 class="fw-bold mb-1">${this.profile.name}</h4>
                        <p class="small text-white text-opacity-75 mb-4">${this.profile.address}</p>
                        <div class="badge bg-white bg-opacity-25 rounded-pill px-4 py-2 small fw-bold text-uppercase">Previsualización de Tarjeta</div>
                    </div>

                    <!-- Zona Peligrosa -->
                    <div class="card border-0 shadow-sm rounded-4 bg-danger bg-opacity-10 border border-danger border-opacity-25 p-4">
                        <h6 class="text-danger fw-bold text-uppercase mb-3 d-flex align-items-center">
                            <i class="bi bi-shield-lock-fill me-2"></i> ZONA DE CONTROL MAESTRO
                        </h6>
                        <p class="small text-muted mb-4 opacity-75">Elimina inmediatamente todos los datos cargados en esta terminal (Ventas, Inventario, Usuarios). Esta acción es definitiva.</p>
                        <button class="btn btn-outline-danger w-100 rounded-pill py-3 fw-bold" onclick="Settings.handleFactoryReset()">RESETEAR SISTEMA DE FÁBRICA</button>
                    </div>
                </div>
            </div>
        `;
    },

    async handleSaveProfile() {
        this.profile.name = document.getElementById('set-name').value;
        this.profile.address = document.getElementById('set-address').value;
        this.profile.tax_id = document.getElementById('set-tax-id').value;
        this.profile.phone = document.getElementById('set-phone').value;
        this.profile.ticket_footer = document.getElementById('set-ticket-footer').value;

        await window.Storage.save('arhez_business_profile', this.profile);
        
        // Actualizar UI Global (si es necesario)
        window.App?.logAction('SETTINGS_UPDATE', `Actualizado perfil del negocio: ${this.profile.name}`);
        this.render();
        window.App?.showToast('🚀 Identidad actualizada.');
    },

    handleFactoryReset() {
        if (confirm('☠️ ¡ALERTA CRÍTICA! \n\nEstás a punto de borrar TODA la base de datos local (Inventarios, Ventas y Usuarios). ¿Realmente deseas continuar?')) {
            if (confirm('Escribe "ELIMINAR" para confirmar la destrucción de datos.')) {
                localStorage.clear();
                window.location.reload();
            }
        }
    }
};

window.Settings = Settings;
