import React from "react";

import GroupHeader from "./GroupHeader.js";
import GroupTabs from "./GroupTabs.js";
import Screen from "@app/components/Screen";

function GroupScreen() {
  return (
    <Screen>
      <GroupHeader />
      <GroupTabs />
    </Screen>
  );
}

export default GroupScreen;
