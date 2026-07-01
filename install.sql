-- ============================================================
-- qb-inventory — SQL de instalación completo
-- Ejecutar en tu base de datos MySQL/MariaDB
-- ============================================================

-- Inventario de jugadores (usada por QBCore en la tabla players)
-- La columna inventory ya existe en la tabla players de QBCore

-- Stashes / Armarios
CREATE TABLE IF NOT EXISTS `stashitems` (
    `id`    INT(11) NOT NULL AUTO_INCREMENT,
    `stash` VARCHAR(255) NOT NULL,
    `items` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `stash` (`stash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Maleteros de vehículos
CREATE TABLE IF NOT EXISTS `trunkitems` (
    `id`    INT(11) NOT NULL AUTO_INCREMENT,
    `plate` VARCHAR(50) NOT NULL,
    `items` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `plate` (`plate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Guanteras de vehículos
CREATE TABLE IF NOT EXISTS `gloveboxitems` (
    `id`    INT(11) NOT NULL AUTO_INCREMENT,
    `plate` VARCHAR(50) NOT NULL,
    `items` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `plate` (`plate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Inventarios genéricos (drops, contenedores personalizados)
CREATE TABLE IF NOT EXISTS `inventories` (
    `id`         INT(11) NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(255) NOT NULL,
    `items`      LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
    PRIMARY KEY (`identifier`),
    KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
