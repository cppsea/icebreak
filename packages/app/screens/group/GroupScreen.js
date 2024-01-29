import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

import GroupHeader from "../../components/GroupScreen/GroupHeader.js";
import GroupTabs from "../../components/GroupScreen/GroupTabs.js";
import Screen from "@app/components/Screen";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import EventsScreen from "../../screens/group/tabs/EventsScreen";
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

function GroupScreen({ navigation }) {
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
        {activeTab.screen && (
          <activeTab.screen
            testID="tab"
            style={styles.screen}
            navigation={navigation}
            previousScreen="GroupScreen"
          />
        )}
      </ScrollView>
    </Screen>
  );
}
GroupScreen.propTypes = {
  navigation: PropTypes.object,
};
export default GroupScreen;
