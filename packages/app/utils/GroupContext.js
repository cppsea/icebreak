import PropTypes from "prop-types";
import React, { createContext, useState } from "react";
import { Alert } from "react-native";
import axios from "axios";
import { ENDPOINT } from "./constants";
import * as SecureStore from "@app/utils/SecureStore";

export const GroupContext = createContext();

export function GroupProvider({ children }) {
  const [name, setName] = useState("");
  const [handler, setHandler] = useState("");
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState("");
  const [icon, setIcon] = useState("");

  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [isInviteOnly, setIsInviteOnly] = useState(false);

  const [twitterLink, setTwitterLink] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [discordLink, setDiscordLink] = useState("");
  const [linkedInLink, setLinkedInLink] = useState("");
  const [githubLink, setGithubLink] = useState("");

  const resetForm = () => {
    setName("");
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

  const isHandlerUnique = async (handler) => {
    try {
      const token = await SecureStore.getValueFor("accessToken");
      const headers = { Authorization: token };
      const response = await axios.get(
        `${ENDPOINT}/guilds/`,
        { params: { search: `@${handler}` } },
        { headers }
      );

      const responseStatus = response.data.status;
      console.log(responseStatus);

      if (responseStatus === "fail") {
        return true;
      } else {
        const matchHandler = response.data.data.guilds.some(
          (guild) => guild.handler === handler
        );
        return !matchHandler;
      }
    } catch (error) {
      console.error("Error:", error);
      return true;
    }
  };

  // form submission logic
  const submitForm = async () => {
    try {
      const media = [
        twitterLink,
        facebookLink,
        instagramLink,
        discordLink,
        linkedInLink,
        githubLink,
      ].filter((item) => item);

      const guildData = {
        name,
        handler,
        description,
        category,
        location,
        website,
        tags,
        media,
        isInviteOnly,
      };

      // submits the basic data
      const token = await SecureStore.getValueFor("accessToken");
      const headers = { Authorization: token };

      const response = await axios.post(`${ENDPOINT}/guilds/`, guildData, {
        headers,
      });

      // image submission
      const id = response.data.data.createdGuild.guildId;
      const iconType = "guild_avatar";
      const bannerType = "guild_banner";

      if (icon && icon.trim() !== "") {
        axios
          .put(
            `${ENDPOINT}/media/images/${iconType}/${id}`,
            { imageData: icon },
            { headers }
          )
          .then((response) => {
            return response;
          });
      }

      if (banner && banner.trim() !== "") {
        axios
          .put(
            `${ENDPOINT}/media/images/${bannerType}/${id}`,
            { imageData: banner },
            { headers }
          )
          .then((response) => {
            return response;
          });
      }

      Alert.alert("Success", "Group created successfully!");
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
        website,
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

        verifyHandler: isHandlerUnique,
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
