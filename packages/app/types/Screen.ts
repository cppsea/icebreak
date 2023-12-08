import { ReactNode } from "react";

export type ScreenProps = {
  children: ReactNode;

  // Handle all other props (for spread operator)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
};
