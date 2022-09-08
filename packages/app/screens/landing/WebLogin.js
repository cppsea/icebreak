import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import Screen from '@app/components/Screen';

function WebLogin({ route }) {
  const { uri } = route.params;
  return (
    <Screen style={styles.container}>
      <WebView source={{ uri }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WebLogin;
