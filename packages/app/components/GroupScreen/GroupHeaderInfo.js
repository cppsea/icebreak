import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import GroupTag from "./GroupTag";

const styles = StyleSheet.create({
  containerStyle: {
    height: "100%",
    width: "100%",
    marginTop: 44,
  },
  titleContainer: {
    justifyContent: "center",
  },
  titleStyle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C2C2C",
  },
  handlerContainer: {
    marginTop: -4,
  },
  handlerStyle: {
    fontSize: 13,
    color: "#6C6C6C",
  },
  descriptionContainer: {
    marginTop: 6,
  },
  descriptionStyle: {
    fontSize: 13, // NOTE: Default font family; change later?
  },
  dataContainer: {
    marginTop: 6,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  dataTextStyle: {
    fontSize: 12,
    marginLeft: 5,
    color: "#6C6C6C",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
});

/**
 * A component for GroupHeader that displays an organization's information.
 *
 * @param {object} props - Object that contains properties of this component.
 * @param {string} props.name - Name of org.
 * @param {string} props.handler - Handler of org, implementation already includes '@'.
 * @param {string} props.description - Description of org.
 *
 * @param {string} props.location - Location of org.
 * @param {number} props.members - Amount of members in org.
 * @param {string} props.url - Link to the website of org.
 * @param {string[]} props.tags - String array of tags related to org.
 */
function GroupHeaderInfo(props) {
  const [isDescriptionTruncated, setIsDescriptionTruncated] = useState(true);

  const toggleDescriptionTruncation = () => {
    setIsDescriptionTruncated(!isDescriptionTruncated);
  };

  return (
    <View style={styles.containerStyle}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleStyle}>{props.name}</Text>

        <View style={styles.handlerContainer}>
          <Text style={styles.handlerStyle}>@{props.handler}</Text>
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <TouchableWithoutFeedback onPress={toggleDescriptionTruncation}>
          <Text
            style={styles.descriptionStyle}
            numberOfLines={isDescriptionTruncated ? 3 : undefined}
            ellipsizeMode={isDescriptionTruncated ? "tail" : undefined}
          >
            {props.description}
          </Text>
        </TouchableWithoutFeedback>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <View style={styles.dataContainer}>
          <Ionicons name="location-sharp" size={16} color="#6C6C6C" />
          <Text style={styles.dataTextStyle}>{props.location || "N/A"}</Text>
        </View>

        <View style={styles.dataContainer}>
          <Ionicons name="person" size={16} color="#6C6C6C" />
          <Text style={styles.dataTextStyle}>
            {props.members > 0 ? props.members : 0} members
          </Text>
        </View>

        <View style={styles.dataContainer}>
          <Ionicons name="link-sharp" size={16} color="#6C6C6C" />
          <Text
            style={[
              styles.dataTextStyle,
              {
                color: "#3498DB",
                flexShrink: 1,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
            onPress={() => Linking.openURL(props.url)}
          >
            {props.url}
          </Text>
        </View>
      </View>

      <View style={styles.tagContainer}>
        {props.tags.map((tag, index) => (
          <GroupTag key={index} text={tag} />
        ))}
      </View>
    </View>
  );
}

export default GroupHeaderInfo;
