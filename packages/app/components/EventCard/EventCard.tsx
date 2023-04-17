import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import EventCardText from './EventCardText';
import EventCardRegistration from './EventCardRegistration';
import { EventCardProps } from '@app/types/EventCard';

// Stylesheet for the EventCard component
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



const EventCard: React.FC<EventCardProps> = ({
  banner, title, timeBegin, timeEnd, location, description
}) => {
  const onRegisterClicked = () => {
    alert("Register button works!");
  }
  
  return (
    <View style={styles.card}>
      { banner ? <Image source={banner} style={styles.banner}/> : null}
      <View style={{ padding: 10, marginBottom: 0 }}>
        <EventCardText 
          title={title}
          timeBegin={timeBegin}
          timeEnd={timeEnd}
          location={location}
          description={description}
        />
        <EventCardRegistration register={onRegisterClicked} />
      </View>
    </View>
  );
};

export default EventCard;