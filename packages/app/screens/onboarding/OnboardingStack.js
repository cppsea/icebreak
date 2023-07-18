import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Dimensions, Animated } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '@app/utils/UserContext';

const Stack = createNativeStackNavigator();

function OnboardingScreen({ navigation }) {
  const [school, setSchool] = useState('');
  const [birthday, setBirthday] = useState('');
  const [interests, setInterests] = useState('');
  const [error1, setError1 ] = useState(false);
  const [error2, setError2 ] = useState(false);
  const [error3, setError3 ] = useState(false);
  const [error4, setError4 ] = useState(false);

  const { onboardingCompleted } = useUserContext();

  const handleSubmit = async () => {
    await AsyncStorage.setItem('isFirstTime', JSON.stringify(false));
    onboardingCompleted();

    if (!school.trim())
    {
      setError1(true);
    }
    if (!birthday.trim())
    {
      setError2(true);
    }
    if (!interests.trim())
    {
      setError3(true);
    }
    if (!school.trim() || !birthday.trim() || !interests.trim())
    {
      setError4(true);
    }
    else
    {
      navigation.navigate('TabNavigation');
    }
  };

  const handleSkip = async () => {
    navigation.navigate('TabNavigation');
  };

   return (
    <View>
      <ScrollView 
      pagingEnabled={true} 
      horizontal={true}
      showsHorizontalScrollIndicator={false}>
        <View style={styles.slide}>
          <Text>Where do you go to school?</Text>
          <TextInput
          style={styles.input}
          placeholder= "Your School"
          onChangeText={setSchool}
          value={school}
          />
          {error2 ? (
            <Text style={styles.error}>*Your School is Required</Text>
            ) : null
          }
        </View>

        <View style={styles.slide}>
          <Text>When's your birthday?</Text>
          <TextInput
          style={styles.input}
          placeholder= "MM/DD/YYYY"
          onChangeText={setBirthday}
          value={birthday}
          />
          {error2 ? (
            <Text style={styles.error}>*Your Birthday is Required</Text>
            ) : null
          }
        </View>
          
        <View style={styles.slide}>
          <Text>List some of your interest:</Text>
          <TextInput
          style={styles.input}
          placeholder= "Your Interests"
          onChangeText={setInterests}
          value={interests}
          />
          {error3 ? (
            <Text style={styles.error}>*Your Interests are Required</Text>
            ) : null
          }
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          {error4 ? (
            <Text style={styles.error}>*Missing Required Responses</Text>
            ) : null
          }
        </View>
      </ScrollView>
      <View style={styles.indicatorContainer}>
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text>SKIP</Text>
        </TouchableOpacity>
        <View style={styles.indicator}></View>
        <View style={styles.indicator}></View>
        <View style={styles.indicator}></View>
        <TouchableOpacity style={styles.nextBtn}>
          <Text>NEXT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const {width, height} = Dimensions.get('window');

function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboardingscreeen" component={OnboardingScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
  },
  slide: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 270,
    height: 45,
    margin: 12,
    padding: 10,
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
  indicatorContainer: {
    position: 'absolute',
    width: width,
    bottom: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 10,
    height: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  skipBtn: {
    marginRight: 65,
  },
  nextBtn: {
    marginLeft: 65,
  },
});

export default OnboardingStack;