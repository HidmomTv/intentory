# 🎒 qb-inventory — by HidmomTv

<p align="center">
  <img src="https://img.shields.io/badge/Author-HidmomTv-blue?style=for-the-badge&logo=github&logoColor=white" />
  <img src="https://img.shields.io/badge/Framework-QBCore-00d1b2?style=for-the-badge&logo=fivem&logoColor=white" />
  <img src="https://img.shields.io/badge/License-GPL--3.0-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Contributions-Welcome-brightgreen?style=for-the-badge" />
</p>

Un reemplazo completo y moderno del inventario estándar de QBCore Framework, con interfaz visual custom (HTML/CSS/JS), sistema de contenedores vehiculares, tiendas, stashes, menú de admin y mucho más.

> **Creado y mantenido por [HidmomTv](https://github.com/HidmomTv).**  
> Las contribuciones externas son bienvenidas — lee la sección [Contribuir](#-contribuir).

---

## ✨ Características

- **Inventario visual moderno** — interfaz HTML/CSS/JS completamente personalizable con temas de color
- **Drag & drop** — mueve ítems entre slots arrastrando con el ratón
- **Inventarios secundarios** — maleteros, guanteras y stashes con persistencia en base de datos
- **Tiendas** — soporte completo para compra de ítems vía NUI
- **Menú de admin** — panel visual para dar ítems a jugadores (`/inventoryadmin`, `/giveitem`)
- **Sistema de ropa** — panel lateral para equipar/quitar ropa al personaje
- **Crafting** — recetas básicas de fabricación en el cliente
- **Hotbar** — barra de acceso rápido (slots 1–5) con atajos de teclado
- **Sistema de armas** — inspección y gestión de armas dentro del inventario
- **Drops al suelo** — al morir o tirar ítems, aparecen como bolsas recogibles en el mundo
- **Sincronización en tiempo real** — el inventario se actualiza al instante tras cada operación

---

## 📋 Requisitos

| Dependencia | Versión mínima |
|-------------|----------------|
| [QBCore Framework](https://github.com/qbcore-framework/qb-core) | Latest |
| [oxmysql](https://github.com/overextended/oxmysql) | Latest |
| FiveM Server | Artifact 6683+ |

---

## 🛠️ Instalación

### 1. Descarga el recurso
```bash
cd resources/[qb]/
git clone https://github.com/HidmomTv/intentory.git qb-inventory
```

### 2. Importa la base de datos
Ejecuta el archivo SQL en tu base de datos MySQL:
```bash
mysql -u root -p tu_base_de_datos < qb-inventory.sql
```
O usa el archivo `install.sql` si es una instalación nueva.

### 3. Activa el recurso
En tu `server.cfg`:
```
ensure qb-inventory
```

### 4. Reinicia el servidor o usa txAdmin
```
refresh
start qb-inventory
```

---

## ⚙️ Configuración

Edita `config/config.lua` para ajustar:
- `Config.MaxWeight` — peso máximo del inventario del jugador
- `Config.MaxSlots` — número de slots de la mochila
- `Config.StashSize` — tamaño de los stashes
- `Config.TrunkWeights` — pesos de maleteros según clase de vehículo

---

## 🔑 Permisos de Administrador

Los comandos y el panel de admin requieren uno de estos grupos de permiso en QBCore/txAdmin:
- `admin`
- `god`
- `command`
- `mod`
- Ace `command`

### Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `/giveitem [id] [item] [cantidad]` | Da un ítem a un jugador |
| `/clearinv [id]` | Limpia el inventario de un jugador |
| `/inventoryadmin` | Abre el panel visual de administración |

---

## 🚗 Integración vehicular

Para abrir el maletero/guantera desde otro recurso:
```lua
-- Maletero
exports['qb-inventory']:OpenTrunk(source, plate)

-- Guantera
exports['qb-inventory']:OpenGlovebox(source, plate)

-- Stash
exports['qb-inventory']:OpenStash(source, stashId)
```

---

## 🛒 Integración de tiendas

Registra una tienda desde tu script:
```lua
exports['qb-inventory']:CreateShop({
    name = "mi_tienda",
    label = "Tienda General",
    items = {
        { name = "water", price = 50, amount = 99 },
        { name = "bread", price = 30, amount = 99 },
    }
})

-- Abrirla para un jugador
exports['qb-inventory']:OpenShop(source, "mi_tienda")
```

---

## 📁 Estructura del proyecto

```
qb-inventory/
├── client/
│   ├── main.lua          # Lógica principal cliente (NUI, eventos, teclado)
│   ├── clothing.lua      # Gestión del menú de ropa
│   ├── loot.lua          # Sistema de drops/loot
│   ├── rob.lua           # Robos entre jugadores
│   ├── crafting.lua      # Crafting client-side
│   ├── weapons.lua       # Gestión de armas
│   └── hotbar.lua        # Barra de acceso rápido
├── server/
│   ├── main.lua          # Lógica principal servidor (contenedores, tiendas, sync)
│   ├── functions.lua     # Funciones auxiliares y callbacks
│   ├── items.lua         # Carga de ítems de QBCore
│   └── commands.lua      # Comandos de administración
├── html/
│   ├── index.html        # Estructura HTML de la interfaz NUI
│   ├── style.css         # Estilos visuales con temas de color
│   ├── app.js            # Lógica JS del inventario (drag&drop, NUI callbacks)
│   └── images/           # Imágenes de ítems
├── config/
│   └── config.lua        # Configuración del recurso
├── locales/              # Traducciones (es, en, ...)
├── install.sql           # SQL inicial
├── fxmanifest.lua        # Manifiesto FiveM
└── README.md
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Sigue estos pasos:

1. **Fork** este repositorio
2. Crea una rama nueva: `git checkout -b feature/mi-mejora`
3. Haz tus cambios y commitea: `git commit -m "feat: descripción del cambio"`
4. Haz push a tu fork: `git push origin feature/mi-mejora`
5. Abre un **Pull Request** describiendo el cambio

### Guía de estilo
- Código Lua siguiendo las convenciones de QBCore
- Comentarios en **español** si es lógica de negocio, **inglés** si es técnico
- Sin dependencias externas nuevas sin consultar primero en un Issue
- Probado en un servidor FiveM con QBCore antes de hacer el PR

### Bugs y sugerencias
Abre un [Issue](https://github.com/HidmomTv/intentory/issues) con:
- Descripción del problema o idea
- Pasos para reproducirlo (si es un bug)
- Versión del servidor y QBCore

---

## 📄 Licencia

Distribuido bajo la licencia [GPL-3.0](LICENSE).  
Puedes usar, modificar y redistribuir el código **siempre que mantengas la misma licencia y créditos al autor original**.

---

<p align="center">
  Hecho con ❤️ por <a href="https://github.com/HidmomTv">HidmomTv</a>
</p>
