import React, { createContext, useState } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { ENDPOINT } from './constants';

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
      const formData = {
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
      const response = await axios.post(`${ENDPOINT}/guilds/insert`, formData);

      Alert.alert('Success', 'Group created successfully!');
      console.log("error");

      resetForm();
    } catch (error) {
      // handle errors
      Alert.alert('Error', 'Failed to create group.');
      console.error('Error submitting form:', error);
    }
  };

  return (
    <GroupContext.Provider
      value={{
        title, setTitle,
        handler, setHandler,
        description, setDescription,
        banner: bannerUrl, setBanner,
        icon: iconUrl, setIcon,

        category, setCategory,
        tags, setTags,
        website: websiteUrl, setWebsite,
        location, setLocation,
        isInviteOnly, setIsInviteOnly,

        twitterLink: twitterUrl, setTwitterLink,
        facebookLink: facebookUrl, setFacebookLink,
        instagramLink: instagramUrl, setInstagramLink,
        discordLink: discordUrl, setDiscordLink,
        linkedInLink: linkedinUrl, setLinkedInLink,
        githubLink: githubUrl, setGithubLink,

        resetForm,
        submitForm,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}