import React, { useCallback, useRef } from 'react';
import axios from 'axios';
import { StyleSheet, View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert, TouchableOpacity} from 'react-native';
import * as WebBroswer from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import Button from '@app/components/Button';
import Screen from '@app/components/Screen';
import TextInput from '@app/components/TextInput';

import { useUserContext } from '@app/utils/UserContext';
import { getUserInfo } from '@app/utils/datalayer';
import { ENDPOINT } from '@app/utils/constants';

WebBroswer.maybeCompleteAuthSession();

function LandingScreen() {
  const { user, setUser } = useUserContext();

  const [request, response, promptAsync] = Google.useAuthRequest({
    responseType: 'id_token',
    expoClientId: '1080245081969-u9lnl9ospj757rq75kiumttqconhnfcc.apps.googleusercontent.com',
    iosClientId: '1080245081969-u9lnl9ospj757rq75kiumttqconhnfcc.apps.googleusercontent.com',
    androidClientId: '1080245081969-u9lnl9ospj757rq75kiumttqconhnfcc.apps.googleusercontent.com',
    webClientId: '1080245081969-u9lnl9ospj757rq75kiumttqconhnfcc.apps.googleusercontent.com',
  });

  const handleOnLoginWithGoogle = useCallback(async () => {
    try {
      const result = await promptAsync();

      if (result.type !== 'success') {
        throw new Error("Failed to authenticate with Google's OAuth");
      }

      const id_token = result.params.id_token;

      const body = {
        token: id_token
      };

      const { data } = await axios.post(`${ENDPOINT}/auth/google`, body);
      if (data?.success) {
        setUser({
          ...user,
          isLoggedIn: true,
          data: data.payload
        }); 
      }
    } catch(error) {
      console.log(error.message);
    }
  }, [user, setUser, request]);

  // Style sheet to keep all the styles in one place
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      paddingLeft: 20,
      paddingRight: 20,
    },
    signupContainer: {
      flexDirection: "row"
    },
    component: {
      height: 50,
      width: "100%",
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center'
    },
    textInput: {
      backgroundColor: "#ebebeb",
      borderWidth: 1,
      paddingLeft: 10,
      paddingRight: 10,
      justifyContent: 'space-between'
    },
    loginButton: {
      borderColor: '#0b91e0',
      backgroundColor: '#0b91e0',
      marginTop: 30
    },
    googleButton: {
      borderWidth: 1,
      borderColor: '#a3a3a3'
    },
    textButton: {
      color: "#0b91e0", 
      fontWeight: "bold", 
    },
    forgotPassContainer: {
      alignSelf: 'flex-end'
    },
    lineDivider: {
      backgroundColor: "#c4c4c4", 
      height: 1, 
      width: "100%",
      marginTop: 20,
      marginBottom: 20
    },
    imageStyle: {
      height: 20,
      width: 20,
      marginRight: 10
    },    
    logo: {
      margin: 20, 
      fontWeight: "bold", 
      fontSize: 40
    },
  });

  // State to change the variable with the TextInput
  const [inputs, setInputs] = React.useState({email: '', password: ''})
  const [errors, setErrors] = React.useState({})

  const validateInput = () => {
    const emailRE = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    let isValid = true;

    // Reset the error message
    for (const inputKey in inputs) {
      handleError(inputKey, null)
    }
    
    if (!inputs.email) {
      handleError('email', 'Please enter an email.');
      isValid = false;
    } else if (!inputs.email.match(emailRE)) {
      handleError('email', 'Please enter a valid email.');
      isValid = false;
    }

    if (!inputs.password) {
      handleError('password', 'Please enter a password.');
      isValid = false;
    }

    if (isValid) {
      login();
    }
  }

  const login = () => {
    // TODO: Login code here
    Alert.alert("Login successful")
  }

  const handleOnChange = (inputKey, text) => {
    setInputs(prevState => ({...prevState, [inputKey]: text}))
  };

  const handleError = (inputKey, error) => {
    setErrors(prevState => ({...prevState, [inputKey]: error}))
  }

  // Keeps a reference to help switch from Username input to Password input
  const refPasswordInput = useRef();

  return (
    <Screen style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={styles.container}>

          <Text style={styles.logo}>icebreak</Text>

          <TextInput 
            container={{marginBottom: 10}}
            style={[styles.component, styles.textInput]}
            borderColor='#cccccc'
            onChangeText={(text) => {
                // whenever we type, we set email hook and clear errors
                handleOnChange("email", text);
                handleError("email", null);
              }
            }
            error={errors.email}
            placeholder="Email"
            onSubmitEditing={() => { refPasswordInput.current.focus(); }}
          />

          <TextInput 
            ref={refPasswordInput}
            style={[styles.component, styles.textInput]}
            borderColor='#cccccc'
            onChangeText={text => {
                handleOnChange("password", text)
                handleError("password", null);
              }
            }
            error={errors.password}
            password
            placeholder="Password"
          />

          <TouchableOpacity 
            onPress={
              // TODO: Forgot password code here.
              handleOnLoginWithGoogle
            }
            style={styles.forgotPassContainer}
            >
            <Text 
              style={styles.textButton} 
              >Forgot password?</Text>
          </TouchableOpacity>


          <Button 
            title="Log In" 
            onPress={validateInput}
            underlayColor="#0e81c4"
            fontColor="#ffffff"
            fontWeight="bold"
            style={[styles.loginButton, styles.component]}
            textStyle={styles.boldText}/>

          <View style={styles.lineDivider}/>

          <Button 
            title="Continue with Google" 
            onPress={handleOnLoginWithGoogle}
            underlayColor='#ebebeb'
            style={[styles.googleButton, styles.component]} 
            fontWeight="bold"
            imageStyle={styles.imageStyle}
            source={require("@app/assets/google-icon.png")}
          />

        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      <View style={styles.lineDivider}/>

      <View 
        style={styles.signupContainer}>

        <Text>Don't have an account? </Text>

        <TouchableOpacity
          onPress={
            // TODO: Navigate to signup screen.
            handleOnLoginWithGoogle
          }>
          <Text 
            style={styles.textButton} >Sign Up.</Text>
        </TouchableOpacity>

        
      </View>
    </Screen>
  );
}

export default LandingScreen;