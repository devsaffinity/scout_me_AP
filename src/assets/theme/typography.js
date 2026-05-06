const typography = {
  fontFamily: {
    sans: '"Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],
    sm: ["0.875rem", { lineHeight: "1.25rem" }],
    base: ["1rem", { lineHeight: "1.5rem" }],
    md: ["1.0625rem", { lineHeight: "1.625rem" }],
    lg: ["1.125rem", { lineHeight: "1.75rem" }],
    xl: ["1.25rem", { lineHeight: "1.875rem" }],
    "2xl": ["1.5rem", { lineHeight: "2rem" }],
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
    "4xl": ["2.25rem", { lineHeight: "2.75rem" }],
  },

  letterSpacing: {
    tight: "-0.03em",
    normal: "-0.01em",
    wide: "0",
  },

  textStyles: {
    pageTitle: {
      fontSize: "1.875rem",
      lineHeight: "2.25rem",
      fontWeight: 800,
      letterSpacing: "-0.03em",
    },

    sectionTitle: {
      fontSize: "1.25rem",
      lineHeight: "1.875rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },

    cardTitle: {
      fontSize: "1rem",
      lineHeight: "1.5rem",
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },

    metricValue: {
      fontSize: "2rem",
      lineHeight: "2.25rem",
      fontWeight: 800,
      letterSpacing: "-0.03em",
    },

    body: {
      fontSize: "0.95rem",
      lineHeight: "1.5rem",
      fontWeight: 500,
      letterSpacing: "-0.01em",
    },

    bodySm: {
      fontSize: "0.875rem",
      lineHeight: "1.375rem",
      fontWeight: 500,
      letterSpacing: "-0.01em",
    },

    label: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },

    caption: {
      fontSize: "0.75rem",
      lineHeight: "1rem",
      fontWeight: 600,
      letterSpacing: "0",
    },
  },
};

export default typography;
