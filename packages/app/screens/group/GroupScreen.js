import React, {useState} from "react";

import GroupHeader from "./GroupHeader.js";
import GroupTabs from "./GroupTabs.js";
import Screen from "@app/components/Screen";

function GroupScreen() {
  const [headerIsVisible, setHeaderIsVisible] = useState(true)

  function handleScrollToTop() {
    setHeaderIsVisible(true);
  }
  
  function handleScrollDown() {
    setHeaderIsVisible(false);
  }

  return (
    <Screen style={{height: '100%'}}>
      {headerIsVisible && <GroupHeader/>}
      <GroupTabs style={{height: '100%', display: 'flex'}} handleScrollToTop={handleScrollToTop} handleScrollDown={handleScrollDown}/>
    </Screen>
  );
}

export default GroupScreen;
