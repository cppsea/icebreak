import React, { useCallback } from 'react';
import { Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import Button from '@app/components/Button';
import Screen from '@app/components/Screen';

function LandingHome() {
  const navigation = useNavigation();

  const handleOnLoginWithGoogle = useCallback(() => {
    navigation.navigate('WebLogin', {
      uri: 'http://localhost:5050/api/auth/google',
    });
  }, [navigation]);

  return (
    <Screen>
      <Text>icebreak</Text>
      <Button onPress={handleOnLoginWithGoogle} title="login with google" />
    </Screen>
  );
}

export default LandingHome;
