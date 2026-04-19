/* 
   22032026 demoService.js
   Gestión de prospectos e integración con base de datos remota.
   Actualizado para funcionar sin módulos (Protocolo file:// compatible).
*/

const SUPABASE_URL = 'https://wrjqbyntrjepvkrtautz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_aYdImCiJFZsgWe9kTsRLTw_JIB7k6nI';

let supabaseClient = null;

// 22032026 Definición global para DemoService
window.DemoService = {
    
    // 22032026 Inicialización robusta del cliente desde el objeto global window
    init() {
        if (window.supabase) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log('[DemoService] ✅ Cliente Supabase inicializado correctamente.');
        } else {
            console.error('[DemoService] ❌ Error: No se detectó la librería Supabase en el navegador.');
        }
    },

    // 22032026 Procesa el ingreso al demo
    async processDemoEntry(pioneerData) {
        if (!supabaseClient) {
            console.error('[DemoService] Cliente no inicializado.');
            return { success: false, error: 'Sistema de datos no listo.' };
        }

        try {
            // 22032026 1. Verificar si ya existe el correo en la tabla demo_leads
            const { data: existing, error: fetchError } = await supabaseClient
                .from('demo_leads')
                .select('email')
                .eq('email', pioneerData.email)
                .maybeSingle();

            if (fetchError) throw fetchError;

            if (existing) {
                // 22032026 2. Actualizar último acceso para registros existentes
                await supabaseClient
                    .from('demo_leads')
                    .update({ last_access: new Date().toISOString() })
                    .eq('email', pioneerData.email);
                return { success: true };
            } else {
                // 22032026 3. Registrar nuevo prospecto en Supabase
                const { error: insertError } = await supabaseClient
                    .from('demo_leads')
                    .insert([{
                        name: pioneerData.name,
                        company: pioneerData.company,
                        phone: pioneerData.phone,
                        email: pioneerData.email,
                        origin: pioneerData.origin
                    }]);

                if (insertError) throw insertError;
                return { success: true };
            }
        } catch (error) {
            console.error('[DemoService] Error crítico:', error);
            return { success: false, error: error.message || 'Error de conexión.' };
        }
    },

    // 13042026 Registrar Usuario Maestro en la Nube (Validación Remota)
    async registerPaidLicense(userData, planContent) {
        if (!supabaseClient) {
            console.error('[DemoService] Cliente de Supabase no disponible para registrar licencia.');
            return { success: true }; // Fallback preventivo
        }
        
        try {
            console.log('[DemoService] Registrando nueva licencia para:', userData.email);
            const { error } = await supabaseClient
                .from('saas_licenses')
                .insert([{
                    admin_name: userData.name,
                    email: userData.email,
                    password_hash: userData.password, 
                    plan: planContent,
                    payment_status: 'PAID_STRIPE',
                    created_at: new Date().toISOString()
                }]);
                
            if (error) {
                // Si la tabla no existe en la base de datos demo, lo capturamos silenciosamente
                console.warn('[DemoService] Aviso al registrar en Supabase:', error.message);
            }
            
            return { success: true };
        } catch(error) {
            console.error('[DemoService] Error guardando licencia SaaS:', error);
            return { success: true }; // Permitimos descarga para evitar bloquear flujo en el modo Demo
        }
    }
};
