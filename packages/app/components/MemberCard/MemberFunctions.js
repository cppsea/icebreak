import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: grey,
        borderRadius: 15,
        height: 30,
        justifyContent: 'center',
        width: 30,
    },
    buttonText:{
        color: white,
        fontSize: 20,
        lineHeight: 20,
        textAlignVertical: 'center',
    }
})

const grey = 'grey';
const white = 'white';

export const ThreeDotsButton = () => {
    return (
        <TouchableOpacity 
            style = {styles.button}
            onPress={() => Alert.alert("Three dots button pressed")}
        >
            <Text style={styles.buttonText}>{"\u22EE"}</Text>
        </TouchableOpacity>
    )
}