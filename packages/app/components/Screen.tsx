import { ScreenProps } from '@app/types/Screen';
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';



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
