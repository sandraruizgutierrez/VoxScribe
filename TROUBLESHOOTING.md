# 🔧 Solución de Problemas - VoxScribe Extension

## Error: "Permiso de micrófono denegado"

Este es el error más común. Aquí te muestro cómo solucionarlo.

### ¿Por qué pasa?

Cuando presionaste el botón para grabar por primera vez, Chrome te pidió permiso para usar el micrófono. Si dijiste "No" o lo cerraste sin responder, Chrome bloqueó el acceso.

### ✅ Solución

#### Opción 1: Permitir el permiso en Chrome

1. **Abre Chrome Settings:**
   - Haz clic en los 3 puntos (arriba a la derecha)
   - Ve a "Configuración"

2. **Ve a Privacidad y Seguridad:**
   - En el menú izquierdo: "Privacidad y seguridad"
   - Busca "Permisos del sitio"
   - Haz clic en "Micrófono"

3. **Revisa VoxScribe:**
   - Deberías ver una entrada con `chrome-extension://...`
   - Si dice "Bloqueado", haz clic en los 3 puntos → "Permitir"

4. **Vuelve a intentar:**
   - Recarga la página o la extensión
   - Intenta grabar nuevamente

#### Opción 2: Borrar permisos y empezar de nuevo

Si la opción anterior no funciona:

1. **Ve a Configuración > Privacidad > Permisos > Micrófono**

2. **Busca la entrada de VoxScribe:**
   - Debería verse como: `chrome-extension://[números y letras]`
   - Haz clic en los 3 puntos al lado
   - Selecciona "Borrar"

3. **Recarga la extensión:**
   - Ve a `chrome://extensions`
   - Haz clic en el icono de actualizar (⟳) en VoxScribe
   - Cierra toda instancia de Chrome si es necesario

4. **Prueba de nuevo:**
   - Abre una página web
   - Haz clic en el botón 🎙️
   - Chrome te pedirá permiso de nuevo
   - **Esta vez, haz clic en "Permitir"**

#### Opción 3: Nivel de sitio (más específico)

Si quieres permitirlo solo en ciertos sitios:

1. **Haz clic en el icono de VoxScribe** (arriba a la derecha de Chrome)
2. **Haz clic en "Detalles"**
3. **Ve a la sección "Permisos"**
4. **Busca "Micrófono"**
5. **Cambia a "Permitir"**

---

## Error: "No se encontró micrófono"

Este error significa que tu sistema operativo o navegador no puede detectar un micrófono.

### Causas posibles

1. **No tienes micrófono conectado**
   - Conecta auriculares con micrófono
   - O conecta un micrófono externo
   - O asegúrate de que tu laptop tenga micrófono integrado

2. **Micrófono desconectado o apagado**
   - Verifica la conexión USB
   - Si es un micrófono externo, asegúrate de que esté encendido

3. **Windows está bloqueando el micrófono**
   - Ve a Configuración > Privacidad > Micrófono
   - Asegúrate de que esté activado
   - Permite que Chrome acceda

4. **Hardware deshabilitado en BIOS**
   - Menos probable, pero posible
   - Reinicia y entra a BIOS (suele ser F12 o DEL al iniciar)
   - Busca la opción de micrófono y habilítala

### ✅ Solución

**En Windows 10/11:**

1. **Configuración > Privacidad y seguridad > Micrófono**
2. Asegúrate de que el toggle "Acceso al micrófono" esté **ON**
3. Desplázate abajo y verifica que "Chrome" tenga permiso (está en la lista)
4. Si no está, haz clic en "Permitir" en la app que quieras

**En Mac:**

1. **Preferencias del Sistema > Seguridad y privacidad**
2. Ve a la pestaña "Micrófono"
3. Busca Chrome en la lista
4. Verifica que tenga un ✓ al lado

**En Linux:**

1. Abre Alsamixer desde terminal: `alsamixer`
2. Verifica que el micrófono no esté mutado (no debería tener `MM`)
3. Si está mutado, presiona `M` para desmutear
4. Asegúrate de que los niveles no estén al mínimo

---

## Error: "Error al transcribir" o "Error HTTP 500"

### ¿Qué significa?

El audio se grabó bien, pero la transcripción falló. Esto generalmente es un problema del servidor.

### ✅ Soluciones

**1. Verifica que tu servidor Vercel esté activo:**

```bash
# En terminal, ve al directorio del proyecto
cd c:/Users/sandra.ruiz_mirai/Downloads/VoxIA/VoxScribe

# Prueba si el server responde
curl https://voxscribe.vercel.app/api/health
```

Si ves una respuesta JSON con `{"status":"ok"}`, el servidor está bien.

**2. Verifica tu API key de Gemini:**

```bash
# En .env, verifica que tienes:
GEMINI_API_KEY=tu_clave_aquí

# Asegúrate de que no esté vacío
# Si lo está, ve a https://aistudio.google.com y obtén una clave
```

**3. Revisa los logs de Vercel:**

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto "voxscribe"
3. Ve a "Deployments"
4. Abre el último deployment
5. Ve a "Function Logs" o "Runtime Logs"
6. Busca errores relacionados con `/api/transcribe`

**4. Intenta nuevamente:**

A veces es un problema temporal:
- Espera 30 segundos
- Recarga la página
- Intenta grabar de nuevo

---

## Error: "El botón flotante no aparece"

El botón debería estar en la esquina inferior derecha de cualquier página.

### ✅ Soluciones

**Paso 1: Recarga la página**
```
Presiona F5 o Ctrl+R
```

**Paso 2: Vuelve a cargar la extensión**
1. Ve a `chrome://extensions`
2. Busca VoxScribe
3. Haz clic en el icono de actualizar (⟳)
4. Vuelve a la página web

