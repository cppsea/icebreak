import React, { useCallback, useEffect, useState } from "react";
import { Text, Image, ImageProps as DefaultImageProps, ImageURISource, ImageSourcePropType, StyleSheet, View, FlatList } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Screen from "@app/components/Screen";
import Button from "@app/components/Button";
import CardEvent from "@app/components/EventCard/EventCard";

import { useUserContext } from "@app/utils/UserContext";
import { logoutUser } from "@app/utils/datalayer";
import { ENDPOINT } from "@app/utils/constants";

type EventType = {
  event_id: string,
  guild_id: string,
  title: string,
  description: string,
  start_date: number,
  end_date: number,
  location: string,
  thumbnail: string
}

type ItemType = {
  banner: ImageSourcePropType,
  title: string,
  description: string,
  location: string,
  start_date: string,
  end_date: string
}

type ImageProps = DefaultImageProps & {
  source: ImageURISource;
};

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
        Authorization: token ?? "",
      },
    });

    const serializeEvents = response.data.events.map((event: EventType) => {
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

  const handleRenderItem = useCallback(( item: ItemType ) => {
    return (
      <CardEvent
        banner={item.banner}
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
