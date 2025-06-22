// src/utils/utils.js

// ==============================
// Data Sanitization and Formatting
// ==============================

/**
 * Ensures all values are safe for display.
 * @param {*} val
 * @param {string} fallback
 * @returns {*}
 */
export function safeValue(val, fallback = "") {
  if (val === null || val === undefined || Number.isNaN(val)) return fallback;
  if (typeof val === "string") return val.trim();
  if (typeof val === "number" && !Number.isFinite(val)) return fallback;
  return val;
}

/**
 * Format numbers with commas for readability
 * @param {number|string} num
 * @returns {string}
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return "";
  return Number(num).toLocaleString();
}

/**
 * Capitalize the first letter of a string
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (typeof str !== "string" || !str.length) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format a column name to be more human-readable
 * @param {string} col
 * @returns {string}
 */
export function prettifyColumn(col) {
  if (!col) return "";
  return capitalize(col.replace(/_/g, " "));
}

// ==============================
// Data Manipulation
// ==============================

/**
 * Deep clone an object (for safe state updates)
 * @param {object} obj
 * @returns {object}
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Group an array of objects by a key
 * @param {Array} arr
 * @param {string} key
 * @returns {object}
 */
export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

/**
 * Sort columns by missing value count (descending)
 * @param {object} nullCounts
 * @returns {Array}
 */
export function sortColumnsByMissing(nullCounts) {
  return Object.entries(nullCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([col]) => col);
}

/**
 * Validate a column name (no special chars, not empty)
 * @param {string} col
 * @returns {boolean}
 */
export function isValidColumnName(col) {
  return typeof col === "string" && /^[a-zA-Z0-9_]+$/.test(col) && col.length > 0;
}

// ==============================
// Color and Visualization Helpers
// ==============================

/**
 * Generate a color based on a string (for tags, charts, etc.)
 * @param {string} str
 * @returns {string}
 */
export function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    color += ("00" + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
  }
  return color;
}

/**
 * Download a string or object as a file (JSON, CSV, etc.)
 * @param {string|object} content
 * @param {string} filename
 * @param {string} type
 */
export function downloadFile(content, filename, type = "text/plain") {
  const blob = new Blob(
    [typeof content === "string" ? content : JSON.stringify(content, null, 2)],
    { type }
  );
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

/**
 * Debounce a function (for search/filter inputs)
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// ==============================
// Data Cleaning Utilities
// ==============================

/**
 * Clean API data before using in components
 * @param {object} data
 * @returns {object}
 */
export function cleanOverviewData(data) {
  if (!data || typeof data !== "object") return {};
  return {
    ...data,
    columns: Array.isArray(data.columns) ? data.columns : [],
    dtypes: typeof data.dtypes === "object" ? data.dtypes : {},
    null_counts: typeof data.null_counts === "object" ? data.null_counts : {},
    head: Array.isArray(data.head) ? data.head : [],
    tail: Array.isArray(data.tail) ? data.tail : [],
    shape: Array.isArray(data.shape) ? data.shape : [0, 0],
  };
}

/**
 * Clean report data
 * @param {object} data
 * @returns {object}
 */
export function cleanReportData(data) {
  if (!data || typeof data !== "object") return {};
  return {
    ...data,
    original_columns: Array.isArray(data.original_columns)
      ? data.original_columns
      : [],
    current_columns: Array.isArray(data.current_columns)
      ? data.current_columns
      : [],
    dropped_columns: Array.isArray(data.dropped_columns)
      ? data.dropped_columns
      : [],
    missing_value_treatment:
      typeof data.missing_value_treatment === "object"
        ? data.missing_value_treatment
        : {},
    outlier_treatment:
      typeof data.outlier_treatment === "object"
        ? data.outlier_treatment
        : {},
    final_stats: typeof data.final_stats === "object" ? data.final_stats : {},
  };
}

// ==============================
// Array and Math Utilities
// ==============================

/**
 * Get unique values from an array
 * @param {Array} arr
 * @returns {Array}
 */
export function unique(arr) {
  return Array.from(new Set(arr));
}

/**
 * Get min and max from an array of numbers
 * @param {Array<number>} arr
 * @returns {[number, number]}
 */
export function minMax(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return [null, null];
  return [Math.min(...arr), Math.max(...arr)];
}

/**
 * Calculate mean of an array of numbers
 * @param {Array<number>} arr
 * @returns {number}
 */
export function mean(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * Calculate median of an array of numbers
 * @param {Array<number>} arr
 * @returns {number}
 */
export function median(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Calculate mode of an array of numbers
 * @param {Array<number>} arr
 * @returns {number|null}
 */
export function mode(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const freq = {};
  let max = 0;
  let result = null;
  for (const num of arr) {
    freq[num] = (freq[num] || 0) + 1;
    if (freq[num] > max) {
      max = freq[num];
      result = num;
    }
  }
  return result;
}

/**
 * Shuffle an array (Fisher-Yates)
 * @param {Array} arr
 * @returns {Array}
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Clamp a number between min and max
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// ==============================
// Date and Time Utilities
// ==============================

/**
 * Format a date as YYYY-MM-DD
 * @param {Date|string|number} date
 * @returns {string}
 */
export function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

/**
 * Format a date as readable string
 * @param {Date|string|number} date
 * @returns {string}
 */
export function formatDateTime(date) {
  const d = new Date(date);
  return d.toLocaleString();
}

// ==============================
// Miscellaneous Utilities
// ==============================

/**
 * Generate a random string of given length
 * @param {number} length
 * @returns {string}
 */
export function randomString(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Sleep for a given number of milliseconds
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ==============================
// Export all as default for convenience
// ==============================

export default {
  safeValue,
  formatNumber,
  capitalize,
  prettifyColumn,
  deepClone,
  groupBy,
  sortColumnsByMissing,
  isValidColumnName,
  stringToColor,
  downloadFile,
  debounce,
  cleanOverviewData,
  cleanReportData,
  unique,
  minMax,
  mean,
  median,
  mode,
  shuffle,
  clamp,
  formatDate,
  formatDateTime,
  randomString,
  sleep,
};
