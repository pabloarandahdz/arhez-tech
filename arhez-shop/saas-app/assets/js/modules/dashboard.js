/* 
   22032026 modules/dashboard.js 
   Tablero de Control General Mejorado para Arhez Shop.
   Incluye: Filtros temporales para gráficas y redimensionamiento estandarizado.
*/

const Dashboard = {
    sales: [],
    inventory: [],
    logs: [],
    currentPeriod: 'week', // 'day', 'week', 'month', 'year'
    chartInstance: null,

    async init() {
        await this.loadData();
        this.render();
        this.renderCharts();
    },

    async loadData() {
        this.sales = await window.Storage.get('sales');
        this.inventory = await window.Storage.get('inventory');
        this.logs = JSON.parse(localStorage.getItem('arhez_logs') || '[]');
        this.sales.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
    },

    // 22032026 Layout Redimensionado y Ajustado
    render() {
        const container = document.getElementById('module-render');
        
        const totalRevenue = this.sales.reduce((sum, s) => sum + s.total, 0);
        const lowStockCount = this.inventory.filter(p => p.stock_quantity <= (p.min_stock || 5)).length;

        container.innerHTML = `
            <div class="row g-3 mb-4">
                <!-- Tarjeta de Ingresos Históricos -->
                <div class="col-md-3">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100 text-white" style="background: linear-gradient(135deg, #F99D1C 0%, #e08b1a 100%)">
                        <div class="d-flex align-items-center mb-2">
                            <div class="bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center me-3" style="width: 45px; height: 45px;">
                                <i class="bi bi-wallet2 fs-5"></i>
                            </div>
                            <span class="opacity-75 small fw-bold text-uppercase ls-1">Histórico</span>
                        </div>
                        <h3 class="fw-bold mb-0 text-white">$${totalRevenue.toFixed(2)}</h3>
                    </div>
                </div>
                <!-- Tarjeta de Ventas -->
                <div class="col-md-3">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white border-bottom border-primary border-4">
                        <div class="d-flex align-items-center mb-2">
                            <div class="bg-primary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center me-3 text-primary" style="width: 45px; height: 45px;">
                                <i class="bi bi-bag-check fs-5"></i>
                            </div>
                            <span class="text-muted small fw-bold text-uppercase ls-1">Ventas</span>
                        </div>
                        <h3 class="fw-bold mb-0 text-dark">${this.sales.length}</h3>
                    </div>
                </div>
                <!-- Tarjeta de Alerta Stock -->
                <div class="col-md-3">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white border-bottom border-warning border-4">
                        <div class="d-flex align-items-center mb-2">
                            <div class="bg-warning bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center me-3 text-warning" style="width: 45px; height: 45px;">
                                <i class="bi bi-box-seam fs-5"></i>
                            </div>
                            <span class="text-muted small fw-bold text-uppercase ls-1">Stock Bajo</span>
                        </div>
                        <h3 class="fw-bold mb-0 text-dark">${lowStockCount}</h3>
                    </div>
                </div>
                <!-- Tarjeta de Inventario -->
                <div class="col-md-3">
                    <div class="card border-0 shadow-sm rounded-4 p-3 h-100 bg-white border-bottom border-info border-4">
                        <div class="d-flex align-items-center mb-2">
                            <div class="bg-info bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center me-3 text-info" style="width: 45px; height: 45px;">
                                <i class="bi bi-layers fs-5"></i>
                            </div>
                            <span class="text-muted small fw-bold text-uppercase ls-1">Catálogo</span>
                        </div>
                        <h3 class="fw-bold mb-0 text-dark">${this.inventory.length}</h3>
                    </div>
                </div>
            </div>

            <!-- Fila de Gráfica con Filtros -->
            <div class="row g-4 mb-4">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm rounded-4 h-100 bg-white">
                        <div class="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="fw-bold mb-0">Análisis de Desempeño</h5>
                                <small class="text-muted">Tendencias de ingreso por periodo</small>
                            </div>
                            <div class="btn-group btn-group-sm bg-light p-1 rounded-pill">
                                <button class="btn btn-sm rounded-pill px-3 ${this.currentPeriod === 'day' ? 'btn-primary' : 'btn-light'}" onclick="Dashboard.updatePeriod('day')">Día</button>
                                <button class="btn btn-sm rounded-pill px-3 ${this.currentPeriod === 'week' ? 'btn-primary' : 'btn-light'}" onclick="Dashboard.updatePeriod('week')">Semana</button>
                                <button class="btn btn-sm rounded-pill px-3 ${this.currentPeriod === 'month' ? 'btn-primary' : 'btn-light'}" onclick="Dashboard.updatePeriod('month')">Mes</button>
                                <button class="btn btn-sm rounded-pill px-3 ${this.currentPeriod === 'year' ? 'btn-primary' : 'btn-light'}" onclick="Dashboard.updatePeriod('year')">Año</button>
                            </div>
                        </div>
                        <div class="card-body p-4 pt-1">
                            <div style="position: relative; height: 320px; width: 100%;">
                                <canvas id="dashboardMainChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Alertas de Stock Mejoradas -->
                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm rounded-4 h-100 bg-white overflow-hidden">
                        <div class="card-header bg-white border-0 p-4">
                            <h5 class="fw-bold mb-0 text-dark small-caps">Resurtido Pendiente</h5>
                        </div>
                        <div class="card-body p-4 pt-0 overflow-auto" style="max-height: 380px;">
                            ${this.renderStockList()}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bitácora de Actividad Reciente -->
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
                <div class="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                    <h5 class="fw-bold mb-0">Trazabilidad de Operación</h5>
                    <button class="btn btn-light btn-sm rounded-pill px-3 fw-bold border" onclick="Dashboard.init()">Actualizar</button>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="bg-light">
                                <tr class="small-caps text-muted">
                                    <th class="ps-4 py-3 border-0">Colaborador</th>
                                    <th class="border-0">Actividad</th>
                                    <th class="border-0">Momento</th>
                                </tr>
                            </thead>
                            <tbody class="small">${this.renderLogs()}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },

    renderStockList() {
        const lowStock = this.inventory.filter(p => p.stock_quantity <= (p.min_stock || 5));
        if (lowStock.length === 0) return `<div class="text-center py-5"><i class="bi bi-check-all display-4 text-success opacity-25"></i><p class="mt-2 text-muted small">Todo bajo control</p></div>`;
        
        return lowStock.map(p => `
            <div class="d-flex align-items-center p-3 rounded-4 bg-light mb-3 border-start border-warning border-4 shadow-sm">
                <div class="flex-grow-1">
                    <div class="fw-bold text-dark small">${p.name}</div>
                    <small class="text-muted">Stock: <span class="text-danger fw-bold">${p.stock_quantity}</span> (Mín: ${p.min_stock})</small>
                </div>
                <button class="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 fw-bold" style="font-size: 0.65rem;" onclick="App.loadModule('inventory')">REABASTECER</button>
            </div>
        `).join('');
    },

    renderLogs() {
        if (this.logs.length === 0) return `<tr><td colspan="3" class="text-center py-5 text-muted small opacity-50 italic">Sin registros de auditoría aún.</td></tr>`;
        return this.logs.slice(0, 6).map(log => `
            <tr>
                <td class="ps-4">
                    <span class="fw-bold text-dark">${log.user_name}</span>
                </td>
                <td><small class="text-secondary">${log.description}</small></td>
                <td><small class="text-muted">${log.timestamp.split(',')[1] || log.timestamp}</small></td>
            </tr>
        `).join('');
    },

    updatePeriod(period) {
        this.currentPeriod = period;
        this.render();
        this.renderCharts();
    },

    renderCharts() {
        const ctx = document.getElementById('dashboardMainChart').getContext('2d');
        if (this.chartInstance) this.chartInstance.destroy();

        const groupedData = this.groupSalesByPeriod();
        
        this.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: groupedData.labels,
                datasets: [{
                    label: 'Ventas ($)',
                    data: groupedData.values,
                    backgroundColor: '#F99D1C',
                    borderRadius: 8,
                    barThickness: 20
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { drawBorder: false, color: '#f0f0f0' } },
                    x: { grid: { display: false }, border: { display: false } }
                }
            }
        });
    },

    groupSalesByPeriod() {
        const data = { labels: [], values: [] };
        const now = new Date();
        const map = {};

        this.sales.forEach(s => {
            const date = new Date(s.timestamp);
            let key = '';

            if (this.currentPeriod === 'day') {
                if (date.toDateString() === now.toDateString()) {
                    key = date.getHours() + ':00';
                } else return;
            } else if (this.currentPeriod === 'week') {
                const diff = (now - date) / (1000 * 60 * 60 * 24);
                if (diff <= 7) key = date.toLocaleDateString('es-ES', { weekday: 'short' });
                else return;
            } else if (this.currentPeriod === 'month') {
                if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
                    key = 'Día ' + date.getDate();
                } else return;
            } else if (this.currentPeriod === 'year') {
                if (date.getFullYear() === now.getFullYear()) {
                    key = date.toLocaleDateString('es-ES', { month: 'short' });
                } else return;
            }

            map[key] = (map[key] || 0) + s.total;
        });

        data.labels = Object.keys(map);
        data.values = Object.values(map);
        return data;
    }
};

window.Dashboard = Dashboard;
