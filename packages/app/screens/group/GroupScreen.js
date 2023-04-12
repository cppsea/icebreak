import React, {useState} from "react";

import GroupHeader from "./GroupHeader.js";
import GroupTabs from "./GroupTabs.js";
import Screen from "@app/components/Screen";
import { Animated, StyleSheet, View } from 'react-native'

function GroupScreen() {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [headerOffset, setHeaderOffset] = useState(new Animated.Value(0))
  const [viewHeight, setViewHeight] = useState(0);

  function handleViewLayout(event) {
    const { height } = event.nativeEvent.layout;
    setViewHeight(height);
  }

  function collapseAnimation() {
    Animated.timing(headerOffset, {
      toValue: -viewHeight,
      duration: 100,
      useNativeDriver: true
    }).start()
  }
  
  function expandAnimation() {
    Animated.timing(headerOffset, {
      toValue: 0,
      duration: 80,
      useNativeDriver: true
    }).start()
  }

  // Make header expand when scrolling up past top
  function handleScrollToTop() {
    expandAnimation()
  }
  
  // Make header collapse when scrolling down
  function handleScrollDown() {
    collapseAnimation()
  }

  function getScrollOffset(offsetY) {
    setScrollOffset(offsetY)
  }

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      transform: [{translateY: headerOffset}]
    },
    header: {
      position: 'relative',
      transform: [{translateY: headerOffset}]
    }
  });

  return (
    <Screen style={{height: '100%'}}>
      <Animated.View style={styles.container}>
        <Animated.View style={styles.header} onLayout={handleViewLayout}>
          <GroupHeader />
        </Animated.View>
        <GroupTabs style={{height: '100%', display: 'flex'}} handleScrollToTop={handleScrollToTop} handleScrollDown={handleScrollDown} getScrollOffset={getScrollOffset}/>
      </Animated.View>
    </Screen>
  );
}

export default GroupScreen;
