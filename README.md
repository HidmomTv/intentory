# 🎒 Universal Inventory (AAA Edition)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![FiveM](https://img.shields.io/badge/FiveM-Ready-orange.svg)
![Framework](https://img.shields.io/badge/Framework-Standalone%20|%20QBCore%20|%20Qbox-success.svg)

Un inventario de nivel comercial y calidad AAA para FiveM. Diseñado desde cero para ofrecer una experiencia inmersiva estilo *Escape From Tarkov* o *Cyberpunk 2077*, con un sistema de cuadrícula espacial (Tetris), personalización extrema y soporte multiplataforma.

---

## ✨ Características Principales

*   🟩 **Motor Drag & Drop (Tetris Grid):** Sistema de inventario espacial real. Los objetos ocupan diferentes dimensiones (ej. Rifle 4x2, Agua 1x1). Sistema de colisiones en tiempo real y rotación de objetos con la tecla `R`.
*   🎭 **Motor de Temas V3:** 4 estéticas premium seleccionables en caliente por el jugador (Minimalista AAA, Retro Terminal, Táctico Hardcore, Urbano Neón) y personalización total de color de acento.
*   👕 **Panel de Equipamiento Anatómico:** Interfaz inmersiva con iconos de equipo RPG reales para armaduras, ropa, máscaras, cadenas, gafas y brazaletes.
*   ⚡ **Menú Rápido (Hotbar Z):** Rueda/Barra de acceso rápido integrada y animada que se activa manteniendo la tecla `Z`, desenfocando el fondo para máxima inmersión táctica.
*   🛠️ **Crafting por Entornos:** Sistema avanzado que detecta objetos cercanos (fogatas, bancos de trabajo) para habilitar recetas específicas, montado sobre un sistema NUI de blueprints.
*   🔫 **Modificación Dinámica de Armas:** Añade silenciadores, linternas y mirillas visualmente al modelo de tu arma directamente desde la interfaz.
*   🌐 **Compatibilidad Universal:** Funciona sin problemas en servidores Standalone, QBCore y Qbox gracias a su capa de abstracción compartida.

---

## 📋 Dependencias Requeridas

Asegúrate de tener instalados los siguientes recursos antes de iniciar el inventario:

1.  [`oxmysql`](https://github.com/overextended/oxmysql) (Manejo de Base de Datos ultrarrápido).
2.  QBCore / Qbox (Solo si no estás usando la versión Standalone).

---

## 🚀 Guía de Instalación

Sigue estos pasos rigurosamente para instalar y compilar el inventario en tu servidor de pruebas o producción:

### 1. Descarga y Ubicación
1.  Clona o descarga este repositorio.
2.  Añade la carpeta `universal_inventory` a la carpeta `[resources]` de tu servidor FiveM.

### 2. Configuración de la Base de Datos
Importa el archivo SQL proporcionado (si existe) o asegúrate de que tu base de datos tiene la tabla `players` estándar de tu framework. El inventario creará dinámicamente el JSON dentro de las columnas existentes.

### 3. Compilación de la Interfaz Web (React)
Este inventario utiliza **React 18** y **Tailwind V4** para su interfaz. Debes compilar el código fuente antes de iniciar el servidor.

1.  Abre tu consola de comandos (CMD, PowerShell o Terminal).
2.  Navega a la carpeta web del inventario:
    ```bash
    cd [ruta_del_servidor]/resources/universal_inventory/web
    ```
3.  Instala las dependencias de Node.js:
    ```bash
    npm install
    ```
4.  Construye la versión de producción optimizada:
    ```bash
    npm run build
    ```
    *(Esto generará una carpeta `dist` que FiveM utilizará para mostrar la UI).*

### 4. Configuración del Servidor (Lua)
1.  Abre el archivo `shared/config.lua`.
2.  Ajusta el framework que utiliza tu servidor:
    ```lua
    Config.Framework = 'qbcore' -- Opciones: 'standalone', 'qbcore', 'qbox'
    ```
3.  Ajusta los pesos máximos según la economía de tu servidor:
    ```lua
    Config.MaxWeight = {
        player = 30.0,
        backpack = 15.0,
        stash = 100.0,
        trunk = 50.0,
        glovebox = 10.0,
        drop = 50.0
    }
    ```

### 5. Iniciar el Recurso
Añade la siguiente línea a tu archivo `server.cfg`:

```cfg
ensure oxmysql
ensure universal_inventory
```

*(Si usas QBCore o Qbox, asegúrate de que `universal_inventory` se inicia **después** del core de tu framework).*

---

## 🎮 Controles por Defecto

*   **F2 / Tabulador:** Abrir/Cerrar el inventario (configurable en cliente).
*   **Z (Mantener):** Abrir Menú Rápido (Hotbar).
*   **Click Izquierdo (Mantener):** Arrastrar un objeto por el grid (Tetris).
*   **R (Mientras se arrastra):** Rotar objeto geométricamente.

---

## 🔧 Resolución de Problemas

*   **La interfaz no aparece o se ve blanca:** Asegúrate de haber ejecutado `npm run build` en la carpeta `web`.
*   **El inventario no guarda los objetos:** Comprueba la consola del servidor. Asegúrate de que `oxmysql` está conectado correctamente y de que el Framework coincide en tu `config.lua`.

---

**Desarrollado con ❤️ para llevar los servidores de FiveM al siguiente nivel.**
