import React, { useRef, useState, useEffect } from "react";
import { Platform } from "react-native";
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
const tabTextPadding = 10;
const tabGroupMargin = 5;
const blueViewPosition = new Animated.ValueXY({
  x: tabTextPadding + tabGroupMargin,
  y: -1,
});
const staticBlueViewPosition = blueViewPosition.getLayout().top.toString + "px";

function GroupTabs(props) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const { handleScrollDown, handleScrollToTop, getScrollOffset } = props;

  // viewRefs.current to access the list
  // viewRefs.current[index].current to access the view
  const viewRefs = useRef([]);

  useEffect(() => {
    // Initialize viewRefs list with a ref for each view
    viewRefs.current = tabs.map(() => React.createRef());
  }, [tabs]);

  // Move the blue view whenever activeTab or scrollOffset changed
  useEffect(() => {
    getPosition()
      .then((position) => {
        Animated.spring(blueViewPosition, {
          toValue: { x: position, y: blueViewPosition.y },
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => {
            setIsAnimationComplete(true);
          }, 200);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [activeTab, scrollOffset]);

  function getPosition() {
    // measureInWindow worked better in Android and measure worked better on iOS
    if (Platform.OS === "ios") {
      return new Promise((resolve, reject) => {
        for (let index = 0; index < tabs.length; index++) {
          if (tabs[index] == activeTab && viewRefs.current[index].current) {
            let position;
            viewRefs.current[index].current.measure(
              (x, y, width, height, pageX, pageY) => {
                position = x + width / 2 - scrollOffset - blueViewWidth / 2 + 3;
                resolve(position);
              }
            );
            return;
          }
        }
        reject(new Error("Could not find active tab or view ref"));
      });
    } else {
      return new Promise((resolve, reject) => {
        for (let index = 0; index < tabs.length; index++) {
          if (tabs[index] == activeTab && viewRefs.current[index].current) {
            let position;
            viewRefs.current[index].current.measureInWindow(
              (x, y, width, height, pageX, pageY) => {
                position = x + width / 2 - scrollOffset - blueViewWidth / 2 + 5;
                resolve(position);
              }
            );
            return;
          }
        }
        reject(new Error("Could not find active tab or view ref"));
      });
    }
  }

  function selectTab(tab) {
    setActiveTab(tab);
    setIsAnimationComplete(false);
  }

  function handleScroll(event) {
    setScrollOffset(event.nativeEvent.contentOffset.x);
  }

  return (
    <View style={props.style}>
      <View>
        <ScrollView
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

                  {activeTab.name == tab.name && (
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
    paddingLeft: tabTextPadding,
    paddingRight: tabTextPadding,
  },
  tabScrollView: {
    marginLeft: tabGroupMargin,
    marginRight: tabGroupMargin,
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
