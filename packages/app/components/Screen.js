import React from 'react';
import { SafeAreaView } from 'react-native';

function Screen(props) {
  const { children } = props;

  return <SafeAreaView>{children}</SafeAreaView>;
}

export default Screen;
