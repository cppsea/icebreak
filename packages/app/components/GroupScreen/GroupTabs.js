import React, { useRef, useState, useEffect } from "react";
import { LogBox, Platform } from "react-native";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import EventsScreen from "../../screens/group/tabs/EventsScreen";
import MembersScreen from "../../screens/group/tabs/MembersScreen";
import LeaderboardScreen from "../../screens/group/tabs/LeaderboardScreen";
import AboutScreen from "../../screens/group/tabs/AboutScreen";
import NewsletterScreen from "../../screens/group/tabs/NewsletterScreen";

const tabs = [
  { name: "Events", screen: EventsScreen },
  { name: "Members", screen: MembersScreen },
  { name: "Leaderboard", screen: LeaderboardScreen },
  { name: "About", screen: AboutScreen },
  { name: "Newsletter", screen: NewsletterScreen },
];

const blueViewWidth = 60;
let firstTabViewRef = React.createRef();
const blueViewPosition = new Animated.ValueXY({
  x: 0,
  y: -1,
});

function GroupTabs(props) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(true);
  const { handleScrollDown, handleScrollToTop, getScrollOffset } = props;

  // viewRefs.current to access the list
  // viewRefs.current[index].current to access the view
  const viewRefs = useRef([]);

  useEffect(() => {
    // Initialize viewRefs list with a ref for each view
    viewRefs.current = tabs.map(() => React.createRef());
  }, [tabs]);

  // Move the blue view whenever activeTab
  useEffect(() => {
    setIsAnimationComplete(false);
    animateBlueSlider();
  }, [activeTab]);

  function animateBlueSlider() {
    getPosition()
    .then((position) => {
      Animated.spring(blueViewPosition, {
        toValue: { x: position, y: blueViewPosition.y },
        useNativeDriver: true,
        speed: 100
      }).start(({ finished }) => {
        if (finished) {
          setIsAnimationComplete(true);
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    setIsAnimationComplete(true)
  }, [])

  function getPosition() {
    return new Promise((resolve, reject) => {
      for (let index = 0; index < tabs.length; index++) {
        if (tabs[index] == activeTab && viewRefs.current[index].current) {
          viewRefs.current[index].current.measure(
            (x, y, width, height, pageX, pageY) => {
              const tabCenter = pageX + width / 2;
              const position = tabCenter - (blueViewWidth / 2);
              resolve(position);
            }
          );
          return;
        }
      }
      reject(new Error("Could not find active tab or view ref"));
    });
  }

  function selectTab(tab) {
    setActiveTab(tab);
  }

  function handleScroll(event) {
    setScrollOffset(event.nativeEvent.contentOffset.x);
  }

  return (
    <View style={props.style} testID={props.testID}>
      <View>
        <ScrollView
          testID="tabScrollView"
          style={styles.tabScrollView}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={100}
          
          onScroll={handleScroll}
        >
          <View style={styles.innerTabView}>
            {tabs.map((tab, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => {
                  selectTab(tab);
                }}
              >
                <View style={styles.tab} ref={viewRefs.current[index]}>
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={[
                        styles.tabText,
                        {
                          color:
                            activeTab.name === tab.name ? "#2C2C2C" : "#717171",
                        },
                      ]}
                    >
                      {tab.name}
                    </Text>
                  </View>

                  {activeTab.name === tab.name && (
                    <View
                      style={[
                        styles.staticBlueView,
                        isAnimationComplete ? {} : { opacity: 0 },
                      ]}
                    />
                  )}
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </ScrollView>

        <Animated.View
          style={[
            {
              transform: blueViewPosition.getTranslateTransform(),
              left: 0,
              right: 0,
            },
            styles.blueView,
            isAnimationComplete ? { opacity: 0 } : {},
          ]}
        />

        <View style={styles.bottomBorder} />
      </View>

      {activeTab.screen && (
        <activeTab.screen
          testID="tab"
          style={styles.screen}
          handleScrollDown={handleScrollDown}
          handleScrollToTop={handleScrollToTop}
          getScrollOffset={getScrollOffset}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  tabText: {
    fontWeight: "600",
    paddingLeft: 10,
    paddingRight: 10,
  },
  tabScrollView: {
    marginLeft: 5,
    marginRight: 5,
  },
  innerTabView: {
    flexDirection: "row",
  },
  blueView: {
    width: blueViewWidth,
    height: 3,
    backgroundColor: "#3498DB",
    marginTop: -2,
    borderRadius: 2,
  },
  staticBlueView: {
    width: blueViewWidth,
    height: 3,
    backgroundColor: "#3498DB",
    marginBottom: -10,
    borderRadius: 2,
    transform: [{ translateY: 7 }],
  },
  bottomBorder: {
    height: 3,
    width: "100%",
    backgroundColor: "#E4E4E4",
  },
  screen: {
    flex: 1,
  },
});

export default GroupTabs;
