import axios from 'axios';
REACT_APP_API_BASE='https://retalp-backend-3.onrender.com/api';

// Base API URL: Uses env variable in production, falls back to localhost for local dev
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000/api';

// Global Axios configuration
axios.defaults.withCredentials = false;

// Enhanced Axios error handler
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('API Request Error:', error.request);
    } else {
      console.error('API Configuration Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// --- Upload File ---
export const uploadFile = async (file, config = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_BASE}/upload/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    ...config
  });
};

// --- Get Data Overview ---
export const getOverview = (fileId) => {
  return axios.get(`${API_BASE}/overview/${fileId}`);
};

// --- Data Cleaning ---
export const removeColumns = (fileId, columns) => {
  return axios.post(`${API_BASE}/cleaning/remove_columns`, {
    file_id: fileId,
    columns
  });
};

export const fillMissing = (fileId, column, method, customValue) => {
  return axios.post(`${API_BASE}/cleaning/fill_missing`, {
    file_id: fileId,
    column,
    method,
    custom_value: customValue
  });
};

// --- Outlier Detection ---
export const detectOutliers = (fileId, column, method) => {
  return axios.post(`${API_BASE}/outliers/detect`, {
    file_id: fileId,
    column,
    method
  });
};

export const handleOutliers = (fileId, action, column, outlierIndices) => {
  return axios.post(`${API_BASE}/outliers/handle`, {
    file_id: fileId,
    action,
    column,
    outlier_indices: outlierIndices
  });
};

// --- Visualization ---
export const generateVisualization = (fileId, chartType, xCol, yCol, hueCol) => {
  if (!fileId || !chartType || !xCol) {
    return Promise.reject(new Error('Missing required parameters for visualization'));
  }

  const payload = {
    file_id: fileId,
    chart_type: chartType,
    x_col: xCol
  };

  if (chartType !== 'histogram') {
    if (!yCol) {
      return Promise.reject(new Error('Y-axis column is required for this chart type'));
    }
    payload.y_col = yCol;
  }

  if (hueCol) {
    payload.hue_col = hueCol;
  }

  return axios.post(
    `${API_BASE}/visualization/generate`,
    payload,
    {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
};

// --- Download Cleaned Data ---
export const downloadCleanedData = (fileId) => {
  return axios.get(`${API_BASE}/download/${fileId}`, {
    responseType: 'blob'
  });
};

// --- Report Generation ---
export const generateReport = (fileId, actionHistory) => {
  return axios.post(
    `${API_BASE}/report/generate/${fileId}`,
    {
      action_history: actionHistory
    }
  );
};

// --- Report Download ---
export const downloadReport = (fileId) => {
  return axios.get(`${API_BASE}/report/download/${fileId}`, {
    responseType: 'blob'
  });
};

