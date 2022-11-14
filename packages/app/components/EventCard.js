import React, { useCallback, useEffect, useState} from 'react';
import Button from '@app/components/Button';
import { View, Image, Text, FlatList, StyleSheet } from 'react-native';
import { Card, ListItem, Icon, Divider } from 'react-native-elements'; 
import FacePile from 'react-native-face-pile';

const FACES = [
  {
    id: 0,
    imageUrl: "./eventcard_test/faces_test/python.png"
  },
  {
    id: 1,
    imageUrl: "./eventcard_test/faces_test/cplusplus.png"
  },
  {
    id: 2,
    imageUrl: "./eventcard_test/faces_test/csharp.png"
  },
  {
    id: 3,
    imageUrl: "./eventcard_test/faces_test/javascript.png"
  }
];

function EventCard(props){
  const styles = StyleSheet.create({
    banner: {
      width: 360,
      height: 144,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10
    },
    button: {
      borderRadius: 10,
      elevation: 0,
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
    }
  });

  const registerGoing = () => {
    console.log("Hello world");
  };

  const [faces] = FACES;

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
              <Text style={styles.description}>{props.description}</Text>
              <View style={{ flexDirection: 'row',}}>
                <View style={{ flex: 0.9 }} >
                  <Button
                    icon={<Icon color='#3498db' />}
                    buttonStyle={styles.button}
                    title='Going'
                    onClick={registerGoing} 
                  />
                </View>
                <FacePile numFaces={4} faces={faces} hideOverflow={true} />
              </View>
            </Divider>
    </Card>
  );
};

export default EventCard;