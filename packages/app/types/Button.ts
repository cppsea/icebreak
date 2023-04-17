import { ColorValue, NativeSyntheticEvent, NativeTouchEvent } from "react-native";

export type ButtonProps = {
  title: string;
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
  color?: ColorValue | undefined;
  accessibilityLabel?: string | undefined;
  disabled?: boolean | undefined;
}