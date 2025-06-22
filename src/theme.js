// src/styles/theme.js

import { extendTheme } from "@chakra-ui/react";

// Color palette
const colors = {
  brand: {
    50: "#e3f2fd",
    100: "#bbdefb",
    200: "#90caf9",
    300: "#64b5f6",
    400: "#42a5f5",
    500: "#2196f3",
    600: "#1e88e5",
    700: "#1976d2",
    800: "#1565c0",
    900: "#0d47a1",
  },
  accent: {
    50: "#e0f7fa",
    100: "#b2ebf2",
    200: "#80deea",
    300: "#4dd0e1",
    400: "#26c6da",
    500: "#00bcd4",
    600: "#00acc1",
    700: "#0097a7",
    800: "#00838f",
    900: "#006064",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },
  // Add more as needed
};

// Fonts
const fonts = {
  heading: "'Inter', sans-serif",
  body: "'Inter', sans-serif",
  mono: "Menlo, monospace",
};

// Global styles
const styles = {
  global: (props) => ({
    "html, body, #root": {
      width: "100%",
      height: "100%",
      minHeight: "100vh",
      bg: "white",
      color: "gray.800",
      fontFamily: "body",
      overflow: "hidden",
    },
    body: {
      bg: "white",
      color: "gray.800",
      fontFamily: "body",
      minHeight: "100vh",
    },
    "*": {
      boxSizing: "border-box",
    },
    ".chakra-ui-dark &": {
      bg: "gray.900",
      color: "gray.100",
    },
    ".no-select": {
      userSelect: "none",
    },
    ".scrollbar-hide": {
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    // Custom scrollbars
    "*::-webkit-scrollbar": {
      width: "8px",
      background: "#f3f4f6",
    },
    "*::-webkit-scrollbar-thumb": {
      background: "#d1d5db",
      borderRadius: "8px",
    },
    "*::-webkit-scrollbar-thumb:hover": {
      background: "#a0aec0",
    },
  }),
};

// Component style overrides
const components = {
  Button: {
    baseStyle: {
      fontWeight: "medium",
      borderRadius: "lg",
      _focus: { boxShadow: "none" },
    },
    variants: {
      solid: (props) => ({
        bg: "brand.500",
        color: "white",
        _hover: { bg: "brand.600" },
        _active: { bg: "brand.700" },
      }),
      outline: (props) => ({
        borderColor: "brand.500",
        color: "brand.500",
        _hover: { bg: "brand.50" },
      }),
      ghost: (props) => ({
        color: "brand.500",
        _hover: { bg: "brand.50" },
      }),
    },
    sizes: {
      lg: {
        h: "56px",
        fontSize: "xl",
        px: "32px",
      },
      md: {
        h: "44px",
        fontSize: "md",
        px: "24px",
      },
      sm: {
        h: "36px",
        fontSize: "sm",
        px: "16px",
      },
    },
  },
  Input: {
    baseStyle: {
      borderRadius: "md",
      _focus: { borderColor: "brand.500", boxShadow: "0 0 0 1px #2196f3" },
    },
    variants: {
      outline: {
        field: {
          borderColor: "gray.200",
          _hover: { borderColor: "brand.300" },
          _focus: { borderColor: "brand.500" },
        },
      },
    },
  },
  Select: {
    baseStyle: {
      borderRadius: "md",
      _focus: { borderColor: "brand.500", boxShadow: "0 0 0 1px #2196f3" },
    },
    variants: {
      outline: {
        field: {
          borderColor: "gray.200",
          _hover: { borderColor: "brand.300" },
          _focus: { borderColor: "brand.500" },
        },
      },
    },
  },
  Table: {
    baseStyle: {
      th: {
        fontWeight: "bold",
        color: "gray.700",
        bg: "gray.50",
        letterSpacing: "wider",
        textTransform: "capitalize",
      },
      td: {
        color: "gray.800",
      },
    },
  },
  Tooltip: {
    baseStyle: {
      borderRadius: "md",
      bg: "gray.700",
      color: "white",
      fontSize: "sm",
      px: 3,
      py: 2,
      boxShadow: "md",
    },
  },
  Progress: {
    baseStyle: {
      borderRadius: "full",
      bg: "gray.100",
      filledTrack: {
        bg: "brand.500",
      },
    },
  },
  Badge: {
    baseStyle: {
      borderRadius: "md",
      px: 2,
      py: 1,
      fontWeight: "medium",
      fontSize: "sm",
    },
  },
  // Add more component overrides as needed
};

// Theme object
const theme = extendTheme({
  colors,
  fonts,
  styles,
  components,
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

export default theme;
