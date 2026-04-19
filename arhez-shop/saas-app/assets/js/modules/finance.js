/* 
   22032026 modules/finance.js 
   Módulo de Gestión Financiera Avanzada para Arhez Shop.
   Incluye: Balances dinámicos, filtros de fecha y desglose por categorías.
*/

const Finance = {
    records: [],
    sales: [],
    filterDays: 30, // Default 30 días

    init() {
        this.loadData();
        this.render();
    },

    async loadData() {
        this.records = await window.Storage.get('financial_records');
        this.sales = await window.Storage.get('sales');
        // Ordenar por fecha (más reciente arriba)
        this.records.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
        this.sales.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    // 22032026 Renderizado Premium con Filtros y Desglose
    render() {
        const container = document.getElementById('module-render');
        
        // Filtro de fecha (Lógica simplificada para demo)
        const now = new Date();
        const cutoff = new Date();
        cutoff.setDate(now.getDate() - this.filterDays);

        const filteredRecords = this.records.filter(r => new Date(r.timestamp) >= cutoff);
        const filteredSales = this.sales.filter(s => new Date(s.timestamp) >= cutoff);

        // Cálculos
        const totalSales = filteredSales.reduce((sum, s) => sum + s.total, 0);
        const extraIncomes = filteredRecords.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
        const totalExpenses = filteredRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
        
        const totalIncomes = totalSales + extraIncomes;
        const netProfit = totalIncomes - totalExpenses;

        container.innerHTML = `
            <!-- Fila de Indicadores Estandarizados (Estilo Dashboard) -->
            <div class="row g-3 mb-4">
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white border-bottom border-success border-4">
                        <div class="d-flex align-items-center mb-2">
                            <div class="bg-success bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center me-3 text-success" style="width: 45px; height: 45px;">
                                <i class="bi bi-arrow-up-right-circle fs-5"></i>
                            </div>
                            <span class="text-muted small fw-bold text-uppercase ls-1">Ingresos Totales</span>
                        </div>
                        <h3 class="fw-bold mb-0 text-dark">$${totalIncomes.toFixed(2)}</h3>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white border-bottom border-danger border-4">
                        <div class="d-flex align-items-center mb-2">
                            <div class="bg-danger bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center me-3 text-danger" style="width: 45px; height: 45px;">
                                <i class="bi bi-arrow-down-left-circle fs-5"></i>
                            </div>
                            <span class="text-muted small fw-bold text-uppercase ls-1">Gastos Realizados</span>
                        </div>
                        <h3 class="fw-bold mb-0 text-dark">$${totalExpenses.toFixed(2)}</h3>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100 text-white" style="background: linear-gradient(135deg, #F99D1C 0%, #e08b1a 100%)">
                        <div class="d-flex align-items-center mb-2">
                            <div class="bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center me-3 text-white" style="width: 45px; height: 45px;">
                                <i class="bi bi-wallet2 fs-5"></i>
                            </div>
                            <span class="opacity-75 small fw-bold text-uppercase ls-1">Balance de Utilidad</span>
                        </div>
                        <h3 class="fw-bold mb-0 text-white">$${netProfit.toFixed(2)}</h3>
                    </div>
                </div>
            </div>

            <div class="row g-4 mb-4">
                <!-- Filtros y Bitácora -->
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                        <div class="card-header bg-white border-0 p-4">
                            <div class="row align-items-center">
                                <div class="col-md-6 d-flex align-items-center">
                                    <div class="bg-primary p-2 rounded-3 me-3 text-white d-flex align-items-center justify-content-center" style="width:40px; height:40px;">
                                        <i class="bi bi-journal-text"></i>
                                    </div>
                                    <h4 class="fw-bold mb-0 text-dark">Movimientos de Efectivo</h4>
                                </div>
                                <div class="col-md-6 text-end d-flex justify-content-end gap-2">
                                    <button class="btn btn-light rounded-pill border px-3 shadow-sm fw-bold small" onclick="Finance.init()" title="Sincronizar Datos">
                                        <i class="bi bi-arrow-clockwise text-primary"></i>
                                    </button>
                                    <select class="form-select d-inline-block w-auto rounded-pill border-0 bg-light px-3 fw-bold small shadow-sm" onchange="Finance.updateFilter(this.value)">
                                        <option value="1" ${this.filterDays == 1 ? 'selected' : ''}>Hoy</option>
                                        <option value="7" ${this.filterDays == 7 ? 'selected' : ''}>Últimos 7 días</option>
                                        <option value="30" ${this.filterDays == 30 ? 'selected' : ''}>Últimos 30 días</option>
                                        <option value="365" ${this.filterDays == 365 ? 'selected' : ''}>Todo el año</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="bg-light">
                                        <tr>
                                            <th class="ps-4 py-3 fw-bold small text-muted">FECHA</th>
                                            <th class="fw-bold small text-muted">CONCEPTO</th>
                                            <th class="fw-bold small text-muted text-center">MONTO</th>
                                            <th class="text-end pe-4 fw-bold small text-muted">ACCIÓN</th>
                                        </tr>
                                    </thead>
                                    <tbody id="finance-table-body">${this.renderRows(filteredRecords)}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Resumen por Categoría -->
                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div class="card-header bg-white border-0 p-4">
                            <h5 class="fw-bold mb-0">Detalle por Gastos</h5>
                        </div>
                        <div class="card-body p-4 pt-0">
                            ${this.renderCategoryBreakdown(filteredRecords)}
                            <hr class="my-4">
                            <button class="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-sm mb-2" onclick="Finance.showAddModal('income')">
                                <i class="bi bi-plus-circle me-2"></i> REGISTRAR INGRESO
                            </button>
                            <button class="btn btn-outline-danger w-100 rounded-pill py-3 fw-bold" onclick="Finance.showAddModal('expense')">
                                <i class="bi bi-dash-circle me-2"></i> REGISTRAR GASTO
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderRows(records) {
        if (records.length === 0) return `<tr><td colspan="4" class="text-center py-5 opacity-50">Sin registros en este periodo.</td></tr>`;
        
        return records.map(r => `
            <tr>
                <td class="ps-4">
                    <div class="fw-bold text-dark small">${new Date(r.timestamp).toLocaleDateString()}</div>
                    <small class="text-muted">${new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                </td>
                <td>
                    <div class="fw-bold text-dark mb-0">${r.description}</div>
                    <small class="text-muted badge p-0 fw-normal uppercase">${r.category}</small>
                </td>
                <td class="text-center">
                    <span class="fw-bold ${r.type === 'income' ? 'text-success' : 'text-danger'} h5 mb-0">
                        ${r.type === 'income' ? '+' : '-'}$${r.amount.toFixed(2)}
                    </span>
                </td>
                <td class="text-end pe-4">
                    <button class="btn btn-icon btn-light rounded-circle" onclick="Finance.handleDelete('${r.id}')"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `).join('');
    },

    renderCategoryBreakdown(records) {
        const expenses = records.filter(r => r.type === 'expense');
        const categories = {};
        let totalExpenses = 0;

        expenses.forEach(e => {
            categories[e.category] = (categories[e.category] || 0) + e.amount;
            totalExpenses += e.amount;
        });

        if (totalExpenses === 0) return `<div class="text-center py-4 text-muted small">No hay gastos para categorizar.</div>`;

        return Object.keys(categories).map(cat => {
            const perc = (categories[cat] / totalExpenses) * 100;
            return `
                <div class="mb-3">
                    <div class="d-flex justify-content-between small mb-1 fw-bold">
                        <span>${cat}</span>
                        <span>$${categories[cat].toFixed(2)}</span>
                    </div>
                    <div class="progress rounded-pill" style="height: 8px;">
                        <div class="progress-bar bg-danger rounded-pill" role="progressbar" style="width: ${perc}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    },

    updateFilter(days) {
        this.filterDays = days;
        this.render();
    },

    async handleDelete(id) {
        if (confirm(`¿Eliminar este registro financiero?`)) {
            this.records = this.records.filter(r => r.id !== id);
            await window.Storage.save('financial_records', this.records);
            this.render();
            window.App?.showToast('Registro eliminado.', 'danger');
        }
    },

    showAddModal(type) {
        this.renderFormModal(type === 'income' ? 'Ingreso Extra' : 'Gasto / Egreso', type);
    },

    renderFormModal(title, type) {
        let modalEl = document.getElementById('finance-form-modal');
        if (!modalEl) {
            modalEl = document.createElement('div');
            modalEl.id = 'finance-form-modal';
            modalEl.className = 'modal fade';
            document.body.appendChild(modalEl);
        }

        modalEl.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div class="modal-header ${type === 'income' ? 'bg-success' : 'bg-danger'} text-white border-0 py-3">
                        <h5 class="modal-title fw-bold text-uppercase"><i class="bi ${type === 'income' ? 'bi-plus-circle' : 'bi-dash-circle'} me-2"></i> ${title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" id="close-finance-modal"></button>
                    </div>
                    <div class="modal-body p-4 bg-white">
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label small fw-bold text-muted">CONCEPTO</label>
                                <input type="text" class="form-control border-0 bg-light p-3 rounded-3" id="fin-desc" placeholder="Especifica el motivo..." required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-bold text-muted">CATEGORÍA</label>
                                <select class="form-select border-0 bg-light p-3 rounded-3" id="fin-cat">
                                    <option value="Operación">Operación</option>
                                    <option value="Servicios">Servicios</option>
                                    <option value="Renta">Renta</option>
                                    <option value="Nómina">Nómina</option>
                                    <option value="Insumos">Insumos</option>
                                    <option value="Mantenimiento">Mantenimiento</option>
                                    <option value="Otros">Otros</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-bold text-muted">MONTO ($)</label>
                                <input type="number" step="0.01" class="form-control border-0 bg-light p-3 rounded-3 fw-bold text-dark" id="fin-amount" placeholder="0.00" required>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer border-0 p-4 pt-0 bg-white">
                         <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">CANCELAR</button>
                         <button type="button" class="btn ${type === 'income' ? 'btn-success' : 'btn-danger'} rounded-pill px-4 fw-bold shadow-sm" onclick="Finance.handleSave('${type}')">GUARDAR</button>
                    </div>
                </div>
            </div>
        `;

        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    },

    async handleSave(type) {
        const desc = document.getElementById('fin-desc').value;
        const amount = parseFloat(document.getElementById('fin-amount').value);
        const cat = document.getElementById('fin-cat').value;

        if (!desc || isNaN(amount) || amount <= 0) {
            return window.App?.showToast('Revisa los datos del formulario.', 'danger');
        }

        const newRecord = {
            id: 'F-' + Date.now(),
            type,
            description: desc,
            category: cat,
            amount: amount,
            timestamp: new Date().toISOString()
        };

        this.records.unshift(newRecord);
        await window.Storage.save('financial_records', this.records);
        
        window.App?.logAction('FINANCE_UPDATE', `Registrado: ${desc} de $${amount.toFixed(2)}`);

        // Cierre manual garantizado
        const btnRef = document.getElementById('close-finance-modal');
        if (btnRef) btnRef.click(); 
        
        this.render();
        window.App?.showToast('🎉 Movimiento registrado.');
    }
};

window.Finance = Finance;