**Paso 3: Verifica que esté activada**
1. Ve a `chrome://extensions`
2. Asegúrate de que VoxScribe tenga un toggle azul (activado)
3. Si está gris, haz clic para activarla

**Paso 4: Revisa la consola para errores**
1. Presiona F12 (abre DevTools)
2. Ve a "Console"
3. Busca mensajes rojos de error
4. Captura la imagen y comparte en GitHub si necesitas ayuda

**Paso 5: Reinicia Chrome completamente**
1. Cierra Chrome completamente
2. Espera 5 segundos
3. Abre Chrome nuevamente
4. Ve a cualquier página web

Si sigue sin aparecer, abre DevTools (F12) y copia el error que ves en la consola.

---

## Error: "Texto no se copia al portapapeles"

El audio se transcribió, pero el texto no se copió automáticamente.

### Causas

1. **Chrome no tiene permiso para escribir al portapapeles**
2. **Hay un error en la transcripción invisible**
3. **El texto está vacío**

### ✅ Soluciones

**Opción 1: Permitir permiso de portapapeles**

1. Ve a `chrome://extensions`
2. Haz clic en "Detalles" en VoxScribe
3. Ve a "Permisos"
4. Busca "Portapapeles"
5. Asegúrate de que esté permitido

**Opción 2: Revisar la consola**

1. Presiona F12 (DevTools)
2. Ve a "Console"
3. Intenta grabar nuevamente
4. Busca mensajes de error
5. Copia el error y búscalo abajo

**Opción 3: Intenta con el popup en lugar del botón**

1. Haz clic en el icono morado (arriba de Chrome)
2. Se abrirá un popup pequeño
3. Presiona "Presiona para grabar"
4. Habla
5. El texto debería aparecer en la vista previa
6. Cópialo manualmente (Ctrl+C en el área de preview)

---

## "La transcripción está en idioma equivocado"

El audio se transcribió, pero en otro idioma al que querías.

### ✅ Solución

Gemini intenta auto-detectar el idioma. Si falla:

1. **Haz clic en el popup** (icono morado arriba)
2. **Cambia el idioma** en el selector
3. **Intenta de nuevo**

Nota: El idioma que selecciones es una sugerencia para Gemini, pero siempre intenta auto-detectar el idioma del audio.

---

## "El botón está en un sitio web que no puedo ver"

Algunos sitios web (como bancos) podrían tener estilos que oculten el botón.

### ✅ Soluciones

**Opción 1: Mueve el botón**

Edita `chrome-extension/content.js`:
```javascript
// Línea 15-16, busca esto:
floatingButton.id = 'voxscribe-floating-btn';
floatingButton.innerHTML = `
  <style>
    #voxscribe-floating-btn {
      position: fixed;
      bottom: 30px;    ← Cambia este número (más alto = más arriba)
      right: 30px;     ← O este (más alto = más a la izquierda)
```

Cambia los valores:
- `bottom: 100px` - más arriba
- `right: 100px` - más a la izquierda

**Opción 2: Usa el popup en lugar del botón flotante**

1. Haz clic en el icono morado (arriba de Chrome)
2. Usa el popup en lugar del botón

---

## "Necesito ayuda con algo no listado aquí"

### Opciones:

1. **Abre la Consola de DevTools (F12)** y captura cualquier error rojo
2. **Ve a `chrome://extensions`** y revisa los detalles de VoxScribe
3. **Revisa los logs del servidor** en Vercel dashboard
4. **Busca en GitHub issues** si alguien reportó lo mismo

### Información útil para reportar un bug:

- Sistema operativo (Windows, Mac, Linux)
- Versión de Chrome
- Micrófono conectado o integrado
- ¿Fue instalada recientemente o lleva tiempo?
- Pasos exactos para reproducir el error
- Captura de pantalla del error (si aplica)

---

## Checklist de configuración

Usa esto para verificar que todo está bien:

- [ ] Chrome 88 o superior (verifica en `chrome://version`)
- [ ] Micrófono conectado y funcionando
- [ ] Extensión instalada en `chrome://extensions`
- [ ] Extensión activada (toggle azul)
- [ ] Permisos de micrófono otorgados a Chrome
- [ ] Permisos de portapapeles otorgados a VoxScribe
- [ ] Servidor Vercel activo (prueba con `/api/health`)
- [ ] `GEMINI_API_KEY` configurado en `.env`
- [ ] Conexión a internet funcionando
- [ ] Botón 🎙️ visible en cualquier página

Si todos estos checks pasan, ¡la extensión debería funcionar!

---

## Última opción: Reiniciar todo

Si nada funciona:

1. **Desinstala la extensión:**
   - Ve a `chrome://extensions`
   - Haz clic en "Remover" en VoxScribe

2. **Elimina archivos temporales:**
   - Presiona Ctrl+Shift+Delete
   - Selecciona "Todas las cookies y otros datos de sitios"
   - Haz clic en "Borrar datos"

3. **Cierra Chrome completamente:**
   - Presiona Alt+F4 o ciérralo desde el administrador de tareas

4. **Abre Chrome nuevamente**

5. **Reinstala la extensión:**
   - Ve a `chrome://extensions`
   - Activa "Modo de desarrollador"
   - "Cargar extensión sin empaquetar"
   - Selecciona `chrome-extension` nuevamente

6. **Prueba nuevamente**

---

Si después de esto sigue sin funcionar, por favor reporta el error con:
- Los pasos que seguiste
- La captura de pantalla de cualquier error
- Los logs de DevTools (F12 > Console)

¡Estoy aquí para ayudar! 🎙️
