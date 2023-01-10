import React from "react";
import { StyleSheet, Button, View } from "react-native";
import { Icon } from "react-native-elements";
import FaceIcon from "./FaceIcon";

// Sample array for testing
const sampleArray = [0,1,2,3];

const styles = StyleSheet.create({
  buttonView: {
    flex: 7,
    justifyContent: 'center',
    borderRadius: 100
  },
  button: {
    borderRadius: 10,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  faceView: {
    flexDirection: 'row',
    flex: 3,
    justifyContent: 'center'
  }
}); 

export default function EventCardRegistration(props) {
  const { register } = props;
  
  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={styles.buttonView}>
        <Button
          icon={<Icon color='#3498db' />}
          buttonStyle={styles.button}
          title='Going'
          onPress={register}
        />
      </View>
      <View style={styles.faceView}>
        {sampleArray.slice(0,4).map(x => {
          return <FaceIcon
          key={sampleArray.indexOf(x)} 
          index={x}
          source={require("@app/components/EventCard/eventcard_test/profile-pic.jpg")}
        />
        })}
      </View>
    </View>
  )
};