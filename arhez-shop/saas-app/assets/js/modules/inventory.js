/* 
   22032026 modules/inventory.js 
   Módulo de Gestión de Inventarios para Arhez Shop.
   Actualizado: Español estricto, iconos con fondo estandarizados y altos contrastes.
*/

const Inventory = {
    items: [],

    init() {
        this.loadData();
        this.render();
    },

    async loadData() {
        this.items = await window.Storage.get('inventory');
    },

    // 22032026 Diseño Estandarizado Arhez Premium
    render() {
        const container = document.getElementById('module-render');
        const totalValue = this.items.reduce((sum, i) => sum + (i.unit_price * i.stock_quantity), 0);
        const lowStock = this.items.filter(i => i.stock_quantity <= (i.min_stock || 5)).length;

        container.innerHTML = `
            <div class="row g-3 mb-4">
                <div class="col-md-6">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100 text-white" style="background: linear-gradient(135deg, #F99D1C 0%, #e08b1a 100%)">
                        <div class="d-flex align-items-center mb-2">
                            <div class="bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center me-3 text-white" style="width: 45px; height: 45px;">
                                <i class="bi bi-currency-exchange fs-5"></i>
                            </div>
                            <span class="opacity-75 small fw-bold text-uppercase ls-1">Valor de Inventario</span>
                        </div>
                        <h3 class="fw-bold mb-0 text-white">$${totalValue.toFixed(2)}</h3>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white border-bottom border-danger border-4">
                        <div class="d-flex align-items-center mb-2">
                            <div class="bg-danger bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center me-3 text-danger" style="width: 45px; height: 45px;">
                                <i class="bi bi-box-arrow-down fs-5"></i>
                            </div>
                            <span class="text-muted small fw-bold text-uppercase ls-1">Productos por Agotarse</span>
                        </div>
                        <h3 class="fw-bold mb-0 text-dark">${lowStock} Alertas</h3>
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div class="card-header bg-white border-0 p-4">
                    <div class="row align-items-center">
                        <div class="col-md-6 d-flex align-items-center">
                            <div class="bg-primary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center me-3 text-primary" style="width: 45px; height: 45px;">
                                <i class="bi bi-box-seam fs-5"></i>
                            </div>
                            <div>
                                <h5 class="fw-bold mb-0">Listado de Existencias</h5>
                                <small class="text-muted">Gestión de stock y codificación</small>
                            </div>
                        </div>
                        <div class="col-md-6 d-flex gap-3">
                            <div class="input-group shadow-sm rounded-pill overflow-hidden bg-light border-0">
                                <span class="input-group-text bg-light border-0 ps-3 text-muted"><i class="bi bi-search"></i></span>
                                <input type="text" class="form-control bg-light border-0 py-2 small" id="inv-search" placeholder="Buscar por SKU o nombre...">
                            </div>
                            <button class="btn btn-light rounded-pill px-3 fw-bold border shadow-sm" onclick="Inventory.init()" title="Refrescar datos">
                                <i class="bi bi-arrow-clockwise text-primary"></i>
                            </button>
                            <button class="btn btn-primary rounded-pill px-4 fw-bold flex-shrink-0 shadow-sm" onclick="Inventory.showAddModal()">
                                <i class="bi bi-plus-lg me-1 text-white"></i> AGREGAR
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive" style="max-height: calc(100vh - 250px);">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light sticky-top">
                                <tr>
                                    <th class="ps-4 py-3 text-muted fw-bold small">PRODUCTO / CÓDIGO</th>
                                    <th class="text-muted fw-bold small">CATEGORÍA</th>
                                    <th class="text-muted fw-bold small">PRECIO VENTA</th>
                                    <th class="text-muted fw-bold small">EXISTENCIAS</th>
                                    <th class="text-end pe-4 text-muted fw-bold small">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody id="inventory-table-body">${this.renderRows()}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        this.attachListeners();
    },

    renderRows(filter = '') {
        const filtered = this.items.filter(i => i.name.toLowerCase().includes(filter.toLowerCase()) || i.sku.toLowerCase().includes(filter.toLowerCase()));
        if (filtered.length === 0) return `<tr><td colspan="5" class="text-center py-5 opacity-50"><i class="bi bi-inbox display-6 d-block mb-3"></i> Sin resultados en la búsqueda.</td></tr>`;
        
        return filtered.map(i => `
            <tr>
                <td class="ps-4">
                    <div class="d-flex align-items-center">
                        ${i.image_url ? `<img src="${i.image_url}" class="rounded-3 me-3 border shadow-sm" style="width: 45px; height: 45px; object-fit: cover;">` : `<div class="bg-light border shadow-sm rounded-3 d-flex align-items-center justify-content-center me-3 text-muted" style="width: 45px; height: 45px;"><i class="bi bi-image"></i></div>`}
                        <div>
                            <div class="fw-bold text-dark">${i.name}</div>
                            <small class="text-muted font-monospace">${i.sku}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge border bg-white text-secondary rounded-pill px-2 fw-normal">${i.category}</span></td>
                <td><span class="fw-bold text-primary">$${i.unit_price.toFixed(2)}</span></td>
                <td>
                    <div class="d-flex align-items-center">
                        <span class="badge ${i.stock_quantity <= (i.min_stock || 5) ? 'bg-danger text-white' : 'bg-success text-white'} rounded-pill px-3 py-2 fw-bold">
                            ${i.stock_quantity} ${i.unit_measure || 'unidades'}
                        </span>
                        ${i.stock_quantity <= (i.min_stock || 5) ? '<i class="bi bi-exclamation-triangle-fill text-danger ms-2" title="Requiere abastecimiento"></i>' : ''}
                    </div>
                </td>
                <td class="text-end pe-4">
                    <button class="btn btn-icon btn-light border rounded-circle me-1" onclick="Inventory.showEditModal('${i.id}')" title="Editar"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-icon btn-outline-danger border rounded-circle" onclick="Inventory.handleDelete('${i.id}')" title="Eliminar"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `).join('');
    },

    async handleDelete(id) {
        const item = this.items.find(i => i.id === id);
        if (item && confirm(`¿Estás seguro de eliminar el producto "${item.name}"?`)) {
            this.items = this.items.filter(i => i.id !== id);
            await window.Storage.save('inventory', this.items);
            this.render();
            window.App?.showToast('🗑️ Producto eliminado correctamente.', 'danger');
        }
    },

    showAddModal() { this.renderFormModal('NUEVO PRODUCTO'); },
    showEditModal(id) { const item = this.items.find(i => i.id === id); if (item) this.renderFormModal('EDITAR PRODUCTO', item); },

    renderFormModal(title, item = null) {
        const titleEl = document.getElementById('inv-modal-title');
        const bodyEl = document.getElementById('inv-modal-body');
        
        titleEl.innerHTML = `<i class="bi ${item ? 'bi-pencil-square' : 'bi-plus-circle-fill'} me-2 text-white"></i> ${title}`;
        bodyEl.innerHTML = `
            <div class="row g-3">
                <input type="hidden" id="inv-id" value="${item ? item.id : ''}">
                <div class="col-12">
                    <label class="form-label small fw-bold text-muted">NOMBRE DEL PRODUCTO</label>
                    <input type="text" class="form-control border-0 bg-light p-3 rounded-3" id="inv-name" value="${item ? item.name : ''}" placeholder="Ej. Leche Deslactosada">
                </div>
                <div class="col-md-6">
                    <label class="form-label small fw-bold text-muted">CÓDIGO / SKU</label>
                    <input type="text" class="form-control border-0 bg-light p-3 rounded-3" id="inv-sku" value="${item ? item.sku : ''}" placeholder="C-0001">
                </div>
                <div class="col-md-6">
                    <label class="form-label small fw-bold text-muted">CATEGORÍA</label>
                    <input type="text" class="form-control border-0 bg-light p-3 rounded-3" id="inv-cat" value="${item ? item.category : 'General'}">
                </div>
                <div class="col-md-6">
                    <label class="form-label small fw-bold text-muted">PRECIO VENTA</label>
                    <div class="input-group">
                        <span class="input-group-text border-0 bg-light fw-bold text-muted">$</span>
                        <input type="number" step="0.01" class="form-control border-0 bg-light p-3 rounded-end-3 fw-bold text-primary" id="inv-price" value="${item ? item.unit_price : ''}">
                    </div>
                </div>
                <div class="col-md-6">
                    <label class="form-label small fw-bold text-muted">UNIDADES DISPONIBLES</label>
                    <input type="number" step="any" class="form-control border-0 bg-light p-3 rounded-3 fw-bold" id="inv-stock" value="${item ? item.stock_quantity : '0'}">
                </div>
                <div class="col-md-4">
                    <label class="form-label small fw-bold text-muted">UNIDAD DE MED. (Ej: Pza, Kg)</label>
                    <input type="text" class="form-control border-0 bg-light p-3 rounded-3" id="inv-unit" value="${item ? (item.unit_measure || 'pza') : 'pza'}" placeholder="pza, kg, lt...">
                </div>
                <div class="col-md-4">
                    <label class="form-label small fw-bold text-muted">STOCK MÍNIMO (ALERTA)</label>
                    <input type="number" step="any" class="form-control border-0 bg-light p-3 rounded-3 fw-bold text-danger" id="inv-min" value="${item ? (item.min_stock || 5) : '5'}">
                </div>
                <div class="col-md-4">
                    <label class="form-label small fw-bold text-muted">IMAGEN (URL WEB)</label>
                    <input type="url" class="form-control border-0 bg-light p-3 rounded-3" id="inv-image" value="${item ? (item.image_url || '') : ''}" placeholder="https://...">
                </div>
            </div>
        `;

        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('inventory-form-modal'));
        modal.show();
    },

    async handleSave() {
        const id = document.getElementById('inv-id').value;
        const name = document.getElementById('inv-name').value;
        if (!name) return window.App?.showToast('El nombre es obligatorio', 'danger');

        const newData = {
            id: id || 'P' + Date.now(),
            name: name,
            sku: document.getElementById('inv-sku').value,
            category: document.getElementById('inv-cat').value,
            unit_price: parseFloat(document.getElementById('inv-price').value) || 0,
            stock_quantity: parseFloat(document.getElementById('inv-stock').value) || 0,
            min_stock: parseFloat(document.getElementById('inv-min').value) || 5,
            unit_measure: document.getElementById('inv-unit').value || 'pza',
            image_url: document.getElementById('inv-image').value || ''
        };

        if (id) {
            const idx = this.items.findIndex(i => i.id === id);
            this.items[idx] = newData;
            window.App?.logAction('STOCK_UPDATE', `Edición de producto: ${name}`);
        } else {
            this.items.push(newData);
            window.App?.logAction('STOCK_ADD', `Registro de producto: ${name}`);
        }

        await window.Storage.save('inventory', this.items);
        
        // Cierre Seguro y Forzado
        const btnRef = document.getElementById('close-inv-modal');
        if (btnRef) btnRef.click(); 
        
        this.render();
        window.App?.showToast('✅ Cambios guardados correctamente.');
    },

    attachListeners() {
        const input = document.getElementById('inv-search');
        if (input) input.addEventListener('input', (e) => { document.getElementById('inventory-table-body').innerHTML = this.renderRows(e.target.value); });
    }
};

window.Inventory = Inventory;
