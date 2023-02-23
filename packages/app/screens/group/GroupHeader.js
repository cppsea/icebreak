import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";

import GroupHeaderIcon from "./GroupIcon.js";

function GroupHeader() {
  const styles = StyleSheet.create({
    headerContainer: {
      width: "100%",
      height: 390,
      borderBottomColor: "grey",
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    bannerStyle: { width: "100%", height: 122 },
  });

  return (
    <View style={styles.headerContainer}>
      <View>
        <Image
          source={require("@app/assets/test-club-banner.png")}
          style={styles.bannerStyle}
        />
        <GroupHeaderIcon
          icon={require("@app/assets/test-club-icon.png")}
          size={62}
          backgroundColor={"#0E131F"}
        />
      </View>
    </View>
  );
}

export default GroupHeader;
