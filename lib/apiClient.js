const API_BASE_URL = 'https://sardinaconquesofrito427.lat/destilo';
// const API_BASE_URL = 'http://localhost:3001/destilo';

export async function apiClient(uid, endpoint, options = {}) {
  console.log(`########## LLAMANDO ENDPOINT ${endpoint} ##################`)
  console.log(`########## LLAMANDO ENDPOINT OPTIONS ##################`)
  console.log(options)
  
  // Verificar si el método es GET
  const isGetMethod = !options.method || options.method.toUpperCase() === 'GET';
  console.log('¿Es método GET?:', isGetMethod);

  if (!uid) {
    return { message: 'error: Falta el uid de acceso para realizar esta accion' }
  }
  
  const ADMIN_UID = process.env.ADMIN_UID;

  // si el metodo no es get, verifica si el uid es el mismo que el de admin
  if(!isGetMethod){
    console.log('isGetMethod',isGetMethod)
    console.log('admin?',ADMIN_UID.toString(),uid.toString())
    if (ADMIN_UID.toString() !== uid.toString()) {
      throw new Error('No tienes los permisos para ejecutar esta accion');
    }
  }
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      console.log(data)
      throw new Error(data.message || 'Error en la petición');
    }
    return data;
  } catch (error) {
    console.error(`Error en la petición a ${endpoint}:`, error);
    throw error;
  }
}

// Funciones específicas para cada tipo de operación
export const api = {
  // Clientes
  getCustomers: (uid) => apiClient(uid,'/customers'),
  createCustomer: (uid,data) => apiClient(uid,'/customers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  deleteCustomer: (uid,id) => apiClient(uid,`/customers/${id}`, {
    method: 'DELETE'
  }),

  // Proveedores
  getSuppliers: (uid) => apiClient(uid,'/suppliers'),
  createSupplier: (uid,data) => apiClient(uid,'/suppliers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  deleteSupplier: (uid,id) => apiClient(uid,`/suppliers/${id}`, {
    method: 'DELETE'
  }),

  // Servicios
  getServices: (uid) => apiClient(uid,'/services'),
  createService: (uid,data) => apiClient(uid,'/services', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateService: (uid,id, data) => apiClient(uid,`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteService: (uid,id) => apiClient(uid,`/services/${id}`, {
    method: 'DELETE'
  }),

  // Inventario
  getStocks: (uid) => apiClient(uid,'/stocks'),
  getStock: (uid,id) => apiClient(uid,`/stocks/${id}`),
  updateStockQuantity: (uid,id, quantity) => apiClient(uid,`/stocks/${id}/quantity`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  }),
  updateStockById: (uid,id, data) => apiClient(uid,`/stocks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteStock: (id) => apiClient(uid,`/stocks/${id}`, {
    method: 'DELETE'
  }),

  // Ventas
  getSells: (uid) => apiClient(uid,'/sells'),
  createSell: (uid,data) => apiClient(uid,'/sells', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Datos generales
  createData: (data) => apiClient(uid,'/stocks', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateData: (collection, id, data) => apiClient(uid,`/data/${collection}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteData: (uid,id) => apiClient(uid,`/stocks/${id}`, {
    method: 'DELETE'
  })
};
