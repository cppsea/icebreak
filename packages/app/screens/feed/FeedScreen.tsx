import React, { useCallback, useEffect, useState } from "react";
import { Text, Image, StyleSheet, FlatList } from "react-native";
import axios from "axios";

import Screen from "@app/components/Screen";
import Button from "@app/components/Button";
import EventCard from "@app/components/EventCard/EventCard";

import { useUserContext } from "@app/utils/UserContext";
import { logoutUser } from "@app/utils/datalayer";
import { ENDPOINT } from "@app/utils/constants";
import { EventType, ItemType } from "@app/types/EventCard";


import * as SecureStore from "@app/utils/SecureStore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

function FeedScreen() {
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
        Authorization: token ?? "",
      },
    });

    const serializeEvents = response.data.events.map((event: EventType) => {
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

  const handleRenderItem = useCallback(( item: ItemType ) => {
    return (
      <EventCard
        title={item.title}
        description={item.description}
        location={item.location}
        timeBegin={item.start_date}
        timeEnd={item.end_date}
      />
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
});

export default FeedScreen;
