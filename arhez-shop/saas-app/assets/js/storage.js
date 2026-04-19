const CONFIG = {
    use_api: true, // MODO PRODUCCIÓN: Conectado a SQL Local (Node.js/Express)
    api_url: 'http://localhost:3000/api'
};

const StorageService = {
    
    // 22032026 Guardar datos (Ventas, Inventario, Logs) - Híbrido SQL / Local
    async save(collection, data) {
        if (CONFIG.use_api) {
            // Asegurar ID obligatorio para que SQL pueda hacer merge (INSERT OR REPLACE)
            if (!Array.isArray(data)) {
                data.id = data.id || 'ID-' + Math.random().toString(36).substr(2, 9);
            }
            try {
                const response = await fetch(`${CONFIG.api_url}/${collection}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                window.App?.notifyUpdate();
                return result;
            } catch (err) {
                console.warn('Servidor SQL local no disponible. Cayendo en LocalStorage.', err);
            }
        }

        // --- Lógica LocalStorage (Demo) ---
        const storageKey = `arhez_${collection}`;
        let currentData = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        if (!Array.isArray(data)) {
            data.id = data.id || 'ID-' + Math.random().toString(36).substr(2, 9); // Generar ID si no existe
            data.created_at = new Date().toISOString();
            currentData.push(data);
        } else {
            currentData = data;
        }

        localStorage.setItem(storageKey, JSON.stringify(currentData));
        console.log(`[Storage] Guardado exitoso en: ${collection} (LocalStorage)`);
        window.App?.notifyUpdate();
        return { success: true, data: data };
    },

    // 22032026 Obtener datos de una colección específica
    async get(collection) {
        if (CONFIG.use_api) {
            try {
                const res = await fetch(`${CONFIG.api_url}/${collection}`);
                return await res.json();
            } catch (err) {
                console.warn('API SQL no responde, usando LocalStorage');
            }
        }
        const storageKey = `arhez_${collection}`;
        return JSON.parse(localStorage.getItem(storageKey) || '[]');
    },

    // 22032026 Eliminar registro específico
    async delete(collection, id) {
        if (CONFIG.use_api) {
            try {
                await fetch(`${CONFIG.api_url}/${collection}/${id}`, { method: 'DELETE' });
                window.App?.notifyUpdate();
                return { success: true };
            } catch (err) {
                console.warn('Fallo DELETE en API, usando LocalStorage');
            }
        }
        const storageKey = `arhez_${collection}`;
        let currentData = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updatedData = currentData.filter(item => item.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(updatedData));
        window.App?.notifyUpdate();
        return { success: true };
    },

    // 22032026 Buscador inteligente (Para inventarios y ventas)
    async find(collection, queryKey, queryValue) {
        const data = await this.get(collection);
        return data.filter(item => item[queryKey] && item[queryKey].toString().toLowerCase().includes(queryValue.toLowerCase()));
    }
};

// 22032026 Definición global para ser accesible por core.js y módulos
window.Storage = StorageService;
