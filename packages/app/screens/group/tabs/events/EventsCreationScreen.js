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
  Image,
  Platform,
} from "react-native";
import Screen from "@app/components/Screen";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import axios from "axios";
import * as SecureStore from "@app/utils/SecureStore";

import { ENDPOINT } from "@app/utils/constants";

const gray = "gray";
const guildId = "5f270196-ee82-4477-8277-8d4df5fcc864";
const imageType = "event_thumbnail";

function EventsCreationScreen() {
  const [dateTime, setDateTime] = useState(new Date());
  const [dateTime2, setDateTime2] = useState(new Date());
  const [image, setImage] = useState(null);
  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [showTimePicker1, setShowTimePicker1] = useState(false);
  const [showDatePicker2, setShowDatePicker2] = useState(false);
  const [showTimePicker2, setShowTimePicker2] = useState(false);

  const [dateDisplay1, setDateDisplay1] = useState("");
  const [timeDisplay1, setTimeDisplay1] = useState("");

  const [dateDisplay2, setDateDisplay2] = useState("");
  const [timeDisplay2, setTimeDisplay2] = useState("");

  React.useEffect(() => {
    const formatDate = (date) => {
      const options = { year: "numeric", month: "numeric", day: "numeric" };
      return date.toLocaleDateString(undefined, options);
    };

    const formatTime = (date) => {
      const options = { hour: "numeric", minute: "numeric" };
      return date.toLocaleTimeString(undefined, options);
    };

    setDateDisplay1(formatDate(dateTime));
    setTimeDisplay1(formatTime(dateTime));

    setDateDisplay2(formatDate(dateTime2));
    setTimeDisplay2(formatTime(dateTime2));
  }, [dateTime, dateTime2]);

  const handleDateTimeChange = (event, selectedDateTime) => {
    setShowDatePicker1(false);
    setShowTimePicker1(false);
    setShowDatePicker2(false);
    setShowTimePicker2(false);
    const currentDate = selectedDateTime || dateTime;
    setDateTime(currentDate);
    console.log(JSON.stringify(dateTime));
  };

  const handleDateTimeChange2 = (event, selectedDateTime) => {
    setShowDatePicker1(false);
    setShowTimePicker1(false);
    setShowDatePicker2(false);
    setShowTimePicker2(false);
    const currentDate = selectedDateTime || dateTime2;
    setDateTime2(currentDate);
    console.log(JSON.stringify(dateTime2));
  };

  const selectImage = async () => {
    Keyboard.dismiss();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2,
      base64: true,
    });

    const { assets } = result;
    if (!result.canceled) {
      const { base64 } = assets[0];
      setImage(base64);
    }
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
      thumbnail = image;

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
        { headers },
      );
      const eventID = JSON.stringify(response.data).substring(40, 76);
      const { status } = response.data;
      console.log("Status:", status);
      console.log("Event ID:", eventID);

      const response2 = await axios.post(
        `${ENDPOINT}/media/images/${imageType}/${eventID}`,
        {
          jpegBase64: thumbnail,
        },
        { headers },
      );

      const { status2 } = response2.status;
      console.log("Status:", status2);

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
            render={() =>
              Platform.OS === "ios" ? (
                <RNDateTimePicker
                  value={dateTime}
                  mode="datetime"
                  display="default"
                  onChange={handleDateTimeChange}
                />
              ) : (
                <View>
                  <Button
                    title={dateDisplay1}
                    onPress={() => setShowDatePicker1(true)}
                  />
                  {showDatePicker1 && (
                    <RNDateTimePicker
                      value={dateTime}
                      mode="date"
                      display="default"
                      onChange={handleDateTimeChange}
                    />
                  )}
                  <Button
                    title={timeDisplay1}
                    onPress={() => setShowTimePicker1(true)}
                  />
                  {showTimePicker1 && (
                    <RNDateTimePicker
                      value={dateTime}
                      mode="time"
                      display="default"
                      onChange={handleDateTimeChange}
                    />
                  )}
                </View>
              )
            }
            name="startDate"
          />

          <Text>End Date</Text>
          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={() =>
              Platform.OS === "ios" ? (
                <RNDateTimePicker
                  value={dateTime2}
                  mode="datetime"
                  display="default"
                  onChange={handleDateTimeChange2}
                />
              ) : (
                <View>
                  <Button
                    title={dateDisplay2}
                    onPress={() => setShowDatePicker2(true)}
                  />
                  {showDatePicker2 && (
                    <RNDateTimePicker
                      value={dateTime}
                      mode="date"
                      display="default"
                      onChange={handleDateTimeChange}
                    />
                  )}
                  <Button
                    title={timeDisplay2}
                    onPress={() => setShowTimePicker2(true)}
                  />
                  {showTimePicker2 && (
                    <RNDateTimePicker
                      value={dateTime}
                      mode="time"
                      display="default"
                      onChange={handleDateTimeChange}
                    />
                  )}
                </View>
              )
            }
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

          <View>
            <Text style={styles.header}>
              <Text>Thumbnail</Text>
            </Text>
            <View style={styles.imageSelectorContainer}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${image}` }}
                style={styles.thumbnailDisplay}
              />
              <View style={styles.imageSelectorBtnContainer}>
                <Button title="Select thumbnail" onPress={selectImage} />
              </View>
            </View>
          </View>

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
  imageSelectorBtnContainer: {
    borderWidth: 1,
    height: 50,
    justifyContent: "center",
    marginTop: 6,
    textAlign: "center",
  },
  imageSelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    borderColor: gray,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    width: "100%",
  },
  thumbnailDisplay: {
    borderRadius: 100,
    borderWidth: 1,
    height: 100,
    width: 100,
  },
});

export default EventsCreationScreen;
