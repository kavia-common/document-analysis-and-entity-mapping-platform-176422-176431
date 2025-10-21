//
// Ocean Professional theme definition and helpers
//

// PUBLIC_INTERFACE
export const theme = {
  name: "Ocean Professional",
  palette: {
    primary: "#1E3A8A", // blue-900
    secondary: "#F59E0B", // amber-600
    success: "#059669", // emerald-600
    error: "#DC2626", // red-600
    background: "#F3F4F6", // gray-100
    surface: "#FFFFFF", // white
    text: "#111827", // gray-900
    mutedText: "#4B5563", // gray-600
    border: "#E5E7EB", // gray-200
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "14px",
  },
  shadow: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 12px rgba(0,0,0,0.08)",
    lg: "0 10px 24px rgba(0,0,0,0.12)",
  },
};

// PUBLIC_INTERFACE
export function applyCssVariables() {
  /**
   * Apply theme variables to :root for use in CSS.
   */
  const root = document.documentElement;
  const t = theme.palette;
  root.style.setProperty("--ocn-primary", t.primary);
  root.style.setProperty("--ocn-secondary", t.secondary);
  root.style.setProperty("--ocn-success", t.success);
  root.style.setProperty("--ocn-error", t.error);
  root.style.setProperty("--ocn-bg", t.background);
  root.style.setProperty("--ocn-surface", t.surface);
  root.style.setProperty("--ocn-text", t.text);
  root.style.setProperty("--ocn-text-muted", theme.palette.mutedText);
  root.style.setProperty("--ocn-border", theme.palette.border);

  root.style.setProperty("--ocn-radius-sm", theme.radius.sm);
  root.style.setProperty("--ocn-radius-md", theme.radius.md);
  root.style.setProperty("--ocn-radius-lg", theme.radius.lg);

  root.style.setProperty("--ocn-shadow-sm", theme.shadow.sm);
  root.style.setProperty("--ocn-shadow-md", theme.shadow.md);
  root.style.setProperty("--ocn-shadow-lg", theme.shadow.lg);
}
