# Frontend - Modular JavaScript Structure

Este proyecto ha sido refactorizado para usar una arquitectura modular más escalable y mantenible.

## Estructura de archivos

```
FrontEnd/
├── index.html              # Archivo HTML principal
├── js/                     # Módulos JavaScript organizados
│   ├── config.js           # Configuración y constantes
│   ├── dom-utils.js        # Utilidades para manipulación del DOM
│   ├── auth.js             # Manejo de autenticación
│   ├── websocket.js        # Manejo de WebSocket
│   ├── messages.js         # Manejo de mensajes del chat
│   └── app.js              # Inicialización principal de la aplicación
└── script.js               # [OBSOLETO] Archivo original monolítico
```

## Descripción de módulos

### `config.js`
- Contiene todas las configuraciones y constantes de la aplicación
- Endpoints de API, selectores DOM, timeouts, etc.
- Centraliza la configuración para fácil mantenimiento

### `dom-utils.js`
- **Clase**: `DOMUtils`
- Maneja toda la manipulación del DOM
- Funciones para mostrar/ocultar errores, obtener valores de inputs, etc.
- Centraliza el acceso a elementos del DOM

### `auth.js`
- **Clase**: `AuthManager`
- Maneja el proceso de autenticación
- Validación de inputs, llamadas a la API de autenticación
- Manejo de estados de carga del botón de login

### `websocket.js`
- **Clase**: `WebSocketManager`
- Maneja la conexión WebSocket
- Setup de event handlers, envío de mensajes
- Verificación de estado de conexión

### `messages.js`
- **Clase**: `MessageManager`
- Maneja la visualización y envío de mensajes
- Creación de elementos de mensaje con timestamps
- Validación de mensajes, scroll automático

### `app.js`
- **Clase**: `ChatApp`
- Orquesta la inicialización de todos los componentes
- Setup de event listeners globales
- Manejo del ciclo de vida de la aplicación

## Ventajas de la nueva estructura

1. **Separación de responsabilidades**: Cada módulo tiene una función específica
2. **Reutilización**: Los componentes pueden ser reutilizados fácilmente
3. **Mantenimiento**: Es más fácil encontrar y modificar funcionalidades específicas
4. **Escalabilidad**: Nuevas funcionalidades pueden agregarse como nuevos módulos
5. **Testing**: Cada módulo puede ser testado independientemente
6. **Legibilidad**: El código es más fácil de entender y navegar

## Cómo usar

La aplicación se inicializa automáticamente cuando se carga la página. Los módulos se cargan en orden específico:

1. `config.js` - Configuración base
2. `dom-utils.js` - Utilidades DOM
3. `auth.js` - Autenticación
4. `websocket.js` - WebSocket
5. `messages.js` - Manejo de mensajes
6. `app.js` - Inicialización principal

## Notas de desarrollo

- Todos los módulos exponen sus clases en el objeto `window` para comunicación cross-module
- Los event listeners se configuran automáticamente
- El cleanup se maneja automáticamente cuando se cierra la página
- Se incluye validación y escape de HTML para prevenir XSS

## Migración

El archivo `script.js` original se mantiene como referencia, pero ya no se usa. Todos los `onclick` handlers en el HTML han sido removidos en favor de event listeners programáticos.
