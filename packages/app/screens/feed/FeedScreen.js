import React, { useCallback, useEffect, useState } from "react";
import { Text, Image, StyleSheet, FlatList, View } from "react-native";
import axios from "axios";
import PropTypes from "prop-types";

import Screen from "@app/components/Screen";
import Button from "@app/components/Button";
import EventCardText from "@app/components/EventCard/EventCardText";
import EventCardRegistration from "@app/components/EventCard/EventCardRegistration";

import { useUserContext } from "@app/utils/UserContext";
import { logoutUser } from "@app/utils/datalayer";
import { ENDPOINT } from "@app/utils/constants";
import * as SecureStore from "@app/utils/SecureStore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const WHITE = "#FFFFFF";

function FeedScreen({ navigation }) {
  const { user, setUser } = useUserContext();
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleOnLogout = useCallback(async () => {
    console.log("logout");

    try {
      // Revoke the refresh token
      const refreshToken = await SecureStore.getValueFor("refreshToken");
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(`${ENDPOINT}/auth/token/revoke`, {
        refreshToken: refreshToken,
      });

      if (response.status === 200) {
        // Remove tokens from SecureStore and logout user
        await logoutUser();
        await GoogleSignin.signOut();
        setUser({
          isLoggedIn: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [setUser]);

  const getEvents = async () => {
    const token = await SecureStore.getValueFor("accessToken");
    const { data: response } = await axios.get(`${ENDPOINT}/events/pages`, {
      headers: {
        Authorization: token,
      },
    });

    const serializeEvents = response.data.events.map((event) => {
      return {
        ...event,
        key: event.eventId,
      };
    });

    setEvents(serializeEvents);
  };

  useEffect(() => {
    getEvents();
  }, [refreshing]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getEvents();
    setRefreshing(false);
  }, []);

  const handleRenderItem = useCallback(({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.container}>
          <EventCardText
            title={item.title}
            description={item.description}
            location={item.location}
            timeBegin={item.start_date}
            timeEnd={item.end_date}
            navigation={navigation}
            previousScreen="FeedDrawer"
          />
          <EventCardRegistration registerState={false} />
        </View>
      </View>
    );
  }, []);

  return (
    <>
      <Screen>
        <Text>Hello, {user.firstName}</Text>
        <Image style={styles.avatar} source={{ uri: user.data.avatar }} />
        <Text>{JSON.stringify(user)}</Text>
        <Button onPress={handleOnLogout} title="logout" />
      </Screen>
      <FlatList
        onRefresh={onRefresh}
        refreshing={refreshing}
        data={events}
        renderItem={handleRenderItem}
        keyExtractor={(item) => item.key}
      />
    </>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 100,
    height: 80,
    width: 80,
  },
  card: {
    backgroundColor: WHITE,
    marginBottom: 10,
    marginTop: 10,
  },
  container: {
    margin: 10,
  },
});

FeedScreen.propTypes = {
  navigation: PropTypes.object,
};

export default FeedScreen;
