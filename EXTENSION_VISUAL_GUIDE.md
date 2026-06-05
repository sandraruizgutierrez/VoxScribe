# VoxScribe Extension - Guía Visual

## 📍 Dónde verás el botón flotante

Cuando abres **cualquier página web**, verás esto:

```
┌─────────────────────────────────────────────────┐
│  Mi sitio web | Contenido importante           │
│                                                  │
│  Lorem ipsum dolor sit amet...                  │
│  Consectetur adipiscing elit...                 │
│  Sed do eiusmod tempor...                       │
│                                                  │
│                                                  │
│                                                  │
│                                    🎙️ ← ¡Aquí!  │
│                                   (esquina      │
│                                   inf-derecha)  │
└─────────────────────────────────────────────────┘
```

## 🎬 Secuencia de uso

### Estado 1: Esperando
```
┌─────────────────────────────┐
│ Página web normal            │
│                              │
│ Contenido...                 │
│                              │
│                   ┌─────┐    │
│                   │ 🎙️  │ ← Botón normal
│                   └─────┘    │
└─────────────────────────────┘
```

### Estado 2: Grabando
```
┌─────────────────────────────┐
│ Página web normal            │
│                              │
│ Contenido...                 │
│                              │
│                   ┏━━━━━┓    │
│                   ┃ 🎙️  ┃ ← Pulsando, brilla
│                   ┃     ┃    │
│                   ┃  *  ┃ ← Animación de pulso
│                   ┗━━━━━┛    │
│                              │
│         "Grabando..." ← Toast│
└─────────────────────────────┘
```

### Estado 3: Procesando
```
┌─────────────────────────────┐
│ Página web normal            │
│                              │
│ Contenido...                 │
│                              │
│                   ┌─────┐    │
│                   │ 🎙️  │    │
│                   └─────┘    │
│                              │
│      "Transcribiendo..." ←─── Toast
└─────────────────────────────┘
```

### Estado 4: Completado
```
┌─────────────────────────────┐
│ Página web normal            │
│                              │
│ Contenido...                 │
│                              │
│                   ┌─────┐    │
│                   │ 🎙️  │    │
│                   └─────┘    │
│                              │
│  "✓ Copiado al portapapeles"│
│         (desaparece en 3s)   │
└─────────────────────────────┘
```

## 🎨 El Botón Flotante en detalle

### Normal (sin interacción)
```
    ╔═════════════╗
    ║    🎙️       ║  ← Icono micrófono
    ║             ║  ← Fondo degradado morado
    ╚═════════════╝
    
    60x60 píxeles, circular
    Sombra suave
    Opacidad: 100%
    Posición: bottom: 30px, right: 30px
```

### Al pasar el mouse (hover)
```
    ╔═════════════╗
    ║    🎙️       ║  ← Se hace 10% más grande
    ║             ║  ← Sombra más pronunciada
    ╚═════════════╝
    
    Cursor: pointer
    Transición: 0.3s ease
```

### Grabando (animación)
```
    ┏━━━━━━━━━━━┓
    ┃    🎙️      ┃  ← Más grande (pulsando)
    ┃            ┃  ← Sombra más fuerte
    ┃  * * * *  ┃  ← Efecto de pulso
    ┗━━━━━━━━━━━┛
    
    Animación: pulse cada 0.6s
    Escala: 1.15x en el máximo
```

## 🔵 Toast Notifications (Notificaciones)

Las notificaciones aparecen encima del botón:

```
┌─────────────────────────────┐
│ Página web...               │
│                              │
│          ┌──────────────────┐│
│          │  Grabando...     ││ ← Toast
│          └──────────────────┘│
│                              │
│                   ┌─────┐    │
│                   │ 🎙️  │    │
│                   └─────┘    │
└─────────────────────────────┘
```

Estados de notificación:
- `"Grabando..."` - mientras estás hablando
- `"Transcribiendo..."` - procesando audio
- `"✓ Copiado al portapapeles"` - listo!
- `"Error: ..."` - si algo falla

## 📱 Popup de la extensión

Cuando haces clic en el icono morado en Chrome:

```
┌──────────────────────────┐
│       🎙️ VoxScribe        │ ← Título
├──────────────────────────┤
│ ┌────────────────────┐   │
│ │ Español ▼          │   │ ← Selector idioma
│ └────────────────────┘   │
│                          │
│  Listo                   │ ← Status
│                          │
│ ┌────────────────────┐   │
│ │ Presiona para...   │   │ ← Botón principal
│ └────────────────────┘   │
│                          │
│  El texto se copiará...  │ ← Ayuda
└──────────────────────────┘
```

### Estados del popup

**Estado 1: Listo**
```
┌──────────────────┐
│ 🎙️ VoxScribe     │
├──────────────────┤
│ Listo            │ ← Status verde
│ [Presionar...]   │ ← Botón normal
└──────────────────┘
```

**Estado 2: Grabando**
```
┌──────────────────┐
│ 🎙️ VoxScribe     │
├──────────────────┤
│ Grabando...      │ ← Status animado
│ [⏹️ Detener]     │ ← Botón se vuelve rojo
└──────────────────┘
```

**Estado 3: Procesando**
```
┌──────────────────┐
│ 🎙️ VoxScribe     │
├──────────────────┤
│ Transcribiendo...│ ← Status
│ [Procesando]     │ ← Botón deshabilitado
│                  │
│ "Tu texto aquí"  │ ← Vista previa
└──────────────────┘
```

