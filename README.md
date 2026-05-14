# IO Manager

Aplicación de gestión de dispositivos IO con modo local y modo colaborativo.

## Stack

- **Backend:** Laravel 13
- **Frontend:** React + Inertia.js v2
- **Estilos:** Tailwind CSS
- **Base de datos:** MySQL (Sail) 
- **Entorno de desarrollo:** Laravel Sail (Docker)
- **App de escritorio:** Tauri

## Arquitectura

```
resources/js/
├── Components/          # Componentes genéricos reutilizables
├── Features/
│   └── Auth/
│       ├── LoginForm.jsx
│       └── RegisterForm.jsx
├── Layouts/
│   ├── AppLayout.jsx    # Layout principal (adapta según usuario autenticado o no)
│   ├── AuthenticatedLayout.jsx
│   └── GuestLayout.jsx
└── Pages/
    ├── Landing.jsx
    ├── About.jsx
    ├── Dashboard.jsx
    ├── IO/
    │   ├── Control.jsx
    │   ├── Presets.jsx
    │   └── Firmware.jsx
    └── Profile/
        └── Edit.jsx
```

## Modos de uso

### Modo Local
Acceso sin autenticación. El usuario entra directamente a `/local` sin necesidad de cuenta.

### Modo Colaborativo
Acceso con autenticación completa. Permite compartir presets y configuraciones con otros usuarios.

## Rutas

| Ruta | Nombre | Auth | Descripción |
|------|--------|------|-------------|
| `/` | `landing` | No | Página de inicio con login y registro |
| `/local` | `local` | No | Acceso en modo local |
| `/io/control` | `io.control` | No* | Panel de control |
| `/io/presets` | `io.presets` | No* | Gestión de presets |
| `/io/firmware` | `io.firmware` | No* | Gestión de firmware |
| `/about` | `about` | No | Información de la app |
| `/profile` | `profile.edit` | Sí | Perfil de usuario |

*Se añadirá middleware `auth` cuando sea necesario.

## Autenticación

Implementada con **Laravel Breeze** e **Inertia React**:

- ✅ Login / Logout
- ✅ Registro de usuarios
- ✅ Recuperación de contraseña (Mailpit en desarrollo)
- ✅ Verificación de email
- ✅ Remember me
- ✅ Rate limiting (5 intentos por email+IP)
- ✅ Política de contraseñas (mínimo 8 caracteres, mayúsculas, números y símbolos)
- ✅ Logs de auditoría de intentos fallidos
- ✅ Sesiones en base de datos (120 minutos de inactividad)

## Seguridad

- ✅ Protección CSRF automática via Inertia
- ✅ Hashing de contraseñas con bcrypt (12 rounds)
- ✅ Protección SQL injection via Eloquent
- ✅ Protección XSS via React
- ✅ HTTP Only cookies
- ✅ Same-site lax
- ✅ Sanctum configurado para sesiones con cookies
- ⬜ HTTPS (configurar en producción)
- ⬜ 2FA (pendiente)

## Entorno de desarrollo

### Requisitos
- Docker Desktop
- Node.js
- Rust (para Tauri)

### Arrancar el entorno

```bash
./vendor/bin/sail up -d
./vendor/bin/sail npm run dev
```

O usando la app de Automator configurada en el proyecto.

### Parar el entorno

```bash
./vendor/bin/sail stop
```

### Comandos útiles

```bash
# Migraciones
./vendor/bin/sail artisan migrate

# Logs en tiempo real
./vendor/bin/sail artisan pail

# Crear modelo con migración
./vendor/bin/sail artisan make:model NombreModelo -m
```

## App de escritorio (Tauri)

### Desarrollo

```bash
npx tauri dev
```

### Build para distribución

```bash
npx tauri build
```

Genera instaladores para macOS (.dmg), Windows (.exe) y Linux.

## Variables de entorno relevantes

```env
APP_URL=http://localhost
DB_CONNECTION=mysql
SESSION_DRIVER=database
SESSION_LIFETIME=120
MAIL_MAILER=smtp
MAIL_HOST=mailpit        # En desarrollo
MAIL_PORT=1025
```

## Mailpit (emails en desarrollo)

Acceder a la bandeja de entrada de desarrollo en:

```
http://localhost:8025
```

## Pendiente

- [ ] Diseño con Tailwind CSS
- [ ] Lógica de Control (IO/Control)
- [ ] Gestión de Presets
- [ ] Gestión de Firmware
- [ ] API REST para modo colaborativo
- [ ] HTTPS en producción
- [ ] 2FA
- [ ] Deploy
