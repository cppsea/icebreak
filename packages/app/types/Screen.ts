import { ReactNode } from "react";

export type ScreenProps = {
  children: ReactNode;

  // Handle all other props (for spread operator)
  [x: string]: any;
};
