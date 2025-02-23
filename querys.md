# Documentación de Consultas a Firebase/Firestore

## Configuración
La configuración de Firebase se encuentra en `/lib/firebase.js`. Se inicializa la aplicación y se exporta la instancia de Firestore.

## Consultas por Categoría

### Clientes (Customers)

#### Obtener Clientes
- **Archivo**: `/app/api/getCustomers/route.js`
- **Operación**: Lectura (Read)
- **Método**: `getDocs`
- **Colección**: 'customers'
- **Descripción**: Obtiene todos los clientes almacenados en la base de datos.

#### Agregar Cliente
- **Archivo**: `/app/api/addCustomer/route.js`
- **Operación**: Creación (Create)
- **Método**: `addDoc`
- **Colección**: 'customers'
- **Descripción**: Agrega un nuevo cliente a la base de datos.

#### Eliminar Cliente
- **Archivo**: `/app/api/deleteCustomer/route.js`
- **Operación**: Eliminación (Delete)
- **Método**: `deleteDoc`
- **Descripción**: Elimina un cliente específico usando su ID.

### Proveedores (Suppliers)

#### Obtener Proveedores
- **Archivo**: `/app/api/getSuppliers/route.js`
- **Operación**: Lectura (Read)
- **Método**: `getDocs`
- **Colección**: 'suppliers'
- **Descripción**: Obtiene la lista de todos los proveedores.

#### Agregar Proveedor
- **Archivo**: `/app/api/addSupplier/route.js`
- **Operación**: Creación (Create)
- **Método**: `addDoc`
- **Colección**: 'suppliers'
- **Descripción**: Agrega un nuevo proveedor al sistema.

#### Eliminar Proveedor
- **Archivo**: `/app/api/deleteSupplier/route.js`
- **Operación**: Eliminación (Delete)
- **Método**: `deleteDoc`
- **Descripción**: Elimina un proveedor específico por su ID.

### Servicios

#### Obtener Servicios
- **Archivo**: `/app/api/getServices/route.js`
- **Operación**: Lectura (Read)
- **Método**: `getDocs`
- **Colección**: 'services'
- **Descripción**: Obtiene todos los servicios disponibles.

#### Agregar Servicio
- **Archivo**: `/app/api/services/addService/route.js`
- **Operación**: Creación (Create)
- **Método**: `addDoc`
- **Colección**: 'services'
- **Descripción**: Agrega un nuevo servicio al catálogo.

#### Editar Servicio
- **Archivo**: `/app/api/services/editService/route.js`
- **Operación**: Actualización (Update)
- **Método**: `updateDoc`
- **Descripción**: Modifica los detalles de un servicio existente.

#### Eliminar Servicio
- **Archivo**: `/app/api/services/deleteService/route.js`
- **Operación**: Eliminación (Delete)
- **Método**: `deleteDoc`
- **Descripción**: Elimina un servicio específico.

### Inventario y Stock

#### Obtener Datos de Stock
- **Archivo**: `/app/api/getStocksData/route.js`
- **Operación**: Lectura (Read)
- **Método**: `getDocs`
- **Colección**: 'stocks'
- **Descripción**: Obtiene todos los items en inventario.

#### Editar Cantidad de Item
- **Archivo**: `/app/api/editItemQty/route.js`
- **Operación**: Actualización (Update)
- **Método**: `updateDoc`
- **Descripción**: Actualiza la cantidad disponible de un item específico.

### Ventas

#### Obtener Ventas
- **Archivo**: `/app/api/getSellsData/route.js`
- **Operación**: Lectura (Read)
- **Método**: `getDocs`
- **Colección**: 'sells'
- **Descripción**: Obtiene el registro de todas las ventas realizadas.

#### Agregar Venta
- **Archivo**: `/app/api/addSells/route.js`
- **Operación**: Creación (Create)
- **Método**: `addDoc`
- **Colección**: 'sells'
- **Descripción**: Registra una nueva venta en el sistema.

### Datos Generales

#### Agregar Datos
- **Archivo**: `/app/api/addData/route.js`
- **Operación**: Creación (Create)
- **Método**: `addDoc`
- **Descripción**: Agrega nuevos datos a una colección específica.

#### Editar Datos
- **Archivo**: `/app/api/editData/route.js`
- **Operación**: Actualización (Update)
- **Método**: `updateDoc`
- **Descripción**: Actualiza datos existentes en una colección específica.

#### Eliminar Datos
- **Archivo**: `/app/api/deleteData/route.js`
- **Operación**: Eliminación (Delete)
- **Método**: `deleteDoc`
- **Descripción**: Elimina datos específicos de una colección.
