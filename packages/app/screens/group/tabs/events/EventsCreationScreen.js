import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { Text, TextInput, Button } from "react-native";
import Screen from "@app/components/Screen";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import DatePicker from "@app/components/DatePicker";
import axios from "axios";
import * as SecureStore from "@app/utils/SecureStore";

import { ENDPOINT } from "@app/utils/constants";

const gray = "gray";
const guildId = "5f270196-ee82-4477-8277-8d4df5fcc864";

function EventsCreationScreen() {
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
    const { title, description, startDate, endDate, location, thumbnail } =
      data;
    console.log("title:", title);
    console.log("description:", description);
    console.log("startDate:", startDate);
    console.log("endDate:", endDate);
    console.log("location:", location);
    console.log("thumbnail:", thumbnail);
    const token = await SecureStore.getValueFor("accessToken");
    const headers = { Authorization: token };
    const response = await axios.post(
      `${ENDPOINT}/events/${guildId}`,
      {
        title: title,
        description: description,
        // "startDate": startDate,
        // "endDate": endDate,
        location: location,
        // "thumbnail": thumbnail,
      },
      { headers }
    );

    const { status } = response.data;
    console.log("Status:", status);
  };

  return (
    <Screen>
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
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            multiline={true}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
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
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            multiline={true}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
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

      <Text>Test Date Picker</Text>
      <Controller
        control={control}
        rules={{
          maxLength: 100,
        }}
        render={() => <DatePicker />}
        name="startDate"
      />
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
