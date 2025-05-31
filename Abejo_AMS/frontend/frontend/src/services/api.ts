import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

// Test connection function
export const testConnection = async () => {
  try {
    const response = await api.get('/health');
    console.log('✅ Connection test successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    throw error;
  }
};

// Appointment API
export const appointmentAPI = {
  test: () => api.get('/test'),
  
  // Get pending appointments (for list.tsx)
  getAll: () => {
    console.log('📋 Fetching pending appointments for list.tsx...');
    return api.get('/appointments');
  },

  // Get confirmed appointments (for pending_list.tsx)
  getPending: () => {
    console.log('📋 Fetching confirmed appointments for pending_list.tsx...');
    return api.get('/appointments/pending');
  },

  create: (formData) => {
    console.log('📝 Creating appointment...');
    return api.post('/appointments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Confirm appointment (moves from list.tsx to pending_list.tsx)
  confirm: (id) => {
    console.log(`✅ Confirming appointment ${id} (moving to pending list)...`);
    return api.put(`/appointments/${id}/confirm`);
  },

  // Complete appointment (moves from pending_list.tsx to patient records)
  complete: (id) => {
    console.log(`✅ Completing appointment ${id} (moving to patient records)...`);
    return api.put(`/appointments/${id}/complete`);
  },

  cancel: (id) => {
    console.log(`🚫 Cancelling appointment ${id}...`);
    return api.put(`/appointments/${id}/cancel`);
  },
};

// Patient API
export const patientAPI = {
  getAll: () => {
    console.log('👥 Fetching all patients...');
    return api.get('/patients');
  },
  getHistory: () => {
    console.log('📚 Fetching patient history...');
    return api.get('/patients/history');
  },
};

// Schedule API
export const scheduleAPI = {
  getAll: () => {
    console.log('📅 Fetching schedule...');
    return api.get('/schedule');
  },
};

// Inventory API
export const inventoryAPI = {
  getAll: () => {
    console.log('📦 Fetching inventory...');
    return api.get('/inventory');
  },
  create: (data) => {
    console.log('📦 Creating inventory item...');
    return api.post('/inventory', data);
  },
  updateStock: (id, additionalStock) => {
    console.log(`📦 Updating stock for item ${id}...`);
    return api.put(`/inventory/${id}/stock`, { additionalStock });
  },
};

// Report API
export const reportAPI = {
  getAppointments: () => {
    console.log('📊 Fetching appointment reports...');
    return api.get('/reports/appointments');
  },
  getPatients: () => {
    console.log('📊 Fetching patient reports...');
    return api.get('/reports/patients');
  },
  getInventory: () => {
    console.log('📊 Fetching inventory reports...');
    return api.get('/reports/inventory');
  },
};

export default api;