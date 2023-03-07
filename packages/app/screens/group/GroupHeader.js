import React, { useState } from "react";
import { Dimensions, View, StyleSheet, Image } from "react-native";

import GroupIcon from "./GroupIcon";
import GroupHeaderInfo from "./GroupHeaderInfo";
import GroupMediaIcon from "./GroupMediaIcon";

const bannerHeight = 110;
const iconSize = 62;
const orgTags = [
  "cs",
  "software",
  "tech",
  "engineering",
  "programming",
  "algorithms",
  "development",
  "code",
]; // string[]

const exampleDescription =
  "The Software Engineering Association (SEA) teaches and encourages the professional skills needed to be a Software Engineer, including code review, unit testing, communication, and software design. Our online and in-meeting exercises allow anyone, novice or professional, to sharpen and practice these skills.";
const exampleDescription2 =
  "The Software Engineering Association (SEA) teaches skills needed to be a Software Engineer, obviously.";

const styles = StyleSheet.create({
  headerContainer: {
    height: "auto",
  },
  textContainer: {
    marginHorizontal: 12,
    marginTop: -0.5 * iconSize,
    flexDirection: "row",
  },
  mediaIconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  bannerStyle: { width: "100%", height: bannerHeight, resizeMode: "cover" },
});

function GroupHeader() {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require("@app/assets/test-club-banner.png")}
        style={styles.bannerStyle}
      />
      <GroupMediaIcon size={17} />

      <View style={styles.textContainer}>
        <GroupIcon
          icon={require("@app/assets/test-club-icon.png")}
          size={iconSize}
          backgroundColor={"#0E131F"}
        />
        <GroupHeaderInfo
          name={"Software Engineering Association"}
          handler={"cppsea"}
          description={exampleDescription}
          location={"Pomona, CA"}
          members={100}
          url={"https://cppsea.com"}
          tags={orgTags}
        />
      </View>
    </View>
  );
}

export default GroupHeader;
