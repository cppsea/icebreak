import React, { ReactNode } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

type ScreenProps = {
  children: ReactNode
}

function Screen(props: ScreenProps ) {
  const { children, ...rest } = props;

  return (
    <SafeAreaView {...rest}>
      <StatusBar barStyle='dark-content'/>
      {children}
    </SafeAreaView>
  );
}

export default Screen;
