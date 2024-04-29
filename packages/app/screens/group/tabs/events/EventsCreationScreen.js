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
import { ScrollView } from "react-native-reanimated/mock";
import { TouchableOpacity } from "react-native-gesture-handler";

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
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const month = months[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();

      return `${month} ${day}, ${year}`;
    };

    const formatTime = (date) => {
      const options = { hour: "numeric", minute: "numeric" };
      return date.toLocaleTimeString(undefined, options);
    };

    setDateDisplay1(formatDate(dateTime));
    setTimeDisplay1(formatTime(dateTime));

    setDateDisplay2(formatDate(dateTime2));
    setTimeDisplay2(formatTime(dateTime2));
  }, [dateTime, dateTime2, timeDisplay1, timeDisplay2]);

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

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
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

      const token = await SecureStore.getValueFor("accessToken");
      const headers = { Authorization: token };

      const testThumbnail =
        "https://icebreak-assets.s3.us-west-1.amazonaws.com/guild_banner.5325b147-5524-4539-b652-0549e074a159.jpg";

      const requestBody = thumbnail ? { jpegBase64: thumbnail } : null;

      const initialEventReponse = await axios.post(
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
      const eventID = JSON.stringify(initialEventReponse.data).substring(
        40,
        76,
      );

      axios
        .post(`${ENDPOINT}/media/images/${imageType}/${eventID}`, requestBody, {
          headers,
        })
        .then()
        .catch((error) => {
          console.error("Error:", error);
        });

      const thumbnailData = await axios.get(
        `${ENDPOINT}/media/images/${imageType}/${eventID}`,
      );

      axios
        .put(
          `${ENDPOINT}/events/${eventID}`,
          {
            title: title,
            description: description,
            startDate: startDate,
            endDate: endDate,
            location: location,
            thumbnail: thumbnailData.data.data.imageURL.thumbnail,
          },
          { headers },
        )
        .then()
        .catch((error) => {
          console.error("Error:", error);
        });

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
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <View style={styles.centerView}>
              <Text style={styles.header}>Event Creation Screen</Text>
            </View>

            <Text style={styles.header}>
              Title
              <Text style={styles.important}>
                *{errors.title && "\n"}
                {errors.title && errors.title.message}
              </Text>
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.centerView}>
                  <TextInput
                    style={styles.input}
                    multiline={true}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
              name="title"
              rules={{
                maxLength: 100,
                required: "Event title is required",
              }}
            />

            <Text style={styles.header}>
              <Text>Event Description</Text>
            </Text>
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.centerView}>
                  <TextInput
                    style={styles.input}
                    multiline={true}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
              name="description"
            />

            <Text style={styles.header}>
              <Text>Start Date</Text>
            </Text>
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={() =>
                Platform.OS === "ios" ? (
                  <View style={styles.centerView}>
                    <RNDateTimePicker
                      value={dateTime}
                      mode="datetime"
                      display="default"
                      onChange={handleDateTimeChange}
                    />
                  </View>
                ) : (
                  <View style={styles.androidAlignView}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => setShowDatePicker1(true)}>
                      <Text style={styles.androidButtonText}>
                        {dateDisplay1}
                      </Text>
                    </TouchableOpacity>
                    {showDatePicker1 && (
                      <RNDateTimePicker
                        value={dateTime}
                        mode="date"
                        display="default"
                        onChange={handleDateTimeChange}
                      />
                    )}
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => setShowTimePicker1(true)}>
                      <Text style={styles.androidButtonText}>
                        {timeDisplay1}
                      </Text>
                    </TouchableOpacity>
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

            <Text style={styles.header}>
              <Text>End Date</Text>
            </Text>
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={() =>
                Platform.OS === "ios" ? (
                  <View style={styles.centerView}>
                    <RNDateTimePicker
                      value={dateTime2}
                      mode="datetime"
                      display="default"
                      onChange={handleDateTimeChange2}
                    />
                  </View>
                ) : (
                  <View style={styles.androidAlignView}>
                    <TouchableOpacity
                      style={styles.button}
                      title={dateDisplay2}
                      onPress={() => setShowDatePicker2(true)}>
                      <Text style={styles.androidButtonText}>
                        {dateDisplay2}
                      </Text>
                    </TouchableOpacity>
                    {showDatePicker2 && (
                      <RNDateTimePicker
                        value={dateTime2}
                        mode="date"
                        display="default"
                        onChange={handleDateTimeChange2}
                      />
                    )}
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => setShowTimePicker2(true)}>
                      <Text style={styles.androidButtonText}>
                        {timeDisplay2}
                      </Text>
                    </TouchableOpacity>
                    {showTimePicker2 && (
                      <RNDateTimePicker
                        value={dateTime2}
                        mode="time"
                        display="default"
                        onChange={handleDateTimeChange2}
                      />
                    )}
                  </View>
                )
              }
              name="endDate"
            />

            <Text style={styles.header}>
              <Text>Location</Text>
            </Text>
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.centerView}>
                  <TextInput
                    style={styles.input}
                    multiline={true}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
              name="location"
            />

            <View>
              <Text style={styles.header}>
                <Text>Thumbnail</Text>
              </Text>
              <View style={styles.centerView}>
                <Image
                  source={{ uri: `data:image/jpeg;base64,${image}` }}
                  style={styles.thumbnailDisplay}
                />
              </View>
              <View style={styles.centerView}>
                <TouchableOpacity style={styles.button} onPress={selectImage}>
                  <Text>Select Thumbnail</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Button title="Submit" onPress={handleSubmit(onSubmit)} />
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </Screen>
  );
}

EventsCreationScreen.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
  navigation: PropTypes.object,
  previousScreen: PropTypes.string,
};

const colors = {
  red: "red",
};

const styles = StyleSheet.create({
  androidAlignView: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: "center",
    marginHorizontal: 5,
    marginVertical: 10,
    paddingVertical: 10,
    width: 150,
  },
  centerView: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 20,
    marginVertical: 5,
    padding: 10,
  },
  important: {
    color: colors.red,
    fontSize: 15,
  },
  input: {
    borderColor: gray,
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    width: "90%",
  },
  thumbnailDisplay: {
    borderWidth: 1,
    height: 130,
    width: "80%",
  },
});

export default EventsCreationScreen;