## 🔄 Flujo de datos

```
┌─────────────────────────────────────────────────────────────┐
│                     TU NAVEGADOR (Chrome)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Página Web                                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  <contenido de la página>                           │   │
│  │                                            🎙️        │   │
│  └─────────────────────────────────────────────────────┘   │
│         ▲                                      ▲              │
│         │ (inyectado por content.js)          │ (pulsas)    │
│         │                                      │              │
│  ┌──────┴──────────────────────────────────────┴─────┐     │
│  │          Content Script (content.js)               │     │
│  │  • Crea botón flotante                             │     │
│  │  • Maneja click del botón                          │     │
│  │  • Inicia MediaRecorder                            │     │
│  └──────────────────────────────────────────────────┘     │
│         │                                                    │
│         │ (audio blob)                                      │
│         ▼                                                    │
│  ┌──────────────────────────────────────────────────┐     │
│  │        INTERNET / RED                            │     │
│  │  POST /api/transcribe (multipart/form-data)      │     │
│  │  • audio: [WAV blob]                             │     │
│  │  • language: "es-ES"                             │     │
│  └──────────────────────────────────────────────────┘     │
│         │                                                    │
│         │ (audio)                                            │
│         ▼                                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              TU SERVIDOR (Vercel)                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Express Server (server.ts)                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  POST /api/transcribe                              │   │
│  │  ├─ Recibe audio en FormData                        │   │
│  │  ├─ Convierte a Base64                             │   │
│  │  └─ Envía a Gemini                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│         │                                                    │
│         │ (audio base64)                                    │
│         ▼                                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │        Google Gemini API                           │   │
│  │        (gemini-3.5-flash)                          │   │
│  │                                                     │   │
│  │  [Transcripción de audio a texto]                  │   │
│  └─────────────────────────────────────────────────────┘   │
│         │                                                    │
│         │ (transcript)                                      │
│         ▼                                                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Respuesta JSON                                    │   │
│  │  { "transcript": "El texto transcrito..." }        │   │
│  └─────────────────────────────────────────────────────┘   │
│         │                                                    │
└─────────────────────────────────────────────────────────────┘
         │
         │ (JSON)
         ▼
┌─────────────────────────────────────────────────────────────┐
│                     TU NAVEGADOR (Chrome)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Content Script (content.js)                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  • Recibe el transcript                             │   │
│  │  • Copia a portapapeles (clipboard.writeText)       │   │
│  │  • Muestra notificación "✓ Copiado"                │   │
│  └─────────────────────────────────────────────────────┘   │
│         │                                                    │
│         │ (ready to paste!)                                 │
│         ▼                                                    │
│  TÚ: [Ctrl+V] → Pega el texto en cualquier lugar           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Interacciones del Usuario

### Flujo 1: Botón flotante (rápido)
```
1. VES el botón 🎙️ en esquina
          ↓
2. HACES click → Empieza grabación
          ↓
3. HABLAS mientras se graba
          ↓
4. HACES click de nuevo → Detiene grabación
          ↓
5. ESPERAS 2-5 segundos → Transcripción
          ↓
6. VES notificación "✓ Copiado"
          ↓
7. PEGAS con Ctrl+V donde necesites
```

### Flujo 2: Popup (manual)
```
1. HACES click en icono morado (arriba)
          ↓
2. SE ABRE popup pequeño
          ↓
3. SELECCIONAS idioma (opcional)
          ↓
4. HACES click en "Presiona para grabar"
          ↓
5. HABLAS
          ↓
6. HACES click en "⏹️ Detener"
          ↓
7. ESPERAS transcripción
          ↓
8. VES preview del texto en popup
          ↓
9. PEGAS
```

## 🎨 Paleta de Colores

**Botón flotante:**
- Fondo: Gradiente morado (`#667eea` → `#764ba2`)
- Icono: Blanco (`#ffffff`)
- Sombra: `rgba(102, 126, 234, 0.4)`

**Popup:**
- Fondo: Gradiente morado
- Texto: Blanco
- Botón: Blanco con texto morado

**Notificaciones (Toast):**
- Fondo: Oscuro (`#333`)
- Texto: Blanco
- Borde: Gris

## 🔊 Elementos de Audio

**Indicadores auditivos:**
- Micrófono inicia: Silencio (sin feedback de audio)
- Grabando: Animación visual (pulse)
- Completado: Notificación visual

## 📐 Tamaños y Espaciado

| Elemento | Tamaño | Posición |
|----------|--------|----------|
| Botón flotante | 60x60 px | bottom: 30px, right: 30px |
| Radio botón | 50% (circular) | - |
| Toast | 200px width | bottom: 100px, right: 30px |
| Popup | 300px width | Chrome default |
| Icono | 28px | Centro del botón |

## ✨ Animaciones

| Elemento | Animación | Duración |
|----------|-----------|----------|
| Botón hover | scale(1.1) | 0.3s |
| Botón grabando | pulse | 0.6s infinite |
| Toast entrada | slideUp | 0.3s |
| Toast salida | fadeOut | 0.3s |

---

**Nota**: Esta guía visual te muestra exactamente qué verá el usuario cuando use la extensión.
