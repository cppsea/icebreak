import PropTypes from "prop-types";
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
  const [banner, setBanner] = useState("");
  const [icon, setIcon] = useState("");

  // 2nd SCREEN INPUTS
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [isInviteOnly, setIsInviteOnly] = useState(false);

  // 3rd SCREEN INPUTS
  const [twitterLink, setTwitterLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [discordLink, setDiscordLink] = useState("");
  const [linkedInLink, setLinkedInLink] = useState("");
  const [githubLink, setGithubLink] = useState("");

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
        twitterLink,
        facebookLink,
        instagramLink,
        discordLink,
        linkedInLink,
        githubLink,
      ].filter((item) => item); // filters empty strings

      const guildData = {
        title,
        handler,
        description,
        category,
        location,
        websiteUrl: website,
        tags,
        media,
        isInviteOnly,
      };

      // submits the basic data
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

      if (icon && icon.trim() !== "") {
        const response = await axios.put(
          `${ENDPOINT}/media/images/${iconType}/${id}`,
          { imageData: icon },
          { headers }
        );
        console.log(`Icon Submitted (status): ${response.status}`);
      }

      if (banner && banner.trim() !== "") {
        const response = await axios.put(
          `${ENDPOINT}/media/images/${bannerType}/${id}`,
          { imageData: banner },
          { headers }
        );
        console.log(`Banner Submitted (status): ${response.status}`);
      }

      Alert.alert("Success", "Group created successfully!");
      console.log(`Guild ID: ${id}`);

      resetForm();
      return true;
    } catch (error) {
      Alert.alert("Error", "Failed to create group.");

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
        banner,
        setBanner,
        icon,
        setIcon,

        category,
        setCategory,
        tags,
        setTags,
        website: website,
        setWebsite,
        location,
        setLocation,
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
      }}>
      {children}
    </GroupContext.Provider>
  );
}

GroupProvider.propTypes = {
  children: PropTypes.any,
};
