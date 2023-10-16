import React from "react";
import { View, StyleSheet, Image } from "react-native";

import GroupIcon from "./GroupIcon";
import GroupHeaderInfo from "./GroupHeaderInfo";
import GroupMediaIcon from "./GroupMediaIcon";
import PropTypes from "prop-types";

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
const testURL = "https://cppsea.com";
const testGithubUrl = "https://github.com";
const testDiscordUrl = "https://discord.com";
const testLinkedInUrl = "https://linkedin.com";
const testInstagramUrl = "https://instagram.com";

function GroupHeader(props) {
  const styles = StyleSheet.create({
    bannerStyle: {
      height: bannerHeight,
      resizeMode: "cover",
      width: "100%",
    },
    headerContainer: {
      height: "auto",
    },
    textContainer: {
      flexDirection: "row",
      marginHorizontal: 12,
      marginTop: -0.5 * iconSize,
    },
  });

  return (
    <View style={styles.headerContainer} testID={props.testID}>
      <Image
        testID="clubBanner"
        source={require("@app/assets/test-club-banner.png")}
        style={styles.bannerStyle}
      />
      <GroupMediaIcon
        size={17}
        testID="groupMediaIcon"
        githubUrl={testGithubUrl}
        discordUrl={testDiscordUrl}
        linkedinUrl={testLinkedInUrl}
        instagramUrl={testInstagramUrl}
      />

      <View style={styles.textContainer}>
        <GroupIcon
          testID="groupIcon"
          icon={require("@app/assets/test-club-icon.png")}
          size={iconSize}
          backgroundColor={"#0E131F"}
        />
        <GroupHeaderInfo
          testID="groupHeaderInfo"
          name={"Software Engineering Association"}
          handler={"cppsea"}
          description={exampleDescription}
          location={"Pomona, CA"}
          members={100}
          url={testURL}
          tags={orgTags}
        />
      </View>
    </View>
  );
}

GroupHeader.propTypes = {
  testID: PropTypes.string,
};

export default GroupHeader;
