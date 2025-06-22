// src/utils/errorUtils.js

/**
 * Extracts a user-friendly error message from various error types
 * @param {any} error - The error object
 * @returns {string} - Human-readable error message
 */
export const getErrorMessage = (error) => {
  // Handle string errors directly
  if (typeof error === 'string') return error;
  
  // Handle Axios errors
  if (error.isAxiosError) {
    const response = error.response;
    
    // Handle FastAPI validation errors
    if (response?.data?.detail) {
      const detail = response.data.detail;
      
      // Array of validation errors
      if (Array.isArray(detail)) {
        return detail.map(d => d.msg || d.message || JSON.stringify(d)).join(', ');
      }
      
      // Single validation error
      if (typeof detail === 'string') {
        return detail;
      }
      
      // Error object with message
      if (detail.msg) {
        return detail.msg;
      }
      
      // Fallback for detail object
      return JSON.stringify(detail);
    }
    
    // Standard HTTP error
    if (response?.statusText) {
      return `Server error: ${response.status} ${response.statusText}`;
    }
    
    // Network errors
    if (error.message === "Network Error") {
      return "Network error: Could not connect to server";
    }
    
    // Request timeout
    if (error.code === "ECONNABORTED") {
      return "Request timed out. Please try again.";
    }
    
    return error.message || "Request failed";
  }
  
  // Handle JavaScript Error objects
  if (error instanceof Error) {
    // Special handling for file upload errors
    if (error.message.includes('file') || error.message.includes('upload')) {
      return `File error: ${error.message.replace('File processing error: ', '')}`;
    }
    return error.message;
  }
  
  // Handle objects with message property
  if (error?.message) {
    return error.message;
  }
  
  // Fallback to string conversion
  return String(error);
};

/**
 * Special handler for upload errors
 * @param {any} error - The error object
 * @param {function} toast - Chakra UI toast function
 */
export const handleUploadError = (error, toast) => {
  const message = getErrorMessage(error);
  
  // Special cases for common upload errors
  let description = message;
  if (message.includes('encoding') || message.includes('decode')) {
    description = "File encoding issue. Try saving as UTF-8.";
  } else if (message.includes('size')) {
    description = "File too large. Max size is 100MB.";
  } else if (message.includes('format')) {
    description = "Unsupported file type. Use CSV or Excel.";
  }
  
  toast({
    title: "Upload failed",
    description,
    status: "error",
    duration: 7000,
    isClosable: true,
    position: "top"
  });
};
