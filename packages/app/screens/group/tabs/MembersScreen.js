import MemberCard from "@app/components/MemberCard/MemberCard";
import { View } from "react-native";
import React from "react";
import { useGuildContext } from "@app/utils/GuildContext";

function MembersScreen() {
  const { guildMembers } = useGuildContext();

  return (
    <View>
      {guildMembers.map((member) => (
        <View key={member.userId}>
          <MemberCard
            image={member.avatar}
            name={
              (member.firstName + " " + member.lastName).length <= 12
                ? member.firstName + " " + member.lastName
                : (member.firstName + " " + member.lastName).substring(0, 12) +
                  "..."
            }
          />
        </View>
      ))}
    </View>
  );
}

export default MembersScreen;
