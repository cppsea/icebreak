import PropTypes from "prop-types";
import React, { useState, useContext } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Button from "@app/components/Button";
import { GroupContext } from "@app/utils/GroupContext";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from "./CreateGroupFormStyles";

function CreateGroupFormScreen3({ navigation }) {
  const {
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

    submitForm,
  } = useContext(GroupContext);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  // Input Validation
  const [twitterLinkError, setTwitterLinkError] = useState("");
  const [facebookLinkError, setFacebookLinkError] = useState("");
  const [instagramLinkError, setInstagramLinkError] = useState("");
  const [discordLinkError, setDiscordLinkError] = useState("");
  const [linkedInLinkError, setLinkedInLinkError] = useState("");
  const [githubLinkError, setGithubLinkError] = useState("");

  function handleInputValidationScreen3() {
    let isValid = true;

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

  const handleOnChangeInput = (text, setLink, setError) => {
    setLink(text);
    setError("");
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
            onPress={() => navigation.navigate("Create Group Form 2")}
            title="BACK"
          />
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
                const isValid = handleInputValidationScreen3();

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
          <View style={styles.scrollview_extra_margin} />
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

CreateGroupFormScreen3.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default CreateGroupFormScreen3;
