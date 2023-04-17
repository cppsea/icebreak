import React from 'react';
import { ButtonProps, Button as RNButton } from 'react-native';




function Button(props: ButtonProps) {
  return <RNButton {...props} />;
}

export default Button;
