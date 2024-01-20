import React from "react";
import { View, FlatList } from "react-native";
import { GroupCard } from "./GroupCard";

const groups = [
  { id: "1", name: "Software Engineering Association", handle: "@cppsea" },
  { id: "2", name: "Developers Guild", handle: "@devguild" },
];

export const GroupList = () => {
  return (
    <View>
      <FlatList
        data={groups}
        renderItem={({ item }) => <GroupCard group={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
