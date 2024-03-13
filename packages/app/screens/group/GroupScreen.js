import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

import GroupHeader from "../../components/GroupScreen/GroupHeader.js";
import GroupTabs from "../../components/GroupScreen/GroupTabs.js";
import { GuildProvider } from "@app/utils/GuildContext.js";
import Screen from "@app/components/Screen";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { EventProvider } from "@app/utils/EventContext.js";
import EventsScreen from "../../screens/group/tabs/events/EventsScreen";
import MembersScreen from "../../screens/group/tabs/MembersScreen";
import LeaderboardScreen from "../../screens/group/tabs/LeaderboardScreen";
import AboutScreen from "../../screens/group/tabs/AboutScreen";
import NewsletterScreen from "../../screens/group/tabs/NewsletterScreen";

const WHITE = "#F5F5F5";

const tabs = [
  { name: "Events", screen: EventsScreen },
  { name: "Members", screen: MembersScreen },
  { name: "Leaderboard", screen: LeaderboardScreen },
  { name: "About", screen: AboutScreen },
  { name: "Newsletter", screen: NewsletterScreen },
];

function GroupScreen({ navigation, route }) {
  const tabRef = useRef(null);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const styles = StyleSheet.create({
    container: {
      display: "flex",
      height: "100%",
    },
    groupTabs: {
      backgroundColor: WHITE,
      display: "flex",
    },
    screen: {
      flex: 1,
    },
  });

  return (
    <Screen style={styles.container}>
      <GuildProvider guildId={route.params?.guildId}>
        <ScrollView scrollEventThrottle={16} stickyHeaderIndices={[1]}>
          <GroupHeader testID="groupHeader" />
          <View ref={tabRef}>
            <GroupTabs
              testID="groupTabs"
              style={styles.groupTabs}
              tabs={tabs}
              activeTab={activeTab}
              selectTab={(tab) => setActiveTab(tab)}
            />
          </View>
          <EventProvider>
            {activeTab.screen && (
              <activeTab.screen
                testID="tab"
                style={styles.screen}
                navigation={navigation}
              />
            )}
          </EventProvider>
        </ScrollView>
      </GuildProvider>
    </Screen>
  );
}
GroupScreen.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
export default GroupScreen;
