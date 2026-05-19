# IO-Manager

Sistema de gestión, control y actualización de firmware para instrumentos IO-X basados en ESP32 mediante una aplicación híbrida de escritorio (Tauri + React) y un backend en Laravel.

---

## Estado del Proyecto (Roadmap & TODO)

### Entorno de Desarrollo
- [x] Configurar Docker / Laravel Sail
- [x] Estructura base del proyecto (Laravel 13, Inertia.js, React, Tauri)
- [x] Control de versiones (Git y vinculación con GitHub)
- [x] Automatización de inicio/cierre de sesión local (Apple Automator)
- [x] Configuración de entorno remoto de desarrollo (SSH, VNC, SMB)

### ESP32 & Firmware
- [x] Conexión por puerto serie (USB Serial Connection)
- [x] Monitor de puerto serie integrado (USB Serial Monitor)
- [x] Quemador de firmware (Firmware Burner)
- [x] Historial y logs de versiones de firmware en Base de Datos
- [x] Implementación de actualizaciones OTA (Over-The-Air) básica
- [x] Servidor de WebSockets funcional en el firmware
- [ ] Panel de administración (Dashboard para subir archivos binarios de firmware y formularios)
- [ ] Implementación de configuración WiFi via interfaz web (Formulario de aprovisionamiento)

### Aplicación Web & Landing Page (Panel de Control)
- [x] Arquitectura e infraestructura Local / Colaborativa
- [x] Sistema de Roles (Admin / User)
- [x] Autenticación completa (Laravel Breeze)
  - [x] Login / Logout
  - [x] Registro de usuarios
  - [x] Recuperación y reajuste de contraseña (Forgot / Reset password)
  - [x] Edición y eliminación de perfil de usuario
  - [x] Recordar sesión (Remember me)
  - [x] Verificación de correo electrónico
- [ ] Módulo de Presets (Gestión en Base de Datos)

### App de Escritorio & UI General
- [x] Esqueleto de la aplicación y maquetación base
- [x] Integración de Tauri: Primer test de entorno de escritorio
- [ ] Integración de Tauri: Generar primer ejecutable nativo (Build)
- [ ] Estilos globales y consistencia de UI con Tailwind CSS
- [ ] Accesibilidad web (Atributos ARIA, navegación por teclado, etc.)
- [ ] Soporte multi-idioma / Traducción *(Por evaluar)*

### Módulo de Control (Dashboard en tiempo real)
- [x] Establecimiento y gestión de conexiones vía WebSockets
- [x] Teclado virtual integrado (Virtual Keyboard)
- [ ] Interfaz gráfica de control de parámetros (Knobs, Sliders, Buttons)
- [ ] Visualizador de Presets cargados en tiempo real
- [ ] Parser de ajustes preestablecidos (Preset Parse)

### Seguridad
- [x] Protección CSRF (Gestionado nativamente por Inertia)
- [x] Hasheo seguro de contraseñas (Bcrypt por defecto)
- [x] Protección contra Inyección SQL (Uso de Prepared Statements en Eloquent)
- [x] Mitigación de ataques XSS (Escapado automático en React)
- [x] Configuración estricta de cookies de sesión con Laravel Sanctum
- [x] Limitación de peticiones / Rate limiting (Login, Registro, Recuperación con Breeze)
- [x] Expiración de sesión por inactividad (Configurado a 120 minutos)
- [x] Logs de auditoría (Registro de intentos fallidos de autenticación)
- [x] Políticas de complejidad de contraseñas
- [x] Seguridad en el túnel de WebSockets (Token de autenticación en Handshake + Validación de origen)
- [ ] Forzar tráfico HTTPS en entorno de producción
- [ ] Implementación de doble factor de autenticación (2FA) *(Por evaluar)*
- [ ] Auditoría y revisión de seguridad del Firmware del ESP32
- [ ] Auditoría y revisión de la seguridad de la conexión WiFi del ESP32

### Documentación
- [x] Redacción del Preproyecto
- [x] Cuaderno de bitácora y seguimiento diario
- [x] Estrategia y flujo de ramas en Git
- [x] Actualización del archivo README (v1)
- [ ] Manual de usuario final
- [ ] Memoria técnica del proyecto

---

## Stack Tecnológico

*   **Backend:** Laravel 13 (PHP) + Sail (Docker)
*   **Frontend:** React, Inertia.js, Tailwind CSS
*   **Desktop Wrapper:** Tauri (Rust)
*   **Hardware / Firmware:** ESP32 (C++/Arduino framework), WebSockets, OTA Core.

---

## Requisitos Previos

*   Docker y Docker Compose
*   Node.js
*   Rust (para compilación con Tauri)