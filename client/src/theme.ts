// PCBforth shared design tokens — Blue-White theme
// Used by Home.tsx, DesignServices pages, and any future pages

export const C = {
  // Sidebar
  sidebarBg:       "#1A3A6B",
  sidebarBgDark:   "#122A52",
  sidebarBorder:   "rgba(255,255,255,0.12)",
  sidebarText:     "#B8D4F8",
  sidebarActive:   "rgba(255,255,255,0.15)",
  sidebarActiveTxt:"#FFFFFF",
  // Content area
  pageBg:          "#F0F6FF",
  cardBg:          "#FFFFFF",
  cardBorder:      "#D0E4FF",
  sectionAlt:      "#EBF3FF",
  // Typography
  heading:         "#0D2A5E",
  body:            "#2C4A7A",
  muted:           "#6B8CB8",
  // Accent
  blue:            "#1565E8",
  blueDark:        "#0D4DC4",
  blueLight:       "#EBF3FF",
  cyan:            "#0EA5E9",
  green:           "#059669",
  greenDark:       "#047857",
  // Divider
  divider:         "#C8DEFF",
} as const;

export type ThemeColors = typeof C;
