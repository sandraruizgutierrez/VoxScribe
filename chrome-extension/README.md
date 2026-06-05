# VoxScribe - Extensión de Chrome

Extensión flotante para transcribir audio a texto en cualquier página web.

## Instalación

### Desarrollo local:

1. Ve a `chrome://extensions`
2. Activa "Modo de desarrollador" (esquina superior derecha)
3. Haz clic en "Cargar extensión sin empaquetar"
4. Selecciona la carpeta `chrome-extension`

## Características

- 🎙️ **Botón flotante** - Disponible en cualquier página
- ⏱️ **Grabación de audio** - Presiona para grabar, presiona de nuevo para parar
- 🔄 **Transcripción automática** - Se envía a tu servidor Vercel
- 📋 **Copia automática** - El texto se copia al portapapeles
- 🌐 **Múltiples idiomas** - Español, Inglés, Francés, Alemán, Italiano, Portugués

## Uso

1. Abre cualquier página web
2. Haz clic en el botón flotante 🎙️ (esquina inferior derecha)
3. Pulsa para grabar
4. Pulsa de nuevo para parar y transcribir
5. ¡El texto se copia automáticamente!
6. Pega donde necesites con Ctrl+V

## Configuración requerida

La extensión necesita acceso a:
- Tu micrófono
- Portapapeles
- API de transcripción en `https://voxscribe.vercel.app/api/transcribe`

## Archivos

- `manifest.json` - Configuración de la extensión
- `popup.html` - Interfaz del popup
- `popup.js` - Lógica del popup
- `content.js` - Botón flotante e inyección en páginas
- `background.js` - Service Worker
- `README.md` - Este archivo
