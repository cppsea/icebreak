import PropTypes from "prop-types";
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Switch,
} from "react-native";
import Button from "@app/components/Button";
import Dropdown from "@app/components/Dropdown";
import TagInput from "@app/components/TagInput";
import { GroupContext } from "@app/utils/GroupContext";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from "./CreateGroupFormStyles";

function CreateGroupFormScreen2({ navigation }) {
  const categoryOptions = ["Sports", "Education", "Business", "Gaming"];
  const [inputValue, setInputValue] = useState("");
  const toggleSwitch = () => setIsInviteOnly((previousState) => !previousState);

  const {
    category,
    setCategory,
    tags,
    setTags,
    location,
    setLocation,
    website,
    setWebsite,
    isInviteOnly,
    setIsInviteOnly,
  } = useContext(GroupContext);

  const [categoryError, setCategoryError] = useState("");
  const [websiteError, setWebsiteError] = useState("");

  function handleInputValidationScreen2() {
    let isValid = true;
    const websiteRegex =
      /^(?!(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$).+$/i;

    if (category.trim() === ``) {
      setCategoryError(`Please select a category`);
      isValid = false;
    } else {
      setCategoryError(``);
    }

    if (website.trim() === ``) {
      setWebsiteError(``);
    } else if (websiteRegex.test(website)) {
      setWebsiteError(`Invalid Website Link`);
      isValid = false;
    } else {
      setWebsiteError(``);
    }

    return isValid;
  }

  const handleWebsiteBlur = (website, setLink) => {
    // Add 'https://' immediately after the user types / is missing
    if (!website.startsWith("https://") && website !== "") {
      setLink("https://" + website);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Button
            onPress={() => navigation.navigate("Create Group Form 1")}
            title="BACK"
          />

          <View>
            <Text style={styles.header}>
              <Text>Category</Text>
              <Text style={styles.important}>* {categoryError} </Text>
            </Text>
            <Dropdown
              options={categoryOptions}
              value={category}
              setValue={setCategory}
              setDropdownError={setCategoryError}
            />
          </View>

          <View>
            <Text style={styles.header}>
              <Text>Tags</Text>
            </Text>
            <TagInput
              value={inputValue}
              setValue={setInputValue}
              tags={tags}
              setTags={setTags}
              maxTags={10}
            />
          </View>

          <View>
            <Text style={styles.header}>Location</Text>
            <TextInput
              value={location}
              onChangeText={(newText) => setLocation(newText)}
              placeholder="location"
              style={styles.input}></TextInput>
          </View>

          <View>
            <Text style={styles.header}>
              <Text>Website</Text>
              <Text style={styles.important}> {websiteError} </Text>
            </Text>
            <TextInput
              value={website}
              placeholder="example.com"
              onChangeText={(newText) => setWebsite(newText)}
              onBlur={handleWebsiteBlur(website, setWebsite)}
              style={styles.input}
            />
          </View>

          <View>
            <Text style={styles.header}>Invite Only</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isInviteOnly ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isInviteOnly}
            />
          </View>

          <View style={styles.btnContainer}>
            <Button
              title="NEXT"
              onPress={() => {
                const isValid = handleInputValidationScreen2();

                if (isValid) {
                  navigation.navigate("Create Group Form 3");
                }
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

CreateGroupFormScreen2.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default CreateGroupFormScreen2;
