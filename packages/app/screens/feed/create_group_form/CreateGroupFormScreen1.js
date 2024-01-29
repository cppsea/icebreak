import PropTypes from "prop-types";
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Switch,
  Alert,
} from "react-native";
import Button from "@app/components/Button";
import * as ImagePicker from "expo-image-picker";
import { GroupContext } from "@app/utils/GroupContext";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from "./CreateGroupFormStyles";
import Dropdown from "@app/components/Dropdown";
import TagInput from "@app/components/TagInput";

function CreateGroupFormScreen({ navigation }) {
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

    twitterLink,
    setTwitterLink,
    facebookLink,
    setFacebookLink,
    instagramLink,
    setInstagramLink,
    discordLink,
    setDiscordLink,
    linkedInLink,
    setLinkedInLink,
    githubLink,
    setGithubLink,

    resetForm,
    submitForm,
  } = useContext(GroupContext);

  // Input Validation
  const [nameError, setNameError] = useState("");
  const [handlerError, setHandlerError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [bannerError, setBannerError] = useState("");
  const [iconError, setIconError] = useState("");

  const [categoryError, setCategoryError] = useState("");
  const [websiteError, setWebsiteError] = useState("");

  const [twitterLinkError, setTwitterLinkError] = useState("");
  const [facebookLinkError, setFacebookLinkError] = useState("");
  const [instagramLinkError, setInstagramLinkError] = useState("");
  const [discordLinkError, setDiscordLinkError] = useState("");
  const [linkedInLinkError, setLinkedInLinkError] = useState("");
  const [githubLinkError, setGithubLinkError] = useState("");

  const [inputHeight, setInputHeight] = useState(10); // description box height
  const categoryOptions = ["Sports", "Education", "Business", "Gaming"];
  const [inputValue, setInputValue] = useState("");
  const toggleSwitch = () => setIsInviteOnly((previousState) => !previousState);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  function handleInputValidation() {
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

    const twitterRegex = /^(?!https?:\/\/(www\.)?(x|twitter)\.com(.*)$)/;
    const facebookRegex = /^(?!https?:\/\/(www\.)?facebook\.com(.*)$)/;
    const instagramRegex = /^(?!https?:\/\/(www\.)?instagram\.com(.*)$)/;
    const discordRegex = /^(?!https?:\/\/(www\.)?discord\.com(.*)$)/;
    const linkedinRegex = /^(?!https?:\/\/(www\.)?linkedin\.com(.*)$)/;
    const githubRegex = /^(?!https?:\/\/(www\.)?github\.com(.*)$)/;

    if (twitterLink.trim() === ``) {
      setTwitterLinkError(``);
    } else if (twitterRegex.test(twitterLink)) {
      setTwitterLinkError(`Invalid Twitter Link`);
      isValid = false;
    } else {
      setTwitterLinkError(``);
    }

    if (facebookLink.trim() === ``) {
      setFacebookLinkError(``);
    } else if (facebookRegex.test(facebookLink)) {
      setFacebookLinkError(`Invalid Facebook Link`);
      isValid = false;
    } else {
      setFacebookLinkError(``);
    }

    if (instagramLink.trim() === ``) {
      setInstagramLinkError(``);
    } else if (instagramRegex.test(instagramLink)) {
      setInstagramLinkError(`Invalid Instagram Link`);
      isValid = false;
    } else {
      setInstagramLinkError(``);
    }

    if (discordLink.trim() === ``) {
      setDiscordLinkError(``);
    } else if (discordRegex.test(discordLink)) {
      setDiscordLinkError(`Invalid Discord Link`);
      isValid = false;
    } else {
      setDiscordLinkError(``);
    }

    if (linkedInLink.trim() === ``) {
      setLinkedInLink(``);
    } else if (linkedinRegex.test(linkedInLink)) {
      setLinkedInLinkError(`Invalid LinkedIn Link`);
      isValid = false;
    } else {
      setLinkedInLinkError(``);
    }

    if (githubLink.trim() === ``) {
      setGithubLinkError(``);
    } else if (githubRegex.test(githubLink)) {
      setGithubLinkError(`Invalid Github Link`);
      isValid = false;
    } else {
      setGithubLinkError(``);
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

  const handleWebsiteBlur = (website, setLink) => {
    // Add 'https://' immediately after the user types / is missing
    if (!website.startsWith("https://") && website !== "") {
      setLink("https://" + website);
    }
  };

  const handleSocialMediaBlur = (social, setLink) => {
    if ((social !== "") == !social.startsWith("https://")) {
      setLink("https://" + social);
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

          <View>
            <Text style={styles.header}>
              <Text>Twitter</Text>
              <Text style={styles.important}> {twitterLinkError} </Text>
            </Text>
            <TextInput
              value={twitterLink}
              placeholder="https://twitter.com/abc123"
              onChangeText={(newText) =>
                handleOnChangeInput(
                  newText,
                  (newLink) => setTwitterLink(newLink),
                  setTwitterLinkError
                )
              }
              onBlur={handleSocialMediaBlur(twitterLink, setTwitterLink)}
              style={styles.input}
            />
          </View>
          <View>
            <Text style={styles.header}>
              <Text>Facebook</Text>
              <Text style={styles.important}> {facebookLinkError} </Text>
            </Text>
            <TextInput
              value={facebookLink}
              placeholder="https://facebook.com/abc123"
              onChangeText={(newText) =>
                handleOnChangeInput(
                  newText,
                  (newLink) => setFacebookLink(newLink),
                  setFacebookLinkError
                )
              }
              onBlur={handleSocialMediaBlur(facebookLink, setFacebookLink)}
              style={styles.input}
            />
          </View>
          <View>
            <Text style={styles.header}>
              <Text>Instagram</Text>
              <Text style={styles.important}> {instagramLinkError} </Text>
            </Text>
            <TextInput
              value={instagramLink}
              placeholder="https://instagram.com/abc123"
              onChangeText={(newText) =>
                handleOnChangeInput(
                  newText,
                  (newLink) => setInstagramLink(newLink),
                  setInstagramLinkError
                )
              }
              onBlur={handleSocialMediaBlur(instagramLink, setInstagramLink)}
              style={styles.input}
            />
          </View>
          <View>
            <Text style={styles.header}>
              <Text>Discord</Text>
              <Text style={styles.important}> {discordLinkError} </Text>
            </Text>
            <TextInput
              value={discordLink}
              placeholder="https://discord.com/abc123"
              onChangeText={(newText) =>
                handleOnChangeInput(
                  newText,
                  (newLink) => setDiscordLink(newLink),
                  setDiscordLinkError
                )
              }
              onBlur={handleSocialMediaBlur(discordLink, setDiscordLink)}
              style={styles.input}
            />
          </View>
          <View>
            <Text style={styles.header}>
              <Text>LinkedIn</Text>
              <Text style={styles.important}> {linkedInLinkError} </Text>
            </Text>
            <TextInput
              value={linkedInLink}
              placeholder="https://linkedin.com/abc123"
              onChangeText={(newText) =>
                handleOnChangeInput(
                  newText,
                  (newLink) => setLinkedInLink(newLink),
                  setLinkedInLinkError
                )
              }
              onBlur={handleSocialMediaBlur(linkedInLink, setLinkedInLink)}
              style={styles.input}
            />
          </View>
          <View>
            <Text style={styles.header}>
              <Text>Github</Text>
              <Text style={styles.important}> {githubLinkError} </Text>
            </Text>
            <TextInput
              value={githubLink}
              placeholder="https://github.com/abc123e"
              onChangeText={(newText) =>
                handleOnChangeInput(
                  newText,
                  (newLink) => setGithubLink(newLink),
                  setGithubLinkError
                )
              }
              onBlur={handleSocialMediaBlur(githubLink, setGithubLink)}
              style={styles.input}
            />
          </View>
          <View style={styles.btnContainer}>
            <Button
              title="SUBMIT"
              disabled={isButtonDisabled}
              onPress={async () => {
                const isValid = handleInputValidation();

                setIsButtonDisabled(true);
                if (isValid) {
                  try {
                    const isSubmitted = await submitForm();

                    if (isSubmitted) {
                      navigation.navigate("Initial Create Group");
                    }
                  } catch (error) {
                    Alert.alert("Error", "Failed to submit form.");
                    console.error("Error submitting form:", error);
                  } finally {
                    setIsButtonDisabled(false);
                  }
                } else {
                  setIsButtonDisabled(false);
                }
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

export default CreateGroupFormScreen;

CreateGroupFormScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
