import React from "react";
import { View, Text, Image } from "react-native";
import PropTypes from "prop-types";
import EventCardText from "@app/components/EventCard/EventCardText";
import EventCardRegistration from "@app/components/EventCard/EventCardRegistration";
import { useEventContext } from "@app/utils/EventContext";
import { useTheme } from "@app/utils/theme";

const mockData = [
  {
    title: "Wednesday, April 6",
    data: ["Pizza", "Burger", "Risotto"],
  },
  {
    title: "Friday, April 8",
    data: ["Pizza", "Burger"],
  },
  {
    title: "Sunday, April 10",
    data: ["Pizza"],
  },
];

const useStyles = () => {
  const theme = useTheme();
  return {
    banner: {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      height: 144,
      width: "100%",
    },
    card: {
      borderRadius: 15,
      backgroundColor: theme.brand.secondary,
      marginBottom: 10,
      marginTop: 10,
    },
    container: {
      margin: 10,
    },
    header: {
      color: theme.SecondaryBodyText.opacity70,
      fontSize: 20,
      fontWeight: "700",
    },
  };
};
function EventsScreen(props) {
  const styles = useStyles();
  const event = useEventContext();

  return (
    <View style={[props.style, styles.container]} testID={props.testID}>
      {mockData.map((section) => (
        <View key={section.title}>
          <Text style={styles.header}>Upcoming</Text>
          {section.data.map((item, index) => (
            <View style={styles.card} key={index}>
              <Image
                source={require("@app/assets/test_card_banner.png")}
                style={styles.banner}
              />
              <View style={styles.container}>
                <EventCardText
                  event={event}
                  navigation={props.navigation}
                  previousScreen="GroupScreen"
                />
                <EventCardRegistration registerState={false} />
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

EventsScreen.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
  navigation: PropTypes.object,
};

export default EventsScreen;
