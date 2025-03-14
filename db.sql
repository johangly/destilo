CREATE DATABASE dEstilo_plus; -- Crea la base de datos

USE dEstilo_plus; -- Se conecta a la base de datos

-- Crea las tablas correspondientes con su estructura

-- Tabla clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,      -- Identificador único del cliente
    cedula VARCHAR(20) NOT NULL,            -- Cédula del cliente (string)
    ciudad VARCHAR(100) NOT NULL,           -- Ciudad del cliente (string)
    cliente VARCHAR(100) NOT NULL,          -- Nombre del cliente (string)
    direccion VARCHAR(255) NOT NULL,        -- Dirección del cliente (string)
    email VARCHAR(100) UNIQUE,              -- Correo electrónico del cliente (string, único)
    empresa VARCHAR(100),                   -- Empresa del cliente (string, opcional)
    fechaRegistro VARCHAR(50) NOT NULL,     -- Fecha de registro del cliente (string)
    nrocasa VARCHAR(50),                    -- Número de casa o edificio (string, opcional)
    pais VARCHAR(100) NOT NULL,             -- País del cliente (string)
    provincia VARCHAR(100) NOT NULL,        -- Provincia del cliente (string)
    rif VARCHAR(20),                        -- RIF del cliente (string, opcional)
    telefono VARCHAR(20)                    -- Teléfono del cliente (string)
);

-- Tabla proveedores
CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cargo VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    fechaRegistro VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    productos VARCHAR(255),
    razonSocial VARCHAR(100) NOT NULL,
    rif VARCHAR(20) NOT NULL,
    servicios VARCHAR(255),
    telefono VARCHAR(20),
    webrrss VARCHAR(100)
);

-- Tabla direcciones_proveedores
CREATE TABLE direcciones_proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,      -- Identificador único de la dirección
    proveedor_id INT NOT NULL,              -- Relación con el proveedor
    calle VARCHAR(100) NOT NULL,            -- Calle de la dirección (string)
    ciudad VARCHAR(100) NOT NULL,           -- Ciudad de la dirección (string)
    estado VARCHAR(100) NOT NULL,           -- Estado de la dirección (string)
    numero VARCHAR(20) NOT NULL,            -- Número de la dirección (string)
    pais VARCHAR(100) NOT NULL,             -- País de la dirección (string)
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE  -- Clave foránea a proveedores
);

-- Tabla sells
CREATE TABLE sells (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha VARCHAR(50) NOT NULL,
    id_factura BIGINT NOT NULL
);

-- Tabla productos_vendidos
CREATE TABLE productos_vendidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sell_id INT NOT NULL,
    cantidad INT NOT NULL,
    fecha VARCHAR(50) NOT NULL,
    producto_id VARCHAR(50) NOT NULL,
    service_id VARCHAR(50),
    nombre VARCHAR(100) NOT NULL,
    precioTotal DECIMAL(10, 2) NOT NULL,
    precioUnitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (sell_id) REFERENCES sells(id) ON DELETE CASCADE
    FOREIGN KEY (service_id) REFERENCES servicios_vendidos(id) ON DELETE CASCADE
);

-- Tabla servicios_vendidos
 CREATE TABLE servicios_vendidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sell_id INT NOT NULL,
    cantidad INT NOT NULL,
    fecha VARCHAR(50) NOT NULL,
    service_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    precioTotal DECIMAL(10, 2) NOT NULL,
    precioUnitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (sell_id) REFERENCES sells(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Tabla stocks
CREATE TABLE stocks (
    id INT AUTO_INCREMENT PRIMARY KEY,      -- Identificador único del registro en stock
    cantidad VARCHAR(20) NOT NULL,          -- Cantidad disponible en stock (string)
    codigo VARCHAR(50) NOT NULL,            -- Código del producto (string)
    precioUnitario VARCHAR(20) NOT NULL,    -- Precio unitario del producto (string)
    producto VARCHAR(100) NOT NULL,         -- Nombre del producto (string)
    proveedor VARCHAR(100) NOT NULL         -- Nombre del proveedor (string)
);

-- Tabla users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'employee') NOT NULL DEFAULT 'employee',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- comando para agregar status y email a la tabal users
ALTER TABLE users
ADD COLUMN status ENUM('pending', 'validated') NOT NULL DEFAULT 'pending',
ADD COLUMN email VARCHAR(255) NOT NULL;

-- para agregar service_id a productos_vendidos

ALTER TABLE productos_vendidos
ADD COLUMN service_id INT,
ADD CONSTRAINT fk_service_id
FOREIGN KEY (service_id)
REFERENCES servicios_vendidos(id)
ON DELETE CASCADE;

CREATE TABLE activation_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único del token
  token VARCHAR(255) NOT NULL, -- Token único para la activación
  expiration DATETIME NOT NULL, -- Fecha y hora de expiración del token
  user_id INT NOT NULL, -- Clave foránea que referencia al usuario
  FOREIGN KEY (user_id) REFERENCES users(id) -- Relación con la tabla users
);