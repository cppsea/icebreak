import React from "react";
import { View, StyleSheet, Image } from "react-native";

import GroupIcon from "./GroupIcon";
import GroupHeaderInfo from "./GroupHeaderInfo";
import GroupMediaIcon from "./GroupMediaIcon";
import PropTypes from "prop-types";
import { useGuildContext } from "@app/utils/GuildContext";

const bannerHeight = 110;
const iconSize = 62;

const testGithubUrl = "https://github.com";
const testDiscordUrl = "https://discord.com";
const testLinkedInUrl = "https://linkedin.com";
const testInstagramUrl = "https://instagram.com";

function GroupHeader(props) {
  const { guild, guildMembers } = useGuildContext();

  return (
    <View style={styles.headerContainer} testID={props.testID}>
      <Image
        testID="clubBanner"
        source={{ uri: guild.banner }}
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
        <View style={{ marginTop: -iconSize / 2 }}>
          <GroupIcon
            testID="groupIcon"
            icon={require("@app/assets/test-club-icon.png")}
            size={iconSize}
            backgroundColor={"#0E131F"}
          />
        </View>
        <GroupHeaderInfo
          testID="groupHeaderInfo"
          name={guild.name}
          handler={guild.handler}
          description={guild.description}
          location={guild.location}
          members={guildMembers.length}
          url={guild.website}
          tags={guild.tags}
        />
      </View>
    </View>
  );
}

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

GroupHeader.propTypes = {
  testID: PropTypes.string,
};

export default GroupHeader;
