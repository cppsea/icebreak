import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

function Screen(props: any) {
  const { children, ...rest } = props;

  return (
    <SafeAreaView {...rest}>
      <StatusBar barStyle='dark-content'/>
      {children}
    </SafeAreaView>
  );
}

export default Screen;
