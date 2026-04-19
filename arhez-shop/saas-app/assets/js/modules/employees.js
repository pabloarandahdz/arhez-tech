/* 
   22032026 modules/employees.js 
   Módulo de Gestión de Empleados y Permisos para Arhez Shop.
   Control de acceso granular por módulo.
*/

const Employees = {
    users: [],
    availableModules: [
        { id: 'pos', name: 'Caja Registradora' },
        { id: 'inventory', name: 'Inventarios' },
        { id: 'sales-history', name: 'Historial de Ventas' },
        { id: 'finance', name: 'Gestión Financiera' },
        { id: 'employees', name: 'Gestión de Empleados' },
        { id: 'dashboard', name: 'Tablero de Control' }
    ],

    init() {
        this.loadData();
        this.render();
    },

    async loadData() {
        this.users = await window.Storage.get('arhez_users'); // Usamos la misma llave que core.js
        if (!this.users || this.users.length === 0) {
            // Si no hay usuarios (raro porque el admin debe existir), inicializamos con el actual
            const currentUser = JSON.parse(localStorage.getItem('arhez_session'));
            this.users = currentUser ? [currentUser] : [];
        }
    },

    render() {
        const container = document.getElementById('module-render');
        container.innerHTML = `
            <!-- Fila de Resumen Estandarizada -->
            <div class="row g-3 mb-4">
                <div class="col-md-6">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100 text-white" style="background: linear-gradient(135deg, #F99D1C 0%, #e08b1a 100%)">
                        <div class="d-flex align-items-center mb-2">
                            <div class="bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center me-3 text-white" style="width: 45px; height: 45px;">
                                <i class="bi bi-people fs-5"></i>
                            </div>
                            <span class="opacity-75 small fw-bold text-uppercase ls-1">Plantilla Total</span>
                        </div>
                        <h3 class="fw-bold mb-0 text-white">${this.users.length} Colaboradores</h3>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white border-bottom border-primary border-4">
                        <div class="d-flex align-items-center mb-2">
                            <div class="bg-primary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center me-3 text-primary" style="width: 45px; height: 45px;">
                                <i class="bi bi-shield-lock fs-5"></i>
                            </div>
                            <span class="text-muted small fw-bold text-uppercase ls-1">Administradores</span>
                        </div>
                        <h3 class="fw-bold mb-0 text-dark">${this.users.filter(u => u.role === 'admin').length} Perfiles</h3>
                    </div>
                </div>
            </div>

            <!-- Tabla de Empleados -->
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div class="card-header bg-white border-0 p-4">
                    <div class="row align-items-center">
                        <div class="col-md-6 d-flex align-items-center">
                            <div class="bg-primary p-2 rounded-3 me-3 text-white d-flex align-items-center justify-content-center" style="width:40px; height:40px;">
                                <i class="bi bi-person-badge"></i>
                            </div>
                            <h4 class="fw-bold mb-0 text-dark">Control de Personal</h4>
                        </div>
                        <div class="col-md-6 text-end">
                            <button class="btn btn-light rounded-pill border px-3 py-2 shadow-sm fw-bold me-2" onclick="Employees.init()" title="Sincronizar">
                                <i class="bi bi-arrow-clockwise text-primary"></i>
                            </button>
                            <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onclick="Employees.showAddModal()">
                                <i class="bi bi-person-plus me-1"></i> AGREGAR EMPLEADO
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light">
                                <tr>
                                    <th class="ps-4 py-3 fw-bold small text-muted text-uppercase">Nombre / Email</th>
                                    <th class="fw-bold small text-muted text-uppercase">Rol</th>
                                    <th class="fw-bold small text-muted text-uppercase">Accesos (Módulos)</th>
                                    <th class="text-end pe-4 fw-bold small text-muted text-uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="employees-table-body">${this.renderRows()}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderRows() {
        if (this.users.length === 0) return `<tr><td colspan="4" class="text-center py-5 opacity-50">No hay empleados registrados.</td></tr>`;
        
        return this.users.map(u => `
            <tr>
                <td class="ps-4">
                    <div class="fw-bold text-dark mb-0">${u.name}</div>
                    <small class="text-muted">${u.email}</small>
                </td>
                <td>
                    <span class="badge ${u.role === 'admin' ? 'bg-primary text-white' : 'bg-light text-dark border'} rounded-pill px-3 py-1 fw-bold text-uppercase" style="font-size: 0.75rem;">
                        ${u.role === 'admin' ? 'ADMINISTRADOR' : 'EMPLEADO'}
                    </span>
                </td>
                <td>
                    ${this.renderPermissionBadges(u.permissions || [])}
                </td>
                <td class="text-end pe-4">
                    <button class="btn btn-icon btn-light rounded-circle me-1" onclick="Employees.showEditModal('${u.id}')" title="Editar"><i class="bi bi-pencil"></i></button>
                    ${u.role !== 'admin' ? `<button class="btn btn-icon btn-outline-danger border-0 rounded-circle" onclick="Employees.handleDelete('${u.id}')" title="Eliminar"><i class="bi bi-trash"></i></button>` : ''}
                </td>
            </tr>
        `).join('');
    },

    renderPermissionBadges(permissions) {
        if (permissions.length === 0) return `<small class="text-muted italic">Sin accesos</small>`;
        return permissions.map(p => {
            const mod = this.availableModules.find(m => m.id === p);
            return mod ? `<span class="badge bg-light border text-primary rounded-pill px-2 me-1 mb-1 fw-normal" style="font-size: 0.7rem;">${mod.name}</span>` : '';
        }).join('');
    },

    async handleDelete(id) {
        if (confirm(`¿Estás seguro de eliminar este acceso de empleado?`)) {
            this.users = this.users.filter(u => u.id !== id);
            await window.Storage.save('arhez_users', this.users);
            this.render();
            window.App?.showToast('🗑️ Empleado eliminado.', 'danger');
        }
    },

    showAddModal() { this.renderFormModal('Agregar Nuevo Empleado'); },
    showEditModal(id) { const user = this.users.find(u => u.id === id); if (user) this.renderFormModal('Editar Empleado y Permisos', user); },

    renderFormModal(title, user = null) {
        let modalEl = document.getElementById('employee-form-modal');
        if (!modalEl) {
            modalEl = document.createElement('div');
            modalEl.id = 'employee-form-modal';
            modalEl.className = 'modal fade';
            document.body.appendChild(modalEl);
        }

        const userPermissions = user ? (user.permissions || []) : [];

        modalEl.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div class="modal-header bg-primary text-white border-0 py-3">
                        <h5 class="modal-title fw-bold text-uppercase"><i class="bi bi-person-lock me-2"></i> ${title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" id="close-emp-modal"></button>
                    </div>
                    <div class="modal-body p-4 bg-white">
                        <div class="row g-3">
                            <input type="hidden" id="emp-id" value="${user ? user.id : ''}">
                            <div class="col-12">
                                <label class="form-label small fw-bold text-muted text-uppercase">Nombre Completo</label>
                                <input type="text" class="form-control border-0 bg-light p-3 rounded-3" id="emp-name" value="${user ? user.name : ''}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-bold text-muted text-uppercase">Correo Electrónico</label>
                                <input type="email" class="form-control border-0 bg-light p-3 rounded-3" id="emp-email" value="${user ? user.email : ''}" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-bold text-muted text-uppercase">Contraseña de Acceso</label>
                                <input type="text" class="form-control border-0 bg-light p-3 rounded-3" id="emp-pass" value="${user ? user.password : ''}" placeholder="Mínimo 6 caracteres" required>
                            </div>
                            <div class="col-md-12">
                                <label class="form-label small fw-bold text-muted text-uppercase">Rol del Usuario</label>
                                <select class="form-select border-0 bg-light p-3 rounded-3" id="emp-role">
                                    <option value="employee" ${user && user.role === 'employee' ? 'selected' : ''}>Empleado (Vendedor)</option>
                                    <option value="admin" ${user && user.role === 'admin' ? 'selected' : ''}>Administrador (Dueño)</option>
                                </select>
                            </div>

                            <!-- Listado de Permisos de Módulos -->
                            <div class="col-12 mt-4">
                                <label class="form-label fw-bold text-dark text-uppercase border-bottom w-100 pb-2 mb-3">Accesos Permitidos</label>
                                <div class="row g-2">
                                    ${this.availableModules.map(m => `
                                        <div class="col-6">
                                            <div class="form-check p-3 bg-light rounded-3 d-flex align-items-center">
                                                <input class="form-check-input ms-0 me-3 mt-0 flex-shrink-0" type="checkbox" value="${m.id}" id="perm-${m.id}" ${userPermissions.includes(m.id) ? 'checked' : ''}>
                                                <label class="form-check-label fw-bold small text-dark p-0" for="perm-${m.id}">${m.name}</label>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0 p-4 pt-0 bg-white">
                         <button type="button" class="btn btn-light rounded-pill px-4 fw-bold border" data-bs-dismiss="modal">CANCELAR</button>
                         <button type="button" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onclick="Employees.handleSave()">GUARDAR SEGURIDAD</button>
                    </div>
                </div>
            </div>
        `;

        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    },

    async handleSave() {
        const id = document.getElementById('emp-id').value;
        const name = document.getElementById('emp-name').value;
        const email = document.getElementById('emp-email').value;
        const pass = document.getElementById('emp-pass').value;
        const role = document.getElementById('emp-role').value;

        if (!name || !email || !pass) return window.App?.showToast('Por favor completa todos los campos (nombre, email y contraseña).', 'danger');
        if (pass.length < 4) return window.App?.showToast('La contraseña debe tener al menos 4 caracteres.', 'warning');

        // Obtener permisos seleccionados
        const selectedPermissions = [];
        this.availableModules.forEach(m => {
            if (document.getElementById(`perm-${m.id}`).checked) selectedPermissions.push(m.id);
        });

        const userData = {
            id: id || Date.now().toString(),
            name: name,
            email: email,
            password: pass,
            role: role,
            permissions: selectedPermissions,
            business: window.App?.user?.business || 'Comercio Arhez'
        };

        if (id) {
            const idx = this.users.findIndex(u => u.id === id);
            this.users[idx] = userData;
            window.App?.logAction('PRIVILEGE_UPDATE', `Actualizados permisos para: ${name}`);
        } else {
            this.users.push(userData);
            window.App?.logAction('USER_ADD', `Nuevo empleado agregado: ${name}`);
        }

        // Guardar tanto en la lista de usuarios como actualizar sesión si es el mismo
        await window.Storage.save('arhez_users', this.users);
        
        const currentUser = JSON.parse(localStorage.getItem('arhez_session'));
        if (currentUser && currentUser.id === id) {
            localStorage.setItem('arhez_session', JSON.stringify(userData));
            window.App.user = userData; // Actualizar core
        }

        // Cierre de modal
        const btnRef = document.getElementById('close-emp-modal');
        if (btnRef) {
            btnRef.click(); 
            setTimeout(() => {
                        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
                        document.body.classList.remove('modal-open');
                        document.body.style.paddingRight = '';
                    }, 300);
        }
        
        this.render();
        window.App?.showToast('✅ Empleado y permisos configurados.');
    }
};

window.Employees = Employees;
