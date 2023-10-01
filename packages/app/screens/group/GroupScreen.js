import React, { useState, useRef } from "react";

import GroupHeader from "../../components/GroupScreen/GroupHeader.js";
import GroupTabs from "../../components/GroupScreen/GroupTabs.js";
import Screen from "@app/components/Screen";
import { Animated, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import EventsScreen from "../../screens/group/tabs/EventsScreen";
import MembersScreen from "../../screens/group/tabs/MembersScreen";
import LeaderboardScreen from "../../screens/group/tabs/LeaderboardScreen";
import AboutScreen from "../../screens/group/tabs/AboutScreen";
import NewsletterScreen from "../../screens/group/tabs/NewsletterScreen";

const tabs = [
  { name: "Events", screen: EventsScreen },
  { name: "Members", screen: MembersScreen },
  { name: "Leaderboard", screen: LeaderboardScreen },
  { name: "About", screen: AboutScreen },
  { name: "Newsletter", screen: NewsletterScreen },
];

function GroupScreen() {
  const tabRef = useRef(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [activeTab, setActiveTab] = useState(tabs[0]);


  function handleScroll(event) {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollOffset(offsetY)
  }

  const styles = StyleSheet.create({
    container: {
      height: "100%",
      display: 'flex'
    },
    screen: {
      flex: 1,
    },
  });

  return (
    <Screen style={styles.container}>
      <ScrollView onScroll={handleScroll} scrollEventThrottle={16} stickyHeaderIndices={[1]}>
        <GroupHeader testID="groupHeader"/>
        <View ref={tabRef}>
          <GroupTabs
            testID="groupTabs"
            style={{ display: "flex", backgroundColor: '#F5F5F5'}}
            tabs={tabs}
            activeTab={activeTab}
            selectTab={(tab) => setActiveTab(tab)}
          />
        </View>
        {activeTab.screen && (
          <activeTab.screen
            testID="tab"
            style={styles.screen}
          />
        )}
      </ScrollView>
    </Screen>
  );
}

export default GroupScreen;
