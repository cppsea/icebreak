import React, { createContext, useState } from 'react';

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

  const submitForm = () => {
    // Perform submission logic here
    // Access the form variables (title, handler, description, etc.) and submit them
    // You can also pass them to an API call or save them to a database
    // After submission, you can reset the form if needed

    resetForm();
  };

  return (
    <GroupContext.Provider
      value={{
        title, setTitle,
        handler, setHandler,
        description, setDescription,
        banner, setBanner,
        icon, setIcon,

        category, setCategory,
        tags, setTags,
        website, setWebsite,
        location, setLocation,
        isInviteOnly, setIsInviteOnly,

        twitterLink, setTwitterLink,
        facebookLink, setFacebookLink,
        instagramLink, setInstagramLink,
        discordLink, setDiscordLink,
        linkedInLink, setLinkedInLink,
        githubLink, setGithubLink,

        resetForm,
        submitForm,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}