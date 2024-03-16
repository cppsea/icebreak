import { createTheming } from "@callstack/react-theme-provider";

const Palette = {
  brand: {
    primary: "#76cadf",
    secondary: "#c0e3de",
  },
  link: {
    opacity30: "#36a5f6",
    opacity50: "#218fdf",
    opacity70: "#0a7ed2",
    opacity90: "#0068b4",
  },
  button: {
    opacity30: "#6cc1d6",
    opacity50: "#489fb5",
    opacity70: "#1d7e96",
    opacity90: "#10677d",
  },
  informational: {
    opacity30: "#6cc1d6",
    opacity50: "#489fb5",
    opacity70: "#1d7e96",
    opacity90: "#10677d",
  },
  success: {
    opacity30: "#74e6c4",
    opacity50: "#5ed3b0",
    opacity70: "#32b68f",
    opacity90: "#218e6d",
  },
  warning: {
    opacity30: "#eeeb94",
    opacity50: "#deda77",
    opacity70: "#cac557",
    opacity90: "#a6a23d",
  },
  error: {
    opacity30: "#f57e7e",
    opacity50: "#db6464",
    opacity70: "#ca4e4e",
    opacity90: "#af3535",
  },
  panelPrimary: {
    opacity0: "#ffffff",
    opacity10: "#efefef",
    opacity30: "#c7c7c7",
    opacity50: "#7f7f7f",
  },
  panelSecondary: {
    opacity30: "#d2eeea",
    opacity50: "#c0e3de",
    opacity70: "#77ccc0",
    opacity90: "#4d9b90",
  },
  textPrimary: {
    opacity30: "#7c7c7c",
    opacity50: "#4a4a4a",
    opacity70: "#2d2d2d",
    opacity100: "#000000",
  },
  textSecondary: {
    opacity30: "#6d6d6d",
    opacity50: "#424242",
    opacity70: "#2c2c2c",
    opacity90: "#131313",
  },
  textDisabled: {
    opacity30: "#dfdfdf",
    opacity50: "#c6c6c6",
    opacity70: "#b4b1b1",
    opacity90: "#999999",
  },
};

export const { ThemeProvider, withTheme, useTheme } = createTheming(Palette);
