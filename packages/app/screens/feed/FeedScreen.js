import React, { useCallback } from "react";
import { Text, Image, StyleSheet, FlatList, View } from "react-native";
import axios from "axios";
import PropTypes from "prop-types";

import Screen from "@app/components/Screen";
import Button from "@app/components/Button";
import EventCardText from "@app/components/EventCard/EventCardText";
import EventCardRegistration from "@app/components/EventCard/EventCardRegistration";
import { useFeedContext } from "@app/utils/FeedContext";
import { FeedProvider } from "@app/utils/FeedContext";
import { GuildProvider } from "@app/utils/GuildContext";

import { useUserContext } from "@app/utils/UserContext";
import { logoutUser } from "@app/utils/datalayer";
import { ENDPOINT } from "@app/utils/constants";
import * as SecureStore from "@app/utils/SecureStore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const WHITE = "#FFFFFF";

function FeedScreen({ navigation }) {
  const { user, setUser } = useUserContext();

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

  const EventFlatList = () => {
    const { events, refreshing, onRefresh } = useFeedContext();
    const handleRenderItem = useCallback(({ item }) => {
      return (
        <GuildProvider guildId={item.guildId}>
          <View style={styles.card}>
            <View style={styles.container}>
              <EventCardText
                event={item}
                navigation={navigation}
                previousScreen="FeedDrawer"
              />
              <EventCardRegistration registerState={false} />
            </View>
          </View>
        </GuildProvider>
      );
    }, []);

    return (
      <FlatList
        onRefresh={onRefresh}
        refreshing={refreshing}
        data={events}
        renderItem={handleRenderItem}
        keyExtractor={(item) => item.key}
      />
    );
  };

  return (
    <>
      <FeedProvider>
        <Screen>
          <Text>Hello, {user.firstName}</Text>
          <Image style={styles.avatar} source={{ uri: user.data.avatar }} />
          <Text>{JSON.stringify(user)}</Text>
          <Button onPress={handleOnLogout} title="logout" />
        </Screen>
        <EventFlatList />
      </FeedProvider>
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
