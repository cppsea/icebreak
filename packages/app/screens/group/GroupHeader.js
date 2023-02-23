import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";

import GroupIcon from "./GroupIcon";
import GroupHeaderInfo from "./GroupHeaderInfo";
import GroupMediaIcon from "./GroupMediaIcon";

const bannerHeight = 122; // main anchor for component positioning
const iconSize = 62;
const headerHeight = bannerHeight + 268; // for testing purposes
const exampleDescription =
  "The Software Engineering Association (SEA) teaches and encourages the professional skills needed to be a Software Engineer, including code review, unit testing, communication, and software design. Our online and in-meeting exercises allow anyone, novice or professional, to sharpen and practice these skills.";
const exampleDescription2 =
  "The Software Engineering Association (SEA) teaches skills needed to be a Software Engineer.";
const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: headerHeight,
    borderBottomColor: "grey",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bannerStyle: { width: "100%", height: bannerHeight },
});

function GroupHeader() {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("@app/assets/test-club-banner.png")}
        style={styles.bannerStyle}
      />

      <GroupIcon
        icon={require("@app/assets/test-club-icon.png")}
        size={iconSize}
        backgroundColor={"#0E131F"}
        anchor={bannerHeight}
      />

      <GroupMediaIcon anchor={bannerHeight} size={17} />

      <GroupHeaderInfo
        name={"Software Engineering Association"}
        handler={"cppsea"}
        description={exampleDescription2}
        anchor={bannerHeight}
      />
    </View>
  );
}

export default GroupHeader;
