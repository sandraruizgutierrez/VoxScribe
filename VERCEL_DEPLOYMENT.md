# Guía de Despliegue en Vercel

Este proyecto está configurado para desplegarse en Vercel. Sigue estos pasos:

## Requisitos

- Cuenta de Vercel ([https://vercel.com](https://vercel.com))
- Git instalado y repositorio configurado
- API Key de Gemini

## Pasos para Desplegar

### 1. Prepara tu repositorio en Git

```bash
git add .
git commit -m "Configure Vercel deployment"
git push origin main
```

### 2. Conecta tu repositorio a Vercel

1. Accede a [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Haz clic en **"New Project"** (Nuevo Proyecto)
3. Selecciona tu repositorio de GitHub (conecta tu cuenta si es necesario)
4. Vercel detectará automáticamente que es un proyecto Node.js

### 3. Configura las Variables de Entorno

En el dashboard de Vercel, antes de desplegar:

1. Ve a **Settings** → **Environment Variables**
2. Agrega las siguientes variables:

```
GEMINI_API_KEY = tu-clave-api-de-gemini
NODE_ENV = production
```

**Nota:** Obtén tu `GEMINI_API_KEY` de:
- [https://aistudio.google.com/app/apikeys](https://aistudio.google.com/app/apikeys)
- Necesitas una cuenta de Google

### 4. Despliega

1. En la página del nuevo proyecto, haz clic en **Deploy**
2. Vercel construirá y desplegará automáticamente tu aplicación
3. Espera a que se complete el despliegue (generalmente 2-5 minutos)

## Configuración Automática

Ya están incluidos los siguientes archivos de configuración:

- **vercel.json** - Configuración de build y rutas
- **.vercelignore** - Archivos a ignorar durante el build
- **package.json** - Scripts actualizados con `vercel-build`

## Después del Despliegue

- Tu aplicación estará disponible en: `https://tu-proyecto.vercel.app`
- Los logs estarán disponibles en el dashboard de Vercel
- Cada push a `main` desencadenará un nuevo despliegue

## Solución de Problemas

### El despliegue falla con errores de build

1. Verifica los logs en **Deployments** → selecciona el deployment fallido
2. Asegúrate que todas las variables de entorno estén configuradas
3. Verifica que el API key de Gemini sea válido

### La aplicación carga pero no funciona correctamente

1. Abre las herramientas de desarrollador en tu navegador (F12)
2. Verifica la consola de navegador para errores
3. Verifica los logs del servidor en el dashboard de Vercel
4. Asegúrate que la API key de Gemini sea correcta

### El servidor no responde

1. Verifica la salud de la aplicación en: `https://tu-proyecto.vercel.app/api/health`
2. Debe devolver: `{"status":"ok","time":"..."}`

## Actualizar Después del Despliegue

Simplemente haz push a tu rama `main`:

```bash
git add .
git commit -m "tu mensaje"
git push origin main
```

Vercel desplegará automáticamente los cambios.

## Monitoreo

En el dashboard de Vercel puedes:

- Ver logs en tiempo real
- Monitorear uso de CPU y memoria
- Ver la duración de los despliegues
- Revertir a versiones anteriores si algo falla

---

¡Tu aplicación está lista para producción! 🚀
