import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

function Root() {
  return (
    <NavigationContainer>
      <SafeAreaView>
        <Text>hello sea</Text>
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default Root;
