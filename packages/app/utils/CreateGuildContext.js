/* eslint-disable react/prop-types */ // TODO: delete later and handle children proptype
import React, { createContext, useState } from "react";
import { Alert } from "react-native";
import axios from "axios";
import { ENDPOINT } from "./constants";
import * as SecureStore from "@app/utils/SecureStore";

export const GroupContext = createContext();

export function GroupProvider({ children }) {
  // 1st SCREEN INPUTS
  const [title, setTitle] = useState("");
  const [handler, setHandler] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBanner] = useState("");
  const [iconUrl, setIcon] = useState("");

  // 2nd SCREEN INPUTS
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
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
      const media = [
        twitterUrl,
        facebookUrl,
        instagramUrl,
        discordUrl,
        linkedinUrl,
        githubUrl,
      ].filter((item) => item);

      const guildData = {
        title,
        handler,
        description,
        category,
        location,
        websiteUrl,
        tags,
        media,
        isInviteOnly,
      };

      // submits the rest of the data
      const token = await SecureStore.getValueFor("accessToken");
      const headers = { Authorization: token };

      const response = await axios.post(
        `${ENDPOINT}/guilds/insert`,
        guildData,
        { headers }
      );

      // image submission
      const id = response.data.data.createdGuild.guildId;
      const iconType = "guild_icon";
      const bannerType = "guild_banner";

      if (iconUrl && iconUrl.trim() !== "") {
        const response = await axios.put(
          `${ENDPOINT}/media/images/${iconType}/${id}`,
          { imageData: iconUrl },
          { headers }
        );
        console.log(`Icon Submitted (status): ${response.status}`);
      }

      if (bannerUrl && bannerUrl.trim() !== "") {
        const response = await axios.put(
          `${ENDPOINT}/media/images/${bannerType}/${id}`,
          { imageData: bannerUrl },
          { headers }
        );
        console.log(`Banner Submitted (status): ${response.status}`);
      }

      Alert.alert("Success", "Group created successfully!");
      console.log(`Guild ID: ${id}`);

      resetForm();
      return true;
    } catch (error) {
      // handle errors
      Alert.alert("Error", "Failed to create group.");
      // Handle the error response here
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
