import React from 'react';
import { Button as RNButton, NativeSyntheticEvent, NativeTouchEvent, ColorValue } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: (ev: NativeSyntheticEvent<NativeTouchEvent>) => void;
  color?: ColorValue | undefined;
  accessibilityLabel?: string | undefined;
  disabled?: boolean | undefined;
}


function Button(props: ButtonProps) {
  return <RNButton {...props} />;
}

export default Button;
