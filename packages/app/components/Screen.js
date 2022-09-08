import React from 'react';
import { SafeAreaView } from 'react-native';

function Screen(props) {
  const { children, ...rest } = props;

  return <SafeAreaView {...rest}>{children}</SafeAreaView>;
}

export default Screen;
