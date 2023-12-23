import {
  StyleProp,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from "react-native";

export type TextInputProps = {
  testID: string;
  password?: boolean;
  container?: StyleProp<ViewStyle>;
  style: StyleProp<ViewStyle> | StyleProp<ViewStyle>[];
  error: string | null;
  borderColor: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: (
    ev: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
  placeholder: string;
};
