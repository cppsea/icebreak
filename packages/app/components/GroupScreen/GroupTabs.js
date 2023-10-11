import React, { useRef, useState, useEffect, createRef } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import PropTypes from "prop-types";

const BLUE = "#3498DB";
const LIGHT_GRAY = "#E4E4E4";
const GRAY = "#717171";
const DARK_GRAY = "#2C2C2C";

const blueViewWidth = 60;
const blueViewPosition = new Animated.ValueXY({
  x: 30,
  y: -1,
});

function GroupTabs(props) {
  const [isAnimationComplete, setIsAnimationComplete] = useState(true);
  const { selectTab, tabs, activeTab } = props;

  // viewRefs.current to access the list
  // viewRefs.current[index].current to access the view
  const viewRefs = useRef([]);

  useEffect(() => {
    // Initialize viewRefs list with a ref for each view
    viewRefs.current = tabs.map(() => createRef());
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
          speed: 100,
          restSpeedThreshold: 100,
          restDisplacementThreshold: 40,
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

  // Set starting position for Blue View
  useEffect(() => {
    setIsAnimationComplete(true);
  }, []);

  function getPosition() {
    return new Promise((resolve, reject) => {
      for (let index = 0; index < tabs.length; index++) {
        if (tabs[index] == activeTab && viewRefs.current[index].current) {
          viewRefs.current[index].current.measure(
            (x, y, width, height, pageX) => {
              const tabCenter = pageX + width / 2;
              const position = tabCenter - blueViewWidth / 2;
              resolve(position);
            }
          );
          return;
        }
      }
      reject(new Error("Could not find active tab or view ref"));
    });
  }

  return (
    <View style={props.style} testID={props.testID}>
      <View>
        <ScrollView
          testID="tabScrollView"
          style={styles.tabScrollView}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}>
          <View style={styles.innerTabView}>
            {tabs.map((tab, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => {
                  selectTab(tab);
                }}>
                <View style={styles.tab} ref={viewRefs.current[index]}>
                  <View style={styles.tabTextContainer}>
                    <Text
                      style={[
                        styles.tabText,
                        {
                          color: activeTab.name === tab.name ? DARK_GRAY : GRAY,
                        },
                      ]}>
                      {tab.name}
                    </Text>
                  </View>

                  {activeTab.name === tab.name && (
                    <View
                      style={[
                        styles.staticBlueView,
                        // eslint-disable-next-line react-native/no-inline-styles
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
            styles.blueView,
            // eslint-disable-next-line react-native/no-inline-styles
            isAnimationComplete ? { opacity: 0 } : {},
          ]}
        />

        <View style={styles.bottomBorder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  blueView: {
    backgroundColor: BLUE,
    borderRadius: 2,
    height: 3,
    left: 0,
    marginTop: -2,
    right: 0,
    transform: blueViewPosition.getTranslateTransform(),
    width: blueViewWidth,
  },
  bottomBorder: {
    backgroundColor: LIGHT_GRAY,
    height: 3,
    width: "100%",
  },
  innerTabView: {
    flexDirection: "row",
  },
  staticBlueView: {
    backgroundColor: BLUE,
    borderRadius: 2,
    height: 3,
    marginBottom: -10,
    transform: [{ translateY: 7 }],
    width: blueViewWidth,
  },
  tab: {
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabScrollView: {
    marginLeft: 5,
    marginRight: 5,
  },
  tabText: {
    fontWeight: "600",
    paddingLeft: 10,
    paddingRight: 10,
  },
  tabTextContainer: {
    alignItems: "center",
  },
});

GroupTabs.propTypes = {
  activeTab: PropTypes.object,
  selectTab: PropTypes.func,
  size: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  tabs: PropTypes.arrayOf(PropTypes.object),
  testID: PropTypes.string,
};

export default GroupTabs;
