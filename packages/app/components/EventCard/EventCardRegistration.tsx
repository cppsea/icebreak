import React from "react";
import { StyleSheet, Button, View, GestureResponderEvent } from "react-native";
import FaceIcon from "./FaceIcon";

// Sample array for testing
const sampleArray = [0,1,2,3];

export type EventCardRegistrationProps = {
  register: () => void;
}

const EventCardRegistration: React.FC<EventCardRegistrationProps> = ({register}) => {

  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={styles.buttonView}>
        <Button
          title='Going'
          onPress={register}
        />
      </View>
      <View style={styles.faceView}>
        {sampleArray.slice(0,4).map(x => {
          return <FaceIcon
          key={sampleArray.indexOf(x)} 
          index={x}
          iconUrl={"https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
        />
        })}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  buttonView: {
    flex: 7,
    justifyContent: 'center',
  },
  button: {
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


export default EventCardRegistration;