const API_BASE_URL = 'https://sardinaconquesofrito427.lat/destilo';

// Función base para hacer peticiones a la API
async function fetchApi(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Servicios de Clientes
export const customerService = {
  getAll: () => fetchApi('/customers'),
  create: (data) => fetchApi('/customers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  delete: (id) => fetchApi(`/customers/${id}`, {
    method: 'DELETE'
  })
};

// Servicios de Proveedores
export const supplierService = {
  getAll: () => fetchApi('/suppliers'),
  create: (data) => fetchApi('/suppliers', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  delete: (id) => fetchApi(`/suppliers/${id}`, {
    method: 'DELETE'
  })
};

// Servicios de Servicios
export const serviceService = {
  getAll: () => fetchApi('/services'),
  create: (data) => fetchApi('/services', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => fetchApi(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => fetchApi(`/services/${id}`, {
    method: 'DELETE'
  })
};

// Servicios de Stock
export const stockService = {
  getAll: () => fetchApi('/stocks'),
  updateQuantity: (id, quantity) => fetchApi(`/stocks/${id}/quantity`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  })
};

// Servicios de Ventas
export const sellService = {
  getAll: () => fetchApi('/sells'),
  create: (data) => fetchApi('/sells', {
    method: 'POST',
    body: JSON.stringify(data)
  })
};

// Servicios de Datos Generales
export const dataService = {
  create: (collection, data) => fetchApi(`/data/${collection}`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (collection, id, data) => fetchApi(`/data/${collection}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (collection, id) => fetchApi(`/data/${collection}/${id}`, {
    method: 'DELETE'
  })
};
