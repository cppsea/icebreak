import React, { useCallback, useEffect, useState} from 'react';
import Button from '@app/components/Button';
import { View, Image, Text, FlatList, StyleSheet } from 'react-native';
import { Card, ListItem, Icon, Divider } from 'react-native-elements';

const PROFILES = [
  {
    id: 0,
    src: "./eventcard_test/profile-pic.jpg"
  },
  {
    id: 1,
    src: "./eventcard_test/profile-pic.jpg"
  },
  {
    id: 2,
    src: "./eventcard_test/profile-pic.jpg"
  },
  {
    id: 3,
    src: "./eventcard_test/profile-pic.jpg"
  }
];

const styles = StyleSheet.create({
  banner: {
    width: 360,
    height: 144,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  button: {
    borderRadius: 10,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0
  },
  card: {
    borderRadius: 10,
    borderColor: 'white',
    elevation: 0,
    padding: 0
  },
  description: {
    marginBottom: 10,
    fontSize: 12
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  smallText: {
    fontSize: 9,
    color: 'grey'
  },
  facesImg: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
  facesView: {
    flex: 3,
    justifyContent: 'center',
    flexDirection: 'row'
  }
});

function Faces(props){
  const profile = props.participants
  const faceList = profile.map((pfp) => {
    <Image 
      source={require("./eventcard_test/profile-pic.jpg")} 
      key={profile.indexOf(pfp)}
      style={styles.facesImg}
    />
  });

  return (
    <View style={styles.facesView}>
      {faceList}
    </View>
  )
};

function EventCard(props){
  
  return (
    <Card containerStyle={styles.card}>
      <Image 
        source={require("./eventcard_test/test_card_banner.png")}
          style={styles.banner}
            />           
      <Divider style={{ padding: 10, marginBottom: 0 }}>
        <Text style={styles.smallText}>{props.timeBegin} - {props.timeEnd}</Text>
        <Text style={styles.eventTitle}>{props.eventTitle}</Text>
        <Text style={styles.smallText}>📌 {props.location}</Text>
        <Text style={styles.description} numberOfLines={3}>{props.description}</Text>
        <View style={{ flexDirection: 'row',}}>
          <View style={{ flex: 7 }} >
            <Button
              icon={<Icon color='#3498db' />}
              buttonStyle={styles.button}
              title='Going'
              onClick={props.onPress} 
            />
          </View>
          <View style={styles.facesView}>
            <Image 
              source={require("./eventcard_test/profile-pic.jpg")} 
              key={"1"}
              style={[styles.facesImg, { 
                transform: [{ translateX: 30 }]}]}
            />
            <Image 
              source={require("./eventcard_test/profile-pic.jpg")} 
              key={"2"}
              style={[styles.facesImg, { 
                transform: [{ translateX: 10 }]}]}
            />
            <Image 
              source={require("./eventcard_test/profile-pic.jpg")} 
              key={"3"}
              style={[styles.facesImg, { 
                transform: [{ translateX: -10 }]}]}
            />
            <Image 
              source={require("./eventcard_test/profile-pic.jpg")} 
              key={"4"}
              style={[styles.facesImg, { 
                transform: [{ translateX: -30 }]}]}
            />
          </View>
        </View>
      </Divider>
    </Card>
  );
};

export default EventCard;