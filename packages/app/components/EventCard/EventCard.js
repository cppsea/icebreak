import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import EventCardText from './EventCardText';
import EventCardRegistration from './EventCardRegistration';



const styles = StyleSheet.create({
  banner: {
    width: '100%',
    height: 144,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    margin: 0
  },
  card: {
    borderRadius: 15,
    padding: 0,
    margin: 20,
    backgroundColor: 'white',
  },
  faceIcon: {
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: 'row'
  }
});

const EventCard = (props) => {
  const onRegisterClicked = () => {
    alert("Register button works!");
  }
  
  return (
    <View style={styles.card}>
      { props.banner ? <Image source={props.banner} style={styles.banner}/> : '' }           
      <View style={{ padding: 10, marginBottom: 0 }}>
        <EventCardText 
          title={props.title}
          timeBegin={props.timeBegin}
          timeEnd={props.timeEnd}
          location={props.location}
          description={props.description}
        />
        <EventCardRegistration register={onRegisterClicked} />
      </View>
    </View>
  );
};

export default EventCard;