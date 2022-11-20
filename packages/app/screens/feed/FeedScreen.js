import React, { useCallback, useEffect, useState } from "react";
import { Text, Image, StyleSheet, View, FlatList } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Screen from "@app/components/Screen";
import Button from "@app/components/Button";
import { useUserContext } from "@app/utils/UserContext";
import { logoutUser } from "@app/utils/datalayer";
import { ENDPOINT } from "@app/utils/constants";

function Card(props) {
  const { title, description, start_date, end_date, location } = props;
  return (
    <View>
      <Text>{title}</Text>
      <Text>{description}</Text>
      <Text>{start_date}</Text>
      <Text>{end_date}</Text>
      <Text>{location}</Text>
      <Text>{start_date}</Text>
    </View>
  );
}

function FeedScreen() {
  const { user, setUser } = useUserContext();

  const handleOnLogout = useCallback(async () => {
    console.log("logout");
    await logoutUser();
    setUser({
      isLoggedIn: false,
    });
  }, [setUser]);

  const handleGetAllUsers = useCallback(async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get("http://localhost:5050/api/users/", {
      withCredentials: true,
      headers: {
        Authorization: token,
      },
    });
    console.log(response.data);
  }, []);

  const [events, setEvents] = useState([]);

  const [isRefreshed, setIsRefreshed] = React.useState(false);

  const getEvents = async () => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.get(`${ENDPOINT}/events`, {
      withCredentials: true,
      headers: {
        Authorization: token,
      },
    });
    setEvents(response.data);
  };
  useEffect(() => {
    getEvents();
  }, [isRefreshed]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const onRefresh = async () => {
    setIsRefreshed(true);
    await sleep(2000);
    setIsRefreshed(false);
  };

  return (
    <>
      <Screen>
        <Text>Hello, {user.data.firstName}</Text>
        <Image style={styles.avatar} source={{ uri: user.data.avatar }} />
        <Text>{JSON.stringify(user)}</Text>
        <Button onPress={handleOnLogout} title="logout" />
        <Button onPress={handleGetAllUsers} title="get all users" />
      </Screen>

      <FlatList
        onRefresh={onRefresh}
        refreshing={isRefreshed}
        data={events}
        renderItem={({ item }) => <Card {...item} />}
        keyExtractor={(item) => item.event_id}
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
});

export default FeedScreen;
