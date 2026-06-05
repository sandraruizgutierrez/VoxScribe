# VoxScribe Chrome Extension - Inicio Rápido

## ✅ Está listo para usar

Tu extensión de Chrome ya está creada y lista para instalar. Aquí está todo lo que necesitas:

### Carpeta: `chrome-extension/`
```
chrome-extension/
├── manifest.json          # Configuración
├── popup.html             # Popup UI
├── popup.js               # Lógica del popup
├── content.js             # Botón flotante (la parte más importante)
├── background.js          # Service Worker
└── icons/                 # Iconos (16x16, 48x48, 128x128)
```

## 🚀 Cómo instalar la extensión

### 1. En Chrome, ve a: `chrome://extensions`

### 2. Activa "Modo de desarrollador" 
   - Arriba a la derecha hay un toggle

### 3. Haz clic en "Cargar extensión sin empaquetar"
   - Selecciona la carpeta `chrome-extension` de este proyecto

### 4. ¡Listo! 🎉
   - Verás un icono morado en la esquina superior derecha
   - Ve a cualquier página web y verás el botón flotante 🎙️

## 💡 Cómo usar

### El botón flotante (lo más cómodo)
- Aparece en la **esquina inferior derecha** de cada página
- **Pulsa 1 vez** = empieza a grabar
- **Pulsa otra vez** = para, transcribe y copia automáticamente
- **Ctrl+V** = pega el texto donde necesites

### El popup de la extensión
- Haz clic en el icono morado (esquina superior derecha)
- Selecciona idioma si lo necesitas
- Pulsa "Presiona para grabar"
- El texto se copia automáticamente

## 📋 Qué pasa detrás de cámaras

1. **Grabas audio** con tu micrófono
2. **Se envía a Vercel** a tu servidor
3. **Gemini AI transcribe** el audio
4. **Se copia automáticamente** al portapapeles
5. **Pegas donde necesites** (Ctrl+V)

## 🌐 URLs que usa

- **Servidor**: `https://voxscribe.vercel.app`
- **Endpoint**: `/api/transcribe`

Si quieres cambiar esto (ej: localhost en desarrollo), edita:
- `chrome-extension/popup.js` (línea ~70)
- `chrome-extension/content.js` (línea ~99)

Busca `const serverUrl =` y cambia la URL.

## 🆚 Comparativa: Botón flotante vs Popup

| Característica | Botón flotante | Popup |
|---|---|---|
| Acceso rápido | ✅ Siempre visible | ⚠️ Requiere clic extra |
| Comodidad | ✅ La mejor | ⚠️ Necesitas popup |
| Cambiar idioma | ⚠️ Usa guardado | ✅ Selector visible |
| Distracción | ⚠️ Puede molestar | ✅ Sin distracciones |

**Recomendación**: Usa el botón flotante, es lo que pediste.

## 🔧 Troubleshooting

### "El botón flotante no aparece"
1. Recarga la página (F5)
2. Vuelve a cargar la extensión en `chrome://extensions`
3. Cierra Chrome completamente y vuelve a abrirlo

### "Error al grabar/transcribir"
1. Verifica que tengas conexión a internet
2. Revisa la consola (F12 > Console) para más detalles
3. Asegúrate de que el servidor Vercel está up

### "Permiso de micrófono denegado"
1. Chrome > Configuración > Privacidad > Sitios
2. Busca "Micrófono"
3. Asegúrate de que `chrome-extension://...` tiene permiso

## 📦 Próximas mejoras (opcionales)

Si quieres mejorar la extensión después, puedes:

- [ ] Agregar historial de transcripciones
- [ ] Guardar transcripciones en Chrome Storage
- [ ] Agregar más idiomas
- [ ] Mejorar el diseño del botón flotante
- [ ] Agregar atajos de teclado (ej: Ctrl+Shift+M para grabar)

## 📞 Soporte

Si algo no funciona:
1. Abre `chrome://extensions`
2. Haz clic en "Detalles" en VoxScribe
3. Mira los errores reportados
4. Revisa la consola del navegador (F12)

---

**¡Ya está todo listo para usar!** 🎙️✨

Simplemente instala la extensión y empieza a dictar en cualquier página web.
