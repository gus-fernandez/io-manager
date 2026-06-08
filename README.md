# IO MANAGER
  
App multimodal para IO Instruments *
- Creación, gestión y almacenamiento de presets para IO Instruments.  
- Configuración y conexión del microcontrolador.  

IO Instruments es una serie de instrumentos digitales para ESP32 WROOM.  
  
## GENERALES
- ✓ Entorno de desarrollo  
- ✓ APP  
- ✓ ESP32  
- ✓ Documentación  
  
## ENTORNO DE DESARROLLO
- ✓ Configurar Docker/Sail  
- ✓ Crear proyecto: Laravel 13, Inertia -> (Migrado a Axios), React, Tauri  
- ✓ Git y Vincular con Github  
- ✓ Automatizar inicio y cierre de sesión (Automator)  
- ✓ Configurando entorno remoto con SSH VNC SMB  
  
## APP
- ✓ App desarrollo  
  - ✓ BD  
  - ✓ Auth  
  - ✓ Landing page  
  - ✓ Control  
  - ✓ Cloud  
  - ✓ Firmware  
  - ✓ About  
- ✓ Seguridad  
- ✓ Tailwind estilos  
- ✓ Accesibilidad  
- ✓ Adaptabilidad  
- ✓ Icon, Name  
- ✓ Integración Tauri  
  
## ESP32
- ✓ Implementación WiFi  
- ✓ Implementación Websockets (V2)  
- ✓ Implementación mDNS  
- ✓ Implementación FileSystem  
- ✓ Implementación Presets Manager  
  
## DOCUMENTACIÓN
- ✓ Preproyecto  
- ✓ Cuaderno de bitácora  
- ✓ Git  
- ✓ Memoria  
- ✓ Presentación  
- ✓ README (v4)  
- ✓ Código PHP Scribe  
- ✓ Código JS JSDoc + docdash  
- ✓ Paths  
- TO DO User manual  
  
### SEGURIDAD
- ✓ CSRF protection — CORS Axios - Laravel  
- ✓ Password hashing — bcrypt por defecto  
- ✓ SQL injection protection — Eloquent usa prepared statements  
- ✓ XSS protection — React escapa el HTML por defecto  
- ✓ Sanctum — Cookies de sesión  
- ✓ Rate limiting — en login, register y forgot password  
- ✓ Session timeout — cerrar sesión por inactividad (120 min)  
- ✓ Logs de auditoría — registrar intentos de login fallidos  
- ✓ Política de contraseñas — mínimo de caracteres, complejidad  
- ✓ Verificación e-mail  
- ✓ WiFi en ESP32 (ofuscación XOR en tránsito y guardado)  
- ✓ Preset Parse CRC32  
- TO DO 2FA — doble factor de autenticación  
- TO DO HTTPS  
  
### BD
- ✓ Auth  
- ✓ Firmware  
- ✓ Presets  
- ✓ Ratings  
  
### AUTH
- ✓ Login  
- ✓ Logout  
- ✓ Register  
- ✓ Reset password  
- ✓ Profile edit/delete  
- ✓ Forgot password  
- ✓ Remember me  
- ✓ Verificación de email  
  
### LANDING PAGE:
- ✓ Local / Collab  
- ✓ Roles (admin / user)  
  
### CONTROL
- ✓ Conexión websockets  
- ✓ Control UI  
- ✓ Virtual Keyboard  
- ✓ Loaded Presets  
  
### CLOUD
- ✓ Local  
- ✓ Cloud  
- ✓ Admin Dashboard (administrar repositorio público)  
  
### FIRMWARE
- ✓ USB Serial Connection  
- ✓ USB Serial Monitor  
- ✓ Command Console  
- ✓ Firmware Burner  
- ✓ Historial de Firmware (BD)  
- ✓ Admin Dashboard (administrar firmware)  
- TO DO Administrador usuarios  
  
### ACCESIBILIDAD
- ✓ Control Panel Highlight  
- ✓ Aria  
- ✓ Navegación focusable  
- ✓ Tooltips  
  
### ADAPTABILIDAD
- ✓ Escritorio  
- ✓ Idioma: Inglés  
- TO DO Traducción  
- TO DO Tablet  
  
### TAURI
- ✓ Primer test  
- ✓ Primer build  
- ✓ Segundo build (to do serial)  
- ✓ Release test