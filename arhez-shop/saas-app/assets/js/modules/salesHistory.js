/* 
   22032026 modules/salesHistory.js 
   Módulo de Historial de Ventas para Arhez Shop.
   Actualizado: Español estricto, iconos con fondo y visualización pulida.
*/

const SalesHistory = {
    sales: [],

    init() {
        this.loadData();
        this.render();
    },

    async loadData() {
        this.sales = await window.Storage.get('sales');
        this.sales.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    },

    // 22032026 Diseño con indicadores financieros y español estricto
    render() {
        const container = document.getElementById('module-render');
        const totalAmount = this.sales.reduce((sum, s) => sum + s.total, 0);
        const count = this.sales.length;

        container.innerHTML = `
            <div class="row g-3 mb-4">
                <div class="col-md-6">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100 text-white" style="background: linear-gradient(135deg, #F99D1C 0%, #e08b1a 100%)">
                        <div class="d-flex align-items-center mb-2">
                            <div class="bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center me-3 text-white" style="width: 45px; height: 45px;">
                                <i class="bi bi-cash-stack fs-5"></i>
                            </div>
                            <span class="opacity-75 small fw-bold text-uppercase ls-1">Acumulado Histórico</span>
                        </div>
                        <h3 class="fw-bold mb-0 text-white">$${totalAmount.toFixed(2)}</h3>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white border-bottom border-primary border-4">
                        <div class="d-flex align-items-center mb-2">
                            <div class="bg-primary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center me-3 text-primary" style="width: 45px; height: 45px;">
                                <i class="bi bi-receipt fs-5"></i>
                            </div>
                            <span class="text-muted small fw-bold text-uppercase ls-1">Folios Emitidos</span>
                        </div>
                        <h3 class="fw-bold mb-0 text-dark">${count}</h3>
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div class="card-header bg-white border-0 p-4">
                    <div class="row align-items-center">
                        <div class="col-md-6 d-flex align-items-center">
                            <div class="bg-primary p-2 rounded-3 me-3 text-white d-flex align-items-center justify-content-center" style="width:40px; height:40px;">
                                <i class="bi bi-calendar3"></i>
                            </div>
                            <h4 class="fw-bold mb-0 text-dark">Historial de Transacciones</h4>
                        </div>
                        <div class="col-md-6 text-end">
                            <button class="btn btn-light rounded-pill border px-4 fw-bold shadow-sm" onclick="SalesHistory.init()">
                                <i class="bi bi-arrow-clockwise me-1 text-primary"></i> Actualizar
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light">
                                <tr>
                                    <th class="ps-4 py-3 fw-bold small text-muted text-uppercase">Folio / Fecha</th>
                                    <th class="fw-bold small text-muted text-uppercase">Atendió</th>
                                    <th class="fw-bold small text-muted text-uppercase text-center">Método Pago</th>
                                    <th class="fw-bold small text-muted text-uppercase text-center">Total</th>
                                    <th class="text-end pe-4 fw-bold small text-muted text-uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="sales-history-body">${this.renderRows()}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderRows() {
        if (this.sales.length === 0) return `<tr><td colspan="5" class="text-center py-5 opacity-50"><i class="bi bi-receipt-cutoff display-6 d-block mb-3"></i> Sin transacciones recientes.</td></tr>`;
        
        return this.sales.map(s => `
            <tr>
                <td class="ps-4">
                    <div class="fw-bold text-dark mb-0">Ticket #${s.id.substr(-6).toUpperCase()}</div>
                    <small class="text-muted">${new Date(s.timestamp).toLocaleString()}</small>
                </td>
                <td><small class="text-muted fw-bold">${s.user_id === 'admin' ? 'Administrador' : s.user_id}</small></td>
                <td class="text-center">
                    <span class="badge bg-light text-dark border rounded-pill px-3 py-2 fw-bold shadow-none">
                        <i class="bi ${s.method === 'cash' ? 'bi-cash-coin' : 'bi-credit-card'} me-1 text-primary"></i> ${s.method === 'cash' ? 'EFECTIVO' : s.method ? s.method.toUpperCase() : 'EFECTIVO'}
                    </span>
                </td>
                <td class="text-center"><span class="fw-bold text-primary h5 mb-0">$${s.total.toFixed(2)}</span></td>
                <td class="text-end pe-4">
                    <button class="btn btn-primary rounded-pill px-3 fw-bold shadow-sm btn-sm" onclick="SalesHistory.viewTicket('${s.id}')">
                        <i class="bi bi-file-text me-1 text-white"></i> VER DETALLE
                    </button>
                </td>
            </tr>
        `).join('');
    },

    async viewTicket(saleId) {
        const sale = this.sales.find(s => s.id === saleId);
        if (sale) {
            let profile = await window.Storage.get('arhez_business_profile');
            if (Array.isArray(profile)) profile = profile[0];
            this.renderTicketModal(sale, profile || {});
        }
    },

    renderTicketModal(sale, profile = {}) {
        let modalEl = document.getElementById('sale-ticket-modal');
        if (!modalEl) {
            modalEl = document.createElement('div');
            modalEl.id = 'sale-ticket-modal';
            modalEl.className = 'modal fade';
            document.body.appendChild(modalEl);
        }

        modalEl.innerHTML = `
            <div class="modal-dialog modal-dialog-centered modal-sm">
                <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div class="modal-header bg-dark text-white border-0 py-3">
                        <h6 class="modal-title fw-bold text-uppercase">Recibo Digital #${sale.id.substr(-6).toUpperCase()}</h6>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4 bg-white">
                        <div class="text-center mb-4">
                            <h4 class="fw-bold mb-0 text-dark">${profile.name || 'ARHEZ SHOP'}</h4>
                            <small class="text-muted">${profile.address || 'Sistema de Gestión POS'}</small>
                            ${profile.phone ? `<br><small class="text-muted">Tel: ${profile.phone}</small>` : ''}
                            ${profile.tax_id ? `<br><small class="text-muted">RFC: ${profile.tax_id}</small>` : ''}
                        </div>
                        
                        <div class="border-top border-bottom py-3 mb-3">
                            ${sale.items.map(item => `
                                <div class="d-flex justify-content-between mb-2 small">
                                    <span>${item.quantity} ${item.unit_measure || 'pza(s)'} x ${item.name}</span>
                                    <span class="fw-bold">$${(item.unit_price * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>

                        <div class="d-flex justify-content-between mb-1 h5 fw-bold text-primary">
                            <span>TOTAL</span>
                            <span>$${sale.total.toFixed(2)}</span>
                        </div>
                        <div class="d-flex justify-content-between text-muted small mt-3">
                            <span>PAGO:</span>
                            <span class="fw-bold text-dark">${(sale.method || 'EFECTIVO').toUpperCase()}</span>
                        </div>
                        <div class="text-center mt-4 pt-3 border-top small text-muted">
                            ${profile.ticket_footer || '¡Gracias por su preferencia!'}
                        </div>
                    </div>
                    <div class="modal-footer border-0 p-3 pt-0 bg-white">
                        <button class="btn btn-dark w-100 rounded-pill py-2 fw-bold" data-bs-dismiss="modal">CERRAR</button>
                    </div>
                </div>
            </div>
        `;

        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
    }
};

window.SalesHistory = SalesHistory;
