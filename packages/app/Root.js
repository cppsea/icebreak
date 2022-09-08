import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import LandingStack from './screens/landing/LandingStack';

const LINKING_CONFIG = {
  prefixes: ['icebreak://'],
};

function Root() {
  return (
    <NavigationContainer linking={LINKING_CONFIG}>
      <LandingStack />
    </NavigationContainer>
  );
}

export default Root;
