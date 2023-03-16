import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '@app/utils/UserContext';

const Stack = createNativeStackNavigator();

function OnboardingScreen({ navigation }) {
  const [school, setSchool] = useState('');
  const [birthday, setBirthday] = useState('');
  const [interests, setInterests] = useState('');

  const { onboardingCompleted } = useUserContext();

  const handleSubmit = async () => {
    await AsyncStorage.setItem('isFirstTime', JSON.stringify(false));
    onboardingCompleted();
    navigation.navigate('TabNavigation');
  };

  const handleSkip = async () => {
    navigation.navigate('TabNavigation');
  };

   return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Onboarding</Text>
      <TextInput
        style={styles.input}
        placeholder="School"
        onChangeText={setSchool}
        value={school}
      />
      <TextInput
        style={styles.input}
        placeholder="Birthday (MM/DD/YYYY)"
        onChangeText={setBirthday}
        value={birthday}
      />
      <TextInput
        style={styles.input}
        placeholder="Interests"
        onChangeText={setInterests}
        value={interests}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSkip}>
        <Text style={styles.skipText}>Skip Onboarding</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  skipText: {
    textAlign: 'center',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default OnboardingStack;