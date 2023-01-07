import React from "react";
import { StyleSheet, Button, View } from "react-native";
import { Icon } from "react-native-elements";
import FaceIcon from "./FaceIcon";

const sampleList = [0,1,2,3,5,6,7,8];

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

export default function RegisterButton(props) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={styles.buttonView}>
        <Button
          icon={<Icon color='#3498db' />}
          buttonStyle={styles.button}
          title='Going'
          onPress={() => props.registerFunction}
        />
      </View>
      <View style={styles.faceView}>
        {sampleList.slice(0,4).map(x => {
          return <FaceIcon
          key={sampleList.indexOf(x)} 
          index={x}
          source={require("@app/components/EventCard/eventcard_test/profile-pic.jpg")}
        />
        })}
      </View>
    </View>
  )
};