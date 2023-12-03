import MemberCard from "@app/components/MemberCard/MemberCard";
import React from "react";
import { View } from "react-native";


// max characters display should be 15?
const mockData = [
  {
    key: "one",
    name: "Carl",
  },
  {
    key: "two",
    name: "Joe",
  },
  {
    key: "three",
    name: "Bobby Jones 3rd",
  },
  {
    key: "four",
    name: "Chicken Nugget",
  },
  {
    key: "five",
    name: "Jill",
  },
  {
    key: "six",
    name: "Jack",
  },
  {
    key: "seven",
    name: "Bartholemew"
  }
];

function MembersScreen() {

  return (
    <View>
      {mockData.map((section) => (
        <View key={section.key}>
          <MemberCard name={section.name.length <= 12 ? section.name : section.name.substring(0, 12) + "..."} />
        </View>
      ))}
    </View>
  );
}

export default MembersScreen;