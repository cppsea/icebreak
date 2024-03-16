import React from "react";
import { View, Text } from "react-native";
import Button from "@app/components/Button";
import PropTypes from "prop-types";
import { styles } from "./CreateGroupFormStyles";

function InitialCreateGroupScreen({ navigation }) {
  return (
    <View style={styles.initialgroup}>
      <Button onPress={() => navigation.navigate("Feed")} title="Back" />
      <Button
        onPress={() => navigation.navigate("Create Group Form")}
        title="CREATE GROUP"
      />
      <Text>Create Group Scren</Text>
    </View>
  );
}

InitialCreateGroupScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default InitialCreateGroupScreen;
