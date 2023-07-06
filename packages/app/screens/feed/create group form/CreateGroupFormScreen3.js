import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Button from "@app/components/Button";
import { GroupContext } from "@app/utils/GroupContext";
import { ScrollView } from "react-native-gesture-handler";
import { styles } from "./CreateGroupFormStyles";

function CreateGroupFormScreen3({ navigation }) {

    const { 
      twitterLink, setTwitterLink,
      facebookLink, setFacebookLink,
      instagramLink, setInstagramLink,
      discordLink, setDiscordLink,
      linkedInLink, setLinkedInLink,
      githubLink, setGithubLink,
  
      submitForm
    } = useContext(GroupContext)
  
    // Input Validation
    const [twitterLinkError, setTwitterLinkError] = useState("");
    const [facebookLinkError, setFacebookLinkError] = useState("");
    const [instagramLinkError, setInstagramLinkError] = useState("");
    const [discordLinkError, setDiscordLinkError] = useState("");
    const [linkedInLinkError, setLinkedInLinkError] = useState("");
    const [githubLinkError, setGithubLinkError] = useState("");
  
    useEffect(() => {
      handleInputValidationScreen3();
    }, [
      twitterLink,
      facebookLink,
      instagramLink,
      discordLink,
      linkedInLink,
      githubLink,
    ]);
  
    function handleInputValidationScreen3() {
      let isValid = true;
  
      const twitterRegex =
        /^(?!https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$)/;
      const facebookRegex =
        /^(?!https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9_]+\/?$)/;
      const discordRegex = /^(?!https?:\/\/(www\.)?discord\.gg\/[a-zA-Z0-9]+).*$/;
      const instagramRegex =
        /^(?!https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/[a-zA-Z0-9_]+\/?$)/;
      const linkedinRegex =
        /^(?!https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$)/;
      const githubRegex =
        /^(?!https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$)/;
  
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
  
    return (
      <ScrollView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                Twitter<Text style={styles.important}> {twitterLinkError} </Text>
              </Text>
              <TextInput
                value={twitterLink}
                placeholder="https://twitter.com/abc123"
                onChangeText={(newText) => setTwitterLink(newText)}
                style={styles.input}
              />
            </View>
            <View>
              <Text style={styles.header}>
                Facebook
                <Text style={styles.important}> {facebookLinkError} </Text>
              </Text>
              <TextInput
                value={facebookLink}
                placeholder="https://facebook.com/abc123"
                onChangeText={(newText) => setFacebookLink(newText)}
                style={styles.input}
              />
            </View>
            <View>
              <Text style={styles.header}>
                Instagram
                <Text style={styles.important}> {instagramLinkError} </Text>
              </Text>
              <TextInput
                value={instagramLink}
                placeholder="https://instagram.com/abc123"
                onChangeText={(newText) => setInstagramLink(newText)}
                style={styles.input}
              />
            </View>
            <View>
              <Text style={styles.header}>
                Discord<Text style={styles.important}> {discordLinkError} </Text>
              </Text>
              <TextInput
                value={discordLink}
                placeholder="https://discord.gg/abc123"
                onChangeText={(newText) => setDiscordLink(newText)}
                style={styles.input}
              />
            </View>
            <View>
              <Text style={styles.header}>
                LinkedIn
                <Text style={styles.important}> {linkedInLinkError} </Text>
              </Text>
              <TextInput
                value={linkedInLink}
                placeholder="https://linkedin.com/abc123"
                onChangeText={(newText) => setLinkedInLink(newText)}
                style={styles.input}
              />
            </View>
            <View>
              <Text style={styles.header}>
                Github<Text style={styles.important}> {githubLinkError} </Text>
              </Text>
              <TextInput
                value={githubLink}
                placeholder="https://github.com/abc123e"
                onChangeText={(newText) => setGithubLink(newText)}
                style={styles.input}
              />
            </View>
            <View style={styles.btnContainer}>
              <Button
                title="SUBMIT"
                onPress={() => {
                  const isValid = handleInputValidationScreen3();
  
                  if (isValid) {
                    navigation.navigate("Initial Create Group");
                  }
  
                  // check GroupContext.js for submitForm implementation
                  submitForm();
                }}
              />
            </View>
            <View style={styles.scrollview_extra_margin}/>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    );
}

export default CreateGroupFormScreen3;