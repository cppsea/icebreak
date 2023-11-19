import { ReactNode } from "react";
import {
  ColorValue,
  NativeSyntheticEvent,
  NativeTouchEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

export type ButtonProps = {
  title: string;
  textStyle?: StyleProp<TextStyle>;
  style: StyleProp<ViewStyle>;
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
  fontColor?: ColorValue | undefined;
  accessibilityLabel?: string | undefined;
  disabled?: boolean | undefined;
  icon?: ReactNode;
  fontWeight?:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900"
    | undefined;

  // Handle all other props (for spread operator)
  [x: string]: any;
};
