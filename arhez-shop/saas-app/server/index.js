/* 
   22032026 server/index.js 
   Servidor de API SQL Local para Arhez Shop SaaS.
   Puente dinámico entre Frontend y Base de Datos SQL.
*/

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

require('dotenv').config(); // 22032026 Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;
const DB_NAME = process.env.DB_NAME || 'arhez_shop.db';

app.use(cors());
app.use(bodyParser.json());

// 13042026 Servir archivos estáticos relativos al paquete (.zip extraído)
const rootPath = path.resolve(__dirname, '../'); 
console.log('Serving from:', rootPath);

// Todo el frontend SaaS está justo en esa raíz
app.use('/app', express.static(rootPath)); // Dashboard en http://localhost:3000/app/

// Ruta explícita para asegurar que el root sirva el index.html
app.get('/app/', (req, res) => {
    res.sendFile(path.join(rootPath, 'index.html'));
});

// 1. Inicializar Base de Datos SQLite (Archivo local desde env)
const dbPath = path.resolve(__dirname, DB_NAME);
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Error abriendo DB:', err);
    else console.log('Conectado a SQL Local (SQLite):', dbPath);
});

// 2. Crear tablas y Sembrar Superusuario Inicial
db.serialize(() => {
    console.log('🛠️ Verificando tablas en base de datos...');
    
    db.run(`CREATE TABLE IF NOT EXISTS inventory (id TEXT PRIMARY KEY, name TEXT, sku TEXT, category TEXT, stock_quantity INTEGER, unit_price DECIMAL, min_stock INTEGER, image_url TEXT, unit_measure TEXT, created_at TEXT)`);
    db.run(`ALTER TABLE inventory ADD COLUMN image_url TEXT`, (err) => {});
    db.run(`ALTER TABLE inventory ADD COLUMN unit_measure TEXT`, (err) => {});
    db.run(`CREATE TABLE IF NOT EXISTS sales (id TEXT PRIMARY KEY, total DECIMAL, method TEXT, timestamp TEXT, items TEXT, user_id TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS financial_records (id TEXT PRIMARY KEY, type TEXT, description TEXT, category TEXT, amount DECIMAL, timestamp TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS arhez_users (id TEXT PRIMARY KEY, name TEXT, email TEXT, password TEXT, role TEXT, permissions TEXT, business TEXT, created_at TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS arhez_business_profile (id TEXT PRIMARY KEY, name TEXT, address TEXT, phone TEXT, email TEXT, tax_id TEXT, currency TEXT, tax_percentage DECIMAL, include_tax INTEGER, ticket_footer TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS arhez_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, user_name TEXT, type TEXT, description TEXT, timestamp TEXT)`);

    console.log('✅ Estructura de tablas SQL lista.');

    // 22032026 Sembrado de cuenta maestra automática (Sincronizado con .env)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@arhez.com';
    const adminPass = process.env.ADMIN_PASS || 'admin'; 

    db.get("SELECT * FROM arhez_users WHERE email = ?", [adminEmail], (err, row) => {
        if (!err && !row) {
            const perms = JSON.stringify(['pos', 'inventory', 'sales-history', 'finance', 'employees', 'dashboard', 'settings']);
            db.run(`INSERT INTO arhez_users (id, name, email, password, role, permissions, business, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                ['admin', 'Administrador Maestro', adminEmail, adminPass, 'admin', perms, 'Arhez Shop Matriz', new Date().toISOString()],
                (err) => {
                    if (err) console.error('❌ Error sembrando admin:', err.message);
                    else console.log(`✅ Superusuario configurado: ${adminEmail} / ${adminPass}`);
                }
            );
        } else {
            // Sincronizar contraseña siempre con el valor actual deseado del .env
            db.run(`UPDATE arhez_users SET password = ? WHERE email = ?`, [adminPass, adminEmail]);
            console.log(`ℹ️ Sistema listo. Superusuario detectado y sincronizado: ${adminEmail} / ${adminPass}`);
        }
    });
});

// 3. Rutas Genéricas API
// Obtener todos
app.get('/api/:collection', (req, res) => {
    const { collection } = req.params;
    db.all(`SELECT * FROM ${collection} ORDER BY rowid DESC`, [], (err, rows) => {
        if (err) {
            console.error(`❌ Error consultando ${collection}:`, err.message);
            return res.status(500).json({ error: err.message });
        }
        
        try {
            const data = rows.map(r => {
                const item = { ...r };
                if (item.items && typeof item.items === 'string') {
                    try { item.items = JSON.parse(item.items); } catch(e) {}
                }
                if (item.permissions && typeof item.permissions === 'string') {
                    try { item.permissions = JSON.parse(item.permissions); } catch(e) {}
                }
                return item;
            });
            res.json(data);
        } catch (parseErr) {
            console.error('❌ Error formateando respuesta JSON:', parseErr);
            res.status(500).json({ error: "Error de formato de datos" });
        }
    });
});

// Guardar o Actualizar (Robusto: Soporta ARREGLOS y filtrado automático de columnas)
app.post('/api/:collection', (req, res) => {
    const { collection } = req.params;
    const rawData = req.body;
    const items = Array.isArray(rawData) ? rawData : [rawData];

    // Obtener estructura de la tabla para filtrar campos inválidos
    db.all(`PRAGMA table_info(${collection})`, (err, columns) => {
        if (err) return res.status(500).json({ error: "Error de esquema" });
        
        const validKeys = columns.map(c => c.name);
        
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            let errors = [];

            items.forEach(item => {
                const filteredData = {};
                Object.keys(item).forEach(k => {
                    if (validKeys.includes(k)) filteredData[k] = item[k];
                });

                const keys = Object.keys(filteredData);
                if (keys.length > 0) {
                    const placeholders = keys.map(() => '?').join(',');
                    const values = keys.map(k => typeof filteredData[k] === 'object' ? JSON.stringify(filteredData[k]) : filteredData[k]);
                    const sql = `INSERT OR REPLACE INTO ${collection} (${keys.join(',')}) VALUES (${placeholders})`;
                    db.run(sql, values, (err) => { if (err) errors.push(err.message); });
                }
            });

            db.run("COMMIT", (err) => {
                if (err || errors.length > 0) {
                    console.error(`❌ Error en transacción ${collection}:`, err || errors);
                    return res.status(500).json({ error: "Fallo parcial o total", details: errors });
                }
                res.json({ success: true, count: items.length });
            });
        });
    });
});

// Eliminar
app.delete('/api/:collection/:id', (req, res) => {
    const { collection, id } = req.params;
    db.run(`DELETE FROM ${collection} WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// 13042026 Ruta de auto-apagado remoto (Cuando se cierra la UI)
app.post('/api/shutdown', (req, res) => {
    console.log('\n🛑 Solicitud de cierre de ventana recibida.');
    console.log('Apagando el motor de Arhez Shop local de forma segura...');
    res.json({ success: true, message: 'Cerrando Node.js...' });
    
    // Dejar terminar la peticion y abortar proceso de consola local
    setTimeout(() => {
        process.exit(0);
    }, 1000);
});

app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`🚀 ARHEZ SHOP - SERVIDOR FULLSTACK v2`);
    console.log(`🏠 Landing: http://localhost:${PORT}/`);
    console.log(`📦 Dash:    http://localhost:${PORT}/app/`);
    console.log(`========================================\n`);
    console.log(`💡 Cambia CONFIG.use_api = true en assets/js/storage.js para conectar.`);
});
