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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Button from "@app/components/Button";
import * as ImagePicker from "expo-image-picker";
import { GroupContext } from "@app/utils/GroupContext";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from "./CreateGroupFormStyles";
import Dropdown from "@app/components/Dropdown";
import TagInput from "@app/components/TagInput";
import { useForm, Controller } from "react-hook-form";

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

    isHandlerUnique,
    resetForm,
    submitForm,
  } = useContext(GroupContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name,
      handler,
      description,
      banner,
      icon,
      category,
      tags_input: "",
      location,
      website,
      isInviteOnly,
      twitterLink,
      facebookLink,
      instagramLink,
      discordLink,
      linkedInLink,
      githubLink,
    },
    mode: "onBlur",
  });

  const categoryOptions = ["Sports", "Education", "Business", "Gaming"];
  const toggleSwitch = () => setIsInviteOnly((previousState) => !previousState);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

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
    selectImage("banner");
  };

  const selectIconImage = () => {
    selectImage("icon");
  };

  const onSubmit = async () => {
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
  };

  const validateHandler = async (value) => {
    try {
      const isUnique = await isHandlerUnique(value);
      if (!isUnique) {
        return "Handler is already taken";
      }
      return true;
    } catch (error) {
      console.error("Error validating handler:", error);
      return "An error occurred";
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView>
            <View style={styles.inner}>
              <Button
                style={styles.btnContainer}
                onPress={() => {
                  navigation.navigate("Initial Create Group");
                  resetForm();
                }}
                title="BACK"
              />

              <Text style={styles.header}>
                <Text>Organization Name</Text>
                <Text style={styles.important}>
                  *{errors.name && "\n"}
                  {errors.name && errors.name.message}
                </Text>
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Guild Name"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      setName(text);
                    }}
                    value={value}
                    maxLength={100}
                  />
                )}
                name="name"
                rules={{
                  required: "Organization Name is required",
                  pattern: {
                    value: /^[\w ]+$/,
                    message:
                      "Only alphanumeric characters with spaces are allowed",
                  },
                }}
              />

              <Text style={styles.header}>
                <Text>Handler</Text>
                <Text style={styles.important}>
                  *{errors.handler && "\n"}
                  {errors.handler && errors.handler.message}
                </Text>
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="unique_organization_handler"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      setHandler(text);
                    }}
                    value={value}
                    maxLength={50}
                  />
                )}
                name="handler"
                rules={{
                  required: "Handler is required",
                  pattern: {
                    value: /^[\w]+$/,
                    message: `Only alphanumeric characters are allowed`,
                  },
                  validate: {
                    isUniqueHandler: validateHandler,
                  },
                }}
              />

              <Text style={styles.header}>
                <Text>Description</Text>
                <Text style={styles.important}>
                  *{errors.description && "\n"}
                  {errors.description && errors.description.message}
                </Text>
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={{ ...styles.inputDescription }}
                    placeholder="This is the organization's description"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      setDescription(text);
                    }}
                    value={value}
                    multiline
                    numberOfLines={4}
                    maxLength={1000}
                  />
                )}
                name="description"
                rules={{
                  required: "Description is required",
                }}
              />

              <View>
                <Text style={styles.header}>
                  <Text>Banner</Text>
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

              <Text style={styles.header}>
                <Text>Category</Text>
                <Text style={styles.important}>
                  *{errors.category && "\n"}
                  {errors.category && errors.category.message}
                </Text>
              </Text>
              <Controller
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Dropdown
                    options={categoryOptions}
                    value={value}
                    setValue={(text) => {
                      onChange(text);
                      setCategory(text);
                    }}
                  />
                )}
                name="category"
                rules={{
                  required: "Category is required",
                }}
              />

              <Text style={styles.header}>
                <Text>Tags</Text>
                <Text style={styles.important}>
                  {errors.tags_input && "\n"}
                  {errors.tags_input && errors.tags_input.message}
                </Text>
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TagInput
                    value={value}
                    setValue={onChange}
                    tags={tags}
                    setTags={setTags}
                    maxTags={10}
                  />
                )}
                name="tags_input"
                rules={{
                  pattern: {
                    value: /^([a-zA-Z]+)( [a-zA-Z]+)?$/,
                    message: `A tag can only have two words.`,
                  },
                }}
              />

              <Text style={styles.header}>
                <Text>Location</Text>
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Organization's Location"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      setLocation(text);
                    }}
                    value={value}
                    maxLength={255}
                  />
                )}
                name="location"
              />

              <Text style={styles.header}>
                <Text>Website</Text>
                <Text style={styles.important}>
                  {errors.website && "\n"}
                  {errors.website && errors.website.message}
                </Text>
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="example.com"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      setWebsite(text);
                    }}
                    value={value}
                    maxLength={255}
                  />
                )}
                name="website"
                rules={{
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                    message: "Invalid Website Link",
                  },
                }}
              />

              <Text style={styles.header}>
                <Text>Invite Only</Text>
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={value ? "#ffffff" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(value) => {
                      onChange(value);
                      toggleSwitch(value);
                    }}
                    value={value}
                  />
                )}
                name="isInviteOnly"
              />

              <Text style={styles.header}>
                <Text>Twitter</Text>
                <Text style={styles.important}>
                  {errors.twitterLink && "\n"}
                  {errors.twitterLink && errors.twitterLink.message}
                </Text>
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="twitter.com/abc123"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      setTwitterLink(text);
                    }}
                    value={value}
                    maxLength={255}
                  />
                )}
                name="twitterLink"
                rules={{
                  pattern: {
                    value:
                      /^(https?:\/\/)?(?:www\.)?(x|twitter)\.com\/([a-zA-Z0-9_]+)/,
                    message: "Invalid Twitter / X Link",
                  },
                }}
              />

              <Text style={styles.header}>
                <Text>Facebook</Text>
                <Text style={styles.important}>
                  {errors.facebookLink && "\n"}
                  {errors.facebookLink && errors.facebookLink.message}
                </Text>
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="facebook.com/abc123"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      setFacebookLink(text);
                    }}
                    value={value}
                    maxLength={255}
                  />
                )}
                name="facebookLink"
                rules={{
                  pattern: {
                    value:
                      /^(https?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9_]+)/,
                    message: "Invalid Facebook Link",
                  },
                }}
              />

              <Text style={styles.header}>
                <Text>Instagram</Text>
                <Text style={styles.important}>
                  {errors.instagramLink && "\n"}
                  {errors.instagramLink && errors.instagramLink.message}
                </Text>
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="instagram.com/abc123"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      setInstagramLink(text);
                    }}
                    value={value}
                    maxLength={255}
                  />
                )}
                name="instagramLink"
                rules={{
                  pattern: {
                    value:
                      /^(https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_]+)/,
                    message: "Invalid Instagram Link",
                  },
                }}
              />

              <Text style={styles.header}>
                <Text>Discord</Text>
                <Text style={styles.important}>
                  {errors.discordLink && "\n"}
                  {errors.discordLink && errors.discordLink.message}
                </Text>
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="discord.gg/abc123"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      setDiscordLink(text);
                    }}
                    value={value}
                    maxLength={255}
                  />
                )}
                name="discordLink"
                rules={{
                  pattern: {
                    value:
                      /^(https?:\/\/)?(?:www\.)?discord\.(com|gg)\/([a-zA-Z0-9_]+)/,
                    message: "Invalid Discord Invintation Link",
                  },
                }}
              />

              <Text style={styles.header}>
                <Text>LinkedIn</Text>
                <Text style={styles.important}>
                  {errors.linkedInLink && "\n"}
                  {errors.linkedInLink && errors.linkedInLink.message}
                </Text>
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="linkedin.com/abc123"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      setLinkedInLink(text);
                    }}
                    value={value}
                    maxLength={255}
                  />
                )}
                name="linkedInLink"
                rules={{
                  pattern: {
                    value:
                      /^(https?:\/\/)?(?:www\.)?linkedin\.com\/([a-zA-Z0-9_]+)/,
                    message: "Invalid LinkedIn Link",
                  },
                }}
              />

              <Text style={styles.header}>
                <Text>Github</Text>
                <Text style={styles.important}>
                  {errors.githubLink && "\n"}
                  {errors.githubLink && errors.githubLink.message}
                </Text>
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="github.com/abc123"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      setGithubLink(text);
                    }}
                    value={value}
                    maxLength={255}
                  />
                )}
                name="githubLink"
                rules={{
                  pattern: {
                    value:
                      /^(https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_]+)/,
                    message: "Invalid Github Link",
                  },
                }}
              />

              <View style={styles.btnContainer}>
                <Button
                  title="SUBMIT"
                  disabled={isButtonDisabled}
                  onPress={handleSubmit(onSubmit)}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default CreateGroupFormScreen;

CreateGroupFormScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
