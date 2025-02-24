// const API_BASE_URL = 'https://sardinaconquesofrito427.lat/destilo';
const API_BASE_URL = 'http://localhost:3001/destilo';

export async function apiClient(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    console.log('#################### consultar inicio ####################')
    console.log(`${API_BASE_URL}${endpoint}`, options);
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      console.log('~!~~~~~~~~~~~~~~~~response error!~~~~~~~~~~~~')
      console.log(response)
      throw new Error(data.message || 'Error en la petición');
    }
    console.log(`--------------- CONSULTA RESPUESTA ----------------`)
    console.log(data)
    console.log('#################### consultar final ####################')
    return data;
  } catch (error) {
    console.error(`Error en la petición a ${endpoint}:`, error);
    throw error;
  }
}

// Funciones específicas para cada tipo de operación
export const api = {
  // Clientes
  getCustomers: () => apiClient('/customers'),
  createCustomer: (data) => apiClient('/customers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  deleteCustomer: (id) => apiClient(`/customers/${id}`, {
    method: 'DELETE'
  }),

  // Proveedores
  getSuppliers: () => apiClient('/suppliers'),
  createSupplier: (data) => apiClient('/suppliers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  deleteSupplier: (id) => apiClient(`/suppliers/${id}`, {
    method: 'DELETE'
  }),

  // Servicios
  getServices: () => apiClient('/services'),
  createService: (data) => apiClient('/services', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateService: (id, data) => apiClient(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteService: (id) => apiClient(`/services/${id}`, {
    method: 'DELETE'
  }),

  // Inventario
  getStocks: () => apiClient('/stocks'),
  getStock: (id) => apiClient(`/stocks/${id}`),
  updateStockQuantity: (id, quantity) => apiClient(`/stocks/${id}/quantity`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  }),
  updateStockById: (id, data) => apiClient(`/stocks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteStock: (id) => apiClient(`/stocks/${id}`, {
    method: 'DELETE'
  }),

  // Ventas
  getSells: () => apiClient('/sells'),
  createSell: (data) => apiClient('/sells', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Datos generales
  createData: (data) => apiClient('/stocks', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateData: (collection, id, data) => apiClient(`/data/${collection}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteData: (id) => apiClient(`/stocks/${id}`, {
    method: 'DELETE'
  })
};
