# Guía: Instalar extensión de Chrome VoxScribe

## Paso 1: Cargar la extensión en Chrome

1. **Abre Chrome** y ve a `chrome://extensions`
2. Activa **"Modo de desarrollador"** (esquina superior derecha)
3. Haz clic en **"Cargar extensión sin empaquetar"**
4. Selecciona la carpeta `chrome-extension` de este proyecto

¡La extensión está lista! Deberías ver un icono morado en la esquina superior derecha de Chrome.

## Paso 2: Permisos necesarios

Chrome te pedirá permisos para:
- 🎙️ Acceder a tu micrófono
- 📋 Escribir en el portapapeles
- 🌐 Funcionar en cualquier página web

Acepta todos los permisos.

## Paso 3: Usar la extensión

### Opción A: Botón flotante (la más cómoda)
1. Abre cualquier página web
2. Ve a la esquina **inferior derecha**
3. Verás un botón morado con 🎙️
4. **Haz clic una vez** para empezar a grabar
5. **Haz clic de nuevo** para parar, transcribir y copiar
6. **Pega el texto** donde necesites (Ctrl+V o Cmd+V)

### Opción B: Popup de la extensión
1. Haz clic en el icono de la extensión (esquina superior derecha)
2. Selecciona el idioma que necesites
3. Presiona "Presiona para grabar"
4. El texto se copiará automáticamente

## Características

✅ Botón flotante en cualquier página
✅ Grabación de audio en tiempo real
✅ Transcripción con Gemini AI
✅ Copia automática al portapapeles
✅ Soporte para múltiples idiomas
✅ Notificaciones de estado

## Idiomas soportados

- 🇪🇸 Español (es-ES) - Por defecto
- 🇺🇸 Inglés (en-US)
- 🇫🇷 Francés (fr-FR)
- 🇩🇪 Alemán (de-DE)
- 🇮🇹 Italiano (it-IT)
- 🇧🇷 Portugués (pt-BR)

## Solución de problemas

### "No puedo acceder al micrófono"
- Verifica que hayas dado permisos al navegador
- Ve a Configuración > Privacidad > Sitios > Micrófono
- Asegúrate de que Chrome tiene permiso

### "Error: HTTP 500"
- El servidor Vercel podría estar caído
- Intenta de nuevo en unos momentos
- Verifica que tienes conexión a internet

### "No se transcribe"
- Comprueba que tienes tu GEMINI_API_KEY configurada en `.env`
- El servidor debe estar corriendo (en producción en Vercel)
- Intenta grabar más tiempo (al menos 1-2 segundos)

### "La extensión no aparece"
- Recarga la página (F5)
- Reinicia Chrome
- Ve a `chrome://extensions` y asegúrate de que esté activada

## Desarrollo local

Si quieres desarrollar la extensión localmente:

```bash
# Edita los archivos en chrome-extension/
# Por ejemplo: popup.js, content.js, etc.

# Luego en Chrome:
# 1. Ve a chrome://extensions
# 2. Haz clic en el botón "Actualizar" en VoxScribe
```

Los cambios se aplicarán inmediatamente (excepto si modificas manifest.json, en cuyo caso necesitas descargar y volver a cargar).

## Archivos de la extensión

```
chrome-extension/
├── manifest.json          # Configuración de la extensión
├── popup.html             # Interfaz del popup
├── popup.js               # Lógica del popup
├── content.js             # Botón flotante (inyectado en cada página)
├── background.js          # Service Worker
├── icons/                 # Iconos de la extensión
└── README.md              # Documentación
```

## Próximos pasos (opcionales)

- [ ] Cambiar los iconos en `chrome-extension/icons/`
- [ ] Personalizar colores y estilos
- [ ] Agregar más idiomas
- [ ] Hacer que persista el historial de transcripciones

¡Disfruta VoxScribe! 🎙️✨
