# Guía de Contribución

¡Gracias por querer mejorar **qb-inventory by HidmomTv**! Sigue estas pautas para mantener el código organizado y facilitar la revisión de los PRs.

---

## 🚀 ¿Cómo contribuir?

### 1. Haz un Fork del repositorio
Haz clic en el botón **Fork** de la esquina superior derecha.

### 2. Clona tu fork localmente
```bash
git clone https://github.com/TU_USUARIO/intentory.git
cd intentory
```

### 3. Crea una rama para tu cambio
Usa nombres descriptivos en inglés o español:
```bash
git checkout -b fix/admin-permissions
git checkout -b feat/new-hotbar-slots
git checkout -b docs/update-readme
```

### 4. Haz tus cambios
- Prueba siempre en un servidor FiveM con QBCore antes de enviar un PR
- Mantén los cambios enfocados — un PR = una sola mejora o corrección

### 5. Commitea con mensajes claros
Sigue el formato `tipo: descripción`:
```
feat: añadir soporte para inventarios de contenedores custom
fix: corregir error al sacar items de maletero vacío
docs: actualizar README con nuevos ejemplos de exportación
refactor: simplificar función GetContainerData
```

### 6. Sube tu rama y abre el PR
```bash
git push origin feat/mi-mejora
```
Luego abre un Pull Request en GitHub describiendo:
- **¿Qué cambia?**
- **¿Por qué es útil?**
- **¿Cómo probarlo?**

---

## 📋 Estándares de código

### Lua
- Indentación con **4 espacios**
- Nombres de variables en `camelCase` o `PascalCase` para tablas globales
- Comentarios en español para lógica de negocio
- Evita variables globales innecesarias
- Usa `local` siempre que sea posible

### JavaScript (app.js)
- Indentación con **4 espacios**
- Usa `const`/`let`, nunca `var`
- Nombres descriptivos en inglés
- Evita manipulación directa del DOM sin verificar si el elemento existe

### CSS (style.css)
- Variables CSS en `:root` para colores y tamaños reutilizables
- Clases BEM o descriptivas en inglés/español
- No uses `!important` salvo casos extremos

---

## 🐛 Reportar bugs

Abre un [Issue](https://github.com/HidmomTv/intentory/issues) con:

1. **Descripción breve** del problema
2. **Pasos para reproducirlo**
3. **Comportamiento esperado vs real**
4. **Versión de FiveM, QBCore y oxmysql**
5. **Logs de error** del servidor o cliente si los hay

---

## 💡 Proponer mejoras

Abre un Issue con la etiqueta `enhancement` y describe:
- Qué funcionalidad quieres añadir
- Por qué sería útil para la comunidad
- Si tienes idea de cómo implementarla

---

## ✅ Checklist antes de enviar un PR

- [ ] Probado en servidor local con QBCore
- [ ] Sin errores en la consola de FiveM
- [ ] El código sigue el estilo del proyecto
- [ ] El PR describe claramente el cambio
- [ ] No rompe funcionalidad existente

---

Gracias por contribuir ❤️ — **HidmomTv**
