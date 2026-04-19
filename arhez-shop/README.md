# Arhez Shop - Gestión Empresarial Inteligente

Plataforma integral de gestión de negocios comerciales. Elaborada por **Arhez Tech** del **Ing. Juan Pablo Aranda Hernandez**.

## 🏢 Estructura del Proyecto
El software está diseñado bajo una arquitectura de **SaaS Local Híbrido**, permitiendo una operación rápida y segura con persistencia en base de datos SQL.

1.  **Landing Page Pública (`/`)**: Sitio web promocional y captación.
2.  **SaaS Application Core (`/saas-app`)**: El software de gestión (POS, Inventario, Finanzas, Empleados).
3.  **SQL Backend Server (`/saas-app/server`)**: Motor de persistencia SQL local con Auto-Seeding.

---

## 🚀 Guía de Instalación "Clone & Work"
Sigue estos pasos para poner el sistema en marcha desde cero:

### 1. Clonar el Repositorio
```bash
git clone https://github.com/pabloarandahdz/arhez-shop.git
cd arhez-shop
```

### 2. Configurar el Servidor SQL (Backend)
Navega a la carpeta del servidor e instala las dependencias necesarias:
```bash
cd saas-app/server
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo llamado `.env` basándote en el ejemplo proporcionado:
```bash
cp .env.example .env
```
Edita el archivo `.env` para definir tus credenciales iniciales:
- `ADMIN_EMAIL`: Correo del primer administrador.
- `ADMIN_PASS`: Contraseña de acceso inicial.

### 4. Iniciar el Sistema
Arranca el motor de base de datos SQL:
```bash
node index.js
```
El servidor confirmará si se ha creado el superusuario inicial.

### 5. Ejecutar la Aplicación
Abre el archivo `saas-app/index.html` en tu navegador o utiliza un servidor estático local (como `live-server` o `serve`). 

**¡Listo! Inicia sesión con los datos configurados en tu archivo .env.**

---

## 🎨 Identidad Visual y Tecnología
- **Frontend**: Vanilla HTML5, CSS3 (Bootstrap 5), JavaScript (ES6+).
- **Backend**: Node.js + Express.
- **Base de Datos**: SQLite (Relacional SQL Portátil).
- **Seguridad**: Protección via .gitignore y variables de entorno para evitar fuga de datos.

---
© 2026 **Arhez Tech** | **Ing. Juan Pablo Aranda Hernandez** - Gestión Profesional de Negocios.
