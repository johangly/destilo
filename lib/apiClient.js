const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://sardinaconquesofrito427.lat/destilo'
  : 'http://localhost:3001/destilo';

export async function apiClient(role, endpoint, options = {}) {
  
  // Verificar si el método es GET
  const isGetMethod = !options.method || options.method.toUpperCase() === 'GET';

  const ADMIN_ROLE = process.env.ADMIN_ROLE;

  // si el metodo no es get, verifica si el uid es el mismo que el de admin
  if(!isGetMethod){
    if (!role) {
      return { message: 'error: Falta permisos para realizar esta accion' }
    }

    if (ADMIN_ROLE.toString() !== role.toString()) {
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
      throw new Error(data.message || 'Error en la petición');
    }

    return data;
  } catch (error) {
    console.error(`Error en la petición a ${endpoint}:`, error);
    throw error;
  }
}

export async function handleLogin(endpoint, options = {}) {
  
  // Verificar si el método es GET
  const isPostMethod = !options.method || options.method.toUpperCase() === 'POST';

  // si el metodo no es get, verifica si el uid es el mismo que el de admin
  if(!isPostMethod){
    throw new Error('No se puede ejecutar esta accion');
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
      throw new Error(data.message || 'Error en la petición');
    }
    return data;
  } catch (error) {
    console.error(`Error en la petición a ${endpoint}:`, error);
    throw error;
  }
}

export async function recoveryPassword(endpoint, options = {}) {
  const isPutMethod = !options.method || options.method.toUpperCase() === 'PUT';
  const isPostMethod = !options.method || options.method.toUpperCase() === 'POST';
  
  if(!isPutMethod && !isPostMethod){
    throw new Error('No se puede ejecutar esta accion');
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
    console.log('API response',response)
    const data = await response.json();
    if (!response.ok) {
      console.error(response)
      console.error(data)
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
  getCustomers: (role) => apiClient(role,'/customers'),
  createCustomer: (role,data) => apiClient(role,'/customers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  deleteCustomer: (role,id) => apiClient(role,`/customers/${id}`, {
    method: 'DELETE'
  }),

  // Proveedores
  getSuppliers: (role) => apiClient(role,'/suppliers'),
  createSupplier: (role,data) => apiClient(role,'/suppliers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  deleteSupplier: (role,id) => apiClient(role,`/suppliers/${id}`, {
    method: 'DELETE'
  }),

  // Servicios
  getServices: (role) => apiClient(role,'/services'),
  createService: (role,data) => apiClient(role,'/services', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateService: (role,id, data) => apiClient(role,`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteService: (role,id) => apiClient(role,`/services/${id}`, {
    method: 'DELETE'
  }),

  // Inventario
  getStocks: (role) => apiClient(role,'/stocks'),
  getStock: (role,id) => apiClient(role,`/stocks/${id}`),
  updateStockQuantity: (role,id, quantity) => apiClient(role,`/stocks/${id}/quantity`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  }),
  updateStockById: (role,id, data) => apiClient(role,`/stocks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteStock: (id) => apiClient(role,`/stocks/${id}`, {
    method: 'DELETE'
  }),

  // Ventas
  getSells: (role) => apiClient(role, '/sells'),
  getSellsById: (role,id) => apiClient(role, `/sells/${id}`),
  createSell: (role,data) => apiClient(role,'/sells', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getBestSells: (role) => apiClient(role, '/sells/best-sells'),
  getBestServices: (role) => apiClient(role, '/sells/best-services'),
  getWeekSells: (role) => apiClient(role, '/sells/week-sells'),

  // Datos generales
  createData: (role,data) => apiClient(role,'/stocks', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateData: (collection, id, data) => apiClient(role,`/data/${collection}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteData: (role,id) => apiClient(role,`/stocks/${id}`, {
    method: 'DELETE'
  }),

   // Usuarios
   getUsers: (role) => apiClient(role, '/users'),
   getUsersById: (role,id) => apiClient(role, `/users/${id}`),
   createUser: (role,data) => apiClient(role,'/users', {
     method: 'POST',
     body: JSON.stringify(data)
   }),
   updateUser: (role,id, data) => apiClient(role,`/users/${id}`, {
     method: 'PUT',
     body: JSON.stringify(data)
   }),
   deleteUser: (role,id) => apiClient(role,`/users/${id}`, {
     method: 'DELETE'
   }),

   // handle login routes
   login: (data) => handleLogin('/login', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // token
  checkValidateToken: (token) => apiClient('any',`/token-validation/${token}`),
  requestResetPassword : (email) => recoveryPassword(`/reset-password/request`,{
    method: 'POST',
    body: JSON.stringify({email})
  }),
  resetPassword: (token, newPassword) => recoveryPassword(`/reset-password/reset`,{
    method: 'PUT',
    body: JSON.stringify({token, newPassword})
  })
};
