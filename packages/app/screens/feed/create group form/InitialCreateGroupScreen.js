import React from "react";
import {
  View,
  Text,
} from "react-native";
import Button from "@app/components/Button";
import { styles } from "./CreateGroupFormStyles";

function InitialCreateGroupScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button onPress={() => navigation.navigate("Feed")} title="Back" />
      <Button
        onPress={() => navigation.navigate("Create Group Form 1")}
        title="CREATE GROUP"
      />
      <Text>Create Group Scren</Text>
    </View>
  );
}

export default InitialCreateGroupScreen;
