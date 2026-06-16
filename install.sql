CREATE TABLE IF NOT EXISTS `universal_items` (
    `name` VARCHAR(50) NOT NULL,
    `label` VARCHAR(50) NOT NULL,
    `weight` FLOAT NOT NULL DEFAULT 0,
    `type` VARCHAR(50) NOT NULL DEFAULT 'item',
    `image` VARCHAR(100) NOT NULL,
    `is_unique` TINYINT(1) NOT NULL DEFAULT 0,
    `useable` TINYINT(1) NOT NULL DEFAULT 0,
    `description` TEXT DEFAULT NULL,
    `tetris_width` INT NOT NULL DEFAULT 1,
    `tetris_height` INT NOT NULL DEFAULT 1,
    `combinable` TEXT DEFAULT NULL,
    PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
