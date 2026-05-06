import colors from "./colors";
import typography from "./typography";
import shadows from "./shadows";

const tokens = {
  colors,
  typography,
  shadows,

  radius: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
    "2xl": "1.75rem",
    full: "9999px",
  },

  spacing: {
    0: "0",
    1: "0.25rem",
    2: "0.5rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    7: "1.75rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    14: "3.5rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
  },

  layout: {
    sidebarWidth: "17.5rem",
    topbarHeight: "5rem",
    mobileNavHeight: "4.75rem",
    pageMaxWidth: "112rem",
    contentGutter: "1.25rem",
  },

  borderWidth: {
    thin: "1px",
    base: "1.5px",
    thick: "2px",
  },

  transitions: {
    fast: "150ms ease",
    base: "180ms ease",
    slow: "280ms ease",
  },

  zIndex: {
    base: 1,
    dropdown: 20,
    sticky: 30,
    overlay: 40,
    drawer: 50,
    modal: 60,
    toast: 70,
  },

  charts: {
    strokeWidth: 3,
    gridDasharray: "4 4",
    barRadius: [10, 10, 0, 0],
  },
};

export default tokens;
