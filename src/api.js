

import axios from 'axios';
REACT_APP_API_BASE='https://retalp-backend-3.onrender.com/api';

// Use environment variable for API base
const API_BASE = process.REACT_APP_API_BASE || 'http://localhost:8000/api';

axios.defaults.withCredentials = false;

// Error interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('API Request Error:', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// UPLOAD - Critical fix: no trailing slash
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);  // Field name must match backend parameter
  console.log("Uploading to:", `${API_BASE}/file_upload`);  // Debug log
  return axios.post(`${API_BASE}/file_upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
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




