import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Text,
  TextInput,
  Button,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Alert,
} from "react-native";
import Screen from "@app/components/Screen";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import axios from "axios";
import * as SecureStore from "@app/utils/SecureStore";

import { ENDPOINT } from "@app/utils/constants";

const gray = "gray";
const guildId = "5f270196-ee82-4477-8277-8d4df5fcc864";

function EventsCreationScreen() {
  const [dateTime, setDateTime] = useState(new Date());
  const [dateTime2, setDateTime2] = useState(new Date());

  const handleDateTimeChange = (event, selectedDateTime) => {
    const currentDate = selectedDateTime || dateTime;
    setDateTime(currentDate);
    console.log(JSON.stringify(dateTime));
  };

  const handleDateTimeChange2 = (event, selectedDateTime) => {
    const currentDate = selectedDateTime || dateTime2;
    setDateTime2(currentDate);
    console.log(JSON.stringify(dateTime2));
  };

  const { handleSubmit, control } = useForm({
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      thumbnail: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      var { title, description, startDate, endDate, location, thumbnail } =
        data;
      startDate = JSON.stringify(dateTime).substring(1, 25);
      endDate = JSON.stringify(dateTime2).substring(1, 25);

      console.log("title:", title);
      console.log("description:", description);
      console.log("startDate:", startDate);
      console.log("endDate:", endDate);
      console.log("location:", location);
      console.log("thumbnail:", thumbnail);

      const token = await SecureStore.getValueFor("accessToken");
      const headers = { Authorization: token };

      const testThumbnail =
        "https://icebreak-assets.s3.us-west-1.amazonaws.com/guild_banner.5325b147-5524-4539-b652-0549e074a159.jpg";

      const response = await axios.post(
        `${ENDPOINT}/events/${guildId}`,
        {
          title: title,
          description: description,
          startDate: startDate,
          endDate: endDate,
          location: location,
          thumbnail: testThumbnail,
        },
        { headers }
      );

      const { status } = response.data;
      console.log("Status:", status);

      Alert.alert("Success", "Event created successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to create event.");

      if (error.response) {
        console.error("Response Error Data:", error.response.data);
      } else if (error.request) {
        console.error("Request Error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
      return false;
    }
  };

  return (
    <Screen>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Text>Event Creation Form</Text>

          <Text>Title</Text>
          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                multiline={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="title"
          />

          <Text>Event Description</Text>
          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                multiline={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="description"
          />

          <Text>Start Date</Text>
          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={() => (
              <RNDateTimePicker
                value={dateTime}
                mode="datetime"
                display="default"
                onChange={handleDateTimeChange}
              />
            )}
            name="startDate"
          />

          <Text>End Date</Text>
          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={() => (
              <RNDateTimePicker
                value={dateTime2}
                mode="datetime"
                display="default"
                onChange={handleDateTimeChange2}
              />
            )}
            name="endDate"
          />

          <Text>Location</Text>
          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                multiline={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="location"
          />

          <Text>Thumbnail</Text>
          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                multiline={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="thumbnail"
          />

          <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        </View>
      </TouchableWithoutFeedback>
    </Screen>
  );
}

EventsCreationScreen.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
  navigation: PropTypes.object,
  previousScreen: PropTypes.string,
};

const styles = StyleSheet.create({
  input: {
    borderColor: gray,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    width: "100%",
  },
});

export default EventsCreationScreen;
