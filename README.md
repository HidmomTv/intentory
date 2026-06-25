# 💎 QBCore Inventory V3 - Edición AAA Espacial Tetris & Vehicular

![QBCore V3 Banner](https://img.shields.io/badge/QBCore-AAA%20Inventory%20V3-00d1b2?style=for-the-badge&logo=fivem&logoColor=white)
![React](https://img.shields.io/badge/React%2018%20+%20Vite-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Lua](https://img.shields.io/badge/Lua-2C2D72?style=for-the-badge&logo=lua&logoColor=white)

Un reemplazo revolucionario y moderno de nivel **AAA** para `qb-inventory` de QBCore Framework. Introduce una mecánica de organización espacial **Tetris (10x10)**, física vehicular automática y un motor visual dinámico con temas seleccionables en tiempo real.

---

## 🌟 Características Principales

### 📦 1. Sistema Espacial Tetris 10x10
* **Geometría de Ítems:** Los objetos ya no ocupan una simple ranura lineal. Cada ítem tiene dimensiones reales de alto y ancho (p. ej., Rifles 5x2, Pistolas 3x2, Balas 1x1).
* **Rotación en Tiempo Real:** Rotación fluida de objetos durante el arrastre (`R` o botón derecho del ratón) para encajar perfectamente en la rejilla de equipaje.
* **Celdas Ampliadas:** Rejilla optimizada con casillas de alta definición que permiten apreciar los dibujos de armas y objetos en resolución completa.
* **Blindaje Visual CEF:** Badges de apilamiento (`x50`) optimizados con `w-max h-max inline-flex` para evitar deformaciones en motores Chromium de GTA V.

### 🚗 2. Física Vehicular Estándar de QBCore (`client/main.lua`)
* **Apertura Contextual Única:** Al pulsar la tecla de inventario (**`TAB`** o **`I`**), el sistema determina automáticamente tu entorno físico:
  1. **🗃️ Guanteras (`Glovebox`):** Si estás sentado en cualquier asiento dentro de un coche, abre automáticamente la guantera vinculada a la matrícula MySQL del vehículo (Capacidad: 10 KG).
  2. **🚙 Maleteros Exteriores (`Trunk`):** Si estás a pie en la calle detrás de un vehículo (distancia < 2.5 metros del paragolpes trasero) y el coche está desbloqueado (`lockStatus < 2`), calcula e hidrata automáticamente su maletero.
  3. **⚖️ Pesos Dinámicos por Clase:** Turismos/Deportivos (60 KG), SUV/Todoterrenos (80 KG), Furgones/Camiones (120 KG).
  4. **🛍️ Drops Prioritarios:** Si estás cerca de una bolsa tirada en el suelo, la abre automáticamente al presionar inventario.

### 🎨 3. Motor de Temas V3 en Tiempo Real
Accesible mediante el botón de engranaje (⚙️) en la interfaz:
* **Minimalista Traslúcido (AAA):** Diseño moderno con desenfoque de fondo (`backdrop-blur-md`), bordes sutiles y tipografía limpia.
* **Terminal PipBoy:** Estilo retro-futurista verde monocromo inspirado en Fallout.
* **Táctico Militar Tarkov:** Fondos oscuros mate, bordes verde oliva y rejillas de alto contraste.
* **Urbano Neón:** Sombras profundas y brillos cian adaptados al roleplay nocturno.
* **Color de Acento Personalizable:** Selector de paleta HEX dinámico que guarda tus preferencias visuales en la memoria local del cliente.

### 👑 4. Panel de Administración (`/inventoryadmin`)
* **Menú Visual Interactivo:** Despacha cualquier ítem del servidor a jugadores conectados de forma gráfica.
* **Búsqueda instantánea:** Filtro en tiempo real por nombre o etiqueta del objeto con previsualización 3D.
* **Seguridad de Red:** Autenticación de servidor infalible (`HasPermission('admin')` o `'god'`).
* **Notificaciones Bilaterales:** Avisos sonoros y visuales en pantalla confirmando la transacción transaccional tanto al admin como al receptor.

---

## 🏗️ Arquitectura Técnica y Estructura

```text
qb-inventory/
├── client/
│   └── main.lua              # Núcleo vehicular, oyentes NUI, callbacks y comando /inventoryadmin
├── server/
│   └── main.lua              # Sincronización Tetris MySQL, transacciones de tienda, stashes y AdminGiveItem
├── web/
│   ├── src/
│   │   ├── App.jsx           # Contenedor raíz, oyente global de cierre (ESC, TAB, F2, I) y motor de temas
│   │   ├── components/
│   │   │   ├── Grid.jsx      # Rejilla Tetris espacial 10x10, física de colisión y arrastre
│   │   │   ├── Equipment.jsx # Slots anatómicos de personaje (cabeza, chaleco, mochila, manos)
│   │   │   ├── AdminPanel.jsx# Interfaz de despacho administrativo con resolución NUI/HTTP fallback
│   │   │   └── QuickAccessBar.jsx # Barra rápida 1-6 con propagación de eventos aislada
│   │   └── index.css         # Estilos Tailwind y variables CSS dinámicas
│   └── dist/                 # Empaquetado de producción compilado por Vite
└── README.md                 # Manual técnico del proyecto
```

---

## 🛠️ Desarrollo e Instalación en otro PC

### Requisitos Previos
* Node.js v18+ y npm.
* Servidor FiveM con QBCore Framework actualizado.

### Instrucciones para continuar el trabajo mañana:

1. **Clonar o descargar** este repositorio en la carpeta `resources/[qb]/` del nuevo servidor.
2. **Desarrollo Web local:**
   ```bash
   cd qb-inventory/web
   npm install
   npm run dev
   ```
   *(Abre `http://localhost:5173` en tu navegador para diseñar la interfaz con datos simulados).*

3. **Compilar para Producción (FiveM):**
   Cada vez que modifiques código de React en `web/src/`, debes empaquetarlo:
   ```bash
   cd qb-inventory/web
   npm run build
   ```
   *Esto generará el código optimizado en `web/dist/` que lee FiveM.*

4. **Reiniciar en el servidor:**
   En la consola de FiveM (o txAdmin):
   ```bash
   ensure qb-inventory
   ```
   *(Si actualizaste ficheros JS de `dist/`, **cierra y abre tu juego FiveM** para vaciar la caché de CEF).*

---

## ❤️ Créditos y Colaboración
Desarrollado y optimizado con amor para **HidmomTv** y su hermano. Pair programming asistido por Antigravity DeepMind. ¡A romperla mañana! 🚀
