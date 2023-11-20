/* eslint-disable react/prop-types */ // TODO: delete later and handle children proptype
import React, { createContext, useState } from "react";
import { Alert } from "react-native";
import axios from "axios";
import { ENDPOINT } from "./constants";
import * as SecureStore from "@app/utils/SecureStore";

export const GroupContext = createContext();

export function GroupProvider({ children }) {
  // 1st SCREEN INPUTS
  const [title, setTitle] = useState("aaaaa");
  const [handler, setHandler] = useState("bbbbb");
  const [description, setDescription] = useState("cccccc");
  const [bannerUrl, setBanner] = useState(
    "https://www.cppsea.com/assets/images/full-logo.png"
  );
  const [iconUrl, setIcon] = useState(
    "https://www.cppsea.com/assets/images/seal-in-triangle.png"
  );

  // 2nd SCREEN INPUTS
  const [category, setCategory] = useState("Sports");
  const [tags, setTags] = useState(["a", "b", "c"]);
  const [websiteUrl, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [isInviteOnly, setIsInviteOnly] = useState(false);

  // 3rd SCREEN INPUTS
  const [twitterUrl, setTwitterLink] = useState("");
  const [facebookUrl, setFacebookLink] = useState("");
  const [instagramUrl, setInstagramLink] = useState("");
  const [discordUrl, setDiscordLink] = useState("");
  const [linkedinUrl, setLinkedInLink] = useState("");
  const [githubUrl, setGithubLink] = useState("");

  const resetForm = () => {
    setTitle("");
    setHandler("");
    setDescription("");
    setBanner("");
    setIcon("");

    setCategory("");
    setTags([]);
    setWebsite("");
    setLocation("");
    setIsInviteOnly(false);

    setTwitterLink("");
    setFacebookLink("");
    setInstagramLink("");
    setDiscordLink("");
    setLinkedInLink("");
    setGithubLink("");
  };

  const submitForm = async () => {
    try {
      const guildData = {
        title,
        handler,
        description,
        category,
        bannerUrl,
        iconUrl,
        location,
        websiteUrl,
        tags,
        twitterUrl,
        facebookUrl,
        instagramUrl,
        discordUrl,
        linkedinUrl,
        githubUrl,
        isInviteOnly,
      };

      // submit images TODO

      // submits the rest of the data
      // const token = await axios.get(``)
      const token = await SecureStore.getValueFor("accessToken");
      const headers = { Authorization: token };
      const response = await axios.post(
        `${ENDPOINT}/guilds/insert`,
        guildData,
        { headers }
      );
      console.log(response);

      Alert.alert("Success", "Group created successfully!");

      resetForm();
      return true;
    } catch (error) {
      // handle errors
      Alert.alert("Error", "Failed to create group.");
      console.error("Error submitting form:", error);
      return false;
    }
  };

  return (
    <GroupContext.Provider
      value={{
        title,
        setTitle,
        handler,
        setHandler,
        description,
        setDescription,
        banner: bannerUrl,
        setBanner,
        icon: iconUrl,
        setIcon,

        category,
        setCategory,
        tags,
        setTags,
        website: websiteUrl,
        setWebsite,
        location,
        setLocation,
        isInviteOnly,
        setIsInviteOnly,

        twitterLink: twitterUrl,
        setTwitterLink,
        facebookLink: facebookUrl,
        setFacebookLink,
        instagramLink: instagramUrl,
        setInstagramLink,
        discordLink: discordUrl,
        setDiscordLink,
        linkedInLink: linkedinUrl,
        setLinkedInLink,
        githubLink: githubUrl,
        setGithubLink,

        resetForm,
        submitForm,
      }}>
      {children}
    </GroupContext.Provider>
  );
}
