/* 
   22032026 modules/pos.js 
   Módulo de Punto de Venta (POS) para Arhez Shop.
   Actualizado: Español estricto, iconos con fondo, alto contraste y sin espanglish.
*/

const POS = {
    cart: [],
    products: [],
    currentPaymentMethod: 'cash',

    init() {
        this.loadProducts();
        this.render();
    },

    async loadProducts() {
        this.products = await window.Storage.get('inventory');
    },

    // 22032026 Interfaz en español con iconos estandarizados
    render() {
        const container = document.getElementById('module-render');
        container.innerHTML = `
            <div class="row g-4 h-100 pb-5">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                        <div class="card-header bg-white border-0 p-4">
                            <div class="row align-items-center">
                                <div class="col-md-6 mb-3 mb-md-0 d-flex align-items-center">
                                    <div class="bg-primary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center me-3 text-primary" style="width: 45px; height: 45px;">
                                        <i class="bi bi-tag fs-5"></i>
                                    </div>
                                    <div>
                                        <h5 class="fw-bold mb-0">Listado de Productos</h5>
                                        <small class="text-muted">Selección rápida de catálogo</small>
                                    </div>
                                </div>
                                <div class="col-md-6 d-flex gap-2">
                                    <input type="text" class="form-control rounded-pill border-0 bg-light px-4 py-2 small" id="pos-search" placeholder="Filtrar por nombre...">
                                    <button class="btn btn-light rounded-pill border px-3 shadow-sm fw-bold" onclick="POS.init()" title="Sincronizar Stock">
                                        <i class="bi bi-arrow-clockwise text-primary"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body p-4 overflow-auto" style="max-height: 70vh;">
                            <div class="row g-3" id="pos-product-grid">${this.renderProductGrid()}</div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card border-0 shadow-lg rounded-4 h-100 bg-white d-flex flex-column">
                        <div class="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
                            <h5 class="fw-bold mb-0 text-primary">Detalle de Venta</h5>
                            <span class="badge bg-primary rounded-pill px-3">${this.cart.reduce((a, b) => a + b.quantity, 0)} artículos</span>
                        </div>
                        <div class="card-body p-4 flex-grow-1 overflow-auto" id="pos-cart-list">${this.renderCartItems()}</div>
                        <div class="card-footer bg-light border-0 p-4 rounded-bottom-4">
                            <div class="d-flex justify-content-between mb-4">
                                <h3 class="fw-bold mb-0">TOTAL</h3>
                                <h3 class="fw-bold text-primary mb-0">$${this.calculateTotal().toFixed(2)}</h3>
                            </div>
                            <button class="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow text-uppercase" onclick="POS.showCheckoutModal()" ${this.cart.length === 0 ? 'disabled' : ''}>
                                <i class="bi bi-check2-circle me-2"></i> Procesar Pago
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.attachListeners();
    },

    renderProductGrid(filter = '') {
        const filtered = this.products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
        return filtered.map(p => `
            <div class="col-6 col-md-4 col-xl-3">
                <div class="card border-0 shadow-sm p-3 h-100 text-center cursor-pointer shadow-hover rounded-4 border-bottom border-primary border-4" onclick="POS.addToCart('${p.id}')">
                    ${p.image_url ? `<img src="${p.image_url}" class="rounded-4 mb-3 mx-auto d-block border shadow-sm" style="width: 60px; height: 60px; object-fit: cover;">` : `<div class="bg-primary bg-opacity-10 rounded-4 mb-3 py-3 text-primary d-flex align-items-center justify-content-center mx-auto" style="width: 60px; height: 60px;">
                        <i class="bi bi-box fs-3"></i>
                    </div>`}
                    <div class="fw-bold text-truncate small text-dark">${p.name}</div>
                    <div class="text-primary fw-bold mt-1">$${p.unit_price.toFixed(2)}</div>
                    <div class="small text-muted mt-1" style="font-size: 0.65rem;">Stock: ${p.stock_quantity} ${p.unit_measure || 'pza'}</div>
                </div>
            </div>
        `).join('');
    },

    renderCartItems() {
        if (this.cart.length === 0) return `<div class="text-center py-5 opacity-50"><i class="bi bi-cart-x display-4 d-block mb-3"></i>Carrito vacío</div>`;
        return this.cart.map(item => `
            <div class="bg-light rounded-4 mb-3 p-3 border">
                <div class="d-flex justify-content-between mb-2">
                    <div class="fw-bold small text-truncate pe-2">${item.name}</div>
                    <div class="fw-bold text-primary">$${(item.unit_price * item.quantity).toFixed(2)}</div>
                </div>
                <div class="d-flex align-items-center">
                    <div class="btn-group btn-group-sm bg-white border rounded-pill overflow-hidden">
                        <button class="btn btn-light px-3" onclick="POS.updateQuantity('${item.id}', -1)">-</button>
                        <span class="px-3 py-1 fw-bold small bg-white d-flex align-items-center">${item.quantity}</span>
                        <button class="btn btn-light px-3" onclick="POS.updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    updateQuantity(id, delta) {
        const item = this.cart.find(c => c.id === id);
        if (item) { item.quantity += delta; if (item.quantity <= 0) this.cart = this.cart.filter(c => c.id !== id); this.render(); }
    },

    addToCart(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            const inCart = this.cart.find(c => c.id === id);
            if (inCart) inCart.quantity++; else this.cart.push({ ...product, quantity: 1 });
            this.render();
        }
    },

    calculateTotal() { return this.cart.reduce((total, item) => total + (item.unit_price * item.quantity), 0); },

    // 22032026 Modal de cobro corregido en español
    showCheckoutModal() {
        const total = this.calculateTotal();
        document.getElementById('checkout-total-display').innerText = total.toFixed(2);
        this.currentPaymentMethod = 'cash';
        document.getElementById('pay-cash').checked = true;
        this.switchPaymentMethod('cash');
        
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('pos-checkout-modal'));
        modal.show();
    },

    switchPaymentMethod(method) {
        this.currentPaymentMethod = method;
        const cashF = document.getElementById('payment-cash-fields');
        const nonCashF = document.getElementById('payment-non-cash-fields');
        if (method === 'cash') { cashF.classList.remove('d-none'); nonCashF.classList.add('d-none'); this.calculateChange(); } 
        else { cashF.classList.add('d-none'); nonCashF.classList.remove('d-none'); }
    },

    calculateChange() {
        const total = this.calculateTotal();
        const rec = parseFloat(document.getElementById('checkout-received').value) || 0;
        const change = rec - total;
        const disp = document.getElementById('checkout-change-display');
        disp.innerText = `$ ${Math.max(0, change).toFixed(2)}`;
        disp.className = change >= 0 ? 'mb-0 fw-bold text-success' : 'mb-0 fw-bold text-danger';
    },

    async confirmCheckout() {
        const total = this.calculateTotal();
        const method = this.currentPaymentMethod;
        let received = total;
        
        if (method === 'cash') { 
            received = parseFloat(document.getElementById('checkout-received').value) || 0; 
            if (received < total) return alert('El monto recibido es insuficiente.');
        } else {
            if (!document.getElementById('checkout-verified-bank').checked) return alert('Debes confirmar que el pago fue validado.');
        }

        const saleData = {
            id: 'V-' + Date.now(),
            items: this.cart,
            total,
            method,
            user_id: window.App?.user?.id || 'anonimo',
            timestamp: new Date().toISOString()
        };

        await window.Storage.save('sales', saleData);
        
        // DESCONTAR INVENTARIO
        for (let item of this.cart) {
            const productIndex = this.products.findIndex(p => p.id === item.id);
            if (productIndex !== -1) {
                this.products[productIndex].stock_quantity -= item.quantity;
            }
        }
        await window.Storage.save('inventory', this.products);

        window.App?.logAction('VENTA_COMPLETADA', `Venta registrada por $${total.toFixed(2)} [${method.toUpperCase()}]`);

        // --- PURGA MANUAL POS ---
        const modalEl = document.getElementById('pos-checkout-modal');
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
        
        modalEl.style.display = 'none';
        modalEl.classList.remove('show');
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
        // --- FIN PURGA ---

        this.cart = [];
        this.render();
        window.App?.showToast('🚀 Venta registrada con éxito.');
    },

    attachListeners() {
        const search = document.getElementById('pos-search');
        if (search) search.addEventListener('input', (e) => { document.getElementById('pos-product-grid').innerHTML = this.renderProductGrid(e.target.value); });
    }
};

window.POS = POS;
