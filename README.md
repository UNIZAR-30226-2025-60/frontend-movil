# 📱 Bookly - Frontend Móvil

Frontend móvil para la plataforma **Bookly**, construido con **React Native** usando **Expo** para facilitar el desarrollo, pruebas y generación de builds. El proyecto detecta automáticamente si está en desarrollo (local) o producción (APK instalada), conectando al backend correspondiente.

- **Framework:** React Native  
- **Gestión de paquetes:** npm  
- **Entorno de desarrollo:** Expo + Android Emulator 
- **CI/CD:** Archivo apk a instalar en móvil 

---

## 📁 Estructura del Proyecto

- **📁 src/**
  - **📁 componentes/** → Componentes reutilizables de UI y lógica
  - **📁 pantallas/** → Vistas principales del usuario
- **📁 assets/** → Recursos estáticos como imágenes
- **📁 node_modules/** → Dependencias del proyecto gestionadas por npm
- **📄 App.js** → Configuración de navegación principal y proveedor de contexto de usuario
- **📄 index.js** → Punto de entrada principal, registra el componente raíz
- **📄 config.js** → Configuración de rutas API para desarrollo y producción (backend, redirección Google, etc.)
- **📄 UsuarioContext.js** → Contexto global para gestionar el estado del usuario autenticado
- **📄 metro.config.js** → Configuración personalizada de Metro bundler (compilador para React Native)
- **📄 package.json** → Dependencias, scripts y configuración general del proyecto
- **📄 eas.json** → Configuración de perfiles de construcción con EAS (Expo Application Services)

---

## 🔧 Instalación y entorno local

### 1. Requisitos previos

- Tener Expo Orbit instalado en PC y un emulador de Android
- Tener **Expo CLI** instalado:
```bash
npm install -g expo-cli
```

### 2. Instalar dependencias

```bash
npm install
npx expo install expo
npm install concurrently --save-dev
npm install start-server-and-test --save-dev
npm install wait-on --save-dev
npx expo install @react-native-picker/picker
```
### 3. Iniciar la aplicación en local (emulador)

Ejecutamos el siguiente comando:
```bash
npx expo run:android
```

## 📱 Generar un APK para ejecutar en Android (Requiere tener Android Studio)

Ejecutar el comando:
```bash
npx expo run:android --variant release
```

Y el archivo se encontrará en la ruta "android/app/build/outputs/apk/release/app-release.apk"
