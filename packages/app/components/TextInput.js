import React from 'react';
import { TextInput as RNTextInput, StyleSheet, Text, View} from 'react-native';

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
    }
});

function TextInput(props) {

    return(
        <View style={[styles.container, props.container]}>
            <RNTextInput 
                {...props}
                ref={props.ref}
                borderColor = {props.error ? "#f54242" : props.borderColor}
            />
            {props.error && (
                <Text style={styles.error}>
                {props.error}
                </Text>
            )}
        </View>

    );
}

export default TextInput;