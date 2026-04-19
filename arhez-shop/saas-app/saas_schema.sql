-- 22032026 saas_schema.sql
-- Estructura de base de datos para Arhez Shop SaaS (Versión Local e Híbrida)

-- 1. Tabla de Comercios
CREATE TABLE IF NOT EXISTS businesses (
    business_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID, -- Referencia al primer administrador
    business_name TEXT NOT NULL,
    business_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Usuarios y Roles
CREATE TABLE IF NOT EXISTS users (
    user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(business_id),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'employee', 'manager')) DEFAULT 'employee',
    status TEXT DEFAULT 'active',
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Inventarios
CREATE TABLE IF NOT EXISTS inventory (
    item_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(business_id),
    name TEXT NOT NULL,
    sku TEXT,
    category TEXT,
    stock_quantity INTEGER DEFAULT 0,
    unit_price DECIMAL(10,2) DEFAULT 0.00,
    cost_price DECIMAL(10,2) DEFAULT 0.00,
    min_stock INTEGER DEFAULT 5,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Ventas (Cabecera)
CREATE TABLE IF NOT EXISTS sales (
    sale_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(business_id),
    user_id UUID REFERENCES users(user_id),
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT, -- cash, card, transfer
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de Detalles de Venta
CREATE TABLE IF NOT EXISTS sale_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sale_id UUID REFERENCES sales(sale_id),
    item_id UUID REFERENCES inventory(item_id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- 6. Tabla de Registros de Trazabilidad (Logs)
-- Esta tabla cumple el requerimiento de quién, cuándo y qué se hizo.
CREATE TABLE IF NOT EXISTS action_logs (
    log_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(business_id),
    user_id UUID REFERENCES users(user_id),
    action_type TEXT NOT NULL, -- 'SALE', 'STOCK_UPDATE', 'USER_LOGIN', etc.
    description TEXT NOT NULL,
    metadata JSONB, -- Detalles extra si es necesario
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Gestión Financiera (Gastos e Ingresos Extra)
CREATE TABLE IF NOT EXISTS financial_records (
    record_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(business_id),
    type TEXT CHECK (type IN ('income', 'expense')),
    category TEXT,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS en todas las tablas para que solo el business_id correspondiente pueda ver sus datos
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;

-- Nota: Las políticas RLS se aplicarán basándose en el user_id y business_id autenticados.
