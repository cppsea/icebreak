import React from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';
import { Card, Divider } from 'react-native-elements';
import EventCardText from './EventCardText';
import EventCardRegistration from './EventCardRegistration';



const styles = StyleSheet.create({
  banner: {
    width: '100%',
    height: 144,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  card: {
    borderRadius: 10,
    borderColor: 'white',
    elevation: 0,
    padding: 0
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
    <Card containerStyle={styles.card}>
      { props.eventBanner ? <Image source={props.eventBanner} style={styles.banner}/> : '' }           
      <Divider style={{ padding: 10, marginBottom: 0 }}>
        <EventCardText 
          eventTitle={props.eventTitle}
          timeBegin={props.timeBegin}
          timeEnd={props.timeEnd}
          location={props.location}
          description={props.description}
        />
        <EventCardRegistration register={onRegisterClicked} />
      </Divider>
    </Card>
  );
};

export default EventCard;