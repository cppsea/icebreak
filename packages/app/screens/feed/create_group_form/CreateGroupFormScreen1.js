import PropTypes from "prop-types";
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import Button from "@app/components/Button";
import * as ImagePicker from "expo-image-picker";
import { GroupContext } from "@app/utils/GroupContext";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from "./CreateGroupFormStyles";

function CreateGroupFormScreen1({ navigation }) {
  // 1st SCREEN INPUTS
  const {
    name,
    setName,
    handler,
    setHandler,
    description,
    setDescription,
    banner,
    setBanner,
    icon,
    setIcon,
    resetForm,
  } = useContext(GroupContext);

  // Input Validation
  const [nameError, setNameError] = useState("");
  const [handlerError, setHandlerError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [bannerError, setBannerError] = useState("");
  const [iconError, setIconError] = useState("");

  const [inputHeight, setInputHeight] = useState(10); // description box height

  function handleInputValidationScreen1() {
    let isValid = true;

    const titleRegex = /^(?![\w\s]+$).*$/;
    const handlerRegex = /^(?!\w+$).*$/;

    if (name.trim() === ``) {
      setNameError(`Please enter a title`);
      isValid = false;
    } else if (titleRegex.test(name)) {
      setNameError(`Can only contain letters and numbers.`);
      isValid = false;
    } else {
      setNameError(``);
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

    return isValid;
  }

  const selectImage = async (imageType) => {
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
      // Process the selected image
      const { base64 } = assets[0];
      if (imageType === "banner") {
        setBanner(base64);
      } else if (imageType === "icon") {
        setIcon(base64);
      }
    }
  };

  // Usage
  const selectBannerImage = () => {
    setBannerError("");
    selectImage("banner");
  };

  const selectIconImage = () => {
    setIconError("");
    selectImage("icon");
  };

  const handleOnChangeInput = (text, setText, setError) => {
    setText(text);
    setError("");
  };

  return (
    <ScrollView
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
              <Text>Organization Name</Text>
              <Text style={styles.important}>* {nameError}</Text>
            </Text>
            <TextInput
              value={name}
              placeholder="name"
              onChangeText={(newText) =>
                handleOnChangeInput(newText, setName, setNameError)
              }
              style={styles.input}
              maxLength={100}
            />
          </View>

          <View>
            <Text style={styles.header}>
              <Text>Handler</Text>
              <Text style={styles.important}>* {handlerError}</Text>
            </Text>
            <TextInput
              value={handler}
              placeholder="@unique_name"
              onChangeText={(newText) =>
                handleOnChangeInput(newText, setHandler, setHandlerError)
              }
              style={styles.input}
              maxLength={50}
            />
          </View>

          <View>
            <Text style={styles.header}>
              <Text>Description</Text>
              <Text style={styles.important}>* {descriptionError}</Text>
            </Text>
            <TextInput
              value={description}
              multiline
              numberOfLines={4}
              placeholder="This is the description."
              onContentSizeChange={(e) =>
                setInputHeight(e.nativeEvent.contentSize.height)
              }
              onChangeText={(newText) =>
                handleOnChangeInput(
                  newText,
                  setDescription,
                  setDescriptionError
                )
              }
              style={{ ...styles.input, height: inputHeight }}
              maxLength={1000}
            />
          </View>

          <View>
            <Text style={styles.header}>
              <Text>Banner</Text>
              <Text style={styles.important}>* {bannerError}</Text>
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
            <Text style={styles.header}>
              <Text>Icon</Text>
              <Text style={styles.important}>* {iconError}</Text>
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

CreateGroupFormScreen1.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default CreateGroupFormScreen1;
