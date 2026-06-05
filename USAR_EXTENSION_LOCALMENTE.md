# 🚀 Cómo usar la extensión localmente

Como Vercel aún no tiene los endpoints API configurados correctamente, vamos a usar la extensión con tu servidor local. Así funciona perfectamente ahora.

## ⚡ Quick Start (3 pasos)

### Paso 1: Inicia el servidor local
```bash
cd c:/Users/sandra.ruiz_mirai/Downloads/VoxIA/VoxScribe
npm run dev
```

Deberías ver:
```
Server running on port 3000
```

### Paso 2: La extensión ya está configurada
La extensión ya está apuntando a `http://localhost:3000` (cambié los URLs).

Solo recarga la extensión:
- Ve a `chrome://extensions`
- Haz clic en el botón de actualizar (⟳) en VoxScribe

### Paso 3: Prueba
1. Abre cualquier página web
2. Haz clic en el botón 🎙️
3. Habla
4. ¡Debería funcionar! ✅

---

## 📋 Requisitos

✅ Servidor corriendo en `http://localhost:3000`
✅ Extensión Chrome instalada
✅ `.env` con `GEMINI_API_KEY` configurado
✅ Micrófono funcionando y con permisos otorgados

## ✅ Verificación

**¿Cómo sé si está funcionando?**

1. Abre DevTools (F12) en la página
2. Ve a "Console"
3. Habla y detén la grabación
4. Deberías ver mensajes como:
   ```
   - Nada malo (sin errores)
   - O si hay error, te dirá qué falla
   ```

5. Deberías ver una notificación "✓ Copiado al portapapeles"
6. Pega con Ctrl+V

Si ves un error, probablemente es:
- El servidor no está corriendo (`npm run dev`)
- El micrófono no tiene permisos
- GEMINI_API_KEY no está configurada

## 🔄 Después: Desplegar a Vercel

Una vez que todo funcione localmente, podemos:

1. Reconfigurarun el proyecto en Vercel para que soporte API routes
2. O usar un servicio alternativo (Railway, Render, Fly.io, etc.)
3. O hacer push a production cuando Vercel esté listo

Por ahora, esto funciona perfectamente para desarrollo. ✅

---

**Próximo paso:** Abre una terminal en tu proyecto y ejecuta `npm run dev`
