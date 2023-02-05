import React from 'react';
import { TextInput as RNTextInput, StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

import EyeOff from '@app/assets/eye-line-off';
import EyeOn from '@app/assets/eye-line-on';

const styles = StyleSheet.create({
    container: {
        height: "auto",
        width: "100%",
        borderRadius: 10,
        alignItems: 'flex-start'
    },
    error: {
        color: "#f54242", 
        fontSize: 12
    },
    textField: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    input: {
        height: "100%",
        flex: 1
    }
});

const TextInput = React.forwardRef((props, ref) => {
    const [hidePassword, setHidePassword] = React.useState(props.password)

    return(
        <View testID={props.testID} style={[styles.container, props.container]}>

            <View 
                testID={`${props.testID}.errorBorder`}
                style={[styles.textField, props.style]}
                borderColor= {props.error ? "#f54242" : props.borderColor}>
                <RNTextInput 
                    testID={`${props.testID}.textInput`}
                    value={props.value}
                    style={styles.input}
                    onChangeText={props.onChangeText}
                    onSubmitEditing={props.onSubmitEditing}
                    placeholder={props.placeholder}
                    secureTextEntry={hidePassword}
                    ref={ref}/>

                {props.password && 
                    <TouchableOpacity 
                        testID={`${props.testID}.visibility`}
                        onPress={() => setHidePassword(!hidePassword)}>
                        {
                            hidePassword ? <EyeOff /> : <EyeOn />
                        }
                    </TouchableOpacity>
                }
            </View>
            

            {props.error && (
                <Text 
                    testID={`${props.testID}.errorText`}
                    style={styles.error} >
                {props.error}
                </Text>
            )}
            
        </View>

    );
})

export default TextInput;