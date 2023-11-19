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

import PropTypes from "prop-types";

const GRAY = "#2C2C2C";
const LIGHT_GRAY = "#6C6C6C";
const BLUE = "#3498DB";

const styles = StyleSheet.create({
  clubDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  containerStyle: {
    height: "100%",
    marginTop: 44,
    width: "100%",
  },
  dataContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginRight: 10,
    marginTop: 6,
  },
  dataTextStyle: {
    color: LIGHT_GRAY,
    fontSize: 12,
    marginLeft: 5,
  },
  descriptionContainer: {
    marginTop: 6,
  },
  descriptionStyle: {
    fontSize: 13, // NOTE: Default font family; change later?
  },
  handlerContainer: {
    marginTop: -4,
  },
  handlerStyle: {
    color: LIGHT_GRAY,
    fontSize: 13,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  titleContainer: {
    justifyContent: "center",
  },
  titleStyle: {
    color: GRAY,
    fontSize: 18,
    fontWeight: "700",
  },
  url: {
    color: BLUE,
    flexShrink: 1,
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
    <View style={styles.containerStyle} testID={props.testID}>
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
            ellipsizeMode={isDescriptionTruncated ? "tail" : undefined}>
            {props.description}
          </Text>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.clubDetails}>
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
            style={[styles.dataTextStyle, styles.url]}
            numberOfLines={1}
            ellipsizeMode="tail"
            onPress={() => Linking.openURL(props.url)}>
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

GroupHeaderInfo.propTypes = {
  description: PropTypes.string,
  handler: PropTypes.string,
  location: PropTypes.string,
  members: PropTypes.number,
  name: PropTypes.string,
  orgTags: PropTypes.arrayOf(PropTypes.string),
  tags: PropTypes.arrayOf(PropTypes.string),
  testID: PropTypes.string,
  url: PropTypes.string,
};

export default GroupHeaderInfo;
