import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import LandingStack from './screens/landing/LandingStack';

function Root() {
  return (
    <NavigationContainer>
      <LandingStack />
    </NavigationContainer>
  );
}

export default Root;
