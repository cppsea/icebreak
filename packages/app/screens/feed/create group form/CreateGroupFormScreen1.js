import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  StyleSheet
} from "react-native";
import Button from "@app/components/Button";
import * as ImagePicker from "expo-image-picker";
import { GroupContext } from "@app/utils/GroupContext";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from "./CreateGroupFormStyles";

function CreateGroupFormScreen1({ navigation }) {

  // 1st SCREEN INPUTS
  const {
    title, setTitle, 
    handler, setHandler,
    description, setDescription,
    banner, setBanner,
    icon, setIcon,
    resetForm } = useContext(GroupContext);

  // Input Validation
  const [titleError, setTitleError] = useState("");
  const [handlerError, setHandlerError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [bannerError, setBannerError] = useState("");
  const [iconError, setIconError] = useState("");

  useEffect(() => {
    handleInputValidationScreen1();
  }, [title, handler, description, banner, icon]);

  function handleInputValidationScreen1() {
    let isValid = true;

    const titleRegex = /^(?![a-zA-Z0-9]+$).*$/;
    const handlerRegex = /^(?!(\w{1,15})$).*$/;

    if (title.trim() === ``) {
      setTitleError(`Please enter a title`);
      isValid = false;
    } else if (titleRegex.test(title)) {
      setTitleError(`Can only contain letters, numbers, and underscores.`);
      isValid = false;
    } else {
      setTitleError(``);
    }

    if (handler.trim() === ``) {
      setHandlerError(`Please enter a handler`);
      isValid = false;
    } else if (handlerRegex.test(handler)) {
      setHandlerError(`Can only contain letters, numbers, and underscores.`);
      isValid = false;
    } else {
      setHandlerError(``);
    }

    if (description.trim() === ``) {
      console.log(0);
      setDescriptionError(`Please enter a description`);
      isValid = false;
    } else {
      setDescriptionError(``);
    }

    if (banner.trim() === ``) {
      setBannerError(`Please pick a banner image`);
      isValid = false;
    } else {
      setBannerError(``);
    }

    if (icon.trim() === ``) {
      setIconError(`Please pick a icon image`);
      isValid = false;
    } else {
      setIconError(``);
    }

    // isValid = true; //for testing
    return isValid;
  }

  const selectBannerImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 1],
        quality: 1,
        base64: true, // Enable base64 option
      });

    const { assets } = result;

    if (!result.canceled) {
        // Process the selected image
        const { base64 } = assets[0];
        // console.log("Banner image picked: " + base64);
        setBanner(base64);
    }
  };

  const selectIconImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true, // Enable base64 option
      });

    const { assets } = result;
    
    if (!result.canceled) {
        // Process the selected image
        const { base64 } = assets[0];
        // console.log("Icon image picked: " + base64);
        setIcon(base64);
    }
  };

  return (
    <ScrollView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Button
            onPress={() => {
              navigation.navigate("Initial Create Group");
              resetForm();
            }}
            title="BACK"
          />

          <View>
            <Text style={styles.header}>
              Title<Text style={styles.important}>* {titleError}</Text>
            </Text>
            <TextInput
              value={title}
              placeholder="title"
              onChangeText={(newText) => setTitle(newText)}
              style={styles.input}
              maxLength={20}
            />
          </View>

          <View>
            <Text style={styles.header}>
              Handler<Text style={styles.important}>* {handlerError}</Text>
            </Text>
            <TextInput
              value={handler}
              placeholder="@unique_name"
              onChangeText={(newText) => setHandler(newText)}
              style={styles.input}
              maxLength={15}
            />
          </View>

          <View>
            <Text style={styles.header}>
              Description
              <Text style={styles.important}>* {descriptionError}</Text>
            </Text>
            <TextInput
              value={description}
              placeholder="This is the description."
              onChangeText={(newText) => setDescription(newText)}
              style={styles.input}
              maxLength={150}
            />
          </View>

          <View>
            {/* Replace with image/media picker */}
            <Text style={styles.header}>
              Banner<Text style={styles.important}>* {bannerError}</Text>
            </Text>
            <View style={styles.imageSelectorContainer}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${banner}` }}
                style={styles.bannerDisplay}
              />
              <View style={styles.imageSelectorBtnContainer}>
                <Button title="Select image" onPress={selectBannerImage} />
              </View>
            </View>
          </View>

          <View>
            {/* Replace with image/media picker */}
            <Text style={styles.header}>
              Icon<Text style={styles.important}>* {iconError}</Text>
            </Text>
            <View style={styles.imageSelectorContainer}>
              <Image
                source={{ uri: `data:image/jpeg;base64,${icon}` }}
                style={styles.iconDisplay}
              />
              <View style={styles.imageSelectorBtnContainer}>
                <Button title="Select image" onPress={selectIconImage} />
              </View>
            </View>
          </View>

          <View style={styles.btnContainer}>
            <Button
              title="NEXT"
              onPress={() => {
                const isValid = handleInputValidationScreen1();

                if (isValid) {
                  navigation.navigate("Create Group Form 2");
                }
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

export default CreateGroupFormScreen1;