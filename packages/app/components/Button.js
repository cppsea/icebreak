import React from 'react';
import { StyleSheet, TouchableHighlight, View, Image, Text } from 'react-native';


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  textStyle: {
    alignItems: "center"
  }
}
);

function Button(props) {
  return (
    <TouchableHighlight 
        {...props}>
        <View 
            style={styles.container}>

            { props.icon }

            <Text style=
              {[
                {
                  color: props.fontColor,
                  fontWeight: props.fontWeight
                }, 
                props.textStyle, 
                styles.textStyle
              ]}>{props.title}</Text>
        </View>
    </TouchableHighlight>
  );
}

export default Button;
