import React, { useCallback, useEffect, useState } from "react";
import { Text, Image, StyleSheet, View, FlatList } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Screen from "@app/components/Screen";
import Button from "@app/components/Button";
import CardEvent from "@app/components/EventCard/EventCard";

import { useUserContext } from "@app/utils/UserContext";
import { logoutUser } from "@app/utils/datalayer";
import { ENDPOINT } from "@app/utils/constants";

function FeedScreen() {
  const { user, setUser } = useUserContext();
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleOnLogout = useCallback(async () => {
    console.log("logout");
    await logoutUser();
    setUser({
      isLoggedIn: false,
    });
  }, [setUser]);

  const getEvents = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log("@token", token);
    const response = await axios.get(`${ENDPOINT}/events`, {
      withCredentials: true,
      headers: {
        Authorization: token,
      },
    });

    const serializeEvents = response.data.events.map(event => {
      return {
        ...event,
        key: event.event_id
      }
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
      <CardEvent
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
        <Text>Hello, {user.data.firstName}</Text>
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
    width: 80,
    height: 80,
    borderRadius: 100,
  },
  h1: {
    fontWeight: "bold"
  }
});

export default FeedScreen;
