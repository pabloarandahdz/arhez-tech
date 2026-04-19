-- 22032026 Script para creación de tabla de prospectos (leads)
-- Este script crea la tabla necesaria para capturar interesados en el demo.

CREATE TABLE IF NOT EXISTS demo_leads (
    uuid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    origin TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_access TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE demo_leads ENABLE ROW LEVEL SECURITY;

-- Política de inserción pública (Cualquiera puede registrarse)
CREATE POLICY "Permitir inserción pública" 
ON demo_leads FOR INSERT 
WITH CHECK (true);

-- Política de lectura pública
CREATE POLICY "Permitir lectura para verificación" 
ON demo_leads FOR SELECT 
USING (true);

-- Política de actualización de acceso
CREATE POLICY "Permitir actualización de acceso" 
ON demo_leads FOR UPDATE 
USING (true);

-- 13042026 Tabla de Licencias Oficiales (Ventas del SaaS)
CREATE TABLE IF NOT EXISTS saas_licenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    plan TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- Habilitar RLS para Licencias
ALTER TABLE saas_licenses ENABLE ROW LEVEL SECURITY;

-- Permitir inserción para nuevas compras
CREATE POLICY "Permitir registro de licencia tras cobro"
ON saas_licenses FOR INSERT
WITH CHECK (true);

-- Permitir validación de inicio de sesión desde el SaaS instalado (para que el app compruebe si se pagó)
CREATE POLICY "Permitir verificación de licencia en app local"
ON saas_licenses FOR SELECT
USING (true);
